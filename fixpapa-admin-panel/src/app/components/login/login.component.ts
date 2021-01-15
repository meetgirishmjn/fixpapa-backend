import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PeopleApi ,LoopBackAuth} from './../../sdk/index';
import { MessagingService } from './../../services/firebase-message/firebase-messaging.service';

declare const $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
}) 
export class LoginComponent implements OnInit {

	  user:any = { 
      realm    : "admin",
      email    : "",
      password : "" 
    };
    actionError:any = {
      isError:false,
      msg:""
    }
    actionResError:any = {
      isError:false,
      msg:"" 
    }
    resetEmail:string="";
    constructor(private messagingService:MessagingService, private auth:LoopBackAuth,private router:Router,private peopleApi:PeopleApi) { 
      
    }

    ngOnInit() {
      let authObj = this.auth.getCurrentUserData();
      if(authObj && authObj.realm=="admin" && (this.auth.getAccessTokenId()!=null || this.auth.getAccessTokenId()!='')){
        return this.router.navigate(['/products']);
      }

    	$.backstretch("assets/img/login-bg.jpg", { speed: 500 });
    }

    login(loginForm:any){
      let _self = this;
      if(loginForm.valid){
        this.actionError.isError = false;
        this.actionError.msg = "";
        let rememberMe = false;
        this.user.role = this.user.realm;
        // this.user.realm = "admin";
        this.user.firebaseToken = this.messagingService.activeToken;
        console.log(this.user);
        this.peopleApi.login(this.user,'user',rememberMe).subscribe((success)=>{
          console.log(success)
          this.router.navigate(['/products']);
        },(error)=>{
          this.actionError.isError = true;
          this.actionError.msg = error.message; 
        })      
      }   
    }

    openForgetpass(){
      this.actionResError.isError = false;
      this.actionResError.msg = "";
      this.resetEmail = "";
      $('#forgetModal').modal({backdrop: 'static', keyboard: false});
    }

    resetPassSubmit(resForm){
      this.actionResError.isError = false;
      this.actionResError.msg = "";
      if(resForm.valid){
        let btn = $("#resetBtn");  
        btn.button('loading');
        // $('#forgetModal').modal("hide");
        this.peopleApi.resetPassword({email:this.resetEmail}).subscribe((success)=>{
          $('#forgetModal').modal("hide");
          btn.button('reset');
        },(error)=>{
          btn.button('reset');
          this.actionResError.isError = true;
          this.actionResError.msg = error.message;
          
        })

      }
    }

}
