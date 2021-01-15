import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PeopleApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';

declare var $: any;

@Component({
  selector: 'app-otp-modal',
  templateUrl: './otp-modal.component.html',
  styleUrls: ['./otp-modal.component.css']
})
export class OtpModalComponent implements OnInit {

	otpForm: FormGroup;
	otp: FormControl;
	peopleId: string;
	mode: any;
	disableSubmit = false;
	@Output() newData = new EventEmitter();
	@Output() newData1 = new EventEmitter();
	constructor(private peopleApi: PeopleApi, private globalFunctionService: GlobalFunctionService) { }

	ngOnInit() {
		this.createOtpForm();
		this.globalFunctionService.openOtpModal$.subscribe(
			(data) => {
				if (!data) {
					this.closeModal();
				} else {
					if (data.peopleId) {
						this.resendOtp(data.peopleId);
					} else if (data.mode) {
						this.openModal1(data);
					}
				}
			}
		)
	}

	openModal(peopleId) {
		$('#otp-modal').modal({backdrop: 'static', keyboard: false});
		// $('.modal-backdrop').show();
		$('#otp-modal').css('visibility', 'visible');
		$('#otp-modal').css('display', 'block');
		console.log($('#otp-modal'));
		// this.peopleId = this.peopleId || peopleId;
		this.peopleId = peopleId;
	}

	openModal1(data) {
		this.mode = data.mode;
		if ($('#otp-modal')[0].style.display === 'none' || 
		$('#otp-modal')[0].style.display === '') {
			$('#otp-modal').modal({backdrop: 'static', keyboard: false});
			$('.modal-backdrop').show();
		}
	}

	verifyEmail() {
		const _self = this;
		this.peopleApi.editEmail_match_otp({}, +this.otpForm.value.otp).subscribe(
			(success) => {
				console.log('email Updated : ', success);
				_self.globalFunctionService.successToast('Congratulations', 'Email is successfully verified');
				_self.disableSubmit = false;
				_self.newData1.emit(success.success.data.email);
				_self.globalFunctionService.onProfileUpdate();
				_self.closeModal();
			},
			(error) => {
				console.log('error : ', error);
				if (error === 'Server error') {
					_self.globalFunctionService.navigateToError('server');
				} else if (error.statusCode === 401) {
					_self.globalFunctionService.navigateToError('401');
				} else {
					_self.globalFunctionService.errorToast(error.message, 'oops');
				}
			}
		);
	}

	createOtpForm() {
		this.otpForm = new FormGroup({
			otp : new FormControl('', [Validators.required])
		});
	}

	resendOtp(peopleId) {
		const _self = this;
		this.peopleId = this.peopleId || peopleId;
		// this.peopleId = peopleId;
		this.peopleApi.resendOtp(this.peopleId).subscribe(
			(success) => {
				console.log('success : ', success);
				_self.globalFunctionService.successToast('New Otp has been sent to your registered Mobile No', '');
				_self.openModal(success.success.data.id);
			},
			(error) => {
				console.log('error : ', error);
				if (error === 'Server error') {
					_self.globalFunctionService.navigateToError('server');
				} else if (error.statusCode === 401) {
					_self.globalFunctionService.navigateToError('401');
				} else {
					_self.globalFunctionService.errorToast(error.message, 'oops');
				}
			}
		);
	}

	closeModal() {
		this.mode = '';
		$('#otp-modal').modal('hide');
		this.otpForm.reset();
	}

	verifyOtp() {
		const _self = this;
		this.disableSubmit = true;
		if (this.otpForm.valid) {
			this.peopleApi.verifyMobile(this.peopleId, +this.otpForm.value.otp).subscribe(
				(success) => {
					console.log('mobile updated : ', success);
					// debugger;
					_self.globalFunctionService.successToast('Mobile is successfully verified', 'Congratulations');
					_self.disableSubmit = false;
					_self.newData.emit(success.success.data.mobile);
					_self.globalFunctionService.onProfileUpdate();
					_self.closeModal();
				},
				(error) => {
					console.log('error : ', error);
					_self.disableSubmit = false;
					if (error === 'Server error') {
						_self.globalFunctionService.navigateToError('server');
					} else if (error.statusCode === 401) {
						_self.globalFunctionService.navigateToError('401');
					} else {
						_self.globalFunctionService.errorToast(error.message, 'oops');
					}
				}
			);
		}
	}
}
