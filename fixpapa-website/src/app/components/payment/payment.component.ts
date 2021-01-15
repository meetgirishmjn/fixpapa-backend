import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PeopleApi,RequestjobApi,LoopBackConfig,LoopBackAuth } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

	monthList					: any = [];
	yearList					: any = [];
	loadingPayments 			: boolean = true;
	payments   					: any = [];
	@Input() myId				: any;
	@Input() cashPay 			: any;
	@Input() chequePay			: any;
	@Input() onlinePay 			: any;
	
	filterForm 					: FormGroup;
	month	   					: FormControl;
	year	   					: FormControl;
	
	searchText : any = '';
	
	constructor(private globalFunctionService : GlobalFunctionService, private requestjobApi : RequestjobApi, private router : Router){ 
		this.getYears();
		this.monthList = [ {month : 'Select Month', value : -1 }, {month : 'January', value : 0 }, 
			{month : 'February', value : 1 }, {month : 'March', value : 2 }, {month : 'April', value : 3 },
			{month : 'May', value : 4 }, {month : 'June', value : 5 }, {month : 'July', value : 6 },
			{month : 'August', value : 7 }, {month : 'September', value : 8 },
			{month : 'October', value : 9 }, {month : 'November', value : 10 },
			{month : 'December', value : 11 } ];
	}

	ngOnInit(){		
		this.month = new FormControl(this.monthList[0].value,[]);
		this.year = new FormControl(this.yearList[0],[]);
		this.filterForm = new FormGroup({
			month : this.month,
			year  : this.year
		});
		this.filterList();
	}
	
	ngAfterViewInit(){
		console.log("payemnts : ", this.payments);
	}
  
	getYears(){
		this.yearList = [];
		let current = new Date().getFullYear();
		let range = 10;
		this.yearList.push('Select Year');
		for(var i=0;i<=range;i++){
			this.yearList.push(current+i);
		}
	}
	
	filterList(){
		if(this.filterForm.value.month === -1)
			this.filterForm.value.month = '';
		if(this.filterForm.value.year === 'Select Year')
			this.filterForm.value.year = '';
		//this.loadingPayments = true;
		this.getPayments(this.filterForm.value.month, this.filterForm.value.year);
	}
	
	navigateToBill(jobId){
		this.router.navigate(['bill',jobId]);
	}
	
	getPayments(month,year){
		let _self = this;
		this.payments = [];
		let cash = 0;
		let cheque = 0;
		let online = 0;
		this.requestjobApi.onGoingVendorJobs(this.myId).subscribe(
			(success)=>{
				if(success.success.data.length > 0){
					for(var i=0;i<=success.success.data.length-1;i++){
						if(success.success.data[i].status === 'completed'){
							let orderDate = new Date(success.success.data[i].completeJob.completedAt);
							let orderYear = orderDate.getFullYear();
							let orderMonth = orderDate.getMonth();
							if(month != '' && year != ''){
								if(orderYear == year && month == orderMonth)
									_self.payments.push(success.success.data[i]);
							}
							else if(month === '' && year === ''){
								_self.payments.push(success.success.data[i]);
							}else{
								if(month === ''){
									if(year == orderYear)
										_self.payments.push(success.success.data[i]);
								}
								if(year === ''){
									if(month == orderMonth)
										_self.payments.push(success.success.data[i]);
								}
							}
						}
					}
					if(_self.payments.length > 0){
						for(let i=0;i<=_self.payments.length-1;i++){
							if(_self.payments[i].completeJob.modeOfPayment === 'cash'){
								cash = cash + _self.payments[i].bill.total;
							}
							if(_self.payments[i].completeJob.modeOfPayment === 'cheque'){
								cheque = cheque + _self.payments[i].bill.total;
							}
							if(_self.payments[i].completeJob.modeOfPayment === 'online'){
								online = online + _self.payments[i].bill.total;
							}
						}
					}
				}
				setTimeout(()=>{
					_self.loadingPayments = false;
					_self.cashPay = cash;
					_self.chequePay = cheque;
					_self.onlinePay = online;
					console.log("completed jobs : ", _self.payments);	
				},0);
			},
			(error)=>{
				_self.loadingPayments = false;
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
