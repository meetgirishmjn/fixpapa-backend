import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { PeopleApi,CategoryApi,LoopBackConfig,LoopBackAuth } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';

import { CreateJobComponent } from './../create-job/create-job.component';
import { NewPurchaseComponent } from './../new-purchase/new-purchase.component';
import { BidRequestComponent } from './../bid-request/bid-request.component';
import { AmcRequestComponent } from './../amc-request/amc-request.component';
import { RentRequestComponent } from './../rent-request/rent-request.component';

import { EnquiryComponent } from './../enquiry/enquiry.component';
import { SeoService } from './../../services/seo/seo.service';
import { LocalStorageService } from '../../services/localstorage.service';

declare var seoData:any;
declare var $:any;

@Component({
	selector: 'app-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

	// @ContentChild(LoginModalComponent)
	// private LoginModalComponent : LoginModalComponent;

	@ViewChild(CreateJobComponent)
	private fixProblemModal: CreateJobComponent;

	@ViewChild(NewPurchaseComponent)
	private newPurchaseModal: NewPurchaseComponent;

	@ViewChild(BidRequestComponent)
	private bidModal : BidRequestComponent;

	@ViewChild(AmcRequestComponent)
	private amcModal : AmcRequestComponent;

	@ViewChild(RentRequestComponent)
	private rentModal : RentRequestComponent;

	@ViewChild(EnquiryComponent)
	private enquiry : EnquiryComponent;
	
	baseUrl : String;
	allCategories : any[];
	amcCategories : any[];
	bidCategories : any[];
	newPurchaseCategories : any[];
	rentCategories : any[];
	fixAProblem : any[];
	responsiveOptions : any = {};
	responsiveOptions1 : any = {};

	loadingFix : boolean = true;
	loadingPurchase : boolean = true;
	loadingOffice : boolean = true;
	loadingRent : boolean = true;
	loadingAmc : boolean = true;

	authCred : any = {};
	isLogin : boolean = false;

	formDetailData : any = {};

	@ViewChild("searchLocation")
	public searchElementRef: ElementRef;

	constructor(private seoService: SeoService, 
		private categoryApi: CategoryApi, 
		private globalFunctionService: GlobalFunctionService, 
		private peopleApi: PeopleApi, 
		private auth: LoopBackAuth, private localStorage: LocalStorageService) {
		//console.log("bank name : ", this.bankNames);
		this.seoService.generateTags(seoData.homePage);	

		this.baseUrl = LoopBackConfig.getPath();
		this.responsiveOptions = {
			0: {
				items: 1
			},
			500: {
				items: 2
			},
			970: {
				items: 4
			}
		};

		this.responsiveOptions1 = {
			0: {
				items: 1
			},
			500: {
				items: 2
			},
			970: {
				items: 3
			}
		};
	}

	ngOnInit() {
		this.setAuthCredential();

		$('#myCarousel').carousel({
			interval: 2000
			});
			
			this.globalFunctionService.openFixProblem$.subscribe(
				(data) => {
					if (data.status && data.categoryId) {
						this.fixProblemModal.openModal(data.categoryId);
					}
				}
			)
			// this.globalFunctionService.openPurchase$.subscribe(
			// 	(data) => {
			// 		if (data.status && data.categoryId) {
			// 			this.newPurchaseModal.getPurchaseById(data.id);
			// 		}
			// 	}
			// )
			// this.globalFunctionService.openBid$.subscribe(
			// 	(data) => {
			// 		if (data.status && data.categoryId) {
			// 			this.bidModal.getBidById(data.id);
			// 		}
			// 	}
			// )
			// this.globalFunctionService.openMaintanance$.subscribe(
			// 	(data) => {
			// 		if (data.status && data.categoryId) {
			// 			this.amcModal.getAmcById(data.id);
			// 		}
			// 	}
			// )
			// this.globalFunctionService.openRent$.subscribe(
			// 	(data) => {
			// 		if (data.status) {
			// 			this.rentModal.getAllCategory();
			// 		}
			// 	}
			// )

			this.globalFunctionService.onLogOut$.subscribe(
				(data) => {
					if (data) {
						this.setAuthCredential();
					}
				}
			)
	}

	ngAfterViewInit(){
		$("#owl-demo").owlCarousel({
			items: 3,
			nav: true,
			loop: true,
			navText: [
				"<i class='glyphicon glyphicon-chevron-left icon-white'></i>",
				"<i class='icon-chevron-right icon-white'>&gt;</i>"
			],
			responsive: this.responsiveOptions1
		});
		
		this.getAllCategories();
	}
	
	openEnq(){
		//this.enquiry.openPanel();
	}

	formDetailInquiry(formDetail){
		
		if(!formDetail.valid)	
			return;

		var $btn = $("#submitBtn");
		$btn.button('loading');
		
		let name = this.formDetailData.name;
		let companyName = this.formDetailData.companyName;
		let workEmail = this.formDetailData.workEmail;
		let phone = this.formDetailData.phone;
		let content = this.formDetailData.content;

		this.peopleApi.formDetails(name, companyName,workEmail,phone,content).subscribe((success)=>{
			this.globalFunctionService.successToast("Successfully submited",'');
			this.formDetailData.name = "";
			this.formDetailData.companyName = "";
			this.formDetailData.workEmail = "";
			this.formDetailData.phone = "";
			this.formDetailData.content = "";
			setTimeout(()=>{
				formDetail.resetForm();
			},0);
			
			$btn.button('reset');
		},(error)=>{
			this.globalFunctionService.errorToast("Something went wrong!",'oops');
			$btn.button('reset');
		})
	}

	openFixProblemModal(data) {
		this.fixProblemModal.openModal(data.categoryId);
		// if(this.isLogin){
		// 	if (!(JSON.parse(this.localStorage.getValue('profileCompleted')))) {
		// 		this.globalFunctionService.confirm1('Wait!', 
		// 		'Your profile is incomplete, please complete to recieve invoice and information about service',
		// 		'OK', 'Skip', 1, data.categoryId);
		// 	} else {
		// 		let user = JSON.parse(this.localStorage.getValue('user'));
		// 		if (user.emailVerified && user.mobileVerified) {
					
		// 		} else if (!user.emailVerified) {
		// 			this.globalFunctionService.infoToastLong('Please verify your Email, Verify link has been sent to your Registered Email Address');
		// 		}
		// 		else if (!user.mobileVerified) {
		// 			// this.globalFunctionService.errorToast('Please verify your mobile', 
		// 			// 'Otp has been sent to your regsitered Mobile No.');
		// 			this.globalFunctionService.openOtpModal({peopleId : 
		// 				this.localStorage.getValue('peopleId')});
		// 		}
		// 	}
		// } else {
		// 	this.globalFunctionService.confirm('Great!', 
		// 	'You can use the service by logging in to fixpapa', 
		// 	'Login', 'Not Now', 1, data.categoryId);
		// }

		/*
		if(this.isLogin){
			if (!(JSON.parse(this.localStorage.getValue('profileCompleted')))) {
				this.globalFunctionService.confirm1('Wait!', 
				'Your profile is incomplete, please complete to recieve invoice and information about service',
				'OK', 'Skip', 1, data.categoryId);
			} else {
				let user = JSON.parse(this.localStorage.getValue('user'));
				if (user.emailVerified && user.mobileVerified) {
					this.fixProblemModal.openModal(data.categoryId);
				} else if (!user.emailVerified) {
					this.globalFunctionService.infoToastLong('Please verify your Email, Verify link has been sent to your Registered Email Address');
				}
				else if (!user.mobileVerified) {
					// this.globalFunctionService.errorToast('Please verify your mobile', 
					// 'Otp has been sent to your regsitered Mobile No.');
					this.globalFunctionService.openOtpModal({peopleId : 
						this.localStorage.getValue('peopleId')});
				}
			}
		} else {
			this.globalFunctionService.confirm('Great!', 
			'You can use the service by logging in to fixpapa', 
			'Login', 'Not Now', 1, data.categoryId);
		}
		 */
	}

	openNewPurchaseModal(data){
		this.setAuthCredential();
		if(this.isLogin) {
			if (!JSON.parse(this.localStorage.getValue('profileCompleted'))) {
				this.globalFunctionService.confirm1('Wait!', 
					'Your profile is incomplete, please complete to recieve invoice and information about service',
					'OK', 'Skip', 2, data.id);
			} else {
				this.newPurchaseModal.getPurchaseById(data.id);
			}
		} else {
			this.globalFunctionService.infoToastLong('You can use the service by logging in to fixpapa');
			this.globalFunctionService.openLoginModal();
		}
	}

	openBidModal(data) {
		this.setAuthCredential();
		if(this.isLogin) {
			if (!JSON.parse(this.localStorage.getValue('profileCompleted'))) {
				this.globalFunctionService.confirm1('Wait!', 
					'Your profile is incomplete, please complete to recieve invoice and information about service',
					'OK', 'Skip', 3, data.id);
			} else {
				this.bidModal.getBidById(data.id);
			}
		} else {
			this.globalFunctionService.infoToastLong('You can use the service by logging in to fixpapa');
			this.globalFunctionService.openLoginModal();
		}
	}

	openAmcModal(data) {
		this.setAuthCredential();
		if(this.isLogin) {
			if (!JSON.parse(this.localStorage.getValue('profileCompleted'))) {
				this.globalFunctionService.confirm1('Wait!', 
					'Your profile is incomplete, please complete to recieve invoice and information about service',
					'OK', 'Skip', 4, data.id);
			} else {
				this.amcModal.getAmcById(data.id);
			}
		} else {
			this.globalFunctionService.infoToastLong('You can use the service by logging in to fixpapa');
			this.globalFunctionService.openLoginModal();
		}
	}

	openRentModal() {
		this.setAuthCredential();
		if(this.isLogin) {
			if (!JSON.parse(this.localStorage.getValue('profileCompleted'))) {
				this.globalFunctionService.confirm1('Wait!', 
					'Your profile is incomplete, please complete to recieve invoice and information about service',
					'OK', 'Skip', 5, '');
			} else {
				this.rentModal.getAllCategory();
			}
		} else {
			this.globalFunctionService.infoToastLong('You can use the service by logging in to fixpapa');
			this.globalFunctionService.openLoginModal();
		}
	}

	getAllCategories() {
		let _self = this;
		_self.categoryApi.allData().subscribe(
			(success) => {
				console.log("all categories : ", success);
				_self.allCategories = success.success.data;
				for(var i=0;i<=success.success.data.categories.length-1;i++){
					if(success.success.data.categories[i].image) {
						success.success.data.categories[i].image = _self.baseUrl + success.success.data.categories[i].image;
					} else {
						success.success.data.categories[i].image = 'assets/images/1.jpg';
					}
				}
				_self.fixAProblem = success.success.data.categories;
				_self.loadingFix = false;
				for(var i=0;i<=success.success.data.amc.length-1;i++){
					if(success.success.data.amc[i].image) {
						success.success.data.amc[i].image = _self.baseUrl + success.success.data.amc[i].image;
					} else {
						success.success.data.amc[i].image = 'assets/images/1.jpg';
					}
				}
				_self.amcCategories = success.success.data.amc;
				_self.loadingAmc = false;
				for(var i=0;i<=success.success.data.bid.length-1;i++){
					if(success.success.data.bid[i].image){
						success.success.data.bid[i].image = _self.baseUrl + success.success.data.bid[i].image;
					}else{
						success.success.data.bid[i].image = 'assets/images/1.jpg';
					}
				}
				_self.bidCategories = success.success.data.bid;
				_self.loadingOffice = false;
				for(var i=0;i<=success.success.data.newpurchases.length-1;i++){
					if(success.success.data.newpurchases[i].image){
						success.success.data.newpurchases[i].image = _self.baseUrl + success.success.data.newpurchases[i].image;
					}else{
						success.success.data.newpurchases[i].image = 'assets/images/1.jpg';
					}
				}
				_self.newPurchaseCategories = success.success.data.newpurchases;
				_self.loadingPurchase = false;
				for(var i=0;i<=success.success.data.rent.length-1;i++){
					if(success.success.data.rent[i].image){
						success.success.data.rent[i].image = _self.baseUrl + success.success.data.rent[i].image;
					}else{
						success.success.data.rent[i].image = 'assets/images/1.jpg';
					}
				}
				_self.rentCategories = success.success.data.rent;
				_self.loadingRent = false;
			},
			(error)=>{
				_self.loadingFix = false;
				_self.loadingPurchase = false;
				_self.loadingOffice = false;
				_self.loadingRent = false;
				_self.loadingAmc = false;
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

	setAuthCredential(){
		this.authCred.tokenId = this.auth.getAccessTokenId();
		this.authCred.userId = this.auth.getCurrentUserId();
		if(this.authCred.tokenId && this.authCred.userId){
			this.isLogin = true;
		} else {
			this.isLogin = false;
		}
	}
}
