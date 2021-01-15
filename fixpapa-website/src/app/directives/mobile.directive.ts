

import { Directive,HostListener } from '@angular/core';

@Directive({
  selector: '[mobileValidator]'
})
export class MobileTestDirective {

	constructor() { }
  
	@HostListener("keypress", ["$event"])
	onKeyPress(e: KeyboardEvent): boolean {
		var mobileRegEx = /^[1-9]\d{9}$/;
		if(e.keyCode != 8 && !mobileRegEx.test(e.key)){
			return false;
		}else{
			return true;
		}
	}
}