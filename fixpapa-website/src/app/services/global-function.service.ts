import { Injectable } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { LoopBackAuth } from './../sdk/index';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs';
import { PeopleApi } from '../sdk/services/custom/People';
import { SDKToken } from '../sdk/models/BaseModels';
import { LocalStorageService } from './localstorage.service';
import { MultipartService } from './multipart/multipart.service';
declare const $: any;
@Injectable()
export class GlobalFunctionService {

	authCred : any = {};
	customerData : any = {};
	token : any = '';
	dataToPostForJob = {};
	constructor(private toastr : ToastsManager, 
		private router : Router, private localStorage: LocalStorageService,
		private auth : LoopBackAuth, private peopleApi: PeopleApi,
		private localStorageService: LocalStorageService,
		private multipartService: MultipartService) { }

	openLoginModalSub = new Subject<any>();
	openLoginModal$ = this.openLoginModalSub.asObservable();

	private openFixProblemSub = new BehaviorSubject<any>(false);
	openFixProblem$ = this.openFixProblemSub.asObservable();

	private openPurchaseSub = new BehaviorSubject<any>(false);
	openPurchase$ = this.openPurchaseSub.asObservable();

	private openBidSub = new BehaviorSubject<any>(false);
	openBid$ = this.openBidSub.asObservable();

	private openMaintananceSub = new BehaviorSubject<any>(false);
	openMaintanance$ = this.openMaintananceSub.asObservable();

	private openRentSub = new BehaviorSubject<any>(false);
	openRent$ = this.openRentSub.asObservable();

	private openLoginMobile = new BehaviorSubject<any>(false);
	openLoginMobile$ = this.openLoginMobile.asObservable()

	private onLoginMobileSub = new BehaviorSubject<boolean>(false);
	onLoginMobile$ = this.onLoginMobileSub.asObservable();

	private openMobileSignUpSub = new BehaviorSubject<any>(false);
	openMobileSignUp$ = this.openMobileSignUpSub.asObservable();

	private onSignUpMobileSub = new BehaviorSubject<boolean>(false);
	onSignUpMobile$ = this.onSignUpMobileSub.asObservable();

	private onLoginSub = new BehaviorSubject<any>(false);
	onLogin$ = this.onLoginSub.asObservable();

	private onProfileUpdateSub = new BehaviorSubject<boolean>(false);
	onProfileUpdate$ = this.onProfileUpdateSub.asObservable();

	private openOtpModalSub = new BehaviorSubject<any>(false);
	openOtpModal$ = this.openOtpModalSub.asObservable();

	private onOtpVerifySub = new BehaviorSubject<any>(false);
	onOtpVerify$ = this.onOtpVerifySub.asObservable();

	private onLogoutSub = new BehaviorSubject<any>(false);
	onLogOut$ = this.onLogoutSub.asObservable();

	private closeModalJobSub = new Subject<any>();
	onCloseJobModal$ = this.closeModalJobSub.asObservable();

	closeJobModal () {
		this.closeModalJobSub.next(false);
	}

	onLogOut () {
		this.onLogoutSub.next(true);
	}

	openOtpModal (data) {
		this.openOtpModalSub.next(data);
	}

	onVerifyOtp () {
		this.onOtpVerifySub.next(true);
	}

	onProfileUpdate() {
		this.onProfileUpdateSub.next(true);
	}

	onLogin() {
		this.onLoginSub.next(true);
	}

	onSignUp () {
		this.onSignUpMobileSub.next(true);
	}

	openSignUp () {
		this.openMobileSignUpSub.next(true);
	}

	closeSignUp () {
		this.openMobileSignUpSub.next(false);
	}

	openLoginModal(realm?: string) {
		this.openLoginModalSub.next({status: true, realm: realm});
	}

	onLoginMobile () {
		this.onLoginMobileSub.next(true);
	}

	closeLoginMobile () {
		this.openLoginMobile.next(false);
	}

	openLoginMobileModal() {
		this.openLoginMobile.next(true)
	}

	postJob() {
		let _self = this;
		this.multipartService.createJob(this.dataToPostForJob).subscribe(
			(success) => {
				console.log("success : ", success);
				_self.successToast("Job Posted Successfully","");
				_self.dataToPostForJob = {};
			},
			(error) => {
				if(error === 'Server error'){
					_self.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.navigateToError('401');
				}else{
					_self.errorToast(error.message,'oops');
				}
				console.log("error : ", error);
			}
		);
	}

