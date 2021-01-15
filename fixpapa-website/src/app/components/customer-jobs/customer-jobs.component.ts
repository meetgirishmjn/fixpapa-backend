import { Component, OnInit, AfterViewInit, ViewChild, NgZone, ElementRef,EventEmitter,Output } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { PeopleApi,CategoryApi,LoopBackConfig,NewpurchaseApi, RequestjobApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';

@Component({
  selector: 'app-customer-jobs',
  templateUrl: './customer-jobs.component.html',
  styleUrls: ['./customer-jobs.component.css']
})
export class CustomerJobsComponent implements OnInit {
	
	loadingJobs : boolean = false;
	myJobs : any = [];
	constructor(private requestjobApi : RequestjobApi,private globalFunctionService : GlobalFunctionService) { }

	ngOnInit() {
	}
	
	getCustomerJobs(data){
		let _self = this;
		this.myJobs = [];
		this.requestjobApi.custAllJobs({}).subscribe(
			(success)=>{
				console.log("customer Jobs : ", success);
				for(var i=0;i<=success.success.data.length-1;i++){
					if(data.type === 'pending' && success.success.data.status !== 'canceled' && success.success.data.status !== 'completed'){
						_self.myJobs.push(success.success.data[i]);
					}
					if(data.type === 'onGoing' && (success.success.data.status === 'vendorAccepted' || success.success.data.status === 'on the way' || success.success.data.status === 'scheduled' || success.success.data.status === 'inprocess' || success.success.data.status === 'billGenerated' || success.success.data.status === 'paymentDone')){
						_self.myJobs.push(success.success.data[i]);
					}
					if(data.type === 'closed' && (success.success.data.status === 'canceled' || success.success.data.status === 'completed')){
						_self.myJobs.push(success.success.data[i]);
					}
				}
				
				setTimeout(()=>{
					_self.loadingJobs = false;
				},1);
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

}
