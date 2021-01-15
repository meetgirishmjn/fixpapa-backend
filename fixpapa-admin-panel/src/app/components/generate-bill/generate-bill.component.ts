import { Component, OnInit, ViewChild } from '@angular/core';
import { PeopleApi,LoopBackConfig, RequestjobApi } from './../../sdk/index';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HsnCodesComponent } from './../hsn-codes/hsn-codes.component';

declare var $ : any;
@Component({
	selector: 'app-bill-generate',
	templateUrl: './generate-bill.component.html',
	styleUrls: ['./generate-bill.component.css']
})
export class BillGenerateComponent implements OnInit {
	
	baseUrl : any;
	jobId : any;
	job : any = {};
	
	items : any = [];
	bill : any = {};
	hsnCodes : any = [];
	
	@ViewChild(HsnCodesComponent)
	private hsn : HsnCodesComponent;
	
	constructor(private toastr : ToastrService, private peopleApi : PeopleApi, private route : ActivatedRoute, private requestjobApi : RequestjobApi){
		this.route.params.subscribe( params =>{
				this.jobId = params.jobId;
				if(this.jobId){
					this.bill.requestjobId = this.jobId;
					this.getJobById();
				}
			}	
		);
		this.baseUrl = LoopBackConfig.getPath();
		this.bill.generatedBy = 'admin';
		this.bill.items = this.items;
		this.bill.totalExclTaxAmount = 0;
		this.bill.totalTaxAmount = 0;
		// this.bill.totalTax = 0;
		this.bill.totalPricePerUnit = 0;
		this.bill.totalOfTotal = 0;
		this.bill.discount = 0;
		this.bill.totalIncAll = 0;
		this.bill.adminGst = '08BGNPS7159C1ZX';
		this.bill.customerGst = '';
		this.bill.invoiceTo = '';
		this.bill.orderDate = '';
		this.bill.paymentMethod = '';
		this.bill.paymentId = '';
		this.bill.admin = 'G L Technovations';
		this.bill.adminInvoiceNo = '';
		this.bill.customerInvoiceNo = '';
		this.bill.orderId = '';
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
				'total': data.problems[i].price
			});
		}
		let start = l1+1;
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
				'total': data.bill.addPart[i].partCost
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
				'total': data.bill.addServiceCost
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
		
		this.bill.orderDate = data.completeJob.completedAt;
		this.bill.paymentMethod = data.completeJob.modeOfPayment;
		this.bill.paymentId = data.bill.paymentId;
		this.bill.adminInvoiceNo = data.completeJob.adminInvoiceId;
		this.bill.customerInvoiceNo = data.completeJob.custInvoiceId;
		this.bill.orderId = data.orderId;
		this.bill.invoiceTo = data.customer.fullName + ', ' + data.address.street + ', ' + data.address.value;
		this.bill.customerGst = data.customer.gstNumber;
		this.bill.admin = 'G L Technovations';
		this.bill.customerId = data.customer.id;
		this.bill.custEmail = data.customer.email;
		// console.log("email Id => ", this.bill.custEmail)
	}
	
	updateRow(index,evt){
		const percentage = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/i;
		if(percentage.test(evt)){
			if($('#tax'+(index+1)).hasClass('error-inp')){
				$('#tax'+(index+1)).removeClass('error-inp');
			}
			this.updateTax(evt,index);
		}else{
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
		// this.bill.items[index].taxAmount = ((evt*(this.bill.items[index].total))/100).toFixed(2);
		this.bill.items[index].exclTaxAmount = ((this.bill.items[index].total * 100)/(100+parseInt(evt))).toFixed(2);
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
				console.log("error : ", error);
			}
		);
	}
	
	openNew(){
		this.hsn.openModal();
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
						_self.toastr.success('Bill is generated','');
					},
					(error)=>{
						_self.toastr.error(error.message);
						console.log("error : ", error);
					}
				);
			}
		}else{
			_self.toastr.error('Please fill in all fields');
		}
		/**/
	}
}
