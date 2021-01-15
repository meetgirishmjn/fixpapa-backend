import { Component, OnInit } from '@angular/core';
import { RequestrentApi, LoopBackConfig, LoopBackFilter } from './../../sdk';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-request-rent',
  templateUrl: './request-rent.component.html',
  styleUrls: ['./request-rent.component.css']
})
export class RequestRentComponent implements OnInit {
  rentRequests : Array<any> = [];	
  options : any = {
    limit : 10,
    page : 1,
    totalCount: 0
  }

  baseUrl:string;
  isLoading = false;
  constructor(private toastr: ToastrService, private requestRentApi:RequestrentApi) { 
  	this.baseUrl = LoopBackConfig.getPath();
  }

  ngOnInit() {
  	this.getAllRents();
  }

  getAllRents(){
    let skip = (this.options.page-1) * this.options.limit;
    this.isLoading = true;
    this.requestRentApi.getAllRentReq(skip,this.options.limit).subscribe((requestData)=>{
      this.rentRequests = requestData.success.data;
      this.options.totalCount = requestData.success.count;
      this.isLoading = false;
      console.log("rent system ",requestData.success);
      // this.purchaseRequests = 
    },(error)=>{
      this.isLoading = false;
      this.toastr.error(error.message);
      // console.log(error);
    })
  }

  changePage(){
    setTimeout(()=>{
      this.getAllRents();
    },0)
  }

}
