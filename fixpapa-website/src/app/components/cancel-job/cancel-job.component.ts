import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PeopleApi,CategoryApi,LoopBackConfig,NewpurchaseApi, RequestjobApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';

declare var $:any;

@Component({
  selector: 'app-cancel-job',
  templateUrl: './cancel-job.component.html',
  styleUrls: ['./cancel-job.component.css']
})
export class CancelJobComponent implements OnInit {
	
	reason : any;
	cancelJobReason : any = [];
	comment : any;
	jobId : any;
	toShow : boolean = false
	otherReason : any;
	realm : any;
	disabled : boolean = false;
	
	@Output() jobCancelled = new EventEmitter();
	
	constructor(private globalFunctionService : GlobalFunctionService, private requestjobApi : RequestjobApi) {
	}

	ngOnInit() {
	}
	
	change(evt){
		console.log("evt : ", evt);
		if(evt === "Other (text box required maximum words 100 )"){
			this.toShow = true;
		}else{
			this.toShow = false;
		}
	}
	
	openModal(data){
		this.realm = data.realm;
		if(data.realm === 'vendor'){
			this.cancelJobReason = [
				"Engineer is not available or free on this time",
				"Mistakenly accepted the call",
				"Client location is too far or not good area to reach",
				"We don't have support for this problem",
				"Client is not good (blacklisted)",
				"Other (text box required maximum words 100 )"
			];
		}
		if(data.realm === 'customer'){
			this.cancelJobReason = [
				"I will do it later",
				"Need more information",
				"Job placed by mistake",
				"Just testing"
			];
		}
		
		this.reason = this.cancelJobReason[0];
		
		$('#cancel-job').modal({backdrop : 'static',keyboard : false});
		this.jobId = data.jobId;
	}
	
	closeModal(){
		$('#cancel-job').modal('hide');
		this.reason = '';
		this.otherReason = '';
		this.comment = '';
	}
	
	cancelJob(){
		this.disabled = true;
		let _self = this;
		let reason;
		if(this.toShow){
			reason = this.otherReason;
		}else{
			reason = this.reason;
		}
		// console.log('reason', reason);
		// console.log("job Id : ", this.jobId);
		this.requestjobApi.cancelJob(reason,this.comment,this.realm,this.jobId).subscribe(
			(success)=>{
				console.log("cancelled job : ", success);
				_self.disabled = false;
				_self.closeModal();
				_self.globalFunctionService.successToast('Job Cancelled','');
				_self.jobCancelled.emit();
			},
			(error)=>{
				_self.disabled = false;
				console.log("error : ", error);
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
			}
		);
	}

}
