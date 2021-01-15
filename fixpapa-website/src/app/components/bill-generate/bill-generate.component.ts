import { Component, OnInit, ViewChild } from '@angular/core';
import { PeopleApi,LoopBackConfig, RequestjobApi, RatingApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { HsnCodesComponent } from './../hsn-codes/hsn-codes.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SeoService } from './../../services/seo/seo.service';

declare var seoData:any;
declare var $ : any;
@Component({
	selector: 'app-bill-generate',
	templateUrl: './bill-generate.component.html',
	styleUrls: ['./bill-generate.component.css']
})
export class BillGenerateComponent implements OnInit {
	
	baseUrl : any;
	jobId : any;
	job : any = {};
	
	items : any = [];
	bill : any = {};
	hsnCodes : any = [];
	
	serCom : any;
	proCom : any;
	
	@ViewChild(HsnCodesComponent)
	private hsn : HsnCodesComponent;
	
	constructor(private seoService:SeoService, private _location : Location, private peopleApi : PeopleApi, private ratingApi : RatingApi, private route : ActivatedRoute, private requestjobApi : RequestjobApi, private globalFunctionService : GlobalFunctionService){
		
		this.seoService.generateTags(seoData.billPage);	
		this.route.params.subscribe( params =>{
				this.jobId = params.id;
				if(this.jobId){
					this.bill.requestjobId = this.jobId;
					this.getCommission();
					this.getJobById();
				}
			}	
		);
		this.baseUrl = LoopBackConfig.getPath();
		this.bill.items = this.items;
		this.bill.totalExclTaxAmount = 0;
		this.bill.totalTaxAmount = 0;
		// this.bill.totalTax = 0;
		this.bill.totalPricePerUnit = 0;
		this.bill.totalOfTotal = 0;
		this.bill.discount = 0;
		this.bill.totalIncAll = 0;
		this.bill.adminGst = '08BGNPS7159C1ZX';
		this.bill.vendorGst = '';
		this.bill.invoiceTo = 'G L Technovations 5F25, 5th Floor, Mahima Trinity Mall Swage Farm , Near New Sanganer Road, Jaipur 302019';
		this.bill.orderDate = '';
		this.bill.orderDueDate = '';
		this.bill.paymentMethod = '';
		this.bill.paymentId = '';
		this.bill.vendor = '';
		this.bill.adminInvoiceNo = '';
		this.bill.vendorInvoiceNo = '';
		this.bill.vendorId = '';
		this.bill.orderId = '';
		this.bill.generatedBy = 'vendor';
	}

	ngOnInit(){
	}
	
	processData(data){
		this.items = [];
		let l1 = data.problems.length;
		let l2 = data.bill.addPart.length;
		for(let i =0;i<=l1-1;i++){
			this.items.push({ 
				'index' : i+1,
				'description' : data.problems[i].probContent,
				'hsnCodes' : '',
				'category' : data.category.name,
				'qty' : 1,
				'pricePerUnit' : data.problems[i].price,
				'exclTaxAmount' : '',
				'taxAmount' : '',
				'cgst' : '',
				'sgst' : '',
				'tax'  : '',
				'total': ((100 - this.serCom)/100)*data.problems[i].price
			});
		}
		let start = l1;
		for(let i =0;i<=l2-1;i++){
			this.items.push({ 
				'index' : start,
				'description' : data.bill.addPart[i].partName + '(' + data.bill.addPart[i].partNumber + ')',
				'hsnCodes' : '',
				'category' : '',
				'qty' : 1,
				'pricePerUnit' : data.bill.addPart[i].partCost,
				'exclTaxAmount' : '',
				'taxAmount' : '',
				'cgst' : '',
				'sgst' : '',
				'tax'  : '',
				'total': ((100-this.proCom)/100)*data.bill.addPart[i].partCost
			});
			start = start + 1;
		}
		
		if(data.bill.addServiceCost){
			this.items.push({ 
				'index' : start,
				'description' : "Service Charge",
				'hsnCodes' : '',
				'category' : '',
				'qty' : 1,
				'pricePerUnit' : data.bill.addServiceCost,
				'exclTaxAmount' : '',
				'taxAmount' : '',
				'cgst' : '',
				'sgst' : '',
				'tax'  : '',
				'total': ((100 - this.serCom)/100)*data.bill.addServiceCost
			});
		}
		
		this.bill.items = this.items;
		
		this.bill.totalExclTaxAmount = 0;
		this.bill.totalTaxAmount = 0;
		// this.bill.totalTax = 0;
		for(let i=0;i<=this.bill.items.length - 1;i++){
			this.bill.totalPricePerUnit = this.bill.totalPricePerUnit + this.bill.items[i].pricePerUnit;
		}
		this.bill.totalPricePerUnit = this.bill.totalPricePerUnit.toFixed(2);
		for(let i=0;i<=this.bill.items.length - 1;i++){
			this.bill.totalOfTotal = this.bill.totalOfTotal + this.bill.items[i].total;
		}
		this.bill.totalOfTotal = this.bill.totalOfTotal.toFixed(2);
		this.bill.discount = this.job.bill.discount.toFixed(2);
		this.bill.totalIncAll = this.bill.totalOfTotal - this.bill.discount;
		this.bill.totalIncAll = this.bill.totalIncAll.toFixed(2);
		
		this.bill.vendorGst = data.vendor.gstNumber;
		this.bill.orderDate = data.createdAt;
		this.bill.orderDueDate = data.completeJob.dueDate;
		this.bill.paymentMethod = data.completeJob.modeOfPayment;
		this.bill.paymentId = data.bill.paymentId;
		this.bill.vendor = data.vendor.firmName;
		this.bill.adminInvoiceNo = data.completeJob.adminInvoiceId;
		this.bill.vendorInvoiceNo = data.completeJob.venInvoiceId;
		this.bill.vendorId = data.vendorId;
		this.bill.orderId = data.orderId;
	}
	
	updateRow(index,evt){
		console.log("tax : ", this.bill.items[index].tax);
		console.log("hsn : ", this.bill.items[index].hsnCodes);
		const percentage = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/i;
		if(percentage.test(evt)){
			console.log("matched : ", evt);
			if($('#tax'+(index+1)).hasClass('error-inp')){
				$('#tax'+(index+1)).removeClass('error-inp');
			}
			this.updateTax(evt,index);
		}else{
			console.log("not matched : ", evt);
			this.bill.items[index].tax = 0;
			if(!($('#tax'+(index+1)).hasClass('error-inp'))){
				$('#tax'+(index+1)).addClass('error-inp');
			}
			this.updateTax(0,index);
		}
	}
	
	updateTax(evt,index){
		this.bill.items[index].cgst = evt/2; 
		this.bill.items[index].sgst = evt/2;
		console.log("evt => ",evt);
		console.log("this.bill.items[index].total => ",this.bill.items[index].total)
		// this.bill.items[index].taxAmount = ((evt*(this.bill.items[index].total))/100).toFixed(2);
		 this.bill.items[index].exclTaxAmount = ((this.bill.items[index].total *100)/(100+parseInt(evt))).toFixed(2);
		// this.bill.items[index].taxAmount = this.bill.items[index].taxAmount.toFixed(2);
		this.bill.items[index].taxAmount = (this.bill.items[index].total - this.bill.items[index].exclTaxAmount).toFixed(2);
		this.checkTotal(evt,index);
	}
	
	checkTotal(evt,index){
		let totalExclTaxAmount = 0;
		for(let i = 0;i<=this.bill.items.length-1;i++){
			totalExclTaxAmount = totalExclTaxAmount + Number(this.bill.items[i].exclTaxAmount);
		}
		this.bill.totalExclTaxAmount = totalExclTaxAmount.toFixed(2);
		
		let totalTaxAmount = 0;
		for(let i = 0;i<=this.bill.items.length-1;i++){
			totalTaxAmount = totalTaxAmount + Number(this.bill.items[i].taxAmount);
		}
		this.bill.totalTaxAmount = totalTaxAmount.toFixed(2);
		
		// let totalTax = 0;
		
		// for(let i = 0;i<=this.bill.items.length-1;i++){
			// if($('#tax' + (i+1))[0].value)
				// totalTax = totalTax + Number($('#tax' + (i+1))[0].value);
		// }
		// this.bill.totalTax = totalTax.toFixed(2);
	}

	getJobById(){
		let _self = this;
		this.requestjobApi.getJobById(this.jobId).subscribe(
			(success)=>{
				console.log("success : ", success);
				_self.job = success.success.data;
				_self.processData(success.success.data);
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
	
	openNew(){
		this.hsn.openModal();
	}
	
	getCommission(){
		let _self = this;
		this.peopleApi.getCommission({}).subscribe(
			(success)=>{
				console.log("commission : ", success);
				_self.serCom = success.success.data.serviceCommission;
				_self.proCom = success.success.data.productCommission;
				_self.bill.serviceCommision = success.success.data.serviceCommission;
				_self.bill.productCommission = success.success.data.productCommission;
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ", error);
			}
		);
	}
	
	createBill(){
		let _self = this;
		console.log("bill : ", this.bill);
		let isHsn = true;
		let isTax = true;
		for(let i=0;i<=$('.hsn-cont').length-1;i++){
			if(!$('.hsn-cont')[i].value){
				isHsn = false;
				break;
			}
		}
		for(let i=0;i<=$('.tax-cont').length-1;i++){
			if(!$('.tax-cont')[i].value){
				isTax = false;
				break;
			}
		}
		
		if(isHsn && isTax){
			let isError = false;
			for(let i=0;i<=$('.tax-cont').length-1;i++){
				if($('.tax-cont').hasClass('error-inp')){
					isError = true;
					break;
				}
			}
			if(!isError){
				this.peopleApi.createBill(this.bill).subscribe(
					(success)=>{
						console.log("bill created : ", success);
						_self.globalFunctionService.successToast('Bill is generated','');
						_self._location.back();
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
		}else{
			this.globalFunctionService.errorToast('Please fill in all fields','');
		}
		/**/
	}
}
