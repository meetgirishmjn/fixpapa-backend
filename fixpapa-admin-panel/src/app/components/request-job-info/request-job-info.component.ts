import { Component, OnInit } from '@angular/core';
import { RequestjobApi, LoopBackConfig } from './../../sdk'
import {ActivatedRoute, Router} from "@angular/router";
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-request-job-info',
  templateUrl: './request-job-info.component.html',
  styleUrls: ['./request-job-info.component.css']
})
export class RequestJobInfoComponent implements OnInit {
  
  params  : any;		
  jobData : any = {};
  baseUrl : string = "";
  billingObj : any = {
    addPartCharges  : 0,
    probCharges     : 0,
    serviceCharges  : 0,
    discount        : 0,
    total           : 0

  };
  constructor(private toastr: ToastrService, private requestJobApi:RequestjobApi, private router : Router, private route: ActivatedRoute) { 
    this.baseUrl = LoopBackConfig.getPath();
  }

  ngOnInit() {
  	this.route.params.subscribe( params => {
  		this.params = params;
  		// console.log(this.params)
  	});

  	this.getJobInfo();
  }

  getJobInfo(){
  	this.requestJobApi.getJobById(this.params.jobId).subscribe((success)=>{
  		this.jobData = success.success.data;
      // this.billingObj = 
      console.log(this.jobData)
      this.calculateBill(this.jobData);
  		// console.log(this.jobData);
  	},(error)=>{
      this.toastr.error(error.message);
  		// console.log(error)
  	})
  }

  calculateBill(jobData){
    let self = this;
    self.billingObj.probCharges = jobData.totalPrice;
    self.billingObj.serviceCharges = jobData.bill.addServiceCost;
    self.billingObj.addPartCharges = 0;
    self.billingObj.discount = jobData.bill.discount || 0;
    jobData.bill.addPart.forEach(function(value){
      self.billingObj.addPartCharges += value.partCost; 
    })

    self.billingObj.total = self.billingObj.probCharges+self.billingObj.serviceCharges+self.billingObj.addPartCharges-self.billingObj.discount;
  }

}
