import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PeopleApi, LoopBackConfig, LoopBackAuth } from './../../sdk/index';
import { SDKToken } from './../../sdk/models/BaseModels';
import { GlobalFunctionService } from './../../services/global-function.service';
import { Router } from '@angular/router';
import { AuthService, GoogleLoginProvider } from 'angular5-social-login';

import { FacebookService, InitParams } from 'ngx-facebook';
import { LocalStorageService } from '../../services/localstorage.service';

declare var $: any;

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

	loginForm: FormGroup;
	emailOrMobile: FormControl;
	passwordL: FormControl;
	invalidMobOrEmail = false;
	realm: string;
	peopleId: string;
	baseUrl: string;
	disableOthers: boolean = false;
	@Output() openCustomerModel = new EventEmitter();
	@Output() openLoginMobileModal = new EventEmitter();
	@Output() openVendorModel = new EventEmitter();
	@Output() resendOtp	= new EventEmitter();
	auth2: any;

	constructor(private socialAuthService: AuthService, private fb: FacebookService,
	private auth: LoopBackAuth, private router: Router, private peopleApi: PeopleApi,
	private globalFunctionService: GlobalFunctionService,
	private localStorageService: LocalStorageService) {
		this.baseUrl = LoopBackConfig.getPath();
		this.realm = 'customer';
		const initParams: InitParams = {
			appId: '242197496398149',
			xfbml: true,
			version: 'v2.8'
		};
		fb.init(initParams);
	}

	ngOnInit() {
		this.createLoginFormControls();
		this.createLoginForm();
		this.globalFunctionService.openLoginModal$.subscribe(
			(data) => {
				if (data.status) {
					this.openSignup();
				}
				if (data.realm) {
					this.disableOthers = true;
				}
			}
		)
	}

	openCustModel() {
		$('#largeModal1').removeClass('slideInRight');
		$('#largeModal1').addClass('slideInLeft');
		$('#largeModal1').modal('hide');
		$('#largeModal1').removeClass('slideInLeft');
		this.openCustomerModel.emit({isThirdParty: false});
	}

	openLoginModal () {
		$('#largeModal1').removeClass('slideInRight');
		$('#largeModal1').addClass('slideInLeft');
		$('#largeModal1').modal('hide');
		$('#largeModal1').removeClass('slideInLeft');
		this.openLoginMobileModal.emit({realm: this.realm});
	}

	openVendModal() {
		$('#largeModal1').addClass('slideInLeft');
		$('#largeModal1').modal('hide');
		$('#largeModal1').removeClass('slideInLeft');
		this.openVendorModel.emit(null);
	}

	closeModal() {
		$('#largeModal1').addClass('slideInLeft');
		$('#largeModal1').modal('hide');
		$('#largeModal1').removeClass('slideInLeft');
		this.invalidMobOrEmail = false;
		this.disableOthers = false;
		this.realm = 'customer';
		this.loginForm.reset();
	}

	createLoginFormControls() {
		this.emailOrMobile = new FormControl('', [
			Validators.required
		]);
		this.passwordL = new FormControl('', [
			Validators.required
		]);
	}

	login(loginObj) {
		loginObj = loginObj || {};
		const _self = this;
		const firebaseToken = this.globalFunctionService.getToken();
		console.log('firebase token : ' , firebaseToken);
		loginObj.firebaseToken = firebaseToken;
		this.peopleApi.login(loginObj, 'user', false).subscribe(
			(success) => {
				console.log('login manually : ', success);
				_self.localStorageService.setValue('profileCompleted', 
					success.success.user.isProfileComplete);
				_self.localStorageService.setValue('user', 
					success.success.user);
				let token: SDKToken = new SDKToken();
				token = {
					'id' : success.success.id,
					'user' : JSON.stringify(success.success.user),
					'userId' : success.success.user.id,
					'created' : success.success.user.createdAt,
					'ttl' : success.success.ttl,
					'rememberMe' : false,
					'scopes'	 : ''
				};
				_self.auth.setToken(token);
				_self.globalFunctionService.infoToast('Logging you in...');
				_self.globalFunctionService.onLogin();
				if (success.success.user.realm === 'customer') {
					// _self.navigateToSame();
				} else {
					_self.router.navigate(['dashboard']);
				}
				_self.globalFunctionService.onLogin();
				_self.closeModal();
			},
			(error) => {
				console.log('error : ', error);
				if (error.statusCode === 401) {
					if (error.code === 'LOGIN_FAILED_MOBILE_NOT_VERIFIED') {
						_self.peopleId = error.details.userId;
						_self.closeModal();
						_self.resendOtp.emit({peopleId : _self.peopleId});
					} else {
						if (error === 'Server error') {
							_self.globalFunctionService.navigateToError('server');
						} else {
							_self.globalFunctionService.errorToast(error.message, '');
						}
					}
				}
				if (error === 'Server error') {
					_self.globalFunctionService.navigateToError('server');
				}
			}
		);
	}

	checkCredentials() {
		let loginObj;
		this.invalidMobOrEmail = false;
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(this.loginForm.controls['emailOrMobile'].value)) {
			loginObj = { 'email' : this.loginForm.controls['emailOrMobile'].value, 'password' : this.loginForm.controls['passwordL'].value, 'realm' : this.realm };
			this.login(loginObj);
		} else {
			const mobile = '';
			const reMobile = /^[1-9]\d{9}$/;
			if (reMobile.test(this.loginForm.controls['emailOrMobile'].value)) {
				const val = this.loginForm.value.emailOrMobile;
				loginObj = { 'mobile' : val, 'password' : this.loginForm.controls['passwordL'].value, 'realm' : this.realm};
				console.log('login object : ', loginObj);
				this.login(loginObj);
			} else {
				this.invalidMobOrEmail = true;
			}
		}
	}

	navigateToSame() {
		const currentUrl = this.router.url;
		console.log('currentUrl : ' , currentUrl);
		// window.location.replace(this.baseUrl + '/' + currentUrl);
		window.location.replace(window.location.href);
	}

	createLoginForm() {
		this.loginForm = new FormGroup({
			emailOrMobile: this.emailOrMobile,
			passwordL: this.passwordL
		});
	}

	openSignup() {
		$('#largeModal1').modal({backdrop: 'static', keyboard: false});
		if ($('#largeModal1')[0].style.visibility === 'hidden') {
			$('#largeModal1').css("visibility", "visible");
		}
		// this.loginForm.reset();
		this.invalidMobOrEmail = false;
		this.realm = 'customer';
		$('#largeModal1').addClass('slideInRight');
	}

	checkLoginState() {
		this.fb.getLoginStatus().then((response) => {
			console.log('response : ', response);
			this.statusChangeCallback(response);
		}).catch((error) => {
			console.log('error : ', error);
		});
	}

	statusChangeCallback(response) {
		console.log('statusChangeCallback');
		console.log(response);

		if (response.status === 'connected') {
			this.loginNow(response);
		} else {
			this.logInFB();
		}
	}

	logInFB() {
		const _self = this;
		this.fb.login().then((success) => {
			console.log('facebook login success : ', success);
			if (success.authResponse) {
				// _self.cookieService.set( 'facebook_authToken', success.authResponse.accessToken );
				_self.loginNow(success);
			}
		}).catch((error) => {
			console.log('error : ', error);
		});
	}

	loginNow(success) {
		const _self = this;
		console.log('firebase token : ' , this.globalFunctionService.getToken());
		const firebaseToken = this.globalFunctionService.getToken();
		_self.peopleApi.LoginWithFB(firebaseToken, 'customer', success.authResponse.accessToken).subscribe(
			(success) => {
				console.log('facebook login : ', success);
				_self.closeModal();
				if (!success.success.data.user.isProfileComplete) {
					_self.globalFunctionService.setCustomerData(success.success.data.user);
					_self.openCustomerModel.emit({isThirdParty: true});
				} else {
					if (success.success.data.user.emailVerified && 
						success.success.data.user.mobileVerified) {
						let token: SDKToken = new SDKToken();
						token = {
							'id' : success.success.data.access_token,
							'user' : JSON.stringify(success.success.data.user),
							'userId' : success.success.data.user.id,
							'created' : success.success.data.user.createdAt,
							'ttl' : success.success.data.ttl || 12000,
							'rememberMe' : false,
							'scopes'	 : ''
						};
						_self.auth.setToken(token);
						_self.globalFunctionService.infoToast('Logging you in...');
						_self.navigateToSame();
					} else {
						if (!success.success.data.user.emailVerified) {
							_self.globalFunctionService.errorToast('Email is not verified', 'oops');
						}
						if (!success.success.data.user.mobileVerified) {
							_self.globalFunctionService.errorToast('Mobile is not verified', 'Please verify your mobile');
							_self.peopleId = success.success.data.user.id;
							_self.resendOtp.emit({peopleId : _self.peopleId});
						}
					}
				}
			},
			(error) => {
				console.log('error : ', error);
				if (error === 'Server error') {
					_self.globalFunctionService.navigateToError('server');
				} else {
					_self.globalFunctionService.errorToast(error.message, 'oops!!!');
				}
			}
		);
	}

	socialSignIn() {
		let socialPlatformProvider;
		const _self = this;
		const firebaseToken = this.globalFunctionService.getToken();
		console.log('firebase token : ' , firebaseToken);
		socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
		if (1) {
			_self.socialAuthService.signIn(socialPlatformProvider).then(
				(userData) => {
					console.log(' sign in data : ' , userData);
					if (userData.idToken) {
						_self.peopleApi.googleLogin(firebaseToken, 'customer', userData.idToken).subscribe(
							(success) => {
								console.log('google Success	: ', success);
								_self.closeModal();
								if (!success.success.data.user.isProfileComplete) {
									_self.globalFunctionService.setCustomerData(success.success.data.user);
									_self.openCustomerModel.emit({isThirdParty: true});
								} else {
									if (success.success.data.user.emailVerified && success.success.data.user.mobileVerified) {
										_self.globalFunctionService.setLoopbackAuth(success.success.data);
										let token: SDKToken = new SDKToken();
										token = {
											'id' : success.success.data.access_token,
											'user' : JSON.stringify(success.success.data.user),
											'userId' : success.success.data.user.id,
											'created' : success.success.data.user.createdAt,
											'ttl' : success.success.data.ttl,
											'rememberMe' : false,
											'scopes'	 : ''
										};
										_self.auth.setToken(token);
										_self.globalFunctionService.infoToast('Logging you in...');
										_self.navigateToSame();
									} else {
										if (!success.success.data.user.emailVerified) {
											_self.globalFunctionService.errorToast('Email is not verified', 'oops');
										}
										if (!success.success.data.user.mobileVerified) {
											_self.globalFunctionService.errorToast('Mobile is not verified', 'Please verify your mobile');
											_self.peopleId = success.success.data.user.id;
											_self.resendOtp.emit({peopleId : _self.peopleId});
										}
									}
								}
							},
							(error) => {
								console.log('error : ', error);
								if (error === 'Server error') {
									_self.globalFunctionService.navigateToError('server');
								} else {
									_self.globalFunctionService.errorToast(error.message, 'oops!!!');
								}
							}
						);
					}
				}
			);
		}
	}
}
