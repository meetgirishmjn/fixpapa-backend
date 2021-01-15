import { AbstractControl } from '@angular/forms';

export function EmailOrMobile(control: AbstractControl) {
	
	var email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;			
	var mobile =  /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
	if (control.value && (!email.test(control.value) && !mobile.test(control.value))){
		return { validEmailOrMobile: true };
	}
	return null;
}