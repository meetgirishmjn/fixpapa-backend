import { AbstractControl } from '@angular/forms';

export function validateMobile(control: AbstractControl) {
	var re = /^[1-9]\d{9}$/;			
	if (control.value && !re.test(control.value)) {
		return { validMobile : true };
	} else {
		return null;
	}
}