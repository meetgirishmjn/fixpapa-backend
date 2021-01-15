import { Component, OnInit } from '@angular/core';
import { PeopleApi } from './../../sdk/index';
import { Router } from '@angular/router';
import { GlobalFunctionService } from './../../services/global-function.service';
import { FormControl,FormGroup, Validators } from '@angular/forms';

import { validateEmail } from './../../validators/email.validator';
import { SeoService } from './../../services/seo/seo.service';

declare var seoData:any;
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

	resetRequestForm : FormGroup;
	email : FormControl;
	disable : boolean = false;
	constructor(private seoService:SeoService, public peopleApi:PeopleApi, private router : Router, private globalFunctionService : GlobalFunctionService) {
		this.seoService.generateTags(seoData.resetRequestPage);	
	}

	ngOnInit() {
		this.email = new FormControl('',[
			Validators.required,
			validateEmail
		]);
		
		this.resetRequestForm = new FormGroup({
			email : this.email
		});
	}

	resetPassword(){
		let _self = this;
		console.log(" resetRequestForm : ", this.resetRequestForm.value);
		if(this.resetRequestForm.valid){
			this.disable = true;
			this.peopleApi.resetPassword(this.resetRequestForm.value).subscribe(
				(success)=>{
					console.log("success : ", success);
					this.disable = false;
					_self.globalFunctionService.successToast('Link to change password has been sent','');
				},(error)=>{
					this.disable = false;
					console.log("error : ", error);
					if(error == "Server error"){
						_self.globalFunctionService.navigateToError('server');
					}else{
						_self.globalFunctionService.errorToast(error.message,'oops');
					}
				}
			);
		}else{
			this.resetRequestForm.controls['email'].markAsTouched();
		}
	}
}
