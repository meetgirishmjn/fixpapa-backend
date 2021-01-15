import { AbstractControl } from '@angular/forms';

export function validateEmail(control: AbstractControl) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;			
	if (control.value && !re.test(control.value)) {
		return { validEmail: true };
	}
	return null;
}