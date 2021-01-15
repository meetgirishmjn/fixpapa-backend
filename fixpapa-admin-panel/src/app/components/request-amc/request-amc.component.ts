import { Component, OnInit, ViewChild  } from '@angular/core';
import { RequestamcApi, LoopBackConfig, LoopBackFilter } from './../../sdk';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-request-amc',
  templateUrl: './request-amc.component.html',
  styleUrls: ['./request-amc.component.css']
})
export class RequestAmcComponent implements OnInit {
	amcRequests : Array<any> = [];  
	options : any = {
	    limit : 10,
	    page : 1,
	    totalCount: 0
	}
	baseUrl:string;	
	isLoading = false;
    constructor(private toastr: ToastrService, private requestAmcApi:RequestamcApi) { 
    	this.baseUrl = LoopBackConfig.getPath();
    }

	ngOnInit() {
		this.getAllAmcRequest();
	}

	getAllAmcRequest(){
		let skip = (this.options.page-1) * this.options.limit;
		this.isLoading = true;
		this.requestAmcApi.getAllAmcReq().subscribe((requestData)=>{
			this.amcRequests = requestData.success.data;
      		this.options.totalCount = requestData.success.count;
      		this.isLoading = false;
			console.log(this.amcRequests);
		},(error)=>{
			this.isLoading = false;
			this.toastr.error(error.message);
			// console.log(error);
		})
	}

    changePage(){
	    setTimeout(()=>{
	      this.getAllAmcRequest();
	    },0)
    }


}
