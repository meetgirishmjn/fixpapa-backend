import { AbstractControl } from '@angular/forms';

export function validateWorkEx(control: AbstractControl) {
	var re = /^[0-9]\d{0,9}(\.\d{1,1})?%?$/;			
	if (control.value && !re.test(control.value)) {
		return { validWorkEx: true };
	}
	return null;
}

export function validateAmount(control: AbstractControl) {
	var re = /^\d+(\.\d{1,2})?$/;			
	if (control.value && !re.test(control.value)) {
		return { validAmount: true };
	}
	return null;
}