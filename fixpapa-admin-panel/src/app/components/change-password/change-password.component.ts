import { Component, OnInit } from '@angular/core';
import { PeopleApi, LoopBackAuth } from './../../sdk';
import { ToastrService } from 'ngx-toastr';
declare const $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  cpObj:any = {};	
  commissionData:any = {};
  role:string = "";
  constructor(private auth:LoopBackAuth, private toastr:ToastrService, private peopleApi:PeopleApi) { }

  ngOnInit() {
    this.role = (this.auth.getCurrentUserData()||{}).realm;
    this.getUser();
  }

  getUser(){
    this.peopleApi.getMyInfo().subscribe((success)=>{
      console.log("user data get my info api")
      this.commissionData.serviceCommission = success.success.data.serviceCommission;
      this.commissionData.productCommission = success.success.data.productCommission;
      console.log(success);
    },(error)=>{
      this.toastr.error(error.message);
      console.log(error);
    })
  }

  changePassword(cpPassForm) {
  	if(cpPassForm.valid){  
    	let $btn = $('#cpPassBtn');
    	$btn.button('loading');
	  	this.peopleApi.changePassword(this.cpObj.oldPassword,this.cpObj.newPassword).subscribe((success)=>{
	  		$btn.button('reset');
          	this.toastr.success("Successfully password changed");
	  		console.log(success);
	  	},(error)=>{
	  		$btn.button('reset');
	  		this.toastr.error(error.message);
	  		console.log(error);
	  	})
	  }  	
  }

  setCommission(comForm){

    if(comForm.valid){
      if(this.commissionData.serviceCommission >= 0  && this.commissionData.serviceCommission <=100 && this.commissionData.productCommission >=0 && this.commissionData.productCommission<= 100){
        this.peopleApi.setCommission(this.commissionData.serviceCommission, this.commissionData.productCommission).subscribe((success)=>{
          this.toastr.success("Successfully updated");
        },(error)=>{
          this.toastr.error(error.message);
          // console.log(error);
        })      
      }else{
        this.toastr.error("Invalid values")
      }
    }

  }

}
