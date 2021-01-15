import { Component, OnInit, NgZone, EventEmitter, Output } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { PeopleApi,CategoryApi,NewpurchaseApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { MultipartService } from './../../services/multipart/multipart.service';

import { validateEmail } from './../../validators/email.validator';
import { validateWorkEx } from './../../validators/yearOfExp.validator';
import { validateAccountNo } from './../../validators/accountNo.validator';
import { bankNameList } from './../../bank-name-list';
import { validateMobile } from './../../validators/mobile.validator';
import { validateIfsc } from './../../validators/ifsc.validator';
import { MapsAPILoader } from '@agm/core';

declare var $:any;

@Component({
  selector: 'app-vendor-modal',
  templateUrl: './vendor-modal.component.html',
  styleUrls: ['./vendor-modal.component.css']
})
export class VendorModalComponent implements OnInit {

	// vendorSignUpForm 	: FormGroup;
	personalDetailForm	: FormGroup;
	teamDetailForm		: FormGroup;
	bankDetailForm		: FormGroup;
	servicesForm		: FormGroup;
	
	password			: FormControl;
	email				: FormControl;
	fullName			: FormControl;
	noSupportDays 		: boolean = false;
	addresses 			: any[];
	mobile				: FormControl;
	address 			: FormControl;
	gstNumber 			: FormControl;
	confPassVen 		: FormControl;
	noOfEngineers 		: FormControl;
	yearOfExp 			: FormControl;
	startTime 			: FormControl;
	endTime   			: FormControl;
	supportDays 		: FormControl;
	firmName 			: FormControl;
	bankName 			: FormControl;
	ifscCode 			: FormControl;
	accountNumber 		: FormControl;
	newpurchaseIds 		: FormControl;
	servicesIds 		: FormControl;
	noServices			: boolean = false;
	noProducts			: boolean = false;
	lat 				: any;
	lng 				: any;
	formatted_address	: string;
	street 				: FormControl;
	vendorProfilePic	: string;
	fileSize			: {};
	bankNames 			: string[];
	invalidLocation 	: boolean = false;
	invalidTime			: boolean = false;
	block1				: any[] = [{name : 'Monday', value : '1'}, {name : 'Tuesday', value : '2' }, {name : 'Wednessday',value: '3'}];
	block2 				: any[] = [{name : 'Thursday', value : '4'}, {name : 'Friday', value : '5'}, {name : 'Saturday', value : '6'}];
	block3 				: any[] = [{name : 'Sunday', value : '0'}];
	
	servicesOffered 	:any[];
	productsOffered		:any[];
	files				:any = {};
	disableVend			: boolean = false;
	peopleId			: any;
	registeredMobileNo 	: any;
	activePhase 		: any;
	
	isMobile : boolean = false;
	focusBeforeStart : boolean = false;
	focusBeforeEnd   : boolean = false;
	startTime1		 : any = '';
	endTime1		 : any = '';
	
	existEmail       : boolean = false;
	existMobile		 : boolean = false;
	
	disablePhase1    : boolean = false;
	
	aadharImg : any;
	panImg : any;
	chequeImg : any;
	gstImg : any;
	
	noAadharImg : boolean = false;
	noPanImg : boolean = false;
	noGstImg : boolean = false;
	noChequeImg : boolean = false;
	
	@Output() openOtpModal = new EventEmitter();
	constructor(private globalFunctionService : GlobalFunctionService,
		private peopleApi : PeopleApi, private multipartService : MultipartService,
		private mapsAPILoader: MapsAPILoader,private ngZone: NgZone,
		private newpurchaseApi : NewpurchaseApi,private categoryApi : CategoryApi){
		this.vendorProfilePic = 'assets/images/profile-img.png';
		this.aadharImg = 'assets/images/profile-img.png';
		this.panImg = 'assets/images/profile-img.png';
		this.chequeImg = 'assets/images/profile-img.png';
		this.gstImg = 'assets/images/profile-img.png';
		this.bankNames = bankNameList;
		this.activePhase = 1;
	}

	ngOnInit(){
		this.checkForDevice();
		this.createVendorSignUpControls();
		this.createVendorSignUpForm();
		this.initializeClockPicker();
		this.initialiseMap();
		this.getServices();
		this.getProducts();
	}
	
	checkForDevice(){
		console.log("width : ", window.screen.width);
		if(window.screen.width <= 499 ){
			this.isMobile = true;
			console.log("isMobile : ", this.isMobile);
		}else{
			this.isMobile = false;
			console.log("isMobile : ", this.isMobile);
		}
	}
	
	focusedBefore(value){
		if(value === 'start'){
			this.focusBeforeStart = true;
		}
		if(value === 'end'){
			this.focusBeforeEnd = true;
		}
	}
	
	changedValue(value){
		if(value === 'start'){
			let startTime = $('#startTime')[0].value;
			if(!startTime && this.focusBeforeStart){
				this.startTime1 = '';
			}
		}
		if(value === 'end'){
			let startDate = $('#endTime')[0].value;
			if(!startDate && this.focusBeforeEnd){
				this.endTime1 = '';
			}
		}
	}
	
	openModal(){
		$('#largeModal3').modal({backdrop: 'static', keyboard: false});
		$("#largeModal3").addClass("slideInRight");
		if ($("#largeModal3")[0].style.visibility === 'hidden') {
			$("#largeModal3").css('visibility', 'visible');
		}
		if ($("#largeModal3")[0].style.display === 'none' ||
			$("#largeModal3")[0].style.display === '') {
			$("#largeModal3").css('display', 'block');
		}
		this.noAadharImg = false;
		this.noPanImg = false;
		this.noGstImg = false;
		this.noChequeImg = false;
		this.personalDetailForm.reset();
		this.teamDetailForm.reset();
		this.bankDetailForm.reset();
		this.servicesForm.reset();
		this.existEmail = false;
		this.existMobile = false;
		this.goToStep(1);
	}
	
	openVerifyOtpModel(){
		$("#largeModal3").modal('hide');
		this.openOtpModal.emit({peopleId : ''});
	}
	
	initialiseMap(){
		this.mapsAPILoader.load().then(()=>{
			let options = {
				componentRestrictions: {country: 'Ind'}
			};
			let addVendAutoComplete = new google.maps.places.Autocomplete(<HTMLInputElement>document.getElementById("address-vendor1"),options);
			addVendAutoComplete.addListener('place_changed', () => {
				this.formatted_address = '';
				this.lat = '';
				this.lng = '';
				let place: google.maps.places.PlaceResult = addVendAutoComplete.getPlace();
				if (place.geometry === undefined || place.geometry === null) {
					return;
				}else{
					this.vendorAddress(place);
				}
			});
		});
	}
	
	setCurrentLocation(){
		let _self = this;
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition((position)=>{
				_self.lat = position.coords.latitude;
				_self.lng = position.coords.longitude;
				let geocoder = new google.maps.Geocoder();
				geocoder.geocode({ location: new google.maps.LatLng(_self.lat,_self.lng)}, function(results, status) {
					if (status) {
						console.log("results : ", results);
						_self.formatted_address = results[0].formatted_address;
						_self.setCurrentAddress(_self.formatted_address, _self.lat, _self.lng);
					} else {
						alert('Geocode was not successful for the following reason: ' + status);
					}
				});
			}, (error)=>{
					//this.handleLocationError(true, infoWindow, this.map.getCenter(),this.map);
					console.log("error : ", error);
					if(error.code == 2){
						_self.globalFunctionService.errorToast('Internet Connection Lost','oops');
					}
					if(error.code == 1){
						_self.globalFunctionService.errorToast(error.message,'oops');
					}
				});
		} else {
			_self.globalFunctionService.errorToast("Browser doesn't support Geolocation",'oops');
			// Browser doesn't support Geolocation
			//this.handleLocationError(false, infoWindow, this.map.getCenter(),this.map);
		}
	}
	
	setCurrentAddress(value,lat,lng){
		if(value){
			this.personalDetailForm.controls['address'].setValue(value);
			this.addresses = [];
			this.addresses.push({'value' : this.personalDetailForm.get('address').value, 'location' : { 'lat' : lat, 'lng' : lng },'street' : ''});
			this.invalidLocation = false;
		}
	}
	
	clearAddress(){
		this.personalDetailForm.get('address').setValue('');
		this.addresses = [];
		this.lat = '';
		this.lng = '';
		this.formatted_address = '';
		this.invalidLocation = false;
	}
  
	initializeClockPicker(){
		var input = $('#input-a');
		var value = input.val();
		// bind multiple inputs
		$('#startTime').clockpicker({
			autoclose: true,
			afterDone: function() {
				console.log("test");
			}
		});
		let _self = this;
		// in the actual code it's not tied to an id but to a non-unique class
		// does not trigger if changed by clock-picker
		$("#startTime").on('change', function(){
			if(_self.teamDetailForm.controls['endTime'].value && (_self.teamDetailForm.controls['endTime'].value < this.value)){
				_self.teamDetailForm.get('startTime').setValue('');
				_self.invalidTime = true;
			}else{
				_self.startTime1 = this.value;
				_self.teamDetailForm.get('startTime').setValue(this.value);
				_self.invalidTime = false;
			}
			
			
			console.log("form control : ", _self.teamDetailForm.controls['startTime'].value);
		});
		
		$("#endTime").on('change', function(){
			if(_self.teamDetailForm.controls['startTime'].value && (this.value < _self.teamDetailForm.controls['startTime'].value)){
				_self.teamDetailForm.get('endTime').setValue('');
				_self.invalidTime = true;
			}else{
				_self.endTime1 = this.value;
				_self.teamDetailForm.get('endTime').setValue(this.value);
				_self.invalidTime = false;
			}
			console.log("form control : ", _self.teamDetailForm.controls['endTime'].value);
		});

		// bind multiple inputs
		$('#endTime').clockpicker({
			autoclose: true,
			afterDone: function() {
				console.log("test");
			}
		});
	}
	
	clearBankName(){
		this.bankDetailForm.get('bankName').setValue('');
	}
	
	selectBank(bank){
		this.bankDetailForm.get('bankName').setValue(bank);
	}
	
	onChange(day,evt){
		let newValue;
		if(evt.target.checked){
			if(this.teamDetailForm.controls['supportDays'].value){
				newValue = this.teamDetailForm.controls['supportDays'].value +  ',' + day;
			}else{
				newValue = day;
			}
			if(this.noSupportDays){
				this.noSupportDays = false;
			}
			this.teamDetailForm.controls['supportDays'].setValue(newValue);
		}
		else{
			let newArr = this.teamDetailForm.controls['supportDays'].value.split(',');
			const index = newArr.indexOf(''+day);
			console.log("index : ", index);
			if(index !== -1){
				newArr.splice(index,1);
			}
			if(newArr.length == 0){
				this.noSupportDays = true;
			}
			newValue = newArr.join(',');
			this.teamDetailForm.controls['supportDays'].setValue(newValue);
		}
		console.log("supportDays : ", this.teamDetailForm.controls['supportDays'].value);
	}
	
	changeServices(id,evt){
		let newValue;
		if(evt.target.checked){
			if(this.servicesForm.controls['servicesIds'].value){
				newValue = this.servicesForm.controls['servicesIds'].value +  ',' + id;
			}else{
				newValue = id;
			}
			if(this.noServices){
				this.noServices = false;
			}
			this.servicesForm.controls['servicesIds'].setValue(newValue);
		}
		else{
			let newArr = this.servicesForm.controls['servicesIds'].value.split(',');
			const index = newArr.indexOf(id);
			console.log("index : ", index);
			if(index !== -1){
				newArr.splice(index,1);
			}
			if(newArr.length == 0){
				this.noServices = true;
			}
			newValue = newArr.join(',');
			this.servicesForm.controls['servicesIds'].setValue(newValue);
		}
		console.log("servicesIds : ", this.servicesForm.controls['servicesIds'].value);
	}
	
	changeProducts(id,evt){
		let newValue;
		if(evt.target.checked){
			if(this.servicesForm.controls['newpurchaseIds'].value){
				newValue = this.servicesForm.controls['newpurchaseIds'].value +  ',' + id;
			}else{
				newValue = id;
			}
			if(this.noProducts){
				this.noProducts = false;
			}
			this.servicesForm.controls['newpurchaseIds'].setValue(newValue);
		}
		else{
			let newArr = this.servicesForm.controls['newpurchaseIds'].value.split(',');
			const index = newArr.indexOf(id);
			console.log("index : ", index);
			if(index !== -1){
				newArr.splice(index,1);
			}
			if(newArr.length == 0){
				this.noProducts = true;
			}
			newValue = newArr.join(',');
			this.servicesForm.controls['newpurchaseIds'].setValue(newValue);
		}
		console.log("newpurchaseIds : ", this.servicesForm.controls['newpurchaseIds'].value);
	}
	
	createVendorSignUpControls(){
		this.fullName = new FormControl('',[
			Validators.required
		]);
		this.email = new FormControl('',[
			Validators.required,
			validateEmail
		]);
		this.password = new FormControl('',[
			Validators.required,
			Validators.minLength(6)
		]);
		this.confPassVen = new FormControl('',[
			Validators.required
		]);
		this.noOfEngineers = new FormControl(0,[
		]);
		this.yearOfExp = new FormControl('',[
			Validators.required,
			validateWorkEx
		]);
		this.startTime = new FormControl('',[
			Validators.required
		]);
		this.endTime = new FormControl('',[
			Validators.required
		]);
		this.firmName = new FormControl('',[
			Validators.required
		]);
		this.bankName  = new FormControl('',[
			Validators.required
		]);
		this.ifscCode  = new FormControl('',[
			Validators.required,
			validateIfsc
		]);
		this.accountNumber = new FormControl('',[
			Validators.required,
			validateAccountNo
		]);
		this.supportDays = new FormControl('',[
			Validators.required
		]);
		this.newpurchaseIds = new FormControl('',[
			Validators.required
		]);
		this.servicesIds = new FormControl('',[
			Validators.required
		]);
		this.mobile = new FormControl('',[
			Validators.required,
			validateMobile
		]);
		this.address = new FormControl('',[
			Validators.required
		]);
		this.gstNumber = new FormControl('',[
			Validators.required
		]); 	
		this.street  =  new FormControl('',[]);
	}
	
	createVendorSignUpForm(){
		this.personalDetailForm = new FormGroup({
			fullName 		: this.fullName,
			email 			: this.email,
			password 		: this.password,
			confPassVen 	: this.confPassVen,
			mobile 			: this.mobile,
			address 		: this.address,
			street			: this.street
		});
		
		this.teamDetailForm = new FormGroup({
			noOfEngineers 	: this.noOfEngineers,
			yearOfExp 		: this.yearOfExp,
			startTime 		: this.startTime,
			endTime 		: this.endTime,
			supportDays 	: this.supportDays
		});
		
		this.bankDetailForm = new FormGroup({
			gstNumber 		: this.gstNumber,
			firmName 		: this.firmName,
			bankName 		: this.bankName,
			ifscCode 		: this.ifscCode,
			accountNumber 	: this.accountNumber,
		});
		
		this.servicesForm = new FormGroup({
			servicesIds 	: this.servicesIds,
			newpurchaseIds 	: this.newpurchaseIds
		});
	}
	
	vendorAddress(place){
		this.lat = place.geometry.location.lat();
		this.lng = place.geometry.location.lng();
		this.formatted_address = place.formatted_address;
		this.personalDetailForm.controls['address'].setValue(this.formatted_address);
		console.log(this.personalDetailForm.get('address').value);
		this.addresses = [];
		this.invalidLocation = false;
		this.addresses.push({'value' : this.personalDetailForm.get('address').value, 'location' : { 'lat' : this.lat, 'lng' : this.lng }, 'street' : ''});
	}
	
	getServices(){
		let _self = this;
		this.categoryApi.getAllCategories().subscribe(
			(success)=>{
				console.log("services offered : ", success);
				_self.servicesOffered = success.success.data;
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ", error);
			}
		);
	}
	
	getProducts(){
		let _self = this;
		this.newpurchaseApi.getAllPurchases().subscribe(
			(success)=>{
				console.log("success : ", success);
				_self.productsOffered = success.success.data;
			},
			(error)=>{
				console.log("error : ", error);
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
			}
		);
	}
	
	resetVendorSignUp(){
		this.personalDetailForm.reset();
		this.teamDetailForm.reset();
		this.bankDetailForm.reset();
		this.servicesForm.reset();
		this.invalidLocation = false;
		this.files = {};
		this.existEmail = false;
		this.existMobile = false;
		this.disablePhase1 = false;
		this.noAadharImg = false;
		this.noChequeImg = false;
		this.noGstImg = false;
		this.noPanImg = false;
		this.teamDetailForm.controls['noOfEngineers'].setValue(0);
		this.vendorProfilePic = 'assets/images/profile-img.png';
		var inputs=document.getElementsByTagName("input");
		for (var i in inputs)
			if (inputs[i].type=="checkbox") inputs[i].checked=false;
	}
	
	closeModal(){
		this.resetVendorSignUp();
		$('#largeModal3').modal('hide');
	}
	
	signUpVendor(data){
		let _self = this;
		this.multipartService.signupApi(data).subscribe(
			(success)=>{
				//console.log("success : ", success);
				_self.disableVend = false;
				_self.globalFunctionService.successToast('','Signed Up Successfully');
				_self.registeredMobileNo = success.success.data.mobile;
				_self.peopleId = success.success.data.id;
				_self.openOtpModal.emit({peopleId:_self.peopleId});
				_self.closeModal();
			},
			(error)=>{
				_self.disableVend = false;
				console.log("error : ", error);
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else{
					if(error.statusCode === 422 && error.name === "ValidationError"){
						_self.globalFunctionService.errorToast(error.message,"oops");
						_self.personalDetailForm.controls['password'].setValue('');
						_self.personalDetailForm.controls['confPassVen'].setValue('');
						_self.personalDetailForm.controls['address'].setValue('');
					}else{
						_self.globalFunctionService.errorToast(error.message,"oops");
						_self.closeModal();
					}
				}
			}
		);
	}
	
	checkSignUpForm(){
		console.log("form data : ", this.personalDetailForm.value);
		console.log("form data : ", this.teamDetailForm.value);
		console.log("form data : ", this.bankDetailForm.value);
		console.log("form data : ", this.servicesForm.value);
		if(this.servicesForm.valid){
			if(this.personalDetailForm.get('address').value === this.formatted_address){
				this.invalidLocation = false;
			}else{
				this.invalidLocation = true;
			}
			//console.log("profile image : ", this.files.image);
			if((this.personalDetailForm.value.password === this.personalDetailForm.value.confPassVen) && 
				this.personalDetailForm.valid && this.teamDetailForm.valid && this.bankDetailForm.valid && 
				this.servicesForm.valid && !this.invalidLocation && this.servicesForm.value.servicesIds &&
				this.servicesForm.value.servicesIds.length > 0 && this.servicesForm.value.newpurchaseIds && 
				this.servicesForm.value.newpurchaseIds.length > 0){
				this.disableVend = true;
				// if(this.personalDetailForm.value.mobile.includes('+91') || this.personalDetailForm.value.mobile[0] === '0'){
					
				// }else{
					// let newMobile = '+91' + this.personalDetailForm.value.mobile;
					// this.personalDetailForm.controls['mobile'].setValue(newMobile);
				// }
				if(this.personalDetailForm.value.street){
					this.addresses[0].street =  this.personalDetailForm.value.street;
				}else{
					this.addresses[0].street =  '';
				}
				//this.addresses[0].street =  this.personalDetailForm.value.street;
				let obj1 = { "addresses" : this.addresses };
				let obj2  = { "realm" : "vendor"};
				let supportDays = this.teamDetailForm.value.supportDays.split(',');
				for(var i=0;i<=supportDays.length-1;i++){
					supportDays[i] = +supportDays[i];
				}
				let newpurchaseIds = this.servicesForm.value.newpurchaseIds.split(',');
				let servicesIds = this.servicesForm.value.servicesIds.split(',');
				delete this.personalDetailForm.value.confPassVen;
				delete this.personalDetailForm.value.address;
				delete this.personalDetailForm.value.street;
				delete this.teamDetailForm.value.supportDays;
				delete this.servicesForm.value.newpurchaseIds;
				delete this.servicesForm.value.servicesIds;
				
				console.log("personalDetailForm : ", this.personalDetailForm);
				
				let obj3 = {'supportDays' : supportDays};
				let obj4 = {'newpurchaseIds' : newpurchaseIds};
				let obj5 = {'servicesIds' : servicesIds};
				let obj = Object.assign({},obj1,this.personalDetailForm.value,this.teamDetailForm.value,this.bankDetailForm.value ,this.servicesForm.value, obj2, obj3, obj4, obj5);
				obj.yearOfExp = +obj.yearOfExp;
				obj.noOfEngineers = +obj.noOfEngineers;
				let data = { 'data' : obj, 'files' : this.files };
				console.log("form data : ", data);
				this.signUpVendor(data);
			}else{
				this.disableVend = false;
				//this.openVerifyOtpModel();
			}
		}else{
			if(!this.servicesForm.value.servicesIds){
				this.noServices = true
			}
			if(!this.servicesForm.value.newpurchaseIds){
				this.noProducts = true;
			}
		}
	}
	
	goToStep(index){
		// console.log('index : ', index);
		this.activePhase = +index;
		let stepTo = '#step' + this.activePhase;
		$('.nav-tabs a[href='+ stepTo + ']').tab('show');
	}
	
	checkForPhase1(){/*919057590857*/
		console.log('called');
		if(this.personalDetailForm.valid){
			let _self = this;
			this.disablePhase1 = true;
			this.checkUniqueEmail();
		}else{
			this.personalDetailForm.controls['fullName'].markAsTouched();
			this.personalDetailForm.controls['email'].markAsTouched();
			this.personalDetailForm.controls['mobile'].markAsTouched();
			this.personalDetailForm.controls['password'].markAsTouched();
			this.personalDetailForm.controls['confPassVen'].markAsTouched();
			this.personalDetailForm.controls['address'].markAsTouched();
			return false;
		}
	}
	
	checkUniqueEmail(){
		let _self = this;
		this.peopleApi.uniqueEmail(this.personalDetailForm.value.email).subscribe(
			(success)=>{
				console.log("uniqueEmail : ", success);
				if(success.success.success.isEmailAvailable){
					_self.existEmail = true;
					_self.globalFunctionService.infoToast('Email Already Exist');
				}else{
					_self.existEmail = false;
				}
				_self.disablePhase1 = false;
				_self.checkUniqueMobile();
			},
			(error)=>{
				_self.existEmail = false;
				_self.disablePhase1 = false;
				console.log("error : ", error);
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else{
					_self.globalFunctionService.errorToast(error,'oops');
				}
			}
		);
	}
	
	checkUniqueMobile(){
		let _self = this;
		_self.peopleApi.uniqueMobile(this.personalDetailForm.value.mobile).subscribe(
			(success)=>{
				console.log("uniqueMobile : ", success);
				if(success.success.success.isMobileAvailable){
					_self.existMobile = true;
					_self.globalFunctionService.infoToast('Mobile Already Exist');
				}else{
					_self.existMobile = false;
				}
				_self.disablePhase1 = false;
				_self.checkForMore();
			},
			(error)=>{
				_self.existMobile = false;
				_self.disablePhase1 = false;
				console.log("error : ", error);
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else{
					_self.globalFunctionService.errorToast(error,'oops');
				}
			}
		);
	}
	
	checkForMore(){
		if(this.personalDetailForm.get('address').value && this.personalDetailForm.get('address').value.length > 0 && (this.personalDetailForm.get('address').value === this.formatted_address)){
			this.invalidLocation = false;
		}else{
			this.invalidLocation = true;
		}
		if((this.personalDetailForm.value.password === this.personalDetailForm.value.confPassVen) && this.personalDetailForm.valid && !this.invalidLocation && !this.existEmail && !this.existMobile){
			this.activePhase = 2;
			let stepTo;
			if(this.activePhase == 4){
				stepTo = '#complete';
			}else{
				stepTo = '#step' + this.activePhase;
			}
			$('.nav-tabs a[href='+ stepTo + ']').tab('show');
		}else{
			
		}
	}
	
	checkForPhase2(){
		if(this.teamDetailForm.valid){
			if(this.teamDetailForm.value.supportDays && this.teamDetailForm.value.supportDays.length > 0){
				return true;
			}
			return false;
		}else{
			this.teamDetailForm.controls['noOfEngineers'].markAsTouched();
			this.teamDetailForm.controls['yearOfExp'].markAsTouched();
			this.teamDetailForm.controls['startTime'].markAsTouched();
			this.teamDetailForm.controls['endTime'].markAsTouched();
			if(!this.startTime1){
				this.focusBeforeStart = true;
			}
			if(!this.endTime1){
				this.focusBeforeEnd = true;
			}
			if(!this.teamDetailForm.value.supportDays){
				this.noSupportDays = true;
			}
			return false;
		}
	}
	
	checkForPhase3(){
		if(this.bankDetailForm.valid && this.files.aadharImg && this.files.panImg && this.files.gstImg && this.files.chequeImg){
			return true;
		}else{
			this.bankDetailForm.controls['gstNumber'].markAsTouched();
			this.bankDetailForm.controls['bankName'].markAsTouched();
			this.bankDetailForm.controls['firmName'].markAsTouched();
			this.bankDetailForm.controls['ifscCode'].markAsTouched();
			this.bankDetailForm.controls['accountNumber'].markAsTouched();
			if(!this.files.aadharImg)
				this.noAadharImg = true;
			if(!this.files.panImg)
				this.noPanImg = true;
			if(!this.files.gstImg)
				this.noGstImg = true;
			if(!this.files.chequeImg)
				this.noChequeImg = true;
			return false;
		}
	}
	
	checkPhase(index){
		console.log('index : ', index);
		if(index == 1){
			this.checkForPhase1();
		}
		if(index == 2){
			if(this.checkForPhase2()){
				this.changePhase(index);
			}
		}
		if(index == 3){
			if(this.checkForPhase3()){
				this.changePhase(index);
			}
		}
	}
	
	changePhase(index){
		this.activePhase = +index + 1;
		let stepTo;
		if(this.activePhase == 4){
			stepTo = '#complete';
		}else{
			stepTo = '#step' + this.activePhase;
		}
		$('.nav-tabs a[href='+ stepTo + ']').tab('show');
	}
}
