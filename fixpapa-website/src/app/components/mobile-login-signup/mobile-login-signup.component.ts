import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalFunctionService } from '../../services/global-function.service';
import { MultipartService } from '../../services/multipart/multipart.service';
import { validateEmail } from '../../validators/email.validator';
import { LocalStorageService } from '../../services/localstorage.service';
import { Subscription } from 'rxjs/Subscription';
declare const $: any;
@Component({
  selector: 'app-mobile-login-signup',
  templateUrl: './mobile-login-signup.component.html',
  styleUrls: ['./mobile-login-signup.component.css']
})
export class MobileLoginSignupComponent implements OnInit {

  customerSignUpForm: FormGroup;
	fullName: FormControl;
	email: FormControl;
	gstNumber: FormControl;
	customerType: FormControl;
	files: any = {};
	defaultCust: string;
	custProfileImg: string;
	disableCust = false;
	peopleId: string;
	companyName: FormControl;

	isLogin = true;
	user: any = {};

	subscriber: Subscription;
  constructor(private globalFunctionService: GlobalFunctionService, 
    private multipartService: MultipartService, private localStorage: LocalStorageService) {
		this.defaultCust = 'home';
		this.custProfileImg = 'assets/images/profile-img.png';
	}

	ngOnInit() {
    this.subscriber = this.globalFunctionService.openMobileSignUp$.subscribe(
      (data) => {
				if (data) {
					this.openModal();
				} else {
					this.closeModal()
				}
      }
		)
	}

	openModal() {
		$('#largeModal6').addClass('slideInRight');
		this.createCustomerSignUpControls();
		this.createCustomerSignUpForm();
		$('#largeModal6').css('visibility', 'visible');
		$('#largeModal6').css('display', 'block');
	}

	closeModal() {
		this.resetCustomerSignUp();
		$('#largeModal6').modal('hide');
		$('#largeModal6').css('visibility', 'hidden');
		$('#largeModal6').css('display', 'none');
	}

	resetCustomerSignUp() {
		if (this.customerSignUpForm) {
			this.customerSignUpForm.reset();
			this.customerSignUpForm.controls['customerType'].setValue(this.defaultCust);
		}
		this.files = {};
		this.custProfileImg = 'assets/images/profile-img.png';
		this.disableCust = false;
	}

	signUpCustomer(data) {
		const _self = this;
		this.multipartService.editProfile(data).subscribe(
			(success) => {
				console.log('success mobie sign up : ', success)
				// _self.globalFunctionService.closeLoginMobile();
				if (!success.success.data.emailVerified) {
					_self.globalFunctionService.infoToast('Please confirm your email address using the verification link sent to you. In case it\'s missing in your inbox,please check your spam folder.')
				} else {
					if (!$.isEmptyObject(this.globalFunctionService.dataToPostForJob)) {
						this.globalFunctionService.postJob();
					}
				}
				_self.globalFunctionService.onSignUp();
				_self.globalFunctionService.closeSignUp();
			},
			(error) => {
				_self.disableCust = false;
				if (error === 'Server error') {
					_self.globalFunctionService.navigateToError('server');
				} else if (error.statusCode === 401) {
					_self.globalFunctionService.navigateToError('401');
				} else {
					if (error.statusCode === 422 && error.name === 'ValidationError') {
						_self.globalFunctionService.errorToast(error.message, 'oops');
					} else {
						_self.globalFunctionService.errorToast(error.message, 'oops');
					}
				}
			}
		);
	}

	checkSignUpForm() {
		if (this.customerSignUpForm.valid) {
			this.disableCust = true;
      const obj = Object.assign({}, this.customerSignUpForm.value );
      const data = { 'data' : obj, 'files' : this.files };
      this.signUpCustomer(data);
		} else {
      this.disableCust = false;
			this.customerSignUpForm.controls['fullName'].markAsTouched();
			this.customerSignUpForm.controls['email'].markAsTouched();
			this.customerSignUpForm.controls['address'].markAsTouched();
			this.customerSignUpForm.controls['gstNumber'].markAsTouched();
			this.customerSignUpForm.controls['companyName'].markAsTouched();
		}
	}

	createCustomerSignUpControls() {
		this.gstNumber = new FormControl('', [
		]);
		this.companyName = new FormControl('', [
		]);
		this.customerType = new FormControl(this.defaultCust, []);
		;
    this.email = new FormControl('', [
      Validators.required,
      validateEmail
    ]);
    this.fullName = new FormControl('', [
      Validators.required
    ]);
    if (this.user.image) {
      this.custProfileImg = this.user.image;
    }
    const image1 = [this.custProfileImg];
    this.files.image = image1;
	}

	createCustomerSignUpForm() {
		this.customerSignUpForm = new FormGroup({
			fullName 		: this.fullName,
      email 			: this.email,
			gstNumber 		: this.gstNumber,
			companyName		: this.companyName,
			customerType 	: this.customerType
		});
	}

	OnDestroy () {
		this.subscriber.unsubscribe();
	}
}
