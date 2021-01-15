import { Component, OnInit } from '@angular/core';
import { PeopleApi } from './../../sdk/index';
import { LoopBackConfig } from './../../sdk/lb.config';
import { Http, Headers, RequestOptions,RequestOptionsArgs } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFunctionService } from './../../services/global-function.service';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { SeoService } from './../../services/seo/seo.service';

declare var seoData:any;
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  
	resetForm : FormGroup;
	newPassword : FormControl;
	confNewPassword : FormControl;
	disbale : boolean = false;
	accessToken : string;
	baseUrl : string;
	constructor(private seoService:SeoService, public http : Http, private globalFunctionService : GlobalFunctionService,public peopleApi:PeopleApi,private route: ActivatedRoute,private router : Router) {
		this.baseUrl = LoopBackConfig.getPath();
		this.seoService.generateTags(seoData.resetPasswordPage);	
	}
	
	ngOnInit() {
		this.createResetForm();
		this.route.params.subscribe(params => {
			this.accessToken = params.accessToken;
			console.log("access token : ",this.accessToken);
		});
	}
	
	setOption(){
		let options: RequestOptionsArgs = new RequestOptions();
		options.headers = new Headers();
		options.headers.append("Authorization", this.accessToken);
		
		return options;
	}

	createResetForm(){
		this.newPassword = new FormControl('',[
			Validators.required,
			Validators.minLength(6)
		]);
		this.confNewPassword = new FormControl('',[
			Validators.required
		]);
		
		this.resetForm = new FormGroup({
			newPassword : this.newPassword,
			confNewPassword : this.confNewPassword
		});
	}

	resetPassword(){
		let _self = this;
		this.disbale = true;
		
		let options = this.setOption();
		let url = this.baseUrl + "/api/People/reset-password";
		
		if(this.resetForm.valid && (this.resetForm.value.newPassword === this.resetForm.value.confNewPassword)){
			_self.http.post(url,{'newPassword' : this.resetForm.value.newPassword},options).subscribe(
				(success)=>{
					console.log("success : ", success);
					_self.disbale = false;
					_self.globalFunctionService.infoToast('Password Change, redirecting to login page...');
					_self.router.navigate(['/']);
				},
				(error)=>{
					console.log("error : ", error);
					_self.disbale = false;
					if(error.status == 401){
						// this.errors.error = "Please request again for reset password. Token has been expired."
						_self.globalFunctionService.errorToast('Link has been expired, Please try again','');
					}else{
						if(error == "Server error"){
							_self.globalFunctionService.navigateToError('server');
						}else if(error.statusCode === 401){
							_self.globalFunctionService.navigateToError('401');
						}
						else{
							_self.globalFunctionService.errorToast(error.message,'oops');
						}
					}
				}
			);
		}else{
			this.resetForm.controls['newPassword'].markAsTouched();
			this.resetForm.controls['confNewPassword'].markAsTouched();
		}
	}
}
