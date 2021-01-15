import { AbstractControl } from '@angular/forms';

export function validateAccountNo(control: AbstractControl) {
	var re = /^[0-9]{1,16}$/;			
	if (control.value && !re.test(control.value)) {
		return { validAccountNo: true };
	}
	return null;
}