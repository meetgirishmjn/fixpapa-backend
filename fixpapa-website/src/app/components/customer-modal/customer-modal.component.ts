import { Component, OnInit, ViewChild, NgZone, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalFunctionService } from './../../services/global-function.service';
import { MultipartService } from './../../services/multipart/multipart.service';

import { validateEmail } from './../../validators/email.validator';
import { validateMobile } from './../../validators/mobile.validator';
import { MapsAPILoader } from '@agm/core';

declare var $: any;

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.css']
})
export class CustomerModalComponent implements OnInit {

	customerSignUpForm: FormGroup;
	fullName: FormControl;
	email: FormControl;
	password: FormControl;
	confPassCust: FormControl;
	mobile: FormControl;
	address: FormControl;
	formatted_address: any;
	gstNumber: FormControl;
	customerType: FormControl;
	files: any = {};
	defaultCust: string;
	custProfileImg: string;
	lat: any;
	lng: any;
	disableCust = false;
	street: FormControl;
	registeredMobileNo: string;
	peopleId: string;
	invalidLocation = false;
	addresses: any[];
	companyName: FormControl;

	isLogin = false;
	user: any = {};

	@Output() openOtpModal = new EventEmitter();
	@Output() openLoginModal = new EventEmitter();

	private addressInput: ElementRef;

	@ViewChild('addressInput') set content1(content1: ElementRef) {
		this.initialiseMap();
	}

	constructor(private globalFunctionService: GlobalFunctionService,
		private multipartService: MultipartService,
		private mapsAPILoader: MapsAPILoader) {
		this.defaultCust = 'home';
		this.custProfileImg = 'assets/images/profile-img.png';
	}

	ngOnInit() {
	}

	openModal(isThirdParty) {
		this.invalidLocation = false;
		$('#largeModal2').addClass('slideInRight');
		if (isThirdParty) {
			this.isLogin = true;
		} else {
			this.isLogin = false;
		}
		this.createCustomerSignUpControls();
		this.createCustomerSignUpForm();
		$('#largeModal2').modal({backdrop: 'static', keyboard: false});
		if ($('#largeModal2')[0].style.display === '' && $('#largeModal2')[0].style.display === 'none') {
			$('#largeModal2').css('display', 'block');
		}
		if ($('#largeModal2')[0].style.visibility === 'hidden') {
			$('#largeModal2').css('visibility', 'visible');
		}
	}

	closeModal() {
		this.resetCustomerSignUp();
		$('#largeModal2').modal('hide');
	}

	initialiseMap() {
		this.mapsAPILoader.load().then(() => {
			const options = {
				componentRestrictions: {country: 'Ind'}
			};
			if (<HTMLInputElement>document.getElementById('customer-address')) {
				const addCustAutocomplete = new google.maps.places.Autocomplete(<HTMLInputElement>document.getElementById('customer-address'), options);
				addCustAutocomplete.addListener('place_changed', () => {
					this.formatted_address = '';
					this.lat = '';
					this.lng = '';
					const place: google.maps.places.PlaceResult = addCustAutocomplete.getPlace();
					if (place.geometry === undefined || place.geometry === null) {
						return;
					} else {
						this.customerAddress(place);
					}
				});
			}
		});
	}

	customerAddress(place) {
		this.lat = place.geometry.location.lat();
		this.lng = place.geometry.location.lng();
		this.formatted_address = place.formatted_address;
		this.customerSignUpForm.controls['address'].setValue(this.formatted_address);
		this.addresses = [];
		this.addresses.push({'value' : this.customerSignUpForm.get('address').value,
    'location' : { 'lat' : this.lat, 'lng' : this.lng }, 'street' : ''});
	}

