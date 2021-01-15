import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PeopleApi } from '../../sdk/services/custom/People';
import { GlobalFunctionService } from '../../services/global-function.service';
import { validateMobile } from './../../validators/mobile.validator';
import { SDKToken } from '../../sdk/models/BaseModels';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../services/localstorage.service';
import { LoopBackAuth } from '../../sdk/services/core/auth.service';
import { Subscription } from 'rxjs/Subscription';
declare const $: any;
@Component({
  selector: 'app-login-mobile',
  templateUrl: './login-mobile.component.html',
  styleUrls: ['./login-mobile.component.css']
})
export class LoginMobileComponent implements OnInit {

  otpForm: FormGroup;
  loginForm: FormGroup;
  otp: FormControl;
  mob: FormControl;
  peopleId: string;
  mode: any;
  disableSubmit = false;
  isReg = false;
  subscriber: Subscription
  constructor(private peopleApi: PeopleApi, 
    private globalFunctionService: GlobalFunctionService,
    private router: ActivatedRoute,
    private localStorage: LocalStorageService,
    private auth: LoopBackAuth) { }

  ngOnInit() {
    this.createOtpForm();
    this.subscriber = this.globalFunctionService.openLoginMobile$.subscribe(
      (data) => {
        if (data) {
          this.openModal();
        } else {
          this.closeModal();
        }
      }
    )
  }

  openModal() {
    $('#login-mobile-modal').modal({backdrop: 'static', keyboard: false});
    if ($('#login-mobile-modal')[0].style.display === 'none' ||
      $('#login-mobile-modal')[0].style.display === '') {
        $('#login-mobile-modal').css("display", "block");
      }
    if ($('#login-mobile-modal')[0].style.visibility === 'hidden') {
      $('#login-mobile-modal').css("visibility", "visible");
    }
  }

  createOtpForm() {
    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required])
    });
    this.loginForm = new FormGroup({
      mob: new FormControl('', [
        Validators.required,
        validateMobile
      ])
    });
  }

  closeModal() {
    this.isReg = false;
    this.otpForm.reset();
    this.loginForm.reset();
    $('#login-mobile-modal').modal('hide');
    $('#login-mobile-modal').css("visibility", "hidden");
    $('#login-mobile-modal').css("display", "none");
  }

  loginMob() {
    const _self = this;
    const reMobile = /^[1-9]\d{9}$/;
    if (reMobile.test(this.loginForm.controls['mob'].value)) {
      this.peopleApi.userLogin('customer', this.loginForm.value.mob).subscribe(
        (success: any) => {
          console.log(success);
          if (success.success.data) {
            if (success.success.data.id) {
              this.isReg = true;
              this.peopleId = success.success.data.id
              this.loginForm.reset()
            }
          }
        },
        (error) => {
          console.log('error : ', error);
          if (error === 'Server error') {
            _self.globalFunctionService.navigateToError('server');
          } else {
            _self.globalFunctionService.errorToast(error.message, '');
          }
        }
      );
    } else {

    }
  }

  verifyOtp() {
    let _self = this;
    const firebaseToken = this.globalFunctionService.getToken();
    console.log('firebase token : ' , firebaseToken);
    this.peopleApi.userOtpVerify(this.peopleId, +this.otpForm.value.otp, firebaseToken).subscribe(
      (success) => {
        console.log('mob verify : ', success);
				let token: SDKToken = new SDKToken();
				token = {
					'id' : success.success.data.accessToken,
					'user' : JSON.stringify(success.success.data),
					'userId' : success.success.data.id,
					'created' : success.success.data.createdAt,
					'ttl' : -1,
					'rememberMe' : false,
					'scopes'	 : ''
        };
        _self.localStorage.setValue('peopleId', success.success.data.id);
        _self.localStorage.setValue('profileCompleted', 
          success.success.data.isProfileComplete);
        _self.localStorage.setValue('user', JSON.stringify(success.success.data));
        _self.auth.setToken(token);
        _self.globalFunctionService.infoToast('Logging you in...');
        _self.globalFunctionService.onLoginMobile();
        _self.globalFunctionService.closeLoginMobile();
        // if (!success.success.data.isProfileComplete) {
        //   this.globalFunctionService.openSignUp();
        // }
      },
      (error) => {
        console.log('error : ', error);
          if (error === 'Server error') {
            _self.globalFunctionService.navigateToError('server');
          } else {
            _self.globalFunctionService.errorToast(error.message, '');
          }
      }
    )
  }

  navigateToSame() {
		const currentUrl = this.router.url;
		console.log('currentUrl : ' , currentUrl);
		// window.location.replace(this.baseUrl + '/' + currentUrl);
		// window.location.replace(window.location.href);
	}

  resendOtp () {
    let _self = this;
    this.peopleApi.resendUserOtp(this.peopleId).subscribe(
      (success) => {
        console.log('resend otp: ', success);
      },
      (error) => {
        console.log('error : ', error);
        if (error === 'Server error') {
          _self.globalFunctionService.navigateToError('server');
        } else {
          _self.globalFunctionService.errorToast(error.message, '');
        }
      }
    )
  }

  ngOnDestroy () {
    this.subscriber.unsubscribe();
  }
}

