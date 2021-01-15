import { Component, OnInit } from '@angular/core';
import { PeopleApi, LoopBackConfig } from './../../sdk';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

	params:any = {};
	user:any = {};
	engineers:Array<any> = [];
	baseUrl:string;
	isLoadingEng:any = false;
	userDefaultImage:string = "assets/img/default-images/user-default.png";
	days:Array<string>= ["Sun","Mon","Tue", "Wed", "Thu", "Fri","Sat"];
    constructor(private toastr: ToastrService, private peopleApi:PeopleApi, private route:ActivatedRoute) { }

    ngOnInit() {
    	this.baseUrl = LoopBackConfig.getPath();
	  	this.route.params.subscribe((params)=>{
	  		this.params = params;
	  	})
	  	this.getUserInfo();
    }

    getDaysList(daysInNumber){
    	let self = this;
    	daysInNumber.sort(function(a, b){return a - b});
    	let str = "";
    	daysInNumber.forEach(function(value,index){
    		
    		str+= self.days[value];
    		if(index+1 < daysInNumber.length){
    			str += ", "; 
    		}
    	})
    	return str;
    }

    getServicesList(services){
    	let self = this;
    	let str = "";
    	services.forEach(function(value, index){
    		str+= value.name;
    		if(index+1 < services.length){
    			str += ", "; 
    		}
    	})
    	return str;
    }

    getProductList(products){
    	let self = this;
    	let str = "";
    	products.forEach(function(value, index){

    		str+= value.name;
    		if(index+1 < products.length){
    			str += ", "; 
    		}
    	})
    	return str;
    }

  	getUserInfo(){
  		this.peopleApi.viewProfile(this.params.userId,"vendor").subscribe((success)=>{
  			this.user = success.success.data;
  			this.getMyEngineers(this.user.id);
  			console.log(this.user);
  		},(error)=>{
  			this.toastr.error(error.message);
  		})	
  	}

  	getMyEngineers(vendorId){
  		this.isLoadingEng = true;
  		this.peopleApi.getEngineers(vendorId).subscribe((success)=>{
  			this.engineers = success.success.data;
  			this.isLoadingEng = false;
  		},(error)=>{
  			this.isLoadingEng = false;
  			this.toastr.error(error.message);
  		})
  	}
}
