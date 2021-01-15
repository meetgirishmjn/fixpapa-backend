import { Component, OnInit, Input,AfterViewInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { PeopleApi,LoopBackConfig, RequestjobApi,NotificationApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { Router } from '@angular/router';

declare var $:any;
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
	
	len : any;
	notification : any;
	loadingNotifications : boolean = true;
	authCred : any = {};
	@Output() openPayment = new EventEmitter();
	
	constructor(private router : Router, private peopleApi : PeopleApi, private notificationApi : NotificationApi, private globalFunctionService : GlobalFunctionService) { }

	ngOnInit(){
		this.getUserCredentials();
		this.checkNotification();
	}
	
	ngAfterViewInit(){
		$('#notifications').niceScroll({
			cursorcolor:'#06386b',
			cursorborder:'1px solid #06386b',
			cursorheight:'70px'
		});
	}
	
	ngOnDestroy(){
	}
	
	getUserCredentials(){
		this.authCred = this.globalFunctionService.getUserCredentials();
	}
	
	checkNotification(){
		let _self = this;
		this.notificationApi.getNotifications().subscribe(
			(success)=>{
				console.log("notification : ", success);
				setTimeout(()=>{
					_self.notification = success.success.data;
					_self.loadingNotifications = false;
				},1);
			},
			(error)=>{
				_self.loadingNotifications = false;
				console.log("error : ", error);
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}
				else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,"oops!!!");
				}
			}
		);
	}
	
	toggle(){
		$('#notifications').slideToggle("slow");
		this.checkNotification();
		let _self = this;
		if(this.len > 0){
			this.notificationApi.readAllNoty().subscribe(
				(success)=>{
					console.log("newNotification : ", success.success.data.newNotification);
					_self.len = success.success.data.newNotification;
				},
				(error)=>{
					console.log("error : ", error);
					if(error === 'Server error'){
						_self.globalFunctionService.navigateToError('server');
					}
					else if(error.statusCode === 401){
						_self.globalFunctionService.navigateToError('401');
					}else{
						_self.globalFunctionService.errorToast(error.message,"oops!!!");
					}
				}
			);
		}
	}
	
	getNewNotification(){
		let _self = this;
		if(this.authCred.tokenId){
			this.peopleApi.getMyInfo().subscribe(
				(success:any)=>{
					_self.len = success.success.data.newNotification;
				},
				(error)=>{
					console.log("error : ", error);
					if(error === 'Server error'){
						_self.globalFunctionService.navigateToError('server');
					}
					else if(error.statusCode === 401){
						_self.globalFunctionService.navigateToError('401');
					}else{
						_self.globalFunctionService.errorToast(error.message,"oops!!!");
					}
				}
			);
		}
	}
	
	navigateTo(jobId){
		this.router.navigate(['job',jobId]);
	}
	
	navToDash(){
		this.router.navigate(['dashboard']);
	}
}
