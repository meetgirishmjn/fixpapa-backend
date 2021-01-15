import { AbstractControl } from '@angular/forms';

export function validateNoOfEngineers(control: AbstractControl) {
	var re = /^[0-9]{1,2}$/;			
	if (control.value && !re.test(control.value)) {
		return { validNoOfEng : true };
	}
	return null;
}