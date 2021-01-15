import { Component, HostListener, ElementRef,
ViewChild, ViewContainerRef } from '@angular/core';
import { LoopBackConfig, LoopBackAuth, PeopleApi } from './sdk/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalFunctionService } from './services/global-function.service';

import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { OtpModalComponent } from './components/otp-modal/otp-modal.component';
import { CustomerModalComponent } from './components/customer-modal/customer-modal.component';
import { VendorModalComponent } from './components/vendor-modal/vendor-modal.component';
import { NotificationComponent } from './components/notification/notification.component';
import { BillComponent } from './components/bill/bill.component';

import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';

import { MessagingService } from './services/messaging.service';
import { LoginMobileComponent } from './components/login-mobile/login-mobile.component';
import { LocalStorageService } from './services/localstorage.service';

declare const $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	
	authCred: any = {};
	isLogin = false;
	baseUrl: string;
	defaultImage: string;
	myInfo: any;
	
	routerUrl: any = '';
	// this is used when we are signup and email not verified we show a
	// message that please verify your otp first then proceed for otp verification
	keepOtpData:any = {};
	@ViewChild(LoginModalComponent)
	private login: LoginModalComponent;
	@ViewChild(LoginMobileComponent)
	private loginMobile: LoginMobileComponent;

	@ViewChild(OtpModalComponent)
	private otpModal: OtpModalComponent;
	
	@ViewChild(CustomerModalComponent)
	private customerModal: CustomerModalComponent;
	
	@ViewChild(VendorModalComponent)
	private vendorModal: VendorModalComponent;
	
	@ViewChild(NotificationComponent)
	private notification: NotificationComponent;
	
	@ViewChild(BillComponent)
	private bill: BillComponent;
	
	hideTopBar: string[];
	hideHeader = false;
	
	private messaging = firebase.messaging();
	private messageSource = new Subject();
	
	@HostListener('document:click', ['$event'])
		clickout(event) {
			// this.setAuthCredential();
			if((event.target.id === 'search-container' ||  ( event.target && event.target.parentElement && event.target.parentElement.classList.contains('cross-icon'))) || 
				(event.target.parentElement && (event.target.parentElement.classList.contains('bank-name-container') || event.target.parentElement.classList.contains('cross-icon1')))) {
				console.log("clicked inside");
				if($('#category-container')[0])
					$('#category-container')[0].style.display = 'block';
			} else {
				if($('#category-container')[0] && $('#category-container')[0].style.display == 'block'){
					console.log("clicked outside");
					$('#category-container')[0].style.display = 'none';
				}
			}
			if((event.target && event.target.parentElement && event.target.parentElement.classList.contains('bank-name-container1'))){
				console.log("clicked inside");
				if($('#save8')[0].style.display == 'block' && $('#category-container1')[0]){
					$('#category-container1')[0].style.display = 'block';
				}
			} else {
				if($('#category-container1')[0] && $('#category-container1')[0].style.display == 'block' && $('#edit8')[0].style.display == 'block' ){
					console.log("clicked outside");
					$('#category-container1')[0].style.display = 'none';
				}
			}
			if (this.authCred && this.authCred.tokenId) {
				if (event.target.parentElement &&
					event.target.parentElement.parentElement &&
					event.target.parentElement.parentElement.id === 'noti_Container') {

				} else {
					if ($('#notifications').length > 0) {
						if ($('#notifications')[0].style.display === 'block') {
							$('#notifications').slideToggle("slow");
						}
					}
				}
			}
		}

	constructor(public messagingService: MessagingService, 
		private afs: AngularFirestore, private globalFunctionService: GlobalFunctionService,
		private peopleApi: PeopleApi, public router: Router, 
		private eRef: ElementRef,public toastr: ToastsManager, 
		private vcr: ViewContainerRef, private auth: LoopBackAuth,
		private localStorage: LocalStorageService) {
		LoopBackConfig.setBaseURL('https://api.fixpapa.com');
		// LoopBackConfig.setBaseURL('http://139.59.71.150:3008');
		LoopBackConfig.setApiVersion('api');
		this.toastr.setRootViewContainerRef(vcr);
		this.baseUrl = LoopBackConfig.getPath();
		// this.defaultImage = 'assets/images/default-pic.png';
		this.defaultImage = 'assets/images/default-pic.png';

		this.hideTopBar = ['reset', 'reset-password'];

		this.router.errorHandler = (error: any) => {
			this.router.navigate(['/']);
		};

		this.messaging.onMessage((payload) => {
			const payload1: any = payload;
			console.log('Message received. ', payload1);
			if (this.notification) {
				this.messageSource.next(payload);
				this.notification.getNewNotification();
			}
		});

		// this.globalFunctionService.onLoginMobile$.subscribe(
		// 	() => {
		// 		console.log('opensignup')
		// 		this.openSignup();
		// 	}
		// );
	}

	ngOnInit() {
		this.setAuthCredential();
		$(window).scroll(function () {
			if ($(this).scrollTop() > 250) {
				$('.top-scroll').fadeIn();
			} else {
				$('.top-scroll').fadeOut();
			}
		});

		$('.top-scroll').click(function () {
			$('html, body').animate({
				scrollTop: 0
			}, 600);
			return false;
		});

		this.messagingService.getPermission();

		$('.navbar-icon').click(function() {
			$('body').addClass('display-mobile-menu');
		});
		$('.close-canvas-mobile-panel').click(function() {
			$('body').removeClass('display-mobile-menu');
		});

		this.globalFunctionService.onLogin$.subscribe(
			(data) => {
				if (data) {
					this.isLogin = true;
					this.setAuthCredential();
				}
			}
		)
		this.globalFunctionService.onLoginMobile$.subscribe(
			(data) => {
				if (data) {
					this.isLogin = true;
					this.setAuthCredential();
				}
			}
		)
		this.globalFunctionService.onProfileUpdate$.subscribe(
			(data) => {
				if (data) {
					this.setAuthCredential();
				}
			}
		)
		this.globalFunctionService.onSignUpMobile$.subscribe(
			(data) => {
				if (data) {
					this.setAuthCredential();
				}
			}
		)

		this.globalFunctionService.onOtpVerify$.subscribe(
			(data) => {
				if (data) {
					this.setAuthCredential();
				}
 			}
		)
		const _self = this;
		this.router.events.subscribe((evt) => {
			_self.routerUrl = _self.router.url;
			// console.log("current url : ", _self.routerUrl);
			if (!(evt instanceof NavigationEnd)) {
				return;
			}
			if (evt.url === '/') {
				this.hideHeader = false;
			}
			if (evt.url !== '/') {
				this.hideHeader = true;
			}
			if (this.authCred.tokenId && ((this.authCred.realm === 'engineer' || this.authCred.realm === 'vendor') && evt.url === '/')) {
				_self.router.navigate(['/dashboard']);
			}
			if (!this.authCred.tokenId && !evt.url.includes('bill') &&
			 	!evt.url.includes('terms-and-condition') &&
			 	!evt.url.includes('privacy-and-security') &&
			 	!evt.url.includes('services') && !evt.url.includes('about-us') &&
				!evt.url.includes('reset') && !evt.url.includes('refund-policy')) {
				_self.router.navigate(['/']);
			}
			if (this.authCred.tokenId && evt.url.includes('pg-redirect') && this.authCred.realm === 'customer') {

			}
		});
	}

	getMyInfo() {
		const _self = this;
		_self.peopleApi.getMyInfo().subscribe(
			(success) => {
				console.log("myinfo : ", success);
				_self.myInfo = success.success.data;
				if (success.success.data.newNotification > 0) {
					if (_self.notification) {
						_self.notification.getNewNotification();
					}
				}
				if (success.success.data.image) {
					if (success.success.data.image.includes('https') || success.success.data.image.includes('http')) {
						_self.defaultImage = success.success.data.image;
					} else {
						success.success.data.image = _self.baseUrl + success.success.data.image;
						_self.defaultImage = success.success.data.image;
					}
				} else {
					_self.defaultImage = 'assets/images/register_bg.jpg';
				}
				_self.localStorage.setValue('profileCompleted', success.success.data.isProfileComplete);
				_self.localStorage.setValue('user', JSON.stringify(success.success.data));
				if (!success.success.data.fullName) {
					success.success.data.fullName = success.success.data.mobile
				}
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

	setAuthCredential() {
		this.authCred.tokenId = this.auth.getAccessTokenId();
		this.authCred.userId = this.auth.getCurrentUserId();
		this.authCred.realm = this.auth.getCurrentUserData() ? this.auth.getCurrentUserData().realm : '';
		if (this.authCred.tokenId && this.authCred.userId) {
			this.isLogin = true;
			this.getMyInfo();
		} else {
			this.isLogin = false;
		}
	}

	backToHome() {
		this.router.navigate(['/']);
	}

	openSignup() {
		this.login.openSignup();
	}

	resendOtpModal(data) {
		this.otpModal.resendOtp(data.peopleId);
	}

	openOtpVerifyModal(data) {
		this.keepOtpData = data;
		if (this.keepOtpData.emailVerified) {
			this.otpModal.openModal(this.keepOtpData.peopleId);
			// this.otpModal.openModal(data.peopleId);
		} else {
			$('#email-verification-alert').modal({backdrop: 'static', keyboard: false});
		}
	}

	openOtpVerifyModalFromAlert() {
		$('#email-verification-alert').modal('hide');
		this.otpModal.openModal(this.keepOtpData.peopleId);
	}

	openCustModel(data) {
		this.customerModal.openModal(data.isThirdParty);
	}

	openLoginMobModal() {
		this.loginMobile.openModal();
	}

	openVendModel() {
		this.vendorModal.openModal();
	}

	navigateToSame() {
		const currentUrl = this.router.url;
		if (currentUrl === '/') {
			// window.location.replace(window.location.href);
			this.setAuthCredential()
		} else {
			this.router.navigate(['/']);
		}
	}

	navigateToProfile() {
		const currentUrl = this.router.url;
		if (currentUrl === '/dashboard') {
		} else {
			this.router.navigate(['/dashboard']);
		}
	}

	logOut() {
		const _self = this;
		if (this.globalFunctionService.getUserCredentials().realm === 'customer') {
			this.peopleApi.logout().subscribe(
				(success) => {
					console.log('success : ', success);
					_self.globalFunctionService.logoutToast('Logging you out...');
					_self.isLogin = false;
					_self.auth.clear();
					_self.localStorage.deleteAll();
					_self.setAuthCredential();
					_self.backToHome();
				},
				(error) => {
					if (error === 'Server error') {
						_self.globalFunctionService.navigateToError('server');
					} else if (error.statusCode === 401) {
						_self.globalFunctionService.navigateToError('401');
					} else {
						console.log('error : ', error);
						_self.globalFunctionService.errorToast(error.message, 'oops');
					}
					console.log('error: ', error);
				}
			);
		} else {
			this.peopleApi.logout().subscribe(
				(success) => {
					console.log('success : ', success);
					_self.auth.clear();
					_self.globalFunctionService.logoutToast('Logging you out...');
					_self.backToHome();
				},
				(error) => {
					if (error === 'Server error') {
						_self.globalFunctionService.navigateToError('server');
					} else if (error.statusCode === 401) {
						_self.globalFunctionService.navigateToError('401');
					} else {
						console.log('error : ', error);
						_self.globalFunctionService.errorToast(error.message, 'oops');
					}
					console.log('error : ', error);
				}
			);
		}
	}
}
