import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { PeopleApi,LoopBackConfig,RequestjobApi,TransactionApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { bankNameList } from './../../bank-name-list';

declare var $: any;

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
	loadingJob : boolean = true;
	job        : any = {};
	bill 	   : any = {};
	bankNames  : string[];
	
	chequeForm : FormGroup;
	bankName   : FormControl;
	chequeNo   : FormControl;
	chequeDate : FormControl;
	
	cheqDate   : any = '';
	focusBeforeDate : boolean = false;
	
	baseUrl : any;
	realm : any;
	
	@ViewChild('chequeDate') set content(content: ElementRef) {
		this.initializeDatepicker();
	}
	
	@Output() paymentDone = new EventEmitter();
	
	constructor(private router : Router, private transactionApi : TransactionApi, private globalFunctionService : GlobalFunctionService, private requestjobApi : RequestjobApi) { 
		this.bankNames = bankNameList;
		this.crtCheqForm();
		this.baseUrl = LoopBackConfig.getPath();
	}

	ngOnInit(){
	}
	
	crtCheqForm(){
		//console.log("called");
		this.bankName = new FormControl(this.bankNames[0],[
			Validators.required
		]);
		this.chequeNo = new FormControl('',[
			Validators.required
		]);
		this.chequeDate = new FormControl('',[
			Validators.required
		]);
		this.chequeForm = new FormGroup({
			bankName : this.bankName,
			chequeNo : this.chequeNo,
			chequeDate : this.chequeDate
		});
	}
	
	focusedBefore(){
		this.focusBeforeDate = true;
	}
	
	changedValue(){
		let cheqDate1 = $('#chequeDate')[0].value;
		if(!cheqDate1 && this.focusBeforeDate){
			this.cheqDate = '';
		}
	}
	
	initializeDatepicker(){
		var date_input = $('input[name="chequeDate"]'); 
		let _self = this;
	
		date_input.datepicker({
			format: 'dd/mm/yyyy',
			todayHighlight: true,
			autoclose: true,
			startDate : new Date()
		});
		
		date_input.datepicker().on('changeDate', function(ev){
			console.log("data : ", ev.date);
			//_self.toShowDate = ev.date;
			_self.cheqDate = $('#chequeDate')[0].value;
			_self.chequeForm.controls['chequeDate'].setValue(_self.cheqDate);
		});
	}
	
	openModal(data){
		$("#billModal").addClass("slideInRight");
		if(data.jobId){
			this.getJobById(data.jobId);
		}
		if(data.realm){
			this.realm = data.realm;
		}
	}
	
	closeModal(){
		this.bill = {};
		// this.job = {};
		this.chequeForm.reset();
		this.crtCheqForm();
		this.focusBeforeDate = false;
		this.cheqDate = '';
		$('#billModal').modal('hide');
	}
	
	getJobById(id){
		let _self = this;
		this.requestjobApi.getJobById(id).subscribe(
			(success)=>{
				if(success.success.data.bill.custSign){
					success.success.data.bill.custSign = _self.baseUrl + success.success.data.bill.custSign;
				}
				_self.job = success.success.data;
				console.log("job : ", success);
				_self.loadingJob = false;
				$('#billModal').modal({backdrop: 'static', keyboard: false});
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
	
	makePayment(mode,job){
		console.log(mode);
		let _self = this;
		if(mode === 'cash'){
			this.transactionApi.cashPayment(job.orderId).subscribe(
				(success)=>{
					console.log("payment success : ", success);
					_self.globalFunctionService.successToast('Thanks for making Payment','');
					_self.paymentDone.emit({jobId : success.success.data.JobId});
					_self.closeModal();
				},
				(error)=>{
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
		if(mode === 'cheque'){
			if(this.chequeForm.valid && job.orderId){
				// console.log(job.orderId, this.chequeForm.value.bankName, this.chequeForm.value.chequeNo, this.chequeForm.value.chequeDate);
				// _self.globalFunctionService.successToast('Thanks for making Payment','');
				// _self.paymentDone.emit({jobId : '5b597b59b21b910c7e4fc1a3'});
				// _self.closeModal();
				this.transactionApi.chequePayment(job.orderId,this.chequeForm.value.bankName, this.chequeForm.value.chequeNo, this.chequeForm.value.chequeDate).subscribe(
					(success)=>{
						console.log("payment recieived through cheque : ", success);
						_self.globalFunctionService.successToast('Thanks for making Payment','');
						_self.paymentDone.emit({jobId : success.success.data.JobId});
						_self.closeModal();
					},
					(error)=>{
						_self.closeModal();
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
			}else{
				this.chequeForm.controls['chequeNo'].markAsTouched();
				if(!this.cheqDate){
					this.focusBeforeDate = true;
				}
			}
		}
		if(mode === 'online'){
			let data = {
				MID : "FIXPAP29847308876050",
				ORDER_ID : job.orderId,
				CUST_ID : job.customer.id,
				INDUSTRY_TYPE_ID : "Retail109",
				CHANNEL_ID : "WEB",
				TXN_AMOUNT : job.bill.total,
				WEBSITE : "WEBPROD",
				MOBILE_NO : job.customer.mobile,
				EMAIL : job.customer.email,
				CALLBACK_URL : 'https://api.fixpapa.com/api/Transactions/paytmResponseUrl'
			};
			_self.router.navigate(['/pg-redirect',JSON.stringify(data)]);
		}
	}
}