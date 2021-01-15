import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'
import { LoopBackConfig, LoopBackAuth, PeopleApi } from './sdk/index';
import { ToastrService } from 'ngx-toastr';
import { NotificationComponent } from './components/notification/notification.component';
import { MessagingService } from './services/firebase-message/firebase-messaging.service';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
declare const $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

 	title = 'app';
	isLoginPage:boolean= true;
	activeUrl:string="";
	notiCount:number = 0;
	role : string = "";

	@ViewChild(NotificationComponent) 
	private notification : NotificationComponent;
	private messaging = firebase.messaging();
	private messageSource = new Subject();
    constructor(private auth:LoopBackAuth, private messagingService:MessagingService, private toastr: ToastrService, private peopleApi:PeopleApi, private router:Router){
		// LoopBackConfig.setBaseURL('http://139.59.71.150:3008');
		// LoopBackConfig.setBaseURL('http://localhost:3005');
		// LoopBackConfig.setBaseURL('https://fixpapa.com');
		LoopBackConfig.setBaseURL('https://api.fixpapa.com');
		LoopBackConfig.setApiVersion('api'); 

    } 

	ngOnInit() {
		this.messagingService.requestPermission();
		this.router.events.subscribe((evt) => {
			if (!(evt instanceof NavigationEnd)) {
				return;
			}
			// console.log(evt.url)
			this.activeUrl = evt.url;
			if(evt.url == "/" || evt.url.startsWith("/reset-password")){
				this.isLoginPage = true;
			}
			else{
				$(".backstretch").remove();
				this.role = (this.auth.getCurrentUserData()||{}).realm;
				// console.log("current user data => ",this.auth.getCurrentUserData().realm);
				this.isLoginPage = false
			}
		})	
		this.getMyInfo();
		this.checkNavBar();
		this.messaging.onMessage((payload) => {
			let payload1 : any = payload;
			// console.log('Message received. ', payload1);
			this.setNotiCount(payload.data.badge);
			if(this.notification){
				this.messageSource.next(payload);
				this.notification.getNewNotification();
			}
		});
	}	

	notyToggle(){
		this.notification.toggle();
	}	

	getMyInfo(){
		this.peopleApi.getMyInfo().subscribe((success)=>{
			this.notiCount = success.success.data.newNotification;	
			this.notification.setLen(this.notiCount || 0);	
		},(error)=>{

		})
	}

	setNotiCount(count){
		if(typeof count == 'string')
			count = parseInt(count);
		this.notiCount = count;
		console.log("count ----------> ",count)
	}

	checkNavBar(){
		var wSize = $(window).width();
        if (wSize <= 768) {
            $('#container').addClass('sidebar-close');
            $('#sidebar > ul').hide();
        }

        if (wSize > 768) {
            $('#container').removeClass('sidebar-close');
            $('#sidebar > ul').show();
        }
	}

	navBar(){
		if ($('#sidebar > ul').is(":visible") === true) {
            $('#main-content').css({
                'margin-left': '0px'
            });
            $('#sidebar').css({
                'margin-left': '-210px'
            });
            $('#sidebar > ul').hide();
            $("#container").addClass("sidebar-closed");
        } else {
            $('#main-content').css({
                'margin-left': '210px'
            });
            $('#sidebar > ul').show();
            $('#sidebar').css({
                'margin-left': '0'
            });
            $("#container").removeClass("sidebar-closed");
        }
	}
	
	navigate(url:string,params?:any){
		this.router.navigate([url]);
		this.checkNavBar()
	}

	logout(){
		this.peopleApi.logout().subscribe((success)=>{
			this.router.navigate(['/']);
		},(error)=>{
			if(error.statusCode == 401){
				this.router.navigate(['/']);
			}
		})
	}

	

}