	successToast(mess1,mess2){
		this.toastr.success(mess1,mess2,{showCloseButton : true, toastLife : 1000});
	}
	
	errorToast(mess1,mess2){
		this.toastr.error(mess1,mess2,{showCloseButton : true, toastLife : 5000});
	}
	
	warningToast(mess1,mess2) {
		this.toastr.warning(mess1, mess2);
	}
	
	infoToast(mess1) {
		this.toastr.info(mess1,'',{toastLife : 1000});
	}

	infoToastLong (msg) {
		this.toastr.info(msg,'',{toastLife : 1200});
	}
	
	logoutToast(mess1){
		this.toastr.info(mess1,'',{toastLife : 1000});
	}
     
	customToast(mess1,mess2){
			this.toastr.custom('<span style="color: red">'+ mess1 +'</span>', null, {enableHTML: true});
	}
	
	navigateToError(error){
		if(error === 'server'){
			this.router.navigate(['server-error']);
		}
		if(error === '401'){
			this.auth.clear();
			this.router.navigate(['/']);
		}
	}
	
	checkForSlots(startDate, endDate){
		startDate = new Date(startDate);
		let first = startDate.getHours();
		let timeZoneFirst = (startDate.getHours() >= 12) ? 'PM' : 'AM';
		
		endDate = new Date(endDate);
		let last = endDate.getHours();
		let timeZoneLast = (endDate.getHours() >= 12) ? 'PM' : 'AM';
		
		let today = new Date();
		let timeSlots = [];
		
		let validTime = [
			{ 
				'time' : '09:00 AM - 11:00 AM', 
				'start' : 9,
				'availableTimeSlot' : [
					{'time' : '09:00 AM - 09:30 AM','disabled' : false},
					{'time' : '09:30 AM - 10:00 AM','disabled' : false},
					{'time' : '10:00 AM - 10:30 AM','disabled' : false},
					{'time' : '10:30 AM - 11:00 AM','disabled' : false}
				] 
			},
			{ 
				'time' : '11:00 AM - 01:00 PM', 
				'start' : 11,
				'availableTimeSlot' : [
					{'time' : '11:00 AM - 11:30 AM','disabled' : false},
					{'time' : '11:30 AM - 12:00 PM','disabled' : false},
					{'time' : '12:00 PM - 12:30 PM','disabled' : false},
					{'time' : '12:30 AM - 01:00 PM','disabled' : false}
				] 
			},
			{ 
				'time' : '01:00 PM - 03:00 PM', 
				'start' : 13,
				'availableTimeSlot' : [
					{'time' : '01:00 PM - 01:30 PM','disabled' : false},
					{'time' : '01:30 PM - 02:00 PM','disabled' : false},
					{'time' : '02:00 PM - 02:30 PM','disabled' : false},
					{'time' : '02:30 PM - 03:00 PM','disabled' : false}
				] 
			},
			{ 
				'time' : '03:00 PM - 05:00 PM', 
				'start' : 15,
				'availableTimeSlot' : [
					{'time' : '03:00 PM - 03:30 PM','disabled' : false},
					{'time' : '03:30 PM - 04:00 PM','disabled' : false},
					{'time' : '04:00 PM - 04:30 PM','disabled' : false},
					{'time' : '04:30 PM - 05:00 PM','disabled' : false}
				] 
			},
			{ 
				'time' : '05:00 PM - 07:00 PM', 
				'start' : 17,
				'availableTimeSlot' : [
					{'time' : '05:00 PM - 05:30 PM','disabled' : false},
					{'time' : '05:30 PM - 06:00 PM','disabled' : false},
					{'time' : '06:00 PM - 06:30 PM','disabled' : false},
					{'time' : '06:30 PM - 07:00 PM','disabled' : false}
				] 
			}
		];
		let timeSlot = [];
		if(today.getDay() === startDate.getDay() && today.getMonth() === startDate.getMonth() && startDate.getFullYear() === today.getFullYear()){
			if(endDate.getHours() >= today.getHours() && startDate.getHours() <= today.getHours()){
				if(today.getHours() ===  startDate.getHours()){
					for(var i=0;i<=validTime.length-1;i++){
						if(today.getHours() == validTime[i].start){
							let minutes = today.getMinutes();
							let selectedSlot = validTime[i].availableTimeSlot;
							if(minutes == 0){
								timeSlot = validTime[i].availableTimeSlot;
							}
							if(minutes <= 30){
								timeSlot.push(selectedSlot[1]);
							}
							break
						}
					}
				}
				if(today.getHours() ===  (startDate.getHours() + 1)){
					for(var i=0;i<=validTime.length-1;i++){
						if(today.getHours() == (validTime[i].start + 1)){
							let minutes = today.getMinutes();
							let selectedSlot = validTime[i].availableTimeSlot;
							if(minutes == 0){
								timeSlot.push(validTime[i].availableTimeSlot[2]);
								timeSlot.push(validTime[i].availableTimeSlot[3]);
							}
							if(minutes <= 30){
								timeSlot.push(selectedSlot[3]);
							}
							break
						}
					}
				}
				// if(today.getHours() ===  endDate.getHours()){
					
				// }
			}else{
				for(var i=0;i<=validTime.length-1;i++){
					if(startDate.getHours() == validTime[i].start){
						timeSlot.push(validTime[i].availableTimeSlot);
						break;
					}
				}
			}
		}else{
			for(var i=0;i<=validTime.length-1;i++){
				if(startDate.getHours() == validTime[i].start){
					timeSlot.push(validTime[i].availableTimeSlot);
					break;
				}
			}
		}
		return timeSlot;
	}
	
