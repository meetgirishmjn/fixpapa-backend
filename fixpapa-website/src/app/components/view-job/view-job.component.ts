import { Component, OnInit, ViewChild } from '@angular/core';
import { PeopleApi,LoopBackConfig,RequestjobApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BillComponent } from '../bill/bill.component';
import { SeoService } from './../../services/seo/seo.service';

declare var seoData:any;
declare var $ : any;

@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css']
})
export class ViewJobComponent implements OnInit {

	jobId : string;
	job : any = {};
	baseUrl : string;
	loadingJob : boolean = true;
	realm : string;
	
	@ViewChild(BillComponent)
	private bill : BillComponent;
	
	constructor(private seoService:SeoService, private _location : Location, private peopleApi : PeopleApi, private requestjobApi : RequestjobApi,private route : ActivatedRoute, private globalFunctionService : GlobalFunctionService){
		let _self = this;
		this.baseUrl = LoopBackConfig.getPath();
		this.seoService.generateTags(seoData.jobPage);	
		this.route.params.subscribe( params => {
			_self.jobId = params.id;
			if(_self.jobId){
				_self.getMyInfo();
				_self.getJobById(_self.jobId);
			}
		});
	}
	
	ngOnInit(){
	}
	
	getBill(id){
		this.bill.openModal({'jobId' : id, 'realm' : this.realm});
	}
	
	getJobById(id){
		let _self = this;
		this.requestjobApi.getJobById(id).subscribe(
			(success)=>{
				console.log("job : ", success);
				if(success.success.data.pick && success.success.data.pick.custSign){
					success.success.data.pick.custSign = _self.baseUrl + success.success.data.pick.custSign;
				}
				if(success.success.data.engineer){
					if(success.success.data.engineer.image){
						success.success.data.engineer.image = _self.baseUrl + success.success.data.engineer.image;
					}else{
						success.success.data.engineer.image = 'assets/images/register_bg.jpg';
					}
				}
				if(success.success.data.customer){
					if(success.success.data.customer.image){
						success.success.data.customer.image = _self.baseUrl + success.success.data.customer.image;
					}else{
						success.success.data.customer.image = 'assets/images/register_bg.jpg';
					}
				}
				for(var i=0;i<=success.success.data.image.length-1;i++){
					success.success.data.image[i] = _self.baseUrl + success.success.data.image[i]; 
				}
				setTimeout(()=>{
					_self.job = success.success.data;
					_self.loadingJob = false;
				},1);
			},
			(error)=>{
				_self.loadingJob = false;
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					console.log('error : ', error);
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ", error);
			}
		);
	}
	
	zoomImage(evt){
		//console.log("event : ", evt);
		let elementId = evt.srcElement.id || evt.target.id;
		let modal = $('#' + elementId).siblings()[0];
		let modalImg = $('#'+$('#' + elementId).siblings()[0].id).children('#img01')[0];
		let caption = $('#'+$('#' + elementId).siblings()[0].id).children('#caption')[0];
		
		modal.style.display = "block";
		modalImg.src = evt.srcElement.src || evt.target.src;
		caption.innerHTML = evt.srcElement.alt || evt.target.alt;
	}
	
	closeModal(evt){
		//console.log("event : ", evt);
		let elementClass = evt.srcElement.classList[0] || evt.target.classList[0];
		$('.'+elementClass).parent().parent()[0].style.display = 'none';
	}
	
	getMyInfo(){
		let _self = this;
		_self.peopleApi.getMyInfo().subscribe(
			(success)=>{
				console.log("realm : ", success.success.data.realm);
				_self.realm = success.success.data.realm;
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
	
	vendorAcceptOrReject(jobId,status){
		let _self = this;
		this.requestjobApi.vendorAcceptorCancel(jobId,status).subscribe(
			(success)=>{
				console.log("vendorAcceptOrReject : ", success.success.data);
				if(success.success.data && success.success.data.status === 'vendorAccepted'){
					_self.globalFunctionService.successToast('Job accepted','Assign a Engineer for your job ASAP');
					_self._location.back();
				}else{
					_self.globalFunctionService.successToast('Job rejected','');
					_self._location.back();
				}
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
	
	productResponse(parts,jobId,_status){
		let _self = this;
		this.requestjobApi.partResponse(parts,jobId,_status).subscribe(
			(success)=>{
				console.log("part response : ", success.success.data);
				// if(success.success.data.bill.clientResponse === 'Done'){
					
				// }
				_self.globalFunctionService.successToast(success.success.data.bill.clientResponse,"");
				_self.job.bill.clientResponse = success.success.data.bill.clientResponse;
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
}