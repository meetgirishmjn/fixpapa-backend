import { Component, OnInit, AfterViewInit, ViewChild, NgZone, ElementRef, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { PeopleApi,CategoryApi,LoopBackConfig, RequestamcApi, AMCApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { MultipartService } from './../../services/multipart/multipart.service';

import { validateAmount } from './../../validators/yearOfExp.validator'

declare var $:any;

@Component({
  selector: 'app-amc-request',
  templateUrl: './amc-request.component.html',
  styleUrls: ['./amc-request.component.css']
})
export class AmcRequestComponent implements OnInit {

	amcDetail  	: any = [];
	amcForm		: FormGroup;
	categoryId  : FormControl;
	noOfUnits   : FormControl;
	timePeriod	: FormControl;
	typeOfAmc	: FormControl;
	description : FormControl;
	estiBudget	: FormControl;
	address		: FormControl;
	amcId		: FormControl;
	
	types 		: any = [];
	amcArr		: any;
	
	loading		: boolean = false;
	emptyArr	: boolean = false;
	
	//amcDetail[{"categoryId":"","noOfUnits":""}],typeOfAmc,description,estiBudget(number),address(string),amcId
	
	constructor(private amcApi : AMCApi, private requestamcApi : RequestamcApi, private globalFunctionService : GlobalFunctionService) {
		this.types = ['Comprehensive','Non-comprehensive'];
	}

	ngOnInit() {
	}
	
	makeForm(){
		this.typeOfAmc	= new FormControl(this.types[0],[
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
		this.amcId = new FormControl(this.amcArr.id,[
			Validators.required
		]);
		
		this.amcForm = new FormGroup({
			description : this.description,
			estiBudget	: this.estiBudget,
			address		: this.address,
			amcId		: this.amcId,
			typeOfAmc 	: this.typeOfAmc
		});
		
		$('#amcModal').modal({backdrop : 'static', keyboard : false});
		//this.loading = false;
	}
	
	checkForCategory(index){
		if($('.option-container')[index].value !== 'No. Of Units'){
			let exist = false;
			for(var i=0;i<=this.amcDetail.length-1;i++){
				if($('.category-container')[index].value == this.amcDetail[i].categoryId){
					exist = true;
					this.amcDetail[i].noOfUnits = $('.option-container')[index].value;
					break;
				}
			}
			if(!exist){
				$('.category-container')[index].checked = true; 
				let obj = {"categoryId":$('.category-container')[index].value,"noOfUnits":$('.option-container')[index].value};
				this.amcDetail.push(obj);
			}
		}else{
			for(var i=0;i<=this.amcDetail.length-1;i++){
				if($('.category-container')[index].value == this.amcDetail[i].categoryId){
					this.amcDetail.splice(i,1);
					$('.category-container')[index].checked = false; 
					break;
				}
			}
			$('.option-container')[index].value = this.amcArr.noOfUnits[0];
		}
		// console.log("options-container : ", $('.option-container')[index].value);
		// console.log("service-container : ", $('.category-container')[index].value);
		// console.log("amc detail : ", this.amcDetail);
	}
	
	changeCategory(category,id,index,evt){
		if(evt.target.checked){
			this.emptyArr = false;
			if($('.option-container')[index].value === this.amcArr.noOfUnits[0]){
				$('.option-container')[index].value = this.amcArr.noOfUnits[1];
				let obj = {"categoryId":$('.category-container')[index].value,"noOfUnits":$('.option-container')[index].value};
				this.amcDetail.push(obj);
			}
		}else{
			for(var i=0;i<=this.amcDetail.length-1;i++){
				if($('.category-container')[index].value == this.amcDetail[i].categoryId){
					this.amcDetail.splice(i,1);
					break;
				}
			}
			$('.option-container')[index].value = this.amcArr.noOfUnits[0];
			if(this.amcDetail.length == 0){
				this.emptyArr = true;
			}
		}
		// console.log("options-container : ", $('.option-container')[index].value);
		// console.log("service-container : ", $('.category-container')[index].value);
		// console.log("amc detail : ", this.amcDetail);
	}
	
	closeModal(){
		this.amcForm.reset();
		$('#amcModal').modal('hide');
		this.amcDetail = [];
		var inputs=document.getElementsByTagName("input");
		for (var i in inputs)
			if (inputs[i].type=="checkbox") inputs[i].checked=false;
		
	}
	
	checkAmcReqForm(){
		if(this.amcForm.valid && this.amcDetail.length > 0){
			let obj1 = {'amcDetail' : this.amcDetail};
			let obj = Object.assign({},obj1,this.amcForm.value);
			obj.estiBudget = +obj.estiBudget;
			console.log("obj to send : ", obj);
			this.createPost(obj);
		}else{
			if(this.amcDetail.length == 0){
				this.emptyArr = true;
			}
			this.amcForm.controls['address'].markAsTouched();
		}
	}
	
	createPost(obj){
		let _self = this;
		this.requestamcApi.createAmc(obj.amcDetail,obj.typeOfAmc,obj.description,obj.estiBudget,obj.address,obj.amcId).subscribe(
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
	
	getAmcById(id){
		let _self = this;
		this.amcApi.getAmc(id).subscribe(
			(success)=>{
				console.log("amc data : ", success);
				success.success.data.noOfUnits.unshift('No. Of Units'); 
				_self.amcArr = success.success.data;
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
