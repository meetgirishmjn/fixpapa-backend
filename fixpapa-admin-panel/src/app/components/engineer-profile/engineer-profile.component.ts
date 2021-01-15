import { Component, OnInit } from '@angular/core';
import { PeopleApi, LoopBackConfig } from './../../sdk';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-engineer-profile',
  templateUrl: './engineer-profile.component.html',
  styleUrls: ['./engineer-profile.component.css']
})
export class EngineerProfileComponent implements OnInit {
    user:any = {};
    params:any = {};
    baseUrl:string="";	
    userDefaultImage:string = "assets/img/default-images/user-default.png";
    constructor(private toastr: ToastrService, private peopleApi:PeopleApi, private route:ActivatedRoute) { }

    ngOnInit() {
  		this.baseUrl = LoopBackConfig.getPath();
	  	this.route.params.subscribe((params)=>{
	  		this.params = params;
	  	})
	  	this.getUserInfo();
    }

   	getUserInfo(){
  		this.peopleApi.viewProfile(this.params.userId,"engineer").subscribe((success)=>{
  			this.user = success.success.data;
  			console.log(this.user)
  		},(error)=>{
  			this.toastr.error(error.message);
  		})	
  	}


}
