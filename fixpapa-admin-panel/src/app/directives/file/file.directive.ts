import { Directive,  ElementRef, HostListener, Input ,Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[rah-file-dir]'
})
export class FileDirective {  
  @Output() assignValue = new EventEmitter();
  @Output() updateName = new EventEmitter();
  constructor(private el:ElementRef) { }

   @HostListener('change',["$event"]) onChange($event) {
   	 this.onFileChange($event);
   }

   onFileChange($event){
   		$event.preventDefault();
   		this.assignValue.emit(this.el.nativeElement.files);
		  //console.log(" files : ", this.el.nativeElement.files[0].name );
   		let i = 0;
   		let arr = [];
   		for(let file in this.el.nativeElement.files){
   			if(i < this.el.nativeElement.files.length){
   				arr.push(this.el.nativeElement.files[file].name);
   				// console.log(this.el.nativeElement.files[file].name);
   			}
   			i++;
   		}
		  // console.log(" arr : ", arr[0]);
   		this.updateName.emit();
   }

}
