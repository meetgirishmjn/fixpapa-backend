import { Directive,HostListener } from '@angular/core';

@Directive({
  selector: '[appTestDirective]'
})
export class TestDirectiveDirective {

	constructor() { }
  
	@HostListener("keypress", ["$event"])
	onKeyPress(e: KeyboardEvent): boolean {
		const digits = /^\d{0,20}?$/;
		if(e.keyCode != 8 && !digits.test(e.key)){
			return false;
		}else{
			return true;
		}
	}
}