	setCurrentLocation() {
		const _self = this;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				_self.lat = position.coords.latitude;
				_self.lng = position.coords.longitude;
				const geocoder = new google.maps.Geocoder();
				geocoder.geocode({ location: new google.maps.LatLng(_self.lat, _self.lng)}, function(results, status) {
					if (status) {
						_self.formatted_address = results[0].formatted_address;
						_self.setCurrentAddress(_self.formatted_address, _self.lat, _self.lng);
					} else {
						alert('Geocode was not successful for the following reason: ' + status);
					}
				});
			}, (error) => {
					if (error.code === 2) {
						_self.globalFunctionService.errorToast('Internet Connection Lost', 'oops');
					}
					if (error.code === 1) {
						_self.globalFunctionService.errorToast(error.message, 'oops');
					}
				});
		} else {
			_self.globalFunctionService.errorToast('Browser doesn\'t support Geolocation', 'oops');
		}
	}

	setCurrentAddress(value, lat, lng) {
		if (value) {
			this.customerSignUpForm.controls['address'].setValue(value);
			this.addresses = [];
			this.addresses.push({'value' : this.customerSignUpForm.get('address').value, 'location' : { 'lat' : lat, 'lng' : lng }, 'street' : ''});
			this.invalidLocation = false;
		}
	}

	clearAddress() {
		this.customerSignUpForm.get('address').setValue('');
		this.addresses = [];
		this.lat = '';
		this.lng = '';
		this.formatted_address = '';
		this.invalidLocation = false;
	}

	resetCustomerSignUp() {
		this.customerSignUpForm.reset();
		this.customerSignUpForm.controls['customerType'].setValue(this.defaultCust);
		this.files = {};
		this.custProfileImg = 'assets/images/profile-img.png';
		const myStorage = window.localStorage;
		if (myStorage.getItem('user')) {
			myStorage.removeItem('user');
		}
	}

	signUpCustomer(data) {
		const _self = this;
		this.multipartService.signupApi(data).subscribe(
			(success) => {
				_self.disableCust = false;
				_self.resetCustomerSignUp();
				_self.globalFunctionService.successToast('', 'Signed Up Successfully');
				if (_self.isLogin) {
					if (!success.success.data.mobileVerified) {
						_self.registeredMobileNo = success.success.data.mobile;
						_self.peopleId = success.success.data.id;
						_self.openOtpModal.emit({peopleId: _self.peopleId, emailVerified: success.success.data.emailVerified});
					}
					/*if(!success.success.data.emailVerified){
						_self.globalFunctionService.infoToast("PLease verify your email Id");
					}*/
					if (success.success.data.mobileVerified && 
						success.success.data.emailVerified) {
						_self.openLoginModal.emit(null);
					}
				} else {
					_self.registeredMobileNo = success.success.data.mobile;
					_self.peopleId = success.success.data.id;
					_self.openOtpModal.emit({peopleId: _self.peopleId});
				}
				_self.closeModal();
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
						_self.customerSignUpForm.controls['address'].setValue('');
						_self.customerSignUpForm.controls['password'].setValue('');
						_self.customerSignUpForm.controls['confPassCust'].setValue('');
					} else {
						_self.globalFunctionService.errorToast(error.message, 'oops');
					}
				}
			}
		);
	}

	openVerifyOtpModel() {
		$('#largeModal2').modal('hide');
		this.openOtpModal.emit(null);
	}

	checkSignUpForm() {
		if (this.customerSignUpForm.valid) {
			this.disableCust = true;
			/*if(this.customerSignUpForm.get('address').value && this.customerSignUpForm.get('address').value.length > 0
				&& (this.customerSignUpForm.get('address').value === this.formatted_address)){
				this.invalidLocation = false;
			}else{
				this.invalidLocation = true;
			}*/

			if ((this.customerSignUpForm.value.password === this.customerSignUpForm.value.confPassCust) && !this.invalidLocation) {
				/*if(this.customerSignUpForm.value.street){
					this.addresses[0].street =  this.customerSignUpForm.value.street;
				}else{
					this.addresses[0].street =  '';
				}*/
				// this.addresses[0].street =  this.customerSignUpForm.value.street;
				// let obj1 = { "addresses" : this.addresses };
				const obj2  = { 'realm' : 'customer'};
				delete this.customerSignUpForm.value.confPassCust;
				delete this.customerSignUpForm.value.address;
				delete this.customerSignUpForm.value.street;
				let obj;
				if (!this.isLogin) {
					// obj = Object.assign({},obj1,this.customerSignUpForm.value, obj2 );
					obj = Object.assign({}, this.customerSignUpForm.value, obj2 );
				} else {
					const obj3 = { 'peopleId' : this.user.id };
					// obj = Object.assign({},obj1,this.customerSignUpForm.value, obj2, obj3 );
					obj = Object.assign({}, this.customerSignUpForm.value, obj2, obj3 );
				}
				const data = { 'data' : obj, 'files' : this.files };
				this.signUpCustomer(data);
			} else {
				this.disableCust = false;
			}
		} else {
			this.customerSignUpForm.controls['fullName'].markAsTouched();
			this.customerSignUpForm.controls['email'].markAsTouched();
			this.customerSignUpForm.controls['password'].markAsTouched();
			this.customerSignUpForm.controls['confPassCust'].markAsTouched();
			this.customerSignUpForm.controls['mobile'].markAsTouched();
			this.customerSignUpForm.controls['address'].markAsTouched();
			this.customerSignUpForm.controls['gstNumber'].markAsTouched();
			this.customerSignUpForm.controls['companyName'].markAsTouched();
			this.customerSignUpForm.controls['street'].markAsTouched();
		}
	}

	createCustomerSignUpControls() {
		this.address = new FormControl('', [
			// Validators.required
		]);
		this.gstNumber = new FormControl('', [
		]);
		this.companyName = new FormControl('', [
		]);
		this.customerType = new FormControl(this.defaultCust, [
		]); /*9649165819*/
		this.street = new FormControl('', []);
		this.password = new FormControl('', [
			Validators.required,
			Validators.minLength(6)
		]);
		this.confPassCust = new FormControl('', [
			Validators.required
		]);
		if (this.isLogin) {
			const myStorage = window.localStorage;
			this.user =  JSON.parse(myStorage.getItem('user'));
			this.mobile = new FormControl(this.user.mobile, [
				Validators.required,
				validateMobile
			]);
			this.email = new FormControl(this.user.email, [
				Validators.required,
				validateEmail
			]);
			this.fullName = new FormControl(this.user.fullName, [
				Validators.required
			]);
			this.custProfileImg = this.user.image;
			const image1 = [this.custProfileImg];
			this.files.image = image1;
		} else {
			this.fullName = new FormControl('', [
				Validators.required
			]);
			this.email = new FormControl('', [
				Validators.required,
				validateEmail
			]);
			this.mobile  = new FormControl('', [
				Validators.required,
				validateMobile
			]);
		}
	}

	createCustomerSignUpForm() {
		this.customerSignUpForm = new FormGroup({
			fullName 		: this.fullName,
			email 			: this.email,
			password 		: this.password,
			confPassCust 	: this.confPassCust,
			mobile 			: this.mobile,
			address 		: this.address,
			gstNumber 		: this.gstNumber,
			companyName		: this.companyName,
			customerType 	: this.customerType,
			street 			: this.street
		});
	}
}
