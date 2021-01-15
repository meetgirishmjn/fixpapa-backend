import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { PeopleApi,CategoryApi,LoopBackAuth } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { MultipartService } from './../../services/multipart/multipart.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';

import { FacebookService, InitParams } from 'ngx-facebook';
import { LocalStorageService } from '../../services/localstorage.service';
import { Subscription } from 'rxjs/Subscription';
declare var $:any;

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements OnInit {

	servicesOffered 	: string[];
	
	files 				: any = [];
	productForm 		: FormGroup;
	brandForm			: FormGroup;
	problemForm			: FormGroup;
	problemDesForm 		: FormGroup;
	addressForm			: FormGroup;
	loginForm			: FormGroup;
	categoryForm 		: FormGroup;
	
	categoryId 			: FormControl;
	brandId 			: FormControl;
	problems 			: FormControl;
	problemDes			: FormControl;
	startDate			: FormControl;
	endDate 			: FormControl;
	address				: FormControl;
	productId 			: FormControl;
	street				: FormControl;
	
	categoryData 		: any = {};
	problemsArr 		: any[];
	productsData		: any[];
	brandsData			: any[];
	totalPrice 			: number = 0;
	noProblems			: boolean = false;
	problemsSelectedArr : any = [];
	askLogin			: boolean = false;
	addressArr			: any[];
	addresses			: any = {};
	
	formatted_address	: string;
	lat: any = 26.912434;
	lng: any = 75.787270;
	invalidLocation		: boolean = false;
	disablePost			: boolean = false;
	
	phase 				: number;
	tab 				: string;
	
	productImage1 		: any;
	productImage2 		: any;
	
	emailOrMobile		: FormControl;
	passwordL			: FormControl;
	invalidMobOrEmail 	: boolean = false;
	realm 				: string = 'customer';
	peopleId 			: string;
	
	disabledTime		: boolean = true;
	validTime			: any[];
	
	startDate1 				: any = '';
	endDate1				: any = '';
	toShowDate				: any;
	
	noStartDate 	: boolean = false;
	noTimeSlots		: boolean = false;
	loading : boolean = false;
	
	phaseList : any[];
	selectedProduct : any;
	
	disable : boolean = false;
	
	focusBeforeDate : boolean = false;
	private geoCoder;
	
	private clearAdd = false;
	private dragAdd = false;

	@ViewChild('startDate') set content(content: ElementRef) {
		if(this.toShowDate){
			let newFormat = this.toShowDate.toString().split(' ');
			if($('#startDate') && $('#startDate')[0]){
				$('#startDate')[0].value = newFormat[0] + ' ' + newFormat[2] + ' ' + newFormat[1] + ' '	+ newFormat[3];
			}
		}
		this.initializeDatepicker();
	}
	@ViewChild('address1') set content1(content1: ElementRef) {
		if (!this.clearAdd && !this.dragAdd) {
			this.initialiseMap();
		}
	}
	@ViewChild('problem') set content2(content2: ElementRef){
		if($('.problem-container').length > 0){
			for(var i=0;i<=$('.problem-container').length-1;i++){
				for(var j=0;j<=this.problemsSelectedArr.length-1;j++){
					if(this.problemsSelectedArr[j].id === $('.problem-container')[i].value){
						$('.problem-container')[i].checked = true;
					}
				}
			}
		}
	}
	
	constructor(
		private fb: FacebookService,private auth : LoopBackAuth,
		private categoryApi : CategoryApi, private peopleApi : PeopleApi,
		private globalFunctionService : GlobalFunctionService, 
		private multipartService : MultipartService,
		private mapsAPILoader : MapsAPILoader,
    private ngZone: NgZone, private localStorage: LocalStorageService) { 
		this.phase = 1;
		this.tab = 'phase1';
		this.productImage1 = "assets/images/profile-img.png";
		this.productImage2 = "assets/images/profile-img.png";
		this.validTime = [
			{ 'time' : '09:00 AM - 11:00 AM', 'disabled' : false },
			{ 'time' : '11:00 AM - 01:00 PM', 'disabled' : false },
			{ 'time' : '01:00 PM - 03:00 PM', 'disabled' : false },
			{ 'time' : '03:00 PM - 05:00 PM', 'disabled' : false },
			{ 'time' : '05:00 PM - 07:00 PM', 'disabled' : false } 
		];
		this.addressArr = [];
		this.phaseList = [];
		this.selectedProduct = '';
		let initParams: InitParams = {
			appId: '242197496398149',
			xfbml: true,
			version: 'v2.8'
		};
		fb.init(initParams);
	}
	
	addFiles(evt){
		this.files.push(evt);
		console.log("files : ", this.files);
	}

	subscriber: Subscription;
	ngOnInit() {
		const _self = this;

		this.subscriber = this.globalFunctionService.onCloseJobModal$.subscribe(
			data => {
				this.closeModal();
			}
 		)

		this.subscriber = this.globalFunctionService.onLoginMobile$.subscribe(
			(data) => {
				if (data) {
					if (this.auth.getAccessTokenId() && this.auth.getCurrentUserId()) {
						_self.isLogin = true;
						_self.askLogin = false;
						let profileCompleted = JSON.parse(_self.localStorage.getValue('profileCompleted'));
						if (!profileCompleted) {
							// if ($.isEmptyObject(_self.globalFunctionService.dataToPostForJob)) {
							// 	let datatopost = 	_self.createPostData();
							// 	_self.globalFunctionService.dataToPostForJob = JSON.parse(
							// 		JSON.stringify(datatopost));
							// }
							// if (!$.isEmptyObject(_self.globalFunctionService.dataToPostForJob)) {
								
							// }
							let datatopost = 	_self.createPostData();
							_self.globalFunctionService.dataToPostForJob = JSON.parse(JSON.stringify(datatopost));
							this.globalFunctionService.confirm('Wait!', 
								'Your profile is incomplete, please complete to recieve invoice and information about service',
								'OK', 'Skip', 1, '');
						} else {
							_self.checkForFixProb();
						}
					} else {
						_self.isLogin = false;
						_self.askLogin = true;
					}
				}
			}
		)
		this.globalFunctionService.onSignUpMobile$.subscribe(
			data => {
				if (data) {
					if (!$.isEmptyObject(_self.globalFunctionService.dataToPostForJob)) {
						this.postJob(this.globalFunctionService.dataToPostForJob);
					}
				}
			}
		)
	}

	createPostData() {
		if (this.addressForm) {
			if(this.addressForm.value.street) {
				this.addresses.street =  this.addressForm.value.street;
			} else {
				this.addresses.street = '';
			}
			let obj1 = { "address" : this.addresses };
			let obj2 = { "problems"  : this.problemsSelectedArr};
			let obj3 = { 'image' : this.files };
			let obj4 = { 'startDate' : this.startDate1 , 'endDate' : this.endDate1 };
			let obj5 = { 'totalPrice' : +this.totalPrice };
			let obj = Object.assign({},obj1,obj2,obj4,obj5,this.productForm.value,
				this.brandForm.value,this.categoryForm.value, this.problemDesForm.value);
			console.log("form data : ", obj);
			let data = { 'data' : obj, 'files' : obj3 };
			return data;
		} else {
			return {};
		}
	}

	zoom: number;
	initialiseMap() {
		this.mapsAPILoader.load().then(() => {
			this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

			let options = {
				componentRestrictions: {country: 'Ind'}
			};
			if(<HTMLInputElement>document.getElementById("customer-address")){
				let jobCreationAutoComplete = new google.maps.places.Autocomplete(
					<HTMLInputElement>document.getElementById("customer-address"),options);
				jobCreationAutoComplete.addListener('place_changed', () => {

					this.ngZone.run(() => {
						//get the place result
						this.formatted_address = '';
						this.lat = '';
						this.lng = '';
						let place: google.maps.places.PlaceResult = jobCreationAutoComplete.getPlace();
	
						//verify result
						if (place.geometry === undefined || place.geometry === null) {
							return;
						} else {
							this.serviceAt(place);
						}
					});
				});
			}
		});
	}

	markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.lat = $event.coords.lat;
		this.lng = $event.coords.lng;
		this.dragAdd = true;
    this.getAddress(this.lat, this.lng);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
					this.formatted_address = results[0].formatted_address;
					this.addressForm.controls['address'].setValue(this.formatted_address);
					console.log(this.addressForm.get('address').value);
					this.addresses = {};
					this.addresses = {
						'value' : this.addressForm.get('address').value,
						'location' : {
							'lat' : this.lat,
							'lng' : this.lng 
						},
						'street' : ''
					};
        } else {
          // window.alert('No results found');
        }
      } else {
        // window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
	
	setCurrentLocation(){
		let _self = this;
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition((position) => {
				_self.lat = position.coords.latitude;
				_self.lng = position.coords.longitude;
				_self.zoom = 12;
				let geocoder = new google.maps.Geocoder();
				geocoder.geocode({ location: new google.maps.LatLng(_self.lat,_self.lng)}, function(results, status) {
					if (status){
						// console.log("results : ", results);
						if (results && results.length > 0) {
							_self.formatted_address = results[0].formatted_address;
							_self.setCurrentAddress(_self.formatted_address, _self.lat, _self.lng);
						}
					} else {
						alert('Geocode was not successful for the following reason: ' + status);
					}
				});
			}, (error)=>{
					console.log("error : ", error);
					if(error.code == 2) {
						_self.globalFunctionService.errorToast('Internet Connection Lost','oops');
					}
					if(error.code == 1) {
						_self.globalFunctionService.errorToast(error.message,'oops');
					}
				});
		} else {
			_self.globalFunctionService.errorToast("Browser doesn't support Geolocation",'oops');
		}
	}
	
	setCurrentAddress(value,lat,lng){
		if(value){
			this.addressForm.controls['address'].setValue(value);
			this.addresses = {};
			this.addresses = {
				'value' : this.addressForm.get('address').value,
				'location' : {
					'lat' : lat,
					'lng' : lng 
				},
				'street' : ''
			};
			this.invalidLocation = false;
		}
	}
	
	serviceAt(place){
		this.lat = place.geometry.location.lat();
		this.lng = place.geometry.location.lng();
		this.formatted_address = place.formatted_address;
		this.addressForm.controls['address'].setValue(this.formatted_address);
		console.log(this.addressForm.get('address').value);
		this.addresses = {};
		this.addresses = {
			'value' : this.addressForm.get('address').value,
			'location' : {
				'lat' : this.lat,
				'lng' : this.lng 
			},
			'street' : ''
		};
	}
	
	clearAddress(){
		if (this.addressForm) {
			this.addressForm.get('address').setValue('');
		}
		this.addresses = {};
		this.lat = 26.922070;
		this.lng = 75.778885;
		this.formatted_address = '';
		this.invalidLocation = false;
	}
	
	getPricing(){
		this.totalPrice = 0;
		if(this.problemsSelectedArr.length > 0){
			for(var i=0;i<=this.problemsSelectedArr.length-1;i++){
				this.totalPrice  = this.totalPrice + this.problemsSelectedArr[i].price; 
			}
		}
	}
	
	getAddresses(){
		let _self = this;
		this.peopleApi.getAddresses({}).subscribe(
			(success)=>{
				console.log("address : ", success.success.data);
				_self.addressArr = success.success.data;
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
	
	selectAddress(address,i){
		this.addressForm.controls['address'].setValue(address.value);
		this.addressForm.controls['street'].setValue(address.street);
		this.lat = address.location.lat;
		this.lng = address.location.lng;
		this.formatted_address = address.value;
		this.addresses = {};
		this.addresses = {
			'value' : this.addressForm.get('address').value,
			'location' : {
				'lat' : this.lat,
				'lng' : this.lng
				},
			'street' : this.addressForm.get('street').value
		};
	}
	
	checkForUser() {
		console.log("addresses");
		let authCred = this.globalFunctionService.getUserCredentials();
		if(authCred.tokenId && authCred.userId){
			this.askLogin = false;
			this.getAddresses();
		} else{
			this.askLogin = true;
			this.phase++;
			this.phaseList.push(this.phase);
			this.loginForm = new FormGroup({
				emailOrMobile	:	this.emailOrMobile,
				passwordL		: 	this.passwordL
			});
		}
		// else {
		// 	this.globalFunctionService.componentMethodCallSource.next()
		// }
		/**/
	}
	
	createDates(timeSlot){
		let newDate = new Date($('#startDate')[0].value);
		if(newDate){
			let startDate = this.globalFunctionService.getStartDate(newDate,timeSlot);
			let endDate = this.globalFunctionService.getEndDate(newDate,timeSlot);
			console.log("startDate : ", startDate);
			console.log("endDate : ", endDate);
			this.startDate1 = startDate;
			this.endDate1 = endDate;
			this.addressForm.controls['endDate'].setValue(timeSlot);
		}else{
		}
	}

	focusedBefore(){
		this.focusBeforeDate = true;
	}
	
	changedValue(){
		let startDate = $('#startDate')[0].value;
		if(!startDate && this.focusBeforeDate){
			this.startDate1 = '';
		}
	}
	
	initializeDatepicker(){
		var date_input = $('input[name="startDate"]'); 
		let _self = this;
	
		date_input.datepicker({
			format: 'D d. M yyyy',
			todayHighlight: true,
			autoclose: true,
			startDate : new Date()
		});
		
		date_input.datepicker().on('changeDate', function (ev) {
			// console.log("data : ", ev.date);
			_self.toShowDate = ev.date;
			let date = new Date(ev.date);
			let currentDate = new Date();
			
			_self.startDate1 = $('#startDate')[0].value;
			// console.log("startDate1 : ", _self.startDate1);
			for(var i=0;i<=_self.validTime.length-1;i++){
				_self.validTime[i].disabled = false;
			}
			
			if(date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()){
				_self.checkForSlots(date);
				//console.log("true");
			}else{
				
			}
		});
	}
	
	checkForSlots(date){
		date = new Date();
		this.addressForm.controls['endDate'].setValue('');
		let timeToCompare = date.toLocaleTimeString(); //"12:00:00 AM" 11:18:00 PM
		console.log("time to compare : ", timeToCompare);
		let splitOnSpace = timeToCompare.split(' ');
		let splitOnColon = splitOnSpace[0].split(':');
		let first = splitOnColon[0]; //11
		let second = splitOnColon[1]; //18
		let timeZone = splitOnSpace[1]; //PM
		//11:00 AM - 01:00 PM
		// let newValidTime = [];
		//console.log("first : ", first);
		if(+first === 12 && timeZone === 'AM'){
		}
		else if(+first > 1 && +first !== 12 && timeZone === 'PM'){
			this.noTimeSlots = true;
			for(var i=0;i<=this.validTime.length-1;i++){
				this.validTime[i].disabled = true;
			}
		}else{
			first = +first + 4;
			if(first > 12){
				first = +first - 12;
				timeZone = 'PM';
			}
			console.log("first : ", first);
			if(+first === 12 && timeZone === 'PM' ){
				this.validTime[0].disabled = true;
				this.validTime[1].disabled = true;
			}
			else{
				if((+first > 5 || (+first === 5 && +second > 0)) &&  timeZone === 'PM'){
					this.noTimeSlots = true;
					for(var i=0;i<=this.validTime.length-1;i++){
						this.validTime[i].disabled = true;
					}
				}
				else if(+first < 9 && timeZone === 'AM'){}
				else if(+first < 11 && timeZone === 'AM'){
					this.validTime[0].disabled = true;
				}
				else if(+first < 1 && timeZone === 'PM'){
					this.validTime[0].disabled = true;
					this.validTime[1].disabled = true;
				}
				else if(+first < 3 && timeZone === 'PM'){
					this.validTime[0].disabled = true;
					this.validTime[1].disabled = true;
					this.validTime[2].disabled = true;
				}
				else if(+first < 5 && timeZone === 'PM'){
					this.validTime[0].disabled = true;
					this.validTime[1].disabled = true;
					this.validTime[2].disabled = true;
					this.validTime[3].disabled = true;
				}
			}
		}
		console.log("valid time : ", this.validTime);
	}
	
	openModal(categoryId){
		this.loading = true;
		this.globalFunctionService.dataToPostForJob = {};
		$('#jobmodal').modal({backdrop : 'static', keyboard : false});
		this.getCategoryById(categoryId);
	}
	closeModal(){
		this.clearAddress();
		this.problemsArr = [];
		this.productsData = [];
		this.brandsData	= [];
		this.totalPrice = 0;
		this.noProblems	= false;
		this.problemsSelectedArr = [];
		this.focusBeforeDate = false;
		this.disable = false;
		this.addressArr	= [];
		this.addresses	= {};
		this.files = [];
		this.productImage1 = "assets/images/profile-img.png";
		this.productImage2 = "assets/images/profile-img.png";
		this.phaseList = [];
		this.toShowDate = '';
		this.selectedProduct = '';
		this.clearAdd = false;
		this.dragAdd = false;
		this.startDate1 = '';
		this.endDate1 = '';
		this.askLogin = false;
		this.isLogin = false;
		this.resetForms();
		$('#jobmodal').modal('hide');
	}
	
	resetForms(){
		if(this.productForm)
			this.productForm.reset();
		if(this.brandForm)
			this.brandForm.reset();
		if(this.problemForm)
			this.problemForm.reset();
		if(this.problemDesForm)
			this.problemDesForm.reset();
		if(this.addressForm)
			this.addressForm.reset();
		if(this.loginForm)
			this.loginForm.reset();
	}
	
	makeFixProblemForm(){
		if(this.categoryData){
			this.categoryId = new FormControl(this.categoryData.id,[
				Validators.required
			]);
			
			this.categoryForm  = new FormGroup({
				categoryId :this.categoryId
			});
			this.problems = new FormControl('',[
				Validators.required
			]);
			this.problemDes	= new FormControl('',[
			]);
			this.startDate = new FormControl('',[
			]);
			this.endDate = new FormControl('',[
			]);
			this.address = new FormControl('',[
				Validators.required
			]);
			this.productId = new FormControl('',[
				Validators.required
			]);
			this.street = new FormControl('',[
			]);
			
			this.addressForm = new FormGroup({
				address 	: this.address,
				street 		: this.street,
				startDate	: this.startDate,
				endDate		: this.endDate
			});
			
			this.problemDesForm = new FormGroup({
				problemDes : this.problemDes
			});
			
			this.emailOrMobile = new FormControl('',[
				Validators.required
			]);
			this.passwordL = new FormControl('',[
				Validators.required,
				Validators.minLength(6)
			]);
			
			if(this.categoryData.problems.length > 0){
				this.problemsArr = this.categoryData.problems;
				this.problemForm = new FormGroup({
					problems  : this.problems
				});
			}
			if(this.categoryData.productsIds.length === 1 && (this.categoryData.name.trim().toUpperCase() === this.categoryData.products[0].name.trim().toUpperCase() )){
				this.productsData = [];
				
				this.productForm = new FormGroup({
					productId : this.productId
				});
				
				this.productForm.controls['productId'].setValue(this.categoryData.products[0].id);
				this.selectedProduct = this.categoryData.products[0].name;
				if(this.categoryData.products[0].brandIds.length === 1 && (this.categoryData.name.trim().toUpperCase() === this.categoryData.products[0].brand[0].name.trim().toUpperCase() )){
					this.brandsData = [];
					this.brandId = new FormControl('',[
						Validators.required
					]);
					this.brandForm = new FormGroup({
						brandId : this.brandId
					});
					this.brandForm.controls['brandId'].setValue(this.categoryData.products[0].brand[0].id);
				}else{
					this.brandId = new FormControl('',[
						Validators.required
					]);
					this.brandForm = new FormGroup({
						brandId : this.brandId
					});
					this.brandsData = this.categoryData.products[0].brand;
					this.phase = 2;
					this.phaseList.push(this.phase);
					this.tab = 'phase2';
					this.loading = false;
				}
				
				// if(this.categoryData.products[0].brandIds.length > 1){
					
				// }
			}else{
				this.productsData = this.categoryData.products;
				this.productForm = new FormGroup({
					productId : this.productId
				});
				this.phase = 1;
				this.phaseList.push(this.phase);
				this.loading = false;
			}
			// if(this.categoryData.productsIds.length > 1){
				
			// }
		}
	}
	
	onSelectProduct(product){
		console.log("product : ", product);
		this.selectedProduct = product.name;
		if(product.brandIds.length === 0){
			this.brandId = new FormControl('',[
			]);
			this.brandForm = new FormGroup({
				brandId : this.brandId
			});
			this.brandsData = [];
		}else{
			if(product.brandIds.length === 1 && (this.categoryData.name.trim().toUpperCase() === product.brand[0].name.trim().toUpperCase() )){
				this.brandsData = [];
				this.brandId = new FormControl('',[
					Validators.required
				]);
				this.brandForm = new FormGroup({
					brandId : this.brandId
				});
				this.brandForm.controls['brandId'].setValue(product.brand[0].id);
			}else{
				this.brandId = new FormControl('',[
					Validators.required
				]);
				this.brandForm = new FormGroup({
					brandId : this.brandId
				});
				this.brandsData = product.brand;
			}
			//if(product.brandIds.length > 1){}
		}
	}
	
	checkForFixProb() {
		/*console.log("productForm : ", this.productForm.value);
		console.log("problem Form : " , this.problemForm.value);
		console.log("problemDesForm : " , this.problemDesForm.value);
		console.log("addressForm : ", this.addressForm.value );
		console.log("categoryForm : ", this.categoryForm.value);*/
		if (this.problemForm) {
			if((this.productForm.valid && this.categoryForm.valid && 
				this.problemForm.valid && this.addressForm.valid && !this.invalidLocation &&
				!this.noProblems && this.startDate1 && this.endDate1 ) && 
				((this.askLogin && this.isLogin ) || !this.askLogin )) {
				if (JSON.parse(this.localStorage.getValue('profileCompleted'))) {
					this.disable = true;
					let data = this.createPostData();
					this.postJob(data);
				} else {
					if ($.isEmptyObject(this.globalFunctionService.dataToPostForJob)) {
						let datatopost = 	this.createPostData();
						this.globalFunctionService.dataToPostForJob = JSON.parse(
							JSON.stringify(datatopost));
					}
					this.globalFunctionService.confirm('Wait!', 
					'Your profile is incomplete, please complete to recieve invoice and information about service',
					'OK', 'Skip', 1, '');
				}
			}
		}
	}
	
	postJob(data){
		let _self = this;
		this.multipartService.createJob(data).subscribe(
			(success)=>{
				console.log("success : ", success);
				_self.globalFunctionService.successToast("Job Posted Successfully","");
				_self.disable = false;
				_self.globalFunctionService.closeJobModal();
			},
			(error)=>{
				_self.disable = false;
				_self.closeModal();
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
	
	getCategoryById(id){
		let _self = this;
		this.categoryApi.getCategory(id).subscribe(
			(success)=>{
				console.log("category Data : ", success);
				_self.categoryData = success.success.data;
				_self.makeFixProblemForm();
				_self.loading = false;
			},
			(error)=>{
				_self.loading = false;
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
	
	private isLogin;
	async checkCredentials() {
		let loginObj;
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;			
		if(re.test(this.loginForm.controls['emailOrMobile'].value)) {
			this.invalidMobOrEmail = false;
			loginObj = { 'email' : this.loginForm.controls['emailOrMobile'].value, 'password' : this.loginForm.controls['passwordL'].value, 'realm' : this.realm };
			this.isLogin = await this.globalFunctionService.loginNow(loginObj);
			if (this.isLogin) {
				if (!JSON.parse(this.localStorage.getValue('profileCompleted'))) {
					this.globalFunctionService.infoToastLong(`Your profile is incomplete,
					 please complete to recieve invoice and information about service`);
					this.globalFunctionService.openSignUp();
				} else {
					let user = JSON.parse(this.localStorage.getValue('user'));
					if (user.emailVerified && user.mobileVerified) {
						this.checkForFixProb();
					} else if (!user.emailVerified) {
						this.globalFunctionService.infoToastLong('Please verify your Email');
						this.closeModal();
					}
					else if (!user.mobileVerified) {
						this.globalFunctionService.openOtpModal({peopleId: this.localStorage.getValue('peopleId')});
					}
				}
			}
		} else {
			let mobile = '';
			var reMobile = /^[6-9]\d{9}$/;
			if(reMobile.test(this.loginForm.controls['emailOrMobile'].value)) {
				this.invalidMobOrEmail = false;
				let val = this.loginForm.value.emailOrMobile;
				mobile = '91' + val;
				loginObj = { 'mobile' : mobile, 'password' : this.loginForm.controls['passwordL'].value, 'realm' : this.realm};
				console.log("login object : ", loginObj);
				this.isLogin = await this.globalFunctionService.loginNow(loginObj);
				if (this.isLogin) {
					this.checkForFixProb();
				}
			} else {
				this.invalidMobOrEmail = true;
			}
		}
	}

	checkForPhase(){
		if(this.phase === 6){ // address screen
			this.checkForPhase6();
		}
		if(this.phase === 5){
			//this.checkForUser(); // final screen
			this.phase++;
			this.phaseList.push(this.phase);
		}
		if(this.phase === 4){
			this.phase++;
			this.checkForUser(); // final screen
			this.phaseList.push(this.phase);
		}
		if(this.phase === 3){
			this.checkForPhase3();
		}
		if(this.phase === 2){
			this.checkForPhase2();
		}
		if(this.phase === 1){
			this.checkForPhase1();
		}
	}
	
	checkForPhase1(){
		if(this.productForm.valid){
			if(this.brandsData.length > 0){
				this.phase++;
				this.phaseList.push(this.phase);
			}else{
				this.phase = this.phase + 2;
				this.phaseList.push(this.phase);
			}
		}else{
			this.productForm.controls['productId'].markAsTouched();
			//this.globalFunctionService.infoToast('Please select a product');
		}
		if(this.phase === 3){
			this.problemsSelectedArr = [];
		}
	}
	
	checkForPhase2(){
		if(this.brandForm.valid){
			this.phase++;
			this.phaseList.push(this.phase);
		}else{
			//this.globalFunctionService.infoToast('Please select a brand');
			this.brandForm.controls['brandId'].markAsTouched();
		}
		if(this.phase === 3){
			this.problemsSelectedArr = [];
		}
	}
	
	checkForPhase3() {
		if(this.problemForm.valid) {
			this.phase++;
			this.phaseList.push(this.phase);
		} else {
			this.noProblems = true;
			//this.globalFunctionService.infoToast('Select atleast a problem');
		}
	}
	
	checkForPhase6() {
		if(this.addressForm.valid && this.startDate1 != '' && this.endDate1 != ''){
			if(this.addressForm.get('address').value && this.addressForm.get('address').value.length > 0 && (this.addressForm.get('address').value === this.formatted_address)){
				this.invalidLocation = false;
				if(this.askLogin) {
					this.globalFunctionService.infoToast('Great!, You can use the service by logging in to fixpapa');
					this.phase++;
					this.phaseList.push(this.phase);
				} else {
					this.checkForFixProb();
				}
			} else {
				this.invalidLocation = true;
			}
		} else {
			this.addressForm.controls['address'].markAsTouched();
			if(this.startDate1 === '') {
				this.focusBeforeDate = true;
			}
			if(this.startDate1 != '' && this.endDate1 === ''){
				this.addressForm.controls['endDate'].markAsTouched();
			}
		}
	}
	
	goBack() {
		this.phaseList.splice(this.phaseList.length-1,1);
		this.phase = this.phaseList[this.phaseList.length-1];
	}
	
	changeProblem(problem,id,evt){
		let newValue;
		console.log("this : ", this);
		if(evt.target.checked){
			this.problemsSelectedArr.push(problem);
			if(this.problemForm.controls['problems'].value){
				newValue = this.problemForm.controls['problems'].value +  ',' + id;
			}else{
				newValue = id;
			}
			if(this.noProblems){
				this.noProblems = false;
			}
			this.problemForm.controls['problems'].setValue(newValue);
			this.getPricing();
		}
		else{
			let newArr = this.problemForm.controls['problems'].value.split(',');
			const index = newArr.indexOf(id);
			console.log("index : ", index);
			if(index !== -1){
				newArr.splice(index,1);
				this.problemsSelectedArr.splice(index,1);
			}
			if(newArr.length == 0){
				this.noProblems = true;
			}
			newValue = newArr.join(',');
			this.problemForm.controls['problems'].setValue(newValue);
			this.getPricing();
		}
		console.log("problems array : ", this.problemsSelectedArr);
		console.log("problems Ids : ", this.problemForm.controls['problems'].value);
	}

	openLoginModal () {
		this.globalFunctionService.openLoginMobileModal();
	}

	ngOnDestroy () {
		this.subscriber.unsubscribe();
	}
}