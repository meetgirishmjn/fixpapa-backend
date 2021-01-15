import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PeopleApi, LoopBackConfig } from './../../sdk/index';
import {ActivatedRoute, Router} from "@angular/router";
import { HttpHeaders } from '@angular/common/http';
declare const $: any;
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    user:any = { 
      password:"",
      conPassword:"" 
    };
    params:any = {};
    constructor(private router : Router, private route: ActivatedRoute, private peopleApi:PeopleApi, private toastr: ToastrService) { }

    ngOnInit() {
  		$.backstretch("assets/img/login-bg.jpg", { speed: 500 });
  		this.route.params.subscribe( params => {
	  		this.params = params;
	  		// console.log(this.params)
	  	});
    }

    resetPassword(resetForm){
    	// console.log(resetForm.valid)
    	if(resetForm.valid){
    		if(this.user.password == this.user.conPassword){
          console.log(this.user);
    			this.peopleApi.setPassword(this.user.password,this.customHeader.bind(this)).subscribe((success)=>{
    				console.log(success);
    				this.toastr.error("Password reset successfully");	
    			},(error)=>{
    				this.toastr.error(error.message);	
    			})
    		}else{
    			this.toastr.error("Password does not match");	
    		}
    	}
    }

    customHeader(abc:HttpHeaders){
      let headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',LoopBackConfig.getAuthPrefix() + this.params.token);
    	/*headers.append('Content-Type', 'application/json');
      console.log("this.params.token", LoopBackConfig.getAuthPrefix() + this.params.token)
    	headers.append('Authorization',LoopBackConfig.getAuthPrefix() + this.params.token)*/
      return headers;
    }

}
