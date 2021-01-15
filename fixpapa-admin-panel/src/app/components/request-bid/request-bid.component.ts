import { Component, OnInit } from '@angular/core';
import { RequestbidApi, LoopBackConfig, LoopBackFilter } from './../../sdk';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-request-bid',
  templateUrl: './request-bid.component.html',
  styleUrls: ['./request-bid.component.css']
})
export class RequestBidComponent implements OnInit {
  
  bidRequests : Array<any> = [];  
  options : any = {
    limit : 10,
    page : 1,
    totalCount: 0
  }

  baseUrl:string;
  isLoading = false;
  constructor(private toastr: ToastrService, private requestBidApi:RequestbidApi) { 
    this.baseUrl = LoopBackConfig.getPath();
  }

  ngOnInit() {
  	this.getAllRequests();
  }

  getAllRequests(){
    let skip = (this.options.page-1) * this.options.limit;
    this.isLoading = true;
  	this.requestBidApi.getAllBidReq( skip,this.options.limit ).subscribe((requestData)=>{
  		this.bidRequests = requestData.success.data;
      this.options.totalCount = requestData.success.count;
      this.isLoading = false;
      console.log("bid request => ",this.bidRequests)
  	},(error)=>{
      this.isLoading = false;
      this.toastr.error(error.message);
  		// console.log(error);
  	})
  }

  changePage(){
    setTimeout(()=>{
      this.getAllRequests();
    },0)
  }

}
