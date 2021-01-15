import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { RequestpurchaseApi,NewpurchaseApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { validateAmount } from './../../validators/yearOfExp.validator';

declare var $:any;

@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.css']
})
export class NewPurchaseComponent implements OnInit {

	newPurchaseReqForm : FormGroup;
	newpurchaseId : FormControl;
	productId : FormControl;
	brandId : FormControl;
	startDate : FormControl;
	startTime : FormControl;
	modelNumber : FormControl;
	noOfUnits : FormControl;
	configuration : FormControl;
	other : FormControl;
	priceBudget : FormControl;
	deliveryAdd : FormControl;
	modeOfPayment : FormControl;
	title		: FormControl;
	values : FormControl;
	
	startDate1 : any;
	startTime1 : any;
	product1   : any = '';
	
	noOfUnitsArr : any = [];
	modeOfPaymentArr : any = [];
	newPurchaseArr : any = [];
	productsData : any = [];
	brandsData : any = [];
	valuesArr : any = [];
	
	loading : boolean = false;
	noValue : boolean = false;
	
	focusBeforeDate : boolean = false;
	focusBeforeSelect : boolean = false;
	@ViewChild('startDate') set content(content: ElementRef){
		this.initializeDatepicker();
		this.initializeClockPicker();
	}
	
	constructor(private newpurchaseApi : NewpurchaseApi,private requestpurchaseApi : RequestpurchaseApi ,private globalFunctionService : GlobalFunctionService) {
		this.modeOfPaymentArr = ['Cash','Credit/Debit Card','Bank Transfer'];
		this.noOfUnitsArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
	}

	ngOnInit() {
		this.globalFunctionService.openPurchase$.subscribe(
			(data) => {
				if (data.status && data.categoryId) {
					this.getPurchaseById(data.categoryId);
				}
			}
		)
	}
	
	initializeClockPicker(){
		$('#startTime1').clockpicker({
			placement : 'top',
			align : 'left',
			donetext : 'Done',
			disableEntry : true,
			default : 0
		});

		let _self = this;
		$("#startTime1").on('change', function() {
			_self.newPurchaseReqForm.controls['startTime'].setValue(this.value);
		});
	}
	
	checkForBrandsAndValues(selectedProductId){
		let selectedProduct;
		for(var i=0;i<=this.productsData.length-1;i++){
			if(this.productsData[i].id === selectedProductId.value){
				selectedProduct = this.productsData[i];
				if(selectedProduct.brandIds && selectedProduct.brandIds.length > 0){
					this.brandsData = selectedProduct.brand;
					console.log("brands data : ", this.brandsData);
					this.newPurchaseReqForm.controls['brandId'].setValue(this.brandsData[0].id);
				}else{
					this.brandsData = [];
				}
				if(selectedProduct.values && selectedProduct.values.length > 0){
					this.valuesArr = selectedProduct.values;
					this.newPurchaseReqForm.controls['values'].setValue(this.valuesArr[0]);
				}else{
					this.valuesArr = [];
				}
				break;
			}
		}
	}
	
	makeForm(){
		this.newpurchaseId = new FormControl(this.newPurchaseArr.id,[
			Validators.required
		]);
		this.productId = new FormControl('',[
			Validators.required
		]);
		this.brandId  = new FormControl('',[
		]);
		this.modelNumber = new FormControl('',[
			Validators.required
		]);
		this.noOfUnits = new FormControl(this.noOfUnitsArr[0],[
			Validators.required
		]);
		this.configuration = new FormControl('',[
		]);
		this.other  = new FormControl('',[
		]);
		this.priceBudget = new FormControl('',[
			Validators.required,
			validateAmount
		]);
		this.deliveryAdd  = new FormControl('',[
			Validators.required
		]);
		this.modeOfPayment = new FormControl(this.modeOfPaymentArr[0],[
			Validators.required
		]);
		this.startDate = new FormControl('',[
			Validators.required
		]);
		this.startTime = new FormControl('',[
			Validators.required
		]);
		this.title = new FormControl('',[
			Validators.required
		]);
		this.values = new FormControl('',[
		]);
		
		this.newPurchaseReqForm = new FormGroup({
			newpurchaseId 	: this.newpurchaseId,
			productId		: this.productId,
			brandId			: this.brandId,
			modelNumber 	: this.modelNumber,
			noOfUnits 		: this.noOfUnits,
			configuration 	: this.configuration,
			other 			: this.other,
			priceBudget 	: this.priceBudget,
			deliveryAdd 	: this.deliveryAdd,
			modeOfPayment 	: this.modeOfPayment,
			startDate		: this.startDate,
			startTime		: this.startTime,
			title			: this.title,
			values			: this.values
		});
		
		if(this.newPurchaseArr.productsIds.length === 1 && (this.newPurchaseArr.name.trim().toUpperCase() === this.newPurchaseArr.products[0].name.trim().toUpperCase() )){
			this.productsData = [];
			this.newPurchaseReqForm.controls['productId'].setValue(this.newPurchaseArr.products[0].id);
			if(this.newPurchaseArr.products[0].brandIds.length === 1 && (this.newPurchaseArr.name.trim().toUpperCase() === this.newPurchaseArr.products[0].brand[0].name.trim().toUpperCase() )){
				this.brandsData = [];
				this.newPurchaseArr.controls['brandId'].setValue(this.newPurchaseArr.products[0].brand[0].id);
				this.loading = false;
			}else{
				this.brandsData = this.newPurchaseArr.products[0].brand;
				this.newPurchaseReqForm.controls['brandId'].setValue(this.brandsData[0].id);
				this.loading = false;
			}
			//if(this.newPurchaseArr.products[0].brandIds.length > 1){}
		}else{
			this.productsData = this.newPurchaseArr.products;
			//this.newPurchaseReqForm.controls['productId'].setValue(this.productsData[0].id);
			//this.checkForBrandsAndValues(this.productsData[0].id);
			this.loading = false;
		}
		$('#newPurchaseModal').modal({backdrop : 'static',keyboard : false});
	}
	