	getStartDate(newDate,timeSlot){
		newDate = new Date(newDate);
		let firstSlot = timeSlot.substring(0,5);
		let firstSlotTimeZone = timeSlot.substring(6,8);
		let minutes = 0;
		let hours = 0;
		let time = [];
		if(firstSlotTimeZone === 'PM'){
			//let first = +(firstSlot.substring(0,2));
			time = firstSlot.split(':');
			hours = +time[0];
			minutes = +time[1];
			hours = hours + 12;
			//firstSlot = hours;
		}else{
			//firstSlot = +(firstSlot.substring(0,2));
			time = firstSlot.split(':');
			hours = +time[0];
			minutes = +time[1];
		}
		let startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), hours, minutes, 0, 0).toISOString();
		return startDate;
	}
	
	getEndDate(newDate,timeSlot){
		newDate = new Date(newDate);
		let lastSlot = timeSlot.substring(11,16);
		let lastSlotTimeZone = timeSlot.substring(17,19);
		let minutes = 0;
		let hours = 0;
		let time = [];
		if(lastSlotTimeZone === 'PM'){
			//let first = +(lastSlot.substring(0,2));
			time = lastSlot.split(':');
			hours = +time[0];
			minutes = +time[1];
			hours = hours + 12;
			// lastSlot = first;
		}else{
			//lastSlot = +(lastSlot.substring(0,2));
			time = lastSlot.split(':');
			hours = +time[0];
			minutes = +time[1];
		}
		let endDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), hours, minutes, 0, 0).toISOString();
		return endDate;
	}
	
	getMonday(d) {
		d = new Date(d);
		var day = d.getDay(),
		diff = d.getDate() - day + (day == 0 ? -6:1);
		return new Date(d.setDate(diff));
	}
	
	getSunday(d) {
		let end = new Date(d);
		end.setHours(23,59,59,999);
		var diff = end.getDate() + 6;
		return new Date(end.setDate(diff));
	}
	
	checkRange(monday,sunday,jobDate){
		let from1 = monday.getTime();  // -1 because months are from 0 to 11
		let to = sunday.getTime();
		let check = jobDate.getTime();

		return check >= from1 && check <= to;
	}
	
	getTimeDiff(dateTime){
		let today = new Date();
		dateTime = new Date(dateTime)
		let diffMs : number;
		diffMs = Math.abs(today.getTime() - dateTime.getTime());
		let diffDays = Math.floor(diffMs / 86400000); // days
		let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
		let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
		// print(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes until Christmas 2009 =)");
		let str = '';
		if(diffMins){
			str = diffMins + ' minutes ';
		}
		if(diffHrs){
			str = diffHrs + ' hours ' + str;
		}
		if(diffDays){
			str = diffDays + ' days ' + str;
		}
		str = str + 'ago';
		return str;
	}
	
	setCustomerData(data){
		//this.customerData = data;
		let myStorage = window.localStorage;
		if(myStorage.getItem('user')){
			myStorage.removeItem('user');
		}
		myStorage.setItem('user', JSON.stringify(data));
	}
	
	getUserCredentials(){
		this.authCred.tokenId = this.auth.getAccessTokenId() || '';
		this.authCred.userId = this.auth.getCurrentUserId() || '';
		this.authCred.realm = this.auth.getCurrentUserData() ? this.auth.getCurrentUserData().realm : '';
		return this.authCred;
	}
	
	setToken(token){
		this.token = token;
		console.log("token : ", this.token);
	}
	
	getToken(){
		return this.token;
	}

	setLoopbackAuth(data){
		let token : any = {};
		if(data.id){
			token.id = data.id;
			token.rememberMe = false;
			token.ttl = data.ttl;
			token.created = data.user.created;
		}
		token.userId = data.user.id;
		token.user = data.user;
		this.auth.setToken(token);
	}

	confirm(title, msg, $true, $false, code, id) { /*change*/
		const _self = this;
		var $content =  "<div class='dialog-ovelay'>" +
											"<div class='dialog'><header>" +
										 		" <h3> " + title + " </h3> " +
										 			"<i class='fa fa-close'></i>" +
								 				"</header>" +
								 			"<div class='dialog-msg'>" +
										 " <p> " + msg + " </p> " +
								 		"</div>" +
								 		"<footer>" +
										 	"<div class='controls'>" +
												" <button class='button button-danger doAction'>" + $true + "</button> " +
										 	"</div>" +
								 		"</footer>" +
									"</div>" +
								"</div>";
		// " <button class='button button-default cancelAction'>" + $false + "</button> " +
		$('body').prepend($content);
		$('.doAction').click(function () {
			$(this).parents('.dialog-ovelay').fadeOut(500, function () {
				$(this).remove();
			});
			_self.openSignUp();
		});
		$('.cancelAction, .fa-close').click(function () {
			$(this).parents('.dialog-ovelay').fadeOut(500, function () {
				$(this).remove();
				_self.closeJobModal();
			});
			// switch(code) {
			// 	case 1:
			// 		_self.openFixProblemSub.next({status: true, categoryId: id}); 
			// 		break;
			// 	case 2: 
			// 		_self.openPurchaseSub.next({status: true, categoryId: id});
			// 		break;
			// 	case 3:
			// 		_self.openBidSub.next({status: true, categoryId: id});
			// 		break;
			// 	case 4:
			// 		_self.openMaintananceSub.next({status: true, categoryId: id});
			// 		break;
			// 	case 5:
			// 		_self.openRentSub.next({status: true, categoryId: id});
			// 		break;
			// }
		});
	}

	confirm1(title, msg, $true, $false, code, id) { /*change*/
		const _self = this;
		var $content = 
			"<div class='dialog-ovelay'>" +
					"<div class='dialog'><header>" +
						" <h3> " + title + " </h3> " +
							"<i class='fa fa-close'></i>" +
						"</header>" +
					"<div class='dialog-msg'>" +
					" <p> " + msg + " </p> " +
				"</div>" +
				"<footer>" +
					"<div class='controls'>" +
						" <button class='button button-danger doAction1'>" + $true + "</button> " +
					"</div>" +
				"</footer>" +
			"</div>" +
		"</div>";
		// " <button class='button button-default cancelAction1'>" + $false + "</button> " +
		$('body').prepend($content);
		$('.doAction1').click(function () {
			$(this).parents('.dialog-ovelay').fadeOut(500, function () {
				$(this).remove();
			});
			_self.openSignUp();
		});
		$('.cancelAction1, .fa-close').click(function () {
			$(this).parents('.dialog-ovelay').fadeOut(500, function () {
				$(this).remove();
			});
		});
	}

	loginNow (loginObj) {
		let _self = this;
		return new Promise(resolve => 
			this.peopleApi.login(loginObj, 'user', false).toPromise().then(
				(success) => {
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
				_self.localStorageService.setValue('profileCompleted', 
					success.success.user.isProfileComplete);
				_self.localStorageService.setValue('peopleId', success.success.user.id);
				_self.localStorageService.setValue('user', JSON.stringify(success.success.user));
					return resolve(true)
				}
			).catch(error => { 
				this.errorToast(error.message, '');
				return resolve(false) 
			})
		);
	}
}