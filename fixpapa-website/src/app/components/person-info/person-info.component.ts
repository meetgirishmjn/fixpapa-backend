import { Component,OnInit } from '@angular/core';
import { PeopleApi,LoopBackConfig, RequestjobApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SeoService } from './../../services/seo/seo.service';

declare var seoData:any;
declare var $:any;

@Component({
  selector: 'app-person-info',
  templateUrl: './person-info.component.html',
  styleUrls: ['./person-info.component.css']
})
export class PersonInfoComponent implements OnInit {

	peopleId : string;
	realm : string;
	userInfo : any;
	baseUrl : string;
	jobs : Array<any> = [];
	loadingJobs : boolean = true;
	constructor(private seoService:SeoService, private requestjobsApi : RequestjobApi, private peopleApi : PeopleApi, private globalFunctionService : GlobalFunctionService, private router : Router, private route : ActivatedRoute) {
		this.baseUrl = LoopBackConfig.getPath();
		this.seoService.generateTags(seoData.profilePage);	
		let _self = this;
		this.route.params.subscribe( params => {
			_self.peopleId = params.id;
			_self.realm = params.realm;
			if(_self.peopleId && _self.realm){
				_self.viewProfile(_self.peopleId,_self.realm);
				_self.getPeopleJobs(_self.peopleId,_self.realm);
			}
		});
	}

	ngOnInit(){
	}
  
	viewProfile(id,realm){
		let _self = this;
		this.peopleApi.viewProfile(id,realm).subscribe(
			(success)=>{
				console.log("profile : ", success);
				if(success.success.data.image){
					success.success.data.image = _self.baseUrl + success.success.data.image;
				}
				else{
					success.success.data.image = 'assets/images/register_bg.jpg';
				}
				_self.userInfo = success.success.data;
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}
	
	getPeopleJobs(id,realm){
		let _self = this;
		this.requestjobsApi.getPeopleJobs(id,realm).subscribe(
			(success)=>{
				let jobs = [];
				for(var i=0;i<=success.success.data.length-1;i++){
					if(success.success.data[i].status === 'completed')
						jobs.push(success.success.data[i]);
				}
				_self.jobs = jobs;
				console.log("previous jobs : ", _self.jobs);
				_self.loadingJobs = false;
			},
			(error)=>{
				_self.loadingJobs = false;
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ",error);
			}
		);
	}
	
	checkCont(evt){
		console.log("evt : ", evt.target);
		let elem = evt.target.target;
		if($(elem) && $(elem)[0]){
			if($(elem)[0].style.display === 'block'){
				$(elem)[0].style.display  = 'none';
			}else{
				$(elem)[0].style.display = 'block';
			}
		}
	}
}
