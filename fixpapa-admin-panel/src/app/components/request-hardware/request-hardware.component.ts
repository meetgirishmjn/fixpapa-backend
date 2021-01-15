import { Component, OnInit } from '@angular/core';
import { RequestpurchaseApi, LoopBackConfig, LoopBackFilter } from './../../sdk';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-request-hardware',
  templateUrl: './request-hardware.component.html',
  styleUrls: ['./request-hardware.component.css']
})
export class RequestHardwareComponent implements OnInit {

  purchaseRequests : Array<any> = [];	
  options : any = {
    limit : 10,
    page : 1,
    totalCount: 0
  }

  baseUrl:string;
  isLoading = false;
  constructor(private toastr: ToastrService, private requestPurchaseApi:RequestpurchaseApi) { 
    this.baseUrl = LoopBackConfig.getPath();
  }

  ngOnInit() {
    this.getAllRequests();
  }


  getAllRequests(){
    let skip = (this.options.page-1) * this.options.limit;
    this.isLoading = true;
    this.requestPurchaseApi.getAllPurchases(skip,this.options.limit).subscribe((requestData)=>{
      this.purchaseRequests = requestData.success.data;
      console.log("purchase request",this.purchaseRequests);
      this.options.totalCount = requestData.success.count;
      this.isLoading = false;
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
