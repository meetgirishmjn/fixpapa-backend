import { Component, OnInit, AfterViewInit, ViewChild, NgZone, ElementRef,EventEmitter,Output } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { PeopleApi,CategoryApi,LoopBackAuth, LoopBackConfig,NewpurchaseApi, RequestjobApi, TransactionApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { MultipartService } from './../../services/multipart/multipart.service';
import { Router } from '@angular/router';
import { validateEmail } from './../../validators/email.validator';

import { validateNoOfEngineers } from './../../validators/numberOfEng.validator';
import { validateWorkEx } from './../../validators/yearOfExp.validator';
import { validateAccountNo } from './../../validators/accountNo.validator';
import { validateMobile } from './../../validators/mobile.validator';
import { bankNameList } from './../../bank-name-list';

import { AddEngineerComponent } from './../add-engineer/add-engineer.component';
import { MapsAPILoader } from '@agm/core';

import { OtpModalComponent } from './../otp-modal/otp-modal.component';
import { SidebarComponent } from './../sidebar/sidebar.component';
import { CancelJobComponent } from './../cancel-job/cancel-job.component';
import { ChangePasswordComponent } from './../change-password/change-password.component';

import { RequestPartsComponent } from './../request-parts/request-parts.component';
import { UpdateStatusComponent } from './../update-status/update-status.component';
import { LiveLocationComponent } from './../live-location/live-location.component';
import { GiveFeedbackComponent } from './../give-feedback/give-feedback.component';
import { JobStatusComponent } from './../job-status/job-status.component';
import { BillComponent } from '../bill/bill.component';
import { Http } from '@angular/http';
import { SeoService } from './../../services/seo/seo.service';

declare var $:any;
declare var seoData:any;

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {

	@ViewChild(GiveFeedbackComponent)
	private feedback : GiveFeedbackComponent;

	@ViewChild(SidebarComponent)
	private freeEngineersList: SidebarComponent;

	@ViewChild(CancelJobComponent)
	private cancelJobModal : CancelJobComponent;

	@ViewChild(ChangePasswordComponent)
	private changePasswordModal : ChangePasswordComponent;

	@ViewChild(RequestPartsComponent)
	private requestParts : RequestPartsComponent;

	@ViewChild(UpdateStatusComponent)
	private updateStatus : UpdateStatusComponent;

	@ViewChild(LiveLocationComponent)
	private liveLocation : LiveLocationComponent;

	@ViewChild(JobStatusComponent)
	private jobStatus : JobStatusComponent;

	@ViewChild(BillComponent)
	private billAnother : BillComponent;
	
	myInfo           : any = {};
	engineersArr     : any[];
	loadingJobs      : boolean = false;
	currentTab       : string;
	orderType        : string;
	loadingMyInfo    : boolean = false;
	loadingEng       : boolean = false;

	myInfoForm    	 : FormGroup;
	gstNumber 	  	 : FormControl;
	fullName  	  	 : FormControl;

	noOfEngineers 	 : FormControl;
	yearOfExp	  	   : FormControl;
	endTime		    	 : FormControl;
	bankName 	  	   : FormControl;
	firmName	    	 : FormControl;
	ifscCode	  	   : FormControl;
	accountNumber 	 : FormControl;
	startTime		     : FormControl;
	newpurchaseIds   : FormControl;
	servicesIds      : FormControl;
	supportDays      : FormControl;

	noProducts		   : boolean = false;
	noServices		    : boolean = false;
	noSupportDays	    : boolean = false;
	invalidTime		    : boolean = false;

	baseUrl 		      : string;
	files 			      : any = {};
	customerProfilePic 	  : any;

	accountSettingForm 	  : FormGroup;
	email 			  	  : FormControl;
	mobile 				  : FormControl;
	oldMobile 			  : any;
	oldEmail 			  : any;

	addressForm 		  : FormGroup;
	address 			  : FormControl;
	street 				  : FormControl;

	formatted_address 	: any;
	lat 				: any;
	lng 				: any;
	disableAdd 			: boolean = false;
	peopleId 			: string;
	invalidLocation 	: boolean = false;
	addresses 			: any = [];
	oldAddress 			: any = [];
	bankNames			: any = [];
	productsOffered		: any = [];
	servicesOffered		: any = [];
	block1				: any[] = [{name : 'Monday', value : '1'}, {name : 'Tuesday', value : '2' }, {name : 'Wednessday',value: '3'}];
	block2 				: any[] = [{name : 'Thursday', value : '4'}, {name : 'Friday', value : '5'}, {name : 'Saturday', value : '6'}];
	block3 				: any[] = [{name : 'Sunday', value : '0'}];
	changePasswordForm 	: FormGroup;
	oldPassword 		: FormControl;
	newPassword 		: FormControl;
	confNewPassword 	: FormControl;

	indexToDelete 		: number = -1;

	isEditMode 			: boolean = false;
	jobType 			: string;
	showList			: boolean = false;
	showDays			: boolean = false;
	showProducts		: boolean = false;
	showServices		: boolean = false;

	myJobs				: any = [];
	loadingVendorJobs	: boolean = false;
	vendorJobs 			: any = [];
	freeEngList 		: any = [];
	toShowEngList		: boolean = false;
	searchForJob		: any;

	jobTypeEng			: any;
	jobTypeNewEng		: any;
	loadingEngJobs		: boolean = false;
	engJobs				: any = [];
	loadingPayments 	: boolean = false;
	payments			: any = [];
	
	engineersFreeArr	: any = [];
	
	disabled			: boolean = false;
	
	sd : any[];
	so : any[];
	po : any[];
	
	checkFormValid      : boolean = true;
	invalidMobile		: boolean = false;
	
	cashPay : any = 0;
	chequePay : any = 0;
	onlinePay : any	= 0;

	@Output() updateProfile = new EventEmitter();

	@ViewChild(AddEngineerComponent)
	private addEngineerModal: AddEngineerComponent;

	@ViewChild(OtpModalComponent)
	private otpModal: OtpModalComponent;

	@ViewChild('services') set content1(content1: ElementRef){
		if(this.myInfoForm && this.myInfoForm.value && this.myInfo.realm === 'vendor'){
			let services = this.myInfoForm.value.servicesIds.split(',');
			// console.log("service : ", $('.service-container'));
			if($('.service-container').length > 0){
				for(var i=0;i<=$('.service-container').length-1;i++){
					for(var j=0;j<=services.length-1;j++){
						if(services[j] == $('.service-container')[i].value){
							$('.service-container')[i].checked = true;
						}
					}
				}
			}
		}
	}

	@ViewChild('products') set content2(content2: ElementRef){
		if(this.myInfoForm && this.myInfoForm.value && this.myInfo.realm === 'vendor'){
			let products = this.myInfoForm.value.newpurchaseIds.split(',');
			// console.log("products : ", $('.purchase-container'));
			if($('.purchase-container').length > 0){
				for(var i=0;i<=$('.purchase-container').length-1;i++){
					for(var j=0;j<=products.length-1;j++){
						if(products[j] == $('.purchase-container')[i].value){
							$('.purchase-container')[i].checked = true;
						}
					}
				}
			}
		}
	}

	@ViewChild('days') set content3(content3: ElementRef){
		if(this.myInfoForm && this.myInfoForm.value && this.myInfo.realm === 'vendor'){
			let supportDays = this.myInfoForm.value.supportDays.split(',');
			// console.log("days : ", $('.days-container'));
			if($('.days-container').length > 0){
				for(var i=0;i<=$('.days-container').length-1;i++){
					for(var j=0;j<=supportDays.length-1;j++){
						if(supportDays[j] == $('.days-container')[i].value){
							$('.days-container')[i].checked = true;
						}
					}
				}
			}
		}
	}

	constructor(private seoService:SeoService, private auth : LoopBackAuth, private http : Http, private transactionApi : TransactionApi, private requestjobApi : RequestjobApi, private categoryApi : CategoryApi,private newpurchaseApi : NewpurchaseApi,private mapsAPILoader: MapsAPILoader,private ngZone: NgZone,private router : Router, private peopleApi : PeopleApi,private globalFunctionService : GlobalFunctionService,private multipartService: MultipartService) {
		this.currentTab = 'myOrders';
		this.jobTypeEng = 'ongoing';
		this.orderType = 'pending';
		this.jobType = 'open';
		this.jobTypeNewEng = 'today';
		this.baseUrl = LoopBackConfig.getPath();
		this.bankNames = bankNameList;
		this.seoService.generateTags(seoData.dashboardPage);	

	}

	ngOnInit(){
		this.getMyInfo();
	}

	initialiseMap(){
		this.mapsAPILoader.load().then(()=>{
			let options = {
				componentRestrictions: {country: 'Ind'}
			};
			let addCustAutocomplete = new google.maps.places.Autocomplete(<HTMLInputElement>document.getElementById("address-cust"),options);
			addCustAutocomplete.addListener('place_changed', () => {
				this.formatted_address = '';
				this.lat = '';
				this.lng = '';
				let place: google.maps.places.PlaceResult = addCustAutocomplete.getPlace();
				if (place.geometry === undefined || place.geometry === null){
					return;
				}else{
					this.customerAddress(place);
				}
			});
		});
	}

	customerAddress(place){
		this.lat = place.geometry.location.lat();
		this.lng = place.geometry.location.lng();
		this.formatted_address = place.formatted_address;
		this.addressForm.controls['address'].setValue(this.formatted_address);
		console.log(this.addressForm.get('address').value);
		this.addresses = [];
		this.addresses.push({'value' : this.addressForm.get('address').value, 'location' : { 'lat' : this.lat, 'lng' : this.lng }, 'street' : ''});
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
						//console.log("results : ", results);
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
				});
		} else {
			_self.globalFunctionService.errorToast("Browser doesn't support Geolocation",'oops');
			// Browser doesn't support Geolocation
			//this.handleLocationError(false, infoWindow, this.map.getCenter(),this.map);
		}
	}

	setCurrentAddress(value,lat,lng){
		if(value){
			this.addressForm.controls['address'].setValue(value);
			//console.log("address value : ", this.addressForm.value.address);
			this.addresses = [];
			this.addresses.push({'value' : value, 'location' : { 'lat' : lat, 'lng' : lng },'street' : ''});
			this.invalidLocation = false;
		}
	}

	clearAddress(){
		this.addressForm.get('address').setValue('');
		this.addresses = [];
		this.lat = '';
		this.lng = '';
		this.formatted_address = '';
		this.invalidLocation = false;
	}

	createMyInfo(data){
		this.fullName = new FormControl(data.fullName,[
			Validators.required
		]);
		this.gstNumber = new FormControl(data.gstNumber,[
		]);
		this.email = new FormControl(data.email,[
			Validators.required,
			validateEmail
		]);
		this.mobile = new FormControl(data.mobile,[
			Validators.required,
			validateMobile
		]);
		this.address = new FormControl('',[
			Validators.required
		]);
		this.street = new FormControl('',[
		]);
		this.oldPassword = new FormControl('',[
			Validators.required
		]);
		this.newPassword = new FormControl('',[
			Validators.required,
			Validators.minLength(6)
		]);
		this.confNewPassword = new FormControl('',[
			Validators.required
		]);

		//vendor
		this.noOfEngineers = new FormControl('',[
			Validators.required,
			validateNoOfEngineers
		]);
		this.yearOfExp	= new FormControl('',[
			Validators.required,
			validateWorkEx
		]);
		this.startTime = new FormControl('',[
			Validators.required
		]);
		this.endTime = new FormControl('',[
			Validators.required
		]);
		this.bankName = new FormControl('',[
			Validators.required
		]);
		this.firmName = new FormControl('',[
			Validators.required
		]);
		this.ifscCode = new FormControl('',[
			Validators.required
		]);
		this.accountNumber  = new FormControl('',[
			Validators.required,
			validateAccountNo
		]);
		this.startTime = new FormControl('',[
			Validators.required
		]);
		this.endTime = new FormControl('',[
			Validators.required
		]);
		this.newpurchaseIds = new FormControl('',[
			Validators.required
		]);
		this.servicesIds  = new FormControl('',[
			Validators.required
		]);
		this.supportDays = new FormControl('',[
			Validators.required
		]);
		//vendor

		if(data.realm === 'customer' && (data.customerType === 'corporate' || data.customerType === 'Corporate' )){
			this.myInfoForm = new FormGroup({
				fullName : this.fullName,
				gstNumber : this.gstNumber
			});
		}
		if(data.realm === 'customer' && (data.customerType === 'Home' || data.customerType === 'home' )){
			this.myInfoForm = new FormGroup({
				fullName : this.fullName
			});
		}
		if(data.realm === 'vendor'){
			this.myInfoForm = new FormGroup({
				fullName 		: this.fullName,
				gstNumber 		: this.gstNumber,
				accountNumber 	: this.accountNumber,
				bankName		: this.bankName,
				firmName		: this.firmName,
				yearOfExp		: this.yearOfExp,
				noOfEngineers	: this.noOfEngineers,
				ifscCode		: this.ifscCode,
				startTime		: this.startTime,
				endTime			: this.endTime,
				newpurchaseIds  : this.newpurchaseIds,
				servicesIds     : this.servicesIds,
				supportDays     : this.supportDays
			});
			
			this.setVendor(data);
		}

		this.accountSettingForm = new FormGroup({
			email 		: this.email,
			mobile 		: this.mobile
		});
		this.addressForm = new FormGroup({
			address 	: this.address,
			street 		: this.street
		});
	}

	createChangePasswordForm(){
		if(!this.changePasswordForm){
			this.changePasswordForm = new FormGroup({
				oldPassword : this.oldPassword,
				newPassword : this.newPassword,
				confNewPassword : this.confNewPassword
			});
		}else{
			this.changePasswordForm.reset();
		}
	}

	openAddEngModal(){
		this.addEngineerModal.openModal({isEdit : false,engineer : ''});
	}

	openEditEngModal(engineer){
		console.log("engineer : ", engineer);
		this.addEngineerModal.openModal({isEdit : true,engineer : engineer});
	}
	
	getAddresses(){
		let _self = this;
		this.peopleApi.getAddresses({}).subscribe(
			(success)=>{
				console.log("addresses : ", success.success.data);
				_self.oldAddress = success.success.data.addresses;
				_self.currentTab='manageAddress';
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ", error);
			}
		);
	}
	
	addressFormReset(){
		this.addressForm.reset();
		this.formatted_address = '';
		this.lat = '';
		this.lng = '';
		this.invalidLocation = false;
	}

	addAddress(){
		let _self = this;
		//console.log("address add called");
		
		let newAddress = [];
		if(this.addressForm.valid){
			this.disabled = true;
			if(this.addressForm.get('address').value && this.addressForm.get('address').value.length > 0 && (this.addressForm.get('address').value === this.formatted_address)){
				this.invalidLocation = false;
			}else{
				this.invalidLocation = true;
			}
			if(!this.invalidLocation){	
				this.addresses[0].street = this.addressForm.value.street;
				
				_self.peopleApi.getAddresses({}).subscribe(
					(success)=>{
						console.log("addresses : ", success.success.data);
						let oldAddress = success.success.data.addresses;
						
						if(_self.isEditMode){
							oldAddress[_self.indexToDelete] = _self.addresses[0];
							newAddress = oldAddress;
						}else{
							newAddress = oldAddress.concat(_self.addresses);
						}
						
						_self.peopleApi.manageAddresses(newAddress).subscribe(
							(success)=>{
								_self.globalFunctionService.successToast('Address added successfully','');
								_self.disabled = false;
								_self.closeModal();
								_self.oldAddress = success.success.data.addresses;
								_self.isEditMode = false;
								_self.indexToDelete = -1;
								_self.addressForm.reset();
								_self.formatted_address = '';
							},
							(error)=>{
								console.log("error : ", error);
								_self.isEditMode = false;
								_self.disabled = false;
								_self.indexToDelete = -1;
								_self.addressForm.reset();
								_self.closeModal();
								_self.formatted_address = '';
								if(error === 'Server error'){
									_self.globalFunctionService.navigateToError('server');
								}else if(error.statusCode === 401){
									_self.globalFunctionService.navigateToError('401');
								}else{
									_self.globalFunctionService.errorToast(error.message,'oops');
								}
							}
						);	
					},
					(error)=>{
						console.log("error : ", error);
						_self.disabled = false;
						_self.isEditMode = false;
						_self.indexToDelete = -1;
						_self.addressForm.reset();
						_self.closeModal();
						_self.formatted_address = '';
						if(error === 'Server error'){
							_self.globalFunctionService.navigateToError('server');
						}else if(error.statusCode === 401){
							_self.globalFunctionService.navigateToError('401');
						}else{
							_self.globalFunctionService.errorToast(error.message,'oops');
						}
					}
				);
			}
		}else{
			this.addressForm.controls['address'].markAsTouched();
		}
	}

	openModal(){
		$('#myModal').modal({backdrop: 'static', keyboard: false});
		this.initialiseMap();
	}

	openConfirm(index){
		$('#myModal1').modal({backdrop: 'static', keyboard: false});
		this.indexToDelete = index;
	}

	closeModal(){
		$('#myModal').modal('hide');
		this.addressFormReset();
	}
	
	closeModalConf(){
		$('#myModal1').modal('hide');
	}
	
	checkCont(index){
		let elem = $('#demo'+index);
		if(elem[0].style.display == 'none'){
			elem.removeClass('slideInRight');
			elem.addClass('slideInLeft');
			elem[0].style.display = 'block';
			
		}else{
			elem.removeClass('slideInLeft');
			elem.addClass('slideInRight');
			elem[0].style.display = 'none';
		} 
	}
	
	makePayment(job){
		let _self = this;
		let data = {
			MID : "FIXPAP78716680122755",
			ORDER_ID : 'FP-HkViiHHgX',
			CUST_ID : job.customer.id,
			INDUSTRY_TYPE_ID : "Retail",
			CHANNEL_ID : "WEB",
			TXN_AMOUNT : job.bill.total,
			WEBSITE : "WEBSTAGING",
			CALLBACK_URL : 'https://fixpapa.com/api/Transactions/paytmResponseUrl'
		};
		// let data = {
			// ORDER_ID : 'FP-HkViiHHgX'
		// };
		_self.router.navigate(['/pg-redirect',JSON.stringify(data)]);
		// this.transactionApi.generateChecksum(data).subscribe(
			// (success)=>{
				// console.log("check sum : ", success);
				// if(success.CHECKSUMHASH){
					// let CHECKSUMHASH = success.CHECKSUMHASH;
					// let obj1 = { 'CHECKSUMHASH' :  CHECKSUMHASH };
					// let obj = Object.assign({},data, obj1 ); 
					// _self.router.navigate(['/pg-redirect',JSON.stringify(obj)]);
				// }
			// },
			// (error)=>{
				// console.log("error : ", error);
			// }
		// );
	}

	getMyInfo(){
		this.currentTab = 'myInfo';
		this.loadingMyInfo = true;
		let _self = this;
		_self.peopleApi.getMyInfo().subscribe(
			(success)=>{
				console.log("my info : ", success.success.data);
				_self.myInfo = success.success.data;
				if(success.success.data.rateThisJob){
					_self.feedback.openModal({'jobId' : success.success.data.rateThisJob});
				}
				_self.createMyInfo(success.success.data);
				_self.oldMobile = success.success.data.mobile;
				_self.oldEmail = success.success.data.email;
				_self.oldAddress  = success.success.data.addresses;
				if(success.success.data.image){
					if(success.success.data.image.includes('https') || success.success.data.image.includes('http')){
						_self.customerProfilePic = success.success.data.image;
					}else{
						success.success.data.image = _self.baseUrl + success.success.data.image;
						_self.customerProfilePic = success.success.data.image;
					}
				}else{
					_self.customerProfilePic = 'assets/images/register_bg.jpg';
				}
				_self.loadingMyInfo = false;
				if(_self.myInfo.realm === 'vendor'){
					_self.getEngineers();
				}
				if(success.success.data.realm === 'vendor'){
					_self.currentTab = 'latestJobs';
					_self.latestVendorJobs('latest');
				}
				if(success.success.data.realm === 'engineer'){
					_self.currentTab = 'openJobs';
					_self.jobTypeNewEng = 'today';
					_self.engineerNewJobs(_self.jobTypeNewEng);
				}
				if(success.success.data.realm === 'customer'){
					_self.currentTab = 'myOrders';
					_self.orderType = 'onGoing';
					_self.getMyOrders(_self.orderType);
				}
			},
			(error)=>{
				_self.loadingMyInfo = false;
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}

	setVendor(success){
		let _self = this;
		_self.myInfoForm.controls['noOfEngineers'].setValue(success.noOfEngineers);
		_self.myInfoForm.controls['yearOfExp'].setValue(success.yearOfExp);
		_self.myInfoForm.controls['bankName'].setValue(success.bankName);
		_self.myInfoForm.controls['firmName'].setValue(success.firmName);
		_self.myInfoForm.controls['accountNumber'].setValue(success.accountNumber);
		_self.myInfoForm.controls['ifscCode'].setValue(success.ifscCode);
		_self.myInfoForm.controls['startTime'].setValue(success.startTime.value);
		_self.myInfoForm.controls['endTime'].setValue(success.endTime.value);
		_self.sd = success.supportDays;
		_self.so = success.servicesIds;
		_self.po = success.newpurchaseIds;
		_self.setSupportDay(success.supportDays);
		_self.getServices();
		_self.getProducts();
		// $('#toggle-two').bootstrapToggle({
			// on: 'Enabled',
			// off: 'Disabled'
		// });
	}

	selectBank(bank){
		this.myInfoForm.controls['bankName'].setValue(bank);
		this.showList = false;
	}

	setSupportDay(days){
		let supportDaysArr = this.block1.concat(this.block2,this.block3);
		let str = [];
		for(var i=0;i<=days.length-1;i++){
			for(var j=0;j<=supportDaysArr.length-1;j++){
				if(days[i] == supportDaysArr[j].value){
					str.push(supportDaysArr[j].name);
				}
			}
		}
		this.myInfoForm.controls['supportDays'].setValue(str.join());
	}

	setServices(services){
		let str = [];
		for(var i=0;i<=services.length-1;i++){
			str.push(services[i].name);
		}
		this.myInfoForm.controls['servicesIds'].setValue(str.join());
	}

	setProducts(products){
		let str = [];
		for(var i=0;i<=products.length-1;i++){
			str.push(products[i].name);
		}
		this.myInfoForm.controls['newpurchaseIds'].setValue(str.join());
	}

	getServices(){
		let _self = this;
		this.categoryApi.getAllCategories().subscribe(
			(success)=>{
				//console.log("success : ", success);
				_self.servicesOffered = success.success.data;
				_self.setServices(_self.myInfo.services);
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
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
				//console.log("success : ", success);
				_self.productsOffered = success.success.data;
				_self.setProducts(_self.myInfo.newpurchase);
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

	getMyOrders(type){
		this.loadingJobs = true;
		this.currentTab = 'myOrders';
		this.orderType = type || 'pending';
		if(this.globalFunctionService.getUserCredentials().realm === 'customer'){
			this.getCustomerJobs(this.orderType);
		}
		//console.log("get orders called");
	}

	accountSettings(){
		this.currentTab = 'accountSettings';
		this.accountSettingForm.reset();
		let _self = this;
		this.peopleApi.getMyInfo().subscribe(
			(success)=>{
				_self.createMyInfo(success.success.data);
			},
			(error)=>{
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
	}
	
	getInfo(){
		let _self = this;
		this.peopleApi.getMyInfo().subscribe(
			(success)=>{
				_self.createMyInfo(success.success.data);
			},
			(error)=>{
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
	}
	
	getEngineers(){
		let _self = this;
		if(this.globalFunctionService.getUserCredentials().userId){
			this.loadingEng = true;
			this.peopleApi.getEngineers(this.globalFunctionService.getUserCredentials().userId).subscribe(
				(success)=>{
					for(var i =0;i<=success.success.data.length-1;i++){
						if(success.success.data[i].image){
							success.success.data[i].image = _self.baseUrl + success.success.data[i].image;
						}else{
							success.success.data[i].image = 'assets/images/register_bg.jpg';
						}
					}
					setTimeout(()=>{
						_self.engineersArr = success.success.data;
						_self.loadingEng = false;
					},0);
				},
				(error)=>{
					console.log("error : ", error);
					_self.loadingEng = false;
					if(error === 'Server error'){
						_self.globalFunctionService.navigateToError('server');
					}else if(error.statusCode === 401){
						_self.globalFunctionService.navigateToError('401');
					}else{
						_self.globalFunctionService.errorToast(error.message,'oops');
					}
				}
			);
		}
	}

	getOngoingjobs(jobType){
		this.jobType = jobType;
		this.onGoingVendorJobs(this.jobType);
	}

	getEngineerJobs(jobType){
		this.jobTypeEng = jobType;
		this.engineerAllJobs(this.jobTypeEng);
	}
	
	getEngineerJobsNew(jobType){
		this.jobTypeNewEng = jobType;
		this.engineerNewJobs(this.jobTypeNewEng);
	}

	deleteAddress(){
		let _self = this;
		this.oldAddress.splice(this.indexToDelete,1);
		this.peopleApi.manageAddresses(this.oldAddress).subscribe(
			(success)=>{
				$('#myModal1').modal('hide');
				_self.oldAddress = success.success.data.addresses;
				_self.globalFunctionService.successToast('Address Deleted successfully','');
			},
			(error)=>{
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
	}

	editAddress(address,index){
		this.addressForm.reset();
		this.openModal();
		this.setCurrentAddress(address.value,address.location.lat,address.location.lng);
		this.addresses[0].street = address.street || '';
		this.addressForm.controls['street'].setValue(this.addresses[0].street);
		this.formatted_address = address.value;
		this.isEditMode = true;
		this.indexToDelete = index;
	}

	disableEdit(evt){
		// $('#' + id1)[0].style.display = 'block';
		// $('#' + id2)[0].style.display = 'none';
		//console.log("event : ", evt);|| evt.srcElement.id
		//debugger;
		let elementId = evt.target.id || evt.currentTarget.id ;
		$('#' + elementId)[0].style.display = 'none';
		$('#' + elementId).parent().siblings()[0].style.display = 'block';
		$('#' + $('#' + $('#' + elementId).parent().parent().siblings()[0].id).children()[1].id).removeAttr('readonly');
		$('#' + $('#' + $('#' + elementId).parent().parent().siblings()[0].id).children()[1].id).addClass('border-bottom');
	}

	afterSuccess(elementId){
		$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).attr('readonly','true');
		$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).removeClass('border-bottom');
		this.globalFunctionService.successToast('Profile Updated','');
		$('#' + elementId)[0].style.display = 'none';
		$('#' + $('#' + elementId).siblings()[0].id).children()[0].style.display = 'block';
	}

	afterError(elementId){
		$('#' + elementId)[0].style.display = 'none';
		$('#' + $('#' + elementId).siblings()[0].id).children()[0].style.display = 'block';
		$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).attr('readonly','true');
		$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).removeClass('border-bottom');
	}

	editVendor(elementId){
		let _self = this;
		let obj1 = { 'supportDays' : this.sd};
		let obj2 = { 'newpurchaseIds' : this.po};
		let obj3 = { 'servicesIds' : this.so};
		delete this.myInfoForm.value.supportDays;
		delete this.myInfoForm.value.newpurchaseIds;
		delete this.myInfoForm.value.servicesIds;
		let obj = Object.assign({},this.myInfoForm.value,obj1,obj2,obj3);
		console.log("obj : ", obj);
		//debugger;
		this.peopleApi.editVendor(obj.fullName,+obj.noOfEngineers,obj.servicesIds,obj.newpurchaseIds,+obj.yearOfExp,
			obj.gstNumber,obj.bankName,obj.firmName,obj.ifscCode,obj.accountNumber,obj.startTime,obj.endTime,obj.supportDays).subscribe(
			(success)=>{
				console.log("updated info : ", success);
				_self.afterSuccess(elementId);
				_self.setVendor(success);
				_self.globalFunctionService.onProfileUpdate();
				// window.location.replace(window.location.href);
			},
			(error)=>{
				console.log("error : ", error);
				_self.afterError(elementId);
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
			}
		);
	}

	disableSave(evt,type){
		let elementId = evt.target.id || evt.currentTarget.id;
		let _self = this;
		if(type === 'vendor'){
			if(this.myInfoForm.valid && !this.noSupportDays && !this.noProducts && !this.noServices){
				this.editVendor(elementId);
			}
		}
		else if(type === 'customer'){
			if(this.myInfoForm.valid){
				let gstNumber = this.myInfoForm.value.gstNumber || '';
				this.peopleApi.editCustomer(this.myInfoForm.value.fullName,gstNumber,{}).subscribe(
					(success)=>{
						console.log("success : ", success);
						$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).attr('readonly','true');
						$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).removeClass('border-bottom');
						_self.globalFunctionService.successToast('Profile Updated','');
						$('#' + elementId)[0].style.display = 'none';
						$('#' + $('#' + elementId).siblings()[0].id).children()[0].style.display = 'block';
						_self.myInfoForm.controls['fullName'].setValue(success.success.data.fullName);
						if(_self.myInfo.customerType === 'corporate'){
							_self.myInfoForm.controls['gstNumber'].setValue(success.success.data.gstNumber);
						}
						// window.location.replace(window.location.href);
						_self.globalFunctionService.onProfileUpdate()
					},
					(error)=>{
						console.log("error : ", error);
						$('#' + elementId)[0].style.display = 'none';
						$('#' + $('#' + elementId).siblings()[0].id).children()[0].style.display = 'block';
						$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).attr('readonly','true');
						$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).removeClass('border-bottom');
						if(error === 'Server error'){
							_self.globalFunctionService.navigateToError('server');
						}else if(error.statusCode === 401){
							_self.globalFunctionService.navigateToError('401');
						}else{
							_self.globalFunctionService.errorToast(error.message,'oops');
						}
					}
				);
			}
		}else if(type === 'email'){
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;			
			var newEmail = this.accountSettingForm.value.email;
			if(re.test(newEmail)){
				if(this.oldEmail !== this.accountSettingForm.value.email){
					this.peopleApi.editEmail(this.accountSettingForm.value.email).subscribe(
						(success)=>{
							console.log("success : ", success);
							$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).attr('readonly','true');
							$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).removeClass('border-bottom');
							_self.globalFunctionService.successToast('Please verify your email id in order to start using it','Otp Sent on '+success.success.data.emailId);
							$('#' + elementId)[0].style.display = 'none';
							$('#' + $('#' + elementId).siblings()[0].id).children()[0].style.display = 'block';
							_self.accountSettingForm.controls['email'].setValue(success.success.data.email);
							_self.otpModal.openModal1({ mode : 'email' });
						},
						(error)=>{
							console.log("error : ", error);
							$('#' + elementId)[0].style.display = 'none';
							$('#' + $('#' + elementId).siblings()[0].id).children()[0].style.display = 'block';
							$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).attr('readonly','true');
							$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).removeClass('border-bottom');
							if(error === 'Server error'){
								_self.globalFunctionService.navigateToError('server');
							}else if(error.statusCode === 401){
								_self.globalFunctionService.navigateToError('401');
							}else{
								_self.globalFunctionService.errorToast(error.message,'oops');
							}
						}
					);
				}else if(this.oldEmail === this.accountSettingForm.value.email){
					_self.globalFunctionService.infoToast('Email Already Exist');
					$('#' + elementId)[0].style.display = 'none';
					$('#' + $('#' + elementId).siblings()[0].id).children()[0].style.display = 'block';
					$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).attr('readonly','true');
					$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).removeClass('border-bottom');
				}
			}else{
				this.accountSettingForm.controls['email'].markAsTouched();
			}
		}
		else if(type === 'mobile'){
			let mobile = '';
			var re = /^[1-9]\d{9}$/;
			if(re.test(this.accountSettingForm.value.mobile)){
				if(this.oldMobile !== this.accountSettingForm.value.mobile){
					this.peopleApi.editMobile(this.accountSettingForm.value.mobile).subscribe(
						(success)=>{
							console.log("success : ", success);
							$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).attr('readonly','true');
							$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).removeClass('border-bottom');
							_self.globalFunctionService.successToast('Mobile Updated','Please verify your Mobile in order to start using it');
							$('#' + elementId)[0].style.display = 'none';
							$('#' + $('#' + elementId).siblings()[0].id).children()[0].style.display = 'block';
							_self.accountSettingForm.controls['mobile'].setValue(success.success.data.mobile);
							_self.otpModal.openModal(success.success.data.id);
						},
						(error)=>{
							console.log("error : ", error);
							$('#' + elementId)[0].style.display = 'none';
							$('#' + $('#' + elementId).siblings()[0].id).children()[0].style.display = 'block';
							$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).attr('readonly','true');
							$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).removeClass('border-bottom');
							if(error === 'Server error'){
								_self.globalFunctionService.navigateToError('server');
							}else if(error.statusCode === 401){
								_self.globalFunctionService.navigateToError('401');
							}else{
								_self.globalFunctionService.errorToast(error.message,'oops');
							}
						}
					);
				}
				else if(this.oldMobile === this.accountSettingForm.value.mobile){
					_self.globalFunctionService.infoToast('Mobile Already Exist');
					$('#' + elementId)[0].style.display = 'none';
					$('#' + $('#' + elementId).siblings()[0].id).children()[0].style.display = 'block';
					$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).attr('readonly','true');
					$('#' + $('#' + ($('#' + elementId).parent().siblings()[0].id)).children()[1].id).removeClass('border-bottom');
				}
			}else{
				this.accountSettingForm.controls['mobile'].markAsTouched();
			}
		}
	}

	updateMobile(mobile){
		this.accountSettingForm.controls['mobile'].setValue(mobile);
	}
	
	updateEmail(email){
		this.accountSettingForm.controls['email'].setValue(email);
	}

	changePassword(){
		let _self = this;
		//console.log(this.changePasswordForm.controls);
		if(!this.changePasswordForm.valid){
			this.changePasswordForm.controls['oldPassword'].markAsTouched();	
			this.changePasswordForm.controls['newPassword'].markAsTouched();
			this.changePasswordForm.controls['confNewPassword'].markAsTouched();	
		}else{
			if((this.changePasswordForm.value.newPassword === this.changePasswordForm.value.confNewPassword) && this.changePasswordForm.valid){
				delete this.changePasswordForm.value.confNewPassword;
				this.peopleApi.changePassword(this.changePasswordForm.value.oldPassword,this.changePasswordForm.value.newPassword).subscribe(
					(success)=>{
						console.log("success : ", success);
						_self.globalFunctionService.successToast('Password Changed','');
						_self.changePasswordForm.reset();
						_self.logOut();
					},
					(error)=>{
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
			}
		}
	}
	
	logOut(){
		let _self = this;
		if(this.globalFunctionService.getUserCredentials().realm === 'customer'){
			this.peopleApi.logout().subscribe(
				(success)=>{
					console.log("success : ", success);
					_self.auth.clear();
					_self.globalFunctionService.logoutToast('Logging you out...');
					_self.navigateToSame();
				},
				(error)=>{
					if(error === 'Server error'){
						_self.globalFunctionService.navigateToError('server');
					}else if(error.statusCode === 401){
						_self.globalFunctionService.navigateToError('401');
					}else{
						console.log('error : ', error);
						_self.globalFunctionService.errorToast(error.message,'oops');
					}
					console.log("error : ", error);
				}
			);
		}else{
			this.peopleApi.logout().subscribe(
				(success)=>{
					console.log("success : ", success);
					_self.auth.clear();
					_self.globalFunctionService.logoutToast('Logging you out...');
					_self.router.navigate(['/']);
				},
				(error)=>{
					if(error === 'Server error'){
						_self.globalFunctionService.navigateToError('server');
					}else if(error.statusCode === 401){
						_self.globalFunctionService.navigateToError('401');
					}else{
						console.log('error : ', error);
						_self.globalFunctionService.errorToast(error.message,'oops');
					}
					console.log("error : ", error);
				}
			);
		}
	}
	
	navigateToSame(){
		let currentUrl = this.router.url;
		if(currentUrl === '/'){
			// window.location.replace(window.location.href);
		}else{
			this.router.navigate(['/']);
		}
	}

	uploadProfilePic(){
		let data = { data : {}, files : this.files };
		let _self = this;
		this.multipartService.uploadProfilePic(data).subscribe(
			(success)=>{
				console.log("profile pic updated : ", success);
				_self.customerProfilePic = _self.baseUrl + success.success.data.image;
				_self.updateProfile.emit(null);
				_self.globalFunctionService.successToast('Profile Pic Updated','');
				// window.location.replace(window.location.href);
				_self.globalFunctionService.onProfileUpdate()
			},
			(error)=>{
				console.log("error : ", error);
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.successToast(error.message,'oops');
				}
			}
		);
	}

	initializeClockPicker(){
		$('#startTime').clockpicker({
			placement : 'bottom',
			align : 'left',
			donetext : 'Done',
			disableEntry : true,
			default : this.myInfo.startTime.value
		});

		let _self = this;
		$("#startTime").on('change', function() {
			if(_self.myInfoForm.controls['endTime'].value && (_self.myInfoForm.controls['endTime'].value < this.value)){
				//_self.myInfoForm.get('startTime').setValue('');
				_self.invalidTime = true;
			}else{
				_self.myInfoForm.get('startTime').setValue(this.value);
				_self.invalidTime = false;
			}
			console.log("form control : ", _self.myInfoForm.controls['startTime'].value);
		});
	}

	initializeClockPicker1(){
		let _self = this;
		$('#endTime').clockpicker({
			placement : 'bottom',
			align : 'left',
			donetext : 'Done',
			disableEntry : true,
			default : this.myInfo.endTime.value
		});

		$("#endTime").on('change', function() {
			if(_self.myInfoForm.controls['startTime'].value && (this.value < _self.myInfoForm.controls['startTime'].value)){
				//_self.myInfoForm.get('endTime').setValue('');
				_self.invalidTime = true;
			}else{
				_self.myInfoForm.get('endTime').setValue(this.value);
				_self.invalidTime = false;
			}
			console.log("form control : ", _self.myInfoForm.controls['endTime'].value);
		});
	}

	clearBankName(){
		this.myInfoForm.get('bankName').setValue('');
	}

	onChange(day,value,evt){
		let newValue;
		if(evt.target.checked){
			if(this.myInfoForm.controls['supportDays'].value){
				newValue = this.myInfoForm.value.supportDays +  ',' + day;
				this.sd.push(+value);
			}else{
				newValue = day;
				this.sd.push(+value);
			}
			if(this.noSupportDays){
				this.noSupportDays = false;
			}
			console.log(this.sd);
			this.myInfoForm.controls['supportDays'].setValue(newValue);
		}
		else{
			//debugger;
			let newArr = this.myInfoForm.value.supportDays.split(',');
			const index = newArr.indexOf(''+day);
			console.log("index : ", index);
			if(index !== -1){
				newArr.splice(index,1);
				this.sd.splice(index,1);
			}
			if(newArr.length == 0){
				this.noSupportDays = true;
			}
			console.log(this.sd);
			newValue = newArr.join(',');
			this.myInfoForm.controls['supportDays'].setValue(newValue);
		}
		
		console.log("supportDays : ", this.myInfoForm.controls['supportDays'].value);
		
	}

	changeServices(name,id,evt){
		let newValue;
		if(evt.target.checked){
			if(this.myInfoForm.controls['servicesIds'].value){
				newValue = this.myInfoForm.value.servicesIds +  ',' + name;
				this.so.push(id);
			}else{
				newValue = name;
				this.so.push(id);
			}
			if(this.noServices){
				this.noServices = false;
			}
			this.myInfoForm.controls['servicesIds'].setValue(newValue);
		}
		else{
			//debugger;
			let newArr = this.myInfoForm.value.servicesIds.split(',');
			const index = newArr.indexOf(name);
			console.log("index : ", index);
			if(index !== -1){
				newArr.splice(index,1);
				this.so.splice(index,1);
			}
			if(newArr.length == 0){
				this.noServices = true;
			}
			newValue = newArr.join(',');
			this.myInfoForm.controls['servicesIds'].setValue(newValue);
		}
		console.log("servicesIds : ", this.myInfoForm.controls['servicesIds'].value);
	}

	changeProducts(name,id,evt){
		let newValue;
		if(evt.target.checked){
			if(this.myInfoForm.controls['newpurchaseIds'].value){
				newValue = this.myInfoForm.controls['newpurchaseIds'].value +  ',' + name;
				this.po.push(id);
			}else{
				newValue = name;
				this.po.push(id);
			}
			if(this.noProducts){
				this.noProducts = false;
			}
			this.myInfoForm.controls['newpurchaseIds'].setValue(newValue);
		}
		else{
			//debugger;
			let newArr = this.myInfoForm.value.newpurchaseIds.split(',');
			const index = newArr.indexOf(name);
			console.log("index : ", index);
			if(index !== -1){
				newArr.splice(index,1);
				this.po.splice(index,1);
			}
			if(newArr.length == 0){
				this.noProducts = true;
			}
			newValue = newArr.join(',');
			this.myInfoForm.controls['newpurchaseIds'].setValue(newValue);
		}
		console.log("newpurchaseIds : ", this.myInfoForm.controls['newpurchaseIds'].value);
	}
	
	checkCancelledJobs(){
		if(this.myInfo.realm === 'customer'){
			this.orderType = 'closed';
			this.getCustomerJobs(this.orderType);
		}
		if(this.myInfo.realm === 'vendor'){
			this.jobType = 'close';
			this.getOngoingjobs(this.jobType);
		}
	}

	getCustomerJobs(type){
		let _self = this;
		this.myJobs = [];
		this.requestjobApi.custAllJobs({}).subscribe(
			(success)=>{
				//console.log("customer Jobs : ", success);
				for(var i=0;i<=success.success.data.length-1;i++){
					success.success.data[i].category.image = _self.baseUrl + success.success.data[i].category.image;
					if(type === 'pending' && (success.success.data[i].status === 'requested' || success.success.data[i].status === 'pending')){
						_self.myJobs.push(success.success.data[i]);
					}
					if(type === 'onGoing' && (success.success.data[i].status === 'outForDelivery' || success.success.data[i].status === 'on the way' || success.success.data[i].status === 'scheduled' || success.success.data[i].status === 'vendorAccepted' || success.success.data[i].status === 'inprocess' || success.success.data[i].status === 'billGenerated' || success.success.data[i].status === 'paymentDone')){
						_self.myJobs.push(success.success.data[i]);
					}
					if(type === 'closed' && (success.success.data[i].status === 'canceled' || success.success.data[i].status === 'completed' || success.success.data[i].status === 'indispute')){
						_self.myJobs.push(success.success.data[i]);
					}
				}
				console.log(type+" : ", _self.myJobs);
				setTimeout(()=>{
					_self.loadingJobs = false;
				},1);
			},
			(error)=>{
				_self.loadingJobs = false;
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}

	latestVendorJobs(type){
		let _self = this;
		this.vendorJobs = [];
		this.loadingVendorJobs = true;
		this.requestjobApi.latestVendorJobs(this.myInfo.id).subscribe(
			(success)=>{
				console.log("vendor Jobs : ", success.success.data);
				for(var i=0;i<=success.success.data.length-1;i++){
					if(type === 'latest' && success.success.data[i].isVendorAssigned == true && success.success.data[i].isEngineerAssigned === false && success.success.data[i].status === 'pending'){
						success.success.data[i].category.image = _self.baseUrl + success.success.data[i].category.image;
						_self.vendorJobs.push(success.success.data[i]);
					}
				}
				setTimeout(()=>{
					_self.loadingVendorJobs = false;
				},0);
			},
			(error)=>{
				_self.loadingVendorJobs = false;
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}

	//'status', { in: ['requested','pending','vendorAccepted','on the way','scheduled','inprocess','billGenerated','paymentDone','canceled','completed']
	//GET /Requestjobs/engineerNewJobs GET /Requestjobs/engineerAllJobs

	acceptJob(jobId){
		let _self = this;
		this.requestjobApi.engineerAccept(jobId).subscribe(
			(success)=>{
				console.log("engineer on the way for the job : ",success);
				_self.globalFunctionService.successToast('Jos is accepted !!!','');
				//_self.getEngJobs(success.success.data);
				_self.currentTab === 'inProgJobs';
				_self.getEngineerJobs('ongoing');
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}

	checkForJobId(jobId,schedule){
		for(var i=0;i<=this.engJobs.length-1;i++){
			if(this.engJobs[i] === jobId){
				this.engJobs[i].schedule = schedule;
				this.engJobs[i].showSlots = false;
				break;
			}
		}
	}

	scheduleJob(job,slot,index){
		let _self = this;
		let eStartDate = this.globalFunctionService.getStartDate(job.startDate,slot);
		let eEndDate = this.globalFunctionService.getEndDate(job.endDate,slot);
		console.log("eStartDate : ", eStartDate);
		console.log("eEndDate : ", eEndDate);
		this.requestjobApi.engineerSchedule(job.id,eStartDate,eEndDate).subscribe(
			(success)=>{
				console.log("job scheduled : ", success);
				_self.checkForJobId(success.success.data.id,job.schedule);
				_self.globalFunctionService.successToast('Job is Scheduled !!!','');
				_self.engJobs[index].schedule = success.success.data.schedule;
				_self.engJobs[index].showSlots = false;
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}

	checkForSlots(startDate,endDate){
		this.globalFunctionService.checkForSlots(startDate,endDate);
	}

	engineerAllJobs(type){
		let _self = this;
		this.engJobs = [];
		this.loadingEngJobs = true;
		this.requestjobApi.engineerAllJobs({}).subscribe(
			(success)=>{
				console.log("on going engineer Jobs : ", success.success.data);
				for(var i=0;i<=success.success.data.length-1;i++){ //&& success.success.data[i].siteType === 'Offsite'
					if(type === 'ongoing' && (success.success.data[i].status === 'outForDelivery' || success.success.data[i].status === 'on the way' || success.success.data[i].status === 'inprocess' || success.success.data[i].status === 'billGenerated' || success.success.data[i].status === 'paymentDone' )){
						success.success.data[i].category.image = _self.baseUrl + success.success.data[i].category.image;
						_self.engJobs.push(success.success.data[i]);
					}
					if(type === 'completed' && (success.success.data[i].status === 'indispute' || success.success.data[i].status === 'completed' || success.success.data[i].status === 'canceled' )){
						success.success.data[i].category.image = _self.baseUrl + success.success.data[i].category.image;
						_self.engJobs.push(success.success.data[i]);
					}
				}

				setTimeout(()=>{
					_self.loadingEngJobs = false;
				},0);
			},
			(error)=>{
				_self.loadingEngJobs = false;
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}

	engineerNewJobs(type){
		let _self = this;
		this.engJobs = [];
		this.loadingEngJobs = true;
		this.requestjobApi.engineerNewJobs({}).subscribe(
			(success)=>{
				//console.log("engineer new Jobs : ", success.success.data);
				let today = new Date();
				let start = new Date();
				start.setHours(0,0,0,0);
				for(var i=0;i<=success.success.data.length-1;i++){
					let jobDate = new Date(success.success.data[i].startDate);
					let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

					let monday = _self.globalFunctionService.getMonday(start);
					//monday = monday.toLocaleDateString();
					let sunday = _self.globalFunctionService.getSunday(monday);
					//sunday = sunday.toLocaleDateString();

					if(type === 'today' &&  today.getFullYear() == jobDate.getFullYear() && today.getMonth() == jobDate.getMonth() && today.getDate() == jobDate.getDate() ){
						success.success.data[i].category.image = _self.baseUrl + success.success.data[i].category.image;
						success.success.data[i].availableSlots = _self.globalFunctionService.checkForSlots(success.success.data[i].startDate,success.success.data[i].endDate);
						console.log("today : ", success.success.data[i]);
						success.success.data[i].showSlots = false;
						_self.engJobs.push(success.success.data[i]);
					}
					if(type === 'tomorrow' &&  tomorrow.getFullYear() == jobDate.getFullYear() && tomorrow.getMonth() == jobDate.getMonth() && tomorrow.getDate() == jobDate.getDate()){
						success.success.data[i].category.image = _self.baseUrl + success.success.data[i].category.image;
						success.success.data[i].availableSlots = _self.globalFunctionService.checkForSlots(success.success.data[i].startDate,success.success.data[i].endDate);
						console.log("tomorrow : ", success.success.data[i]);
						success.success.data[i].showSlots = false;
						_self.engJobs.push(success.success.data[i]);
					}
					if(type === 'week' && (success.success.data[i].status === 'vendorAccepted' || success.success.data[i].status === 'scheduled')){ //&& _self.globalFunctionService.checkRange(monday,sunday,jobDate)
						success.success.data[i].category.image = _self.baseUrl + success.success.data[i].category.image;
						success.success.data[i].availableSlots = _self.globalFunctionService.checkForSlots(success.success.data[i].startDate,success.success.data[i].endDate);
						console.log("week : ", success.success.data[i]);
						success.success.data[i].showSlots = false;
						_self.engJobs.push(success.success.data[i])
					}
				}
				console.log("engineer new Jobs : ", success.success.data);
				setTimeout(()=>{
					_self.loadingEngJobs = false;
				},0);
			},
			(error)=>{
				_self.loadingEngJobs = false;
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}

	onGoingVendorJobs(type){
		let _self = this;
		this.vendorJobs = [];
		this.loadingVendorJobs = true;
		this.requestjobApi.onGoingVendorJobs(this.myInfo.id).subscribe(
			(success)=>{
				console.log("on going vendor Jobs : ", success.success.data);
				for(var i=0;i<=success.success.data.length-1;i++){
					if(type === 'open' && success.success.data[i].isVendorAssigned == true && success.success.data[i].status === 'vendorAccepted'){
						success.success.data[i].category.image = _self.baseUrl + success.success.data[i].category.image;
						_self.vendorJobs.push(success.success.data[i]);
						//console.log("open jobs : ", success.success.data[i]);
					}
					if(type === 'ongoing' && (success.success.data[i].status === 'outForDelivery' || success.success.data[i].status === 'scheduled' || success.success.data[i].status === 'on the way' || success.success.data[i].status === 'inprocess' || success.success.data[i].status === 'billGenerated' || success.success.data[i].status === 'paymentDone')){
						success.success.data[i].category.image = _self.baseUrl + success.success.data[i].category.image;
						_self.vendorJobs.push(success.success.data[i]);
						console.log("on going jobs : ", success.success.data[i]);
					}
					if(type === 'close' && (success.success.data[i].status === 'canceled' || success.success.data[i].status === 'completed' || success.success.data[i].status === 'indispute')){
						success.success.data[i].category.image = _self.baseUrl + success.success.data[i].category.image;
						_self.vendorJobs.push(success.success.data[i]);
						console.log("close jobs : ", success.success.data[i]);
					}
					if(success.success.data[i].status === 'indispute'){
						console.log('indispute : ', success.success.data[i]);
					}
				}

				setTimeout(()=>{
					_self.loadingVendorJobs = false;
				},0);
			},
			(error)=>{
				_self.loadingVendorJobs = false;
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}

	vendorAcceptOrReject(jobId,status){
		let _self = this;
		this.requestjobApi.vendorAcceptorCancel(jobId,status).subscribe(
			(success)=>{
				console.log("vendorAcceptOrReject : ", success.success.data);
				if(success.success.data && success.success.data.status === 'vendorAccepted'){
					_self.globalFunctionService.successToast('Job accepted','');
					_self.latestVendorJobs('latest');
					_self.openSideBar(jobId);
				}else{
					_self.globalFunctionService.successToast('Job rejected','');
					_self.latestVendorJobs('latest');
				}
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}

	openSideBar(jobId){
		this.searchForJob = jobId;
		this.getFreeEngs();
	}

	getFreeEngs(){
		let _self = this;
		this.peopleApi.getFreeEngineers(this.myInfo.id).subscribe(
			(success)=>{
				console.log("free engineers list : ", success.success.data);
				for(var i =0;i<=success.success.data.length-1;i++){
					if(success.success.data[i].image){
						success.success.data[i].image = _self.baseUrl + success.success.data[i].image;
					}else{
						success.success.data[i].image = 'assets/images/register_bg.jpg';
					}
				}
				setTimeout(()=>{
					_self.freeEngList = success.success.data;
					_self.freeEngineersList.openNav();
				},0);
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}

	getVendorJobs(job){
		// this.latestVendorJobs('latest');
		// this.onGoingVendorJobs('open');
		console.log("returned job : ", job);
		for(var i=0;i<=this.vendorJobs.length-1;i++){
			if(this.vendorJobs[i].id === job.id){
				this.vendorJobs[i] = job;
				this.vendorJobs[i].category.image = this.baseUrl + this.vendorJobs[i].category.image;
				break;
			}
		}
	}
	
	getEngJobs(job){
		console.log("returned job : ", job);
		for(var i=0;i<=this.engJobs.length-1;i++){
			if(this.engJobs[i].id === job.id){
				this.engJobs[i] = job;
				this.engJobs[i].category.image = this.baseUrl + this.engJobs[i].category.image;
				break;
			}
		}
	}
	
	checkCustJobs(job){
		console.log("returned job : ", job.jobId);
		this.getMyOrders('onGoing');
	}

	actInacEngineers(engId,status){
		let _self = this;
		this.peopleApi.actInacEngineers(engId,status).subscribe(
			(success)=>{
				console.log("actInacEngineers : ", success);
				if(!status){
					_self.globalFunctionService.successToast('Engineer is Blocked','');
				}else{
					_self.globalFunctionService.successToast('Engineer is unblocked','')
				}
				_self.checkForEng(success.success.data);
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}
	
	checkForEng(eng){
		for(var i=0;i<=this.engineersArr.length-1;i++){
			if(eng.id == this.engineersArr[i].id){
				if(eng.image){
					eng.image = this.baseUrl + eng.image;
				}else{
					eng.image = 'assets/images/register_bg.jpg';
				}
				this.engineersArr[i] = eng;
				break;
			}
		}
	}

	vendorAvailability(value){
		let _self = this;
		console.log("value : ", value);
		//let value = false;
		// if($('#check1')[0].checked){
			// value = true;
		// }else{
		   // value = false;
		// }
		this.peopleApi.vendorAvailability(value).subscribe(
			(success)=>{
				console.log("vendor online/offline : ", success);
				_self.myInfo = success.success.data;
				if(!_self.myInfo.isAvailable){
					_self.globalFunctionService.infoToast('Offline Mode');
				}else{
					_self.globalFunctionService.infoToast('Online Mode');
					_self.latestVendorJobs('latest');
					_self.onGoingVendorJobs('open');
				}
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}

	cancelJob(data){
		this.cancelJobModal.openModal(data);
	}

	changePasswordEng(engId){
		this.changePasswordModal.openModal({'engId' : engId});
	}

	addPart(jobId){
		this.requestParts.openModal({'jobId' : jobId});
	}

	updateStat(jobId){
		this.updateStatus.openModal({'jobId' : jobId});
	}

	checkLiveLocation(jobId){
		this.liveLocation.openModal({'jobId' : jobId});
	}

	giveFeedback(data){
		this.feedback.openModal(data);
	}
	
	navigateToProfile(id,realm){
		this.router.navigate(['profile/'+realm+'/'+id]);
	}
	
	navigateToJob(id){
		this.router.navigate(['job/'+id]);
	}
	
	getBill(id){
		this.billAnother.openModal({'jobId' : id, 'realm' : 'customer'});
		//this.globalFunctionService.callComponentMethod1({'jobId' : id, 'realm' : 'customer'});
	}
	
	openBill(data){
		this.billAnother.openModal({'jobId' : data.id, 'realm' : 'customer'});
	}
	
	getPayments(){
		let _self = this;
		this.loadingPayments = true;
		//this.payments = [];
		let cash = 0;
		let cheque = 0;
		let online = 0;
		this.requestjobApi.onGoingVendorJobs(this.myInfo.id).subscribe(
			(success)=>{
				if(success.success.data.length > 0){
					for(var i=0;i<=success.success.data.length-1;i++){
						if(success.success.data[i].status === 'completed' && !success.success.data[i].venToAdmin){
							//_self.payments.push(success.success.data[i]);
							if(success.success.data[i].completeJob.modeOfPayment === 'cash'){
								cash = cash + success.success.data[i].bill.total;
							}
							if(success.success.data[i].completeJob.modeOfPayment === 'cheque'){
								cheque = cheque + success.success.data[i].bill.total;
							}
							if(success.success.data[i].completeJob.modeOfPayment === 'online'){
								online = online + success.success.data[i].bill.total;
							}
						}
					}
					_self.loadingPayments = false;
					_self.cashPay = cash;
					_self.chequePay = cheque;
					_self.onlinePay = online;
				}
			},
			(error)=>{
				_self.loadingPayments = false;
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}
	
	updateJobStatus(jobId,job){
		let _self = this;
		this.requestjobApi.updateJobStatus(jobId,'outForDelivery').subscribe(
			(success)=>{
				console.log("outForDelivery : ", success);
				_self.getEngJobs(success.success.data);
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}
}