	closeModal(){
		this.newPurchaseReqForm.reset();
		this.newPurchaseReqForm.controls['noOfUnits'].setValue(this.noOfUnitsArr[0]);
		this.newPurchaseReqForm.controls['modeOfPayment'].setValue(this.modeOfPaymentArr[0]);
		this.startDate1 = '';
		this.productsData = [];
		this.brandsData = [];
		this.valuesArr = [];
		$('#newPurchaseModal').modal('hide');
	}
	
	initializeDatepicker(){
		var date_input = $('#startDate1'); 
		let _self = this;
	
		date_input.datepicker({
			format: 'D d. M yyyy',
			todayHighlight: true,
			autoclose: true,
			startDate: '+1d'
		});
		
		date_input.datepicker().on('changeDate', function (ev) {
			//console.log("called");
			//console.log("data : ", ev.date);
			_self.startDate1 = $('#startDate1')[0].value;
			_self.newPurchaseReqForm.controls['startDate'].setValue(_self.startDate1);
		});
	}
	
	focusedBefore(value){
		if(value === 'date'){
			this.focusBeforeDate = true;
		}
		if(value === 'select'){
			this.focusBeforeSelect = true;
		}
	}
	
	changedValue(value){
		if(value === 'date'){
			let startDate = $('#startDate1')[0].value;
			if(!startDate && this.focusBeforeDate){
				this.startDate1 = '';
			}else{
				this.startDate1 = startDate;
			}
		}
		if(value === 'select'){
			console.log("this.newPurchaseReqForm.value.productId : ",this.newPurchaseReqForm.value.productId);
			if(!this.newPurchaseReqForm.value.productId && this.focusBeforeSelect){
				this.product1 = '';
			}else{
				this.product1 = this.newPurchaseReqForm.value.productId;
			}
		}
	}
	
	checkPurchaseReqForm(){
		if(this.newPurchaseReqForm.valid){
			let data = this.newPurchaseReqForm.value.values.split() || [];
			let newDate = new Date(this.newPurchaseReqForm.value.startDate);
			let first = this.newPurchaseReqForm.value.startTime.substring(0,2);
			let second = this.newPurchaseReqForm.value.startTime.substring(3,5);
			let purchaseDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), first, second, 0, 0).toISOString();
			let obj1 = { 'values' : data };
			let obj2 = { 'purchaseDate' :  purchaseDate};
			delete this.newPurchaseReqForm.value.startDate;
			delete this.newPurchaseReqForm.value.startTime;
			delete this.newPurchaseReqForm.value.values;
			let obj = Object.assign({},this.newPurchaseReqForm.value,obj1,obj2);
			obj.priceBudget = +obj.priceBudget;
			obj.noOfUnits = +obj.noOfUnits;
			console.log("object to send : ", obj);
			this.createPost(obj);
		}else{
			if(!this.product1){
				this.focusBeforeSelect = true;
			}
			if(!this.startDate1){
				this.focusBeforeDate = true;
			}
			this.newPurchaseReqForm.controls['modelNumber'].markAsTouched();
			this.newPurchaseReqForm.controls['priceBudget'].markAsTouched();
			this.newPurchaseReqForm.controls['deliveryAdd'].markAsTouched();
			this.newPurchaseReqForm.controls['title'].markAsTouched();
			this.newPurchaseReqForm.controls['startTime'].markAsTouched();
			if(this.productsData.length > 0){
				this.newPurchaseReqForm.controls['productId'].markAsTouched();
			}
			if(this.brandsData.length > 0){
				this.newPurchaseReqForm.controls['brandId'].markAsTouched();
			}
			if(this.valuesArr.length > 0){
				this.newPurchaseReqForm.controls['values'].markAsTouched();
			}
			//this.newPurchaseReqForm.controls['startDate'].markAsTouched();
		}
	}
	
	createPost(data){
		let _self = this;
		this.requestpurchaseApi.createPurchase(data.newpurchaseId,data.productId,data.brandId,data.values,data.title,
			data.purchaseDate,data.modelNumber,data.noOfUnits,data.configuration,
			data.other,data.priceBudget,data.deliveryAdd,data.modeOfPayment).subscribe(
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
	
	getPurchaseById(id){
		let _self = this;
		this.newpurchaseApi.getPurchase(id).subscribe(
			(success)=>{
				console.log("purchase data : ", success);
				_self.newPurchaseArr = success.success.data;
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
