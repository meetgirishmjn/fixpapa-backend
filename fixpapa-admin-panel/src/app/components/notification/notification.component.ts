import { Component, OnInit, Input,AfterViewInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { PeopleApi,LoopBackConfig,LoopBackAuth, RequestjobApi,NotificationApi } from './../../sdk/index';
import { ToastrService } from 'ngx-toastr';
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
	@Output() countSet = new EventEmitter();
	constructor(private auth : LoopBackAuth, private toastr : ToastrService, private router : Router, private peopleApi : PeopleApi, private notificationApi : NotificationApi) { }

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
		this.authCred.tokenId = this.auth.getAccessTokenId();
		this.authCred.userId = this.auth.getCurrentUserId();
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
				_self.toastr.error(error.message);
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
					this.countSet.emit(_self.len);
				},
				(error)=>{
					console.log("error : ", error);
					_self.toastr.error(error.message);
				}
			);
		}
	}

	setLen(count){
		this.len = count;
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
					_self.toastr.error(error.message);
				}
			);
		}
	}
}
