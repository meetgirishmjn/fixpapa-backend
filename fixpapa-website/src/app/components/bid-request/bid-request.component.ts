import { Component, OnInit, AfterViewInit, ViewChild, NgZone, ElementRef, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { PeopleApi,CategoryApi,LoopBackConfig, RequestbidApi, BidApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { validateAmount } from './../../validators/yearOfExp.validator';

declare var $:any;

@Component({
  selector: 'app-bid-request',
  templateUrl: './bid-request.component.html',
  styleUrls: ['./bid-request.component.css']
})
export class BidRequestComponent implements OnInit {
	
	// bidDetail[{"servicesId":"","noOfSystems":""}],description,startDate,endDate,estiBudget(number),address(string),bidId
	loading     : boolean = false;
	bidDetail	: any = [];
	bidArr 		: any = [];
	bidForm		: FormGroup;
	description : FormControl;
	startDate	: FormControl;
	endDate		: FormControl;
	estiBudget	: FormControl;
	address		: FormControl;
	bidId		: FormControl;
	
	invalidTime : boolean = false;
	focusBeforeStart : boolean = false;
	focusBeforeEnd 	 : boolean = false;
	
	startDate1 : any = '';
	endDate1   : any = '';
	
	emptyArr : boolean = false;
	
	@ViewChild('startDate') set content(content: ElementRef) {
		this.initializeDatepicker();
	}
	
	constructor(private bidApi : BidApi, private globalFunctionService : GlobalFunctionService, private requestbidApi : RequestbidApi) { }

	ngOnInit() {
		this.globalFunctionService.openBid$.subscribe(
			(data) => {
				if (data.status && data.categoryId) {
					this.getBidById(data.categoryId);
				}
			}
		)
	}
	
	makeForm(){
		this.startDate	= new FormControl('',[
			Validators.required
		]);
		this.endDate = new FormControl('',[
			Validators.required
		]);
		this.description = new FormControl('',[
		]);
		this.estiBudget	= new FormControl('',[
			validateAmount
		]);
		this.address = new FormControl('',[
			Validators.required
		]);
		this.bidId = new FormControl(this.bidArr.id,[
		]);
		
		this.bidForm = new FormGroup({
			description : this.description,
			startDate	: this.startDate,
			endDate		: this.endDate,
			estiBudget	: this.estiBudget,
			address		: this.address,
			bidId		: this.bidId
		});
		
		$('#bidModal').modal({backdrop : 'static', keyboard : false});
	}
	
	focusedBefore(value){
		if(value === 'start'){
			this.focusBeforeStart = true;
		}
		if(value === 'end'){
			this.focusBeforeEnd = true;
		}
	}
	
	changedValue(value){
		if(value === 'start'){
			let startDate = $('#startDate1')[0].value;
			if(!startDate && this.focusBeforeStart){
				this.startDate1 = '';
			}
		}
		if(value === 'end'){
			let endDate = $('#endDate1')[0].value;
			if(!endDate && this.focusBeforeEnd){
				this.endDate1 = '';
			}
		}
	}
	
	checkForService(index){
		if($('.option-container')[index].value !== 'No. Of Systems'){
			let exist = false;
			for(var i=0;i<=this.bidDetail.length-1;i++){
				if($('.service-container')[index].value == this.bidDetail[i].servicesId){
					exist = true;
					this.bidDetail[i].noOfSystems = $('.option-container')[index].value;
					break;
				}
			}
			if(!exist){			
				$('.service-container')[index].checked = true; 
				let obj = {"servicesId":$('.service-container')[index].value,"noOfSystems":$('.option-container')[index].value};
				this.bidDetail.push(obj);
			}
		}else{
			for(var i=0;i<=this.bidDetail.length-1;i++){
				if($('.service-container')[index].value == this.bidDetail[i].servicesId){
					this.bidDetail.splice(i,1);
					$('.service-container')[index].checked = false; 
					break;
				}
			}
			$('.option-container')[index].value = this.bidArr.noOfSystems[0];
		}
		// console.log("options-container : ", $('.option-container')[index].value);
		// console.log("service-container : ", $('.service-container')[index].value);
		// console.log("bid detail : ", this.bidDetail);
	}
	
	changeService(service,id,index,evt){
		if(evt.target.checked){
			this.emptyArr = false;
			if($('.option-container')[index].value === this.bidArr.noOfSystems[0]){
				$('.option-container')[index].value = this.bidArr.noOfSystems[1];
				let obj = {"servicesId":$('.service-container')[index].value,"noOfSystems":$('.option-container')[index].value};
				this.bidDetail.push(obj);
			}
		}else{
			for(var i=0;i<=this.bidDetail.length-1;i++){
				if($('.service-container')[index].value == this.bidDetail[i].servicesId){
					this.bidDetail.splice(i,1);
					break;
				}
			}
			$('.option-container')[index].value = this.bidArr.noOfSystems[0];
			if(this.bidDetail.length == 0){
				this.emptyArr = true;
			}
		}
		// console.log("bid detail : ", this.bidDetail);
		// console.log("options-container : ", $('.option-container')[index].value);
		// console.log("service-container : ", $('.service-container')[index].value);
	}
	
	initializeDatepicker(){
		var date_input = $('input[name="startDate"]'); 
		var date_input1 = $('input[name="endDate"]'); 
		let _self = this;
	
		date_input.datepicker({
			format: 'D d. M yyyy',
			todayHighlight: true,
			autoclose: true,
			startDate: new Date()
		});
		
		date_input1.datepicker({
			format: 'D d. M yyyy',
			todayHighlight: true,
			autoclose: true,
			startDate: new Date()
		});
		
		date_input.datepicker().on('changeDate', function (ev) {
			console.log("data : ", ev.date);
			_self.bidForm.controls['startDate'].setValue(ev.date);
			let startDate = new Date(ev.date);
			let endDate = new Date(_self.bidForm.value.endDate);
			if(endDate){
				if(endDate.getTime() < startDate.getTime()){
					_self.bidForm.controls['startDate'].setValue('');
					_self.invalidTime = true;
					_self.startDate1 = '';
				}else{
					_self.invalidTime = false;
					_self.startDate1 = startDate;
				}
			}
		});
		
		date_input1.datepicker().on('changeDate', function (ev) {
			console.log("data : ", ev.date);
			_self.bidForm.controls['endDate'].setValue(ev.date);
			let endDate = new Date(ev.date);
			let startDate = new Date(_self.bidForm.value.startDate);
			if(startDate){
				if(endDate.getTime() < startDate.getTime()){
					_self.bidForm.controls['endDate'].setValue('');
					_self.invalidTime = true;
					_self.endDate1 = '';
				}else{
					_self.invalidTime = false;
					_self.endDate1 = endDate;
				}
			}
		});
	}
	
	closeModal(){
		this.bidForm.reset();
		$('#bidModal').modal('hide');
		this.bidDetail = [];
		var inputs=document.getElementsByTagName("input");
		for (var i in inputs)
			if (inputs[i].type=="checkbox") inputs[i].checked=false;
	}
	
	checkBidReqForm(){
		if(this.bidForm.valid){
			if($('#startDate1')[0].value && $('#endDate1')[0].value && !this.emptyArr){
				let obj1 = {'bidDetail' : this.bidDetail};
				delete this.bidForm.value.servicesId;
				delete this.bidForm.value.noOfUnits;
				let startDate = new Date(this.bidForm.value.startDate);
				let endDate = new Date(this.bidForm.value.endDate);
				let startDate1 = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).toISOString();
				let endDate1 = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0, 0).toISOString();
				let obj2 = { 'startDate' : startDate1 };
				let obj3 = { 'endDate' : endDate1 };
				delete this.bidForm.value.startDate;
				delete this.bidForm.value.endDate;
				let obj = Object.assign({},obj1,this.bidForm.value,obj2,obj3);
				obj.estiBudget = +obj.estiBudget;
				console.log("obj to send : ", obj);
				this.createPost(obj);
			}else{
				if(this.bidDetail.length == 0){
					this.emptyArr = true;
				}
				if(!this.startDate1){
					this.focusBeforeStart = true;
				}
				if(!this.endDate1){
					this.focusBeforeEnd = true;
				}
			}
		}else{
			this.bidForm.controls['address'].markAsTouched();
		}
		if(this.bidDetail.length == 0){
			this.emptyArr = true;
		}
		if(!this.startDate1){
			this.focusBeforeStart = true;
		}
		if(!this.endDate1){
			this.focusBeforeEnd = true;
		}
	}
	
	createPost(obj){
		let _self = this;
		this.requestbidApi.createBid(obj.bidDetail,obj.description,obj.startDate,obj.endDate,obj.estiBudget,obj.address,obj.bidId).subscribe(
			(success)=>{
				console.log("success : ", success);
				_self.globalFunctionService.successToast("Job Posted Successfully","");
				_self.closeModal();
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ", error);
			}
		);
	}
	
	getBidById(id){
		let _self = this;
		this.bidApi.getBid(id).subscribe(
			(success)=>{
				console.log("Bid data : ", success);
				success.success.data.noOfSystems.unshift('No. Of Systems'); 
				_self.bidArr = success.success.data;
				_self.makeForm();
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ", error);
			}
		);
	}
}
