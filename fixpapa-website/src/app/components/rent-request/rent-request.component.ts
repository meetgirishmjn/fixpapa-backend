import { Component, OnInit, AfterViewInit, ViewChild, NgZone, ElementRef, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { PeopleApi,CategoryApi,LoopBackConfig, RequestrentApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { MultipartService } from './../../services/multipart/multipart.service';

// import { validateEmail } from './../../validators/email.validator';
import { validateAmount } from './../../validators/yearOfExp.validator';

declare var $:any;

@Component({
  selector: 'app-rent-request',
  templateUrl: './rent-request.component.html',
  styleUrls: ['./rent-request.component.css']
})
export class RentRequestComponent implements OnInit {
	
	//rentDetail[{"categoryId":"","noOfUnits":"","timePeriod":""}],description,estiBudget(number),address(string)
	rentDetail 		: any = [];
	rentForm 		: FormGroup;
	description 	: FormControl;
	estiBudget		: FormControl;
	address			: FormControl;
	
	rentableArr		: any = [];
	noOfUnits		: any = [];
	timePeriod		: any = [];
	loading         : boolean = false;
	emptyArr : boolean = false;
	
	constructor(private categoryApi : CategoryApi,private requestrentApi : RequestrentApi, private globalFunctionService : GlobalFunctionService) {
		this.noOfUnits  = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
		this.timePeriod = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
	}

	ngOnInit() {
	}
	
	checkForUnits(index){
		console.log("index : ", index);
		if($('.option-container')[index].value != 0){
			let exist = false;
			this.emptyArr = false;
			for(var i=0;i<=this.rentDetail.length-1;i++){
				if($('.category-container')[index].value == this.rentDetail[i].categoryId){
					exist = true;
					this.rentDetail[i].noOfUnits = $('.option-container')[index].value;
					break;
				}
			}
			if(!exist){			
				$('.category-container')[index].checked = true; 
				$('.option-container1')[index].value = ($('.option-container1')[index].value != 0) ? $('.option-container1')[index].value : this.timePeriod[1];
				let obj = {"categoryId":$('.category-container')[index].value,"noOfUnits":$('.option-container')[index].value,"timePeriod" : $('.option-container1')[index].value};
				this.rentDetail.push(obj);
			}
		}else{
			$('.option-container')[index].value = this.noOfUnits[0];
			$('.option-container1')[index].value = this.timePeriod[0];
			for(var i=0;i<=this.rentDetail.length-1;i++){
				if($('.category-container')[index].value == this.rentDetail[i].categoryId){
					this.rentDetail.splice(i,1);
					$('.category-container')[index].checked = false; 
					break;
				}
			}
			if(this.rentDetail.length == 0){
				this.emptyArr = true;
			}
		}
		console.log("rentDetail : ", this.rentDetail);
	}
	
	checkForTime(index){
		if($('.option-container1')[index].value != 0){
			let exist = false;
			this.emptyArr = false;
			for(var i=0;i<=this.rentDetail.length-1;i++){
				if($('.category-container')[index].value == this.rentDetail[i].categoryId){
					exist = true;
					this.rentDetail[i].timePeriod = $('.option-container1')[index].value;
					break;
				}
			}
			if(!exist){			
				$('.category-container')[index].checked = true; 
				$('.option-container')[index].value = ($('.option-container')[index].value != 0) ? $('.option-container')[index].value : this.noOfUnits[1];
				let obj = {"categoryId":$('.category-container')[index].value,"noOfUnits":$('.option-container')[index].value,"timePeriod" : $('.option-container1')[index].value};
				this.rentDetail.push(obj);
			}
		}else{
			for(var i=0;i<=this.rentDetail.length-1;i++){
				if($('.category-container')[index].value == this.rentDetail[i].categoryId){
					this.rentDetail.splice(i,1);
					$('.category-container')[index].checked = false; 
					break;
				}
			}
			$('.option-container')[index].value = this.noOfUnits[0];
			$('.option-container1')[index].value = this.timePeriod[0];
			if(this.rentDetail.length == 0){
				this.emptyArr = true;
			}
		}
		console.log("rentDetail : ", this.rentDetail);
	}
	
	changeCategory(category,id,index,evt){
		console.log("index : ", index);
		console.log("option container : ", $('.option-container1')[index].value);
		if(evt.target.checked){
			this.emptyArr = false;
			$('.option-container')[index].value = ($('.option-container')[index].value != 0) ? $('.option-container')[index].value : this.noOfUnits[1];
			$('.option-container1')[index].value = ($('.option-container1')[index].value != 0) ? $('.option-container1')[index].value : this.timePeriod[1];
			let obj = {"categoryId":$('.category-container')[index].value,"noOfUnits":$('.option-container')[index].value,"timePeriod" : $('.option-container1')[index].value};
			this.rentDetail.push(obj);
		}else{
			for(var i=0;i<=this.rentDetail.length-1;i++){
				if($('.category-container')[index].value == this.rentDetail[i].categoryId){
					this.rentDetail.splice(i,1);
					break;
				}
			}
			$('.option-container')[index].value = this.noOfUnits[0];
			$('.option-container1')[index].value = this.timePeriod[0];
			if(this.rentDetail.length == 0){
				this.emptyArr = true;
			}
		}
		console.log("rentDetail : ", this.rentDetail);
	}
	
	makeForm(){
		this.description = new FormControl('',[]);
		this.estiBudget	= new FormControl('',[
			Validators.required,
			validateAmount
		]);
		this.address = new FormControl('',[
			Validators.required
		]);
		
		this.rentForm = new FormGroup({
			description 	: this.description,
			estiBudget		: this.estiBudget,
			address			: this.address
		});
		
		$('#rentModal').modal({backdrop : 'static',keyboard : false});
	}
	
	closeModal(){
		this.rentForm.reset();
		this.rentDetail = [];
		this.rentableArr = [];
		var inputs=document.getElementsByTagName("input");
		for (var i in inputs){
			if (inputs[i].type=="checkbox") inputs[i].checked=false;
		}
		$('#rentModal').modal('hide');
	}
	
	checkRentReqForm(){
		if(this.rentForm.valid && this.rentDetail.length > 0){
			let obj1 = {'rentDetail' : this.rentDetail};
			let obj = Object.assign({},obj1,this.rentForm.value);
			obj.estiBudget = +obj.estiBudget;
			console.log("obj to send : ", obj);
			this.createPost(obj);
		}else{
			if(this.rentDetail.length == 0){
				this.emptyArr = true;
			}
			this.rentForm.controls['address'].markAsTouched();
			this.rentForm.controls['estiBudget'].markAsTouched();
		}
	}
	
	createPost(obj){
		let _self = this;
		this.requestrentApi.createRentReq({},obj.rentDetail,obj.description,obj.estiBudget,obj.address).subscribe(
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

	getAllCategory(){
		let _self = this;
		this.categoryApi.getAllCategories({}).subscribe(
			(success)=>{
				for(var i=0;i<=success.success.data.length-1;i++){
					if(success.success.data[i].isAvailableForRent){
						_self.rentableArr.push(success.success.data[i]);
					}
				}
				console.log("rent data : ", _self.rentableArr);
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
