import { Directive , HostListener} from '@angular/core';

@Directive({
  selector: '[appPercentage]'
})
export class PercentageDirective {

  constructor() { }
	
	@HostListener("keypress", ["$event"])
	onKeyPress(e: KeyboardEvent): boolean {
		const percentage = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/i;
		if(e.keyCode != 8 && !percentage.test(e.key)){
			return false;
		}else{
			return true;
		}
	}
}
