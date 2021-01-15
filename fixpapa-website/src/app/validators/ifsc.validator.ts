import { AbstractControl } from '@angular/forms';

export function validateIfsc(control: AbstractControl) {
	var re = /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/;			
	if(control.value && !re.test(control.value)){
		return { validIfsc : true };
	}else{
		return null;
	}
}