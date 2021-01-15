import { Directive,  ElementRef, HostListener, Input ,Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[rah-file-dir]'
})
export class FileDirective {  
	@Output() assignValue = new EventEmitter();
	@Output() updateName = new EventEmitter();
	@Output() imageAsUrl = new EventEmitter();
	constructor(private el:ElementRef) { }

	@HostListener('change',["$event"]) onChange($event) {
		this.onFileChange($event);
	}

	onFileChange($event){
		$event.preventDefault();
		
		let _self = this;
		if (this.el.nativeElement.files && this.el.nativeElement.files[0]) {
			this.assignValue.emit(this.el.nativeElement.files);
			let i = 0;
			let arr = [];
			for(let file in this.el.nativeElement.files){
				if(i < this.el.nativeElement.files.length){
					arr.push(this.el.nativeElement.files[file].name);
				}
				i++;
			}
			console.log(" arr : ", arr[0]);
			this.updateName.emit();
		
			let reader = new FileReader();
			reader.onload = (fre:FileReaderEvent) => {
				console.log("file on read : ",fre );
				let data = fre.target.result;
				if(data){
					this.imageAsUrl.emit(data);
				}
			}
			reader.readAsDataURL(this.el.nativeElement.files[0]);
		}
	}
}

interface FileReaderEventTarget extends EventTarget {
    result:string
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget
}
