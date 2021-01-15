import { Directive,HostListener } from '@angular/core';

@Directive({
  selector: '[appTestDirective2]'
})
export class TestDirectiveDirective2 {

	constructor() { }
  
	@HostListener("keypress", ["$event"])
	onKeyPress(e: KeyboardEvent): boolean {
		//const mobileNo = /^[\+0-9]{1,15}$/;
		//const mobileNo = /^[1-9]{1}\d{9}$/; 
		const mobileNo = /^[1-9]\d{9}$/;
		if(e.keyCode != 8 && !mobileNo.test(e.key)){
			return false;
		}else{
			return true;
		}
	}
}
