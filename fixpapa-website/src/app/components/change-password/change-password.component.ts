import { Component, OnInit, AfterViewInit, ViewChild, NgZone, ElementRef,EventEmitter,Output } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder } from '@angular/forms';
import { PeopleApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';

declare var $:any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

	changePasswordForm 	: FormGroup;
	vendorPwd 			: FormControl;
	newPwd 				: FormControl;
	confNewPwd			: FormControl;
	engineerId			: FormControl;
	disabled			: boolean = false;
	
	constructor(private peopleApi : PeopleApi,private globalFunctionService : GlobalFunctionService){
		this.disabled = false;
	}

	ngOnInit(){
	}
	
	createChangePasswordForm(engId){
		console.log("engineer Id : ", engId);
		this.engineerId = new FormControl(engId,[
		]);
		this.newPwd = new FormControl('',[
			Validators.required,
			Validators.minLength(6)
		]);
		this.vendorPwd = new FormControl('',[
			Validators.required
		]);
		this.confNewPwd = new FormControl('',[
			Validators.required
		])
		this.changePasswordForm = new FormGroup({
			engineerId : this.engineerId,
			newPwd : this.newPwd,
			vendorPwd : this.vendorPwd,
			confNewPwd : this.confNewPwd
		});
		$('#change-pass').modal({backdrop : 'static', keyboard : false});
	}
	
	openModal(data){
		this.createChangePasswordForm(data.engId);
	}
	
	closeModal(){
		$('#change-pass').modal('hide');
		this.changePasswordForm.reset();
	}
	
	changePassword(){
		let _self = this;
		if((this.changePasswordForm.value.confNewPwd === this.changePasswordForm.value.newPwd) && this.changePasswordForm.valid){
			_self.disabled = true;
			this.peopleApi.changePwd({},this.changePasswordForm.value.engineerId,this.changePasswordForm.value.vendorPwd,this.changePasswordForm.value.newPwd).subscribe(
				(success)=>{
					console.log("password changed : ", success.success.data);
					_self.globalFunctionService.successToast('Engineer Password Changed!!!','');
					_self.closeModal();
					_self.disabled = false;
				},
				(error)=>{
					_self.disabled = false;
					console.log("error : ", error);
					if(error === 'Server error'){
						_self.globalFunctionService.navigateToError('server');
					}else if(error.statusCode === 401){
						_self.globalFunctionService.navigateToError('401');
					}else{
						_self.globalFunctionService.errorToast(error.message,'oops');
					}
				}
			);
		}else{
			this.changePasswordForm.controls['confNewPwd'].markAsTouched();
			this.changePasswordForm.controls['newPwd'].markAsTouched();
			this.changePasswordForm.controls['vendorPwd'].markAsTouched();
		}
	}
}
