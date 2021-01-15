import { Directive,HostListener } from '@angular/core';

@Directive({
  selector: '[appTestDirective1]'
})
export class TestDirectiveDirective1 {

	constructor() { }
  
	@HostListener("keypress", ["$event"])
	onKeyPress(e: KeyboardEvent): boolean {
		const workEx = /^[0-9.]+$/;
		if(e.keyCode != 8 && !workEx.test(e.key)){
			return false;
		}else{
			return true;
		}
	}
}
