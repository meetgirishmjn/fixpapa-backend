import { Component, OnInit } from '@angular/core';
import { PeopleApi, RequestjobApi, LoopBackConfig, LoopBackFilter } from './../../sdk';
import { Router } from '@angular/router'
// import { DataTable, DataTableTranslations, DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-request-job',
  templateUrl: './request-job.component.html',
  styleUrls: ['./request-job.component.css']
})
export class RequestJobComponent implements OnInit {
  
  jobs : Array<any> = [];	
  dealerResource : any;
  dealerCount : any;
  baseUrl : string;
  selectedJob : any = {};
  assignVendorInfo : any = {};
  allVendors:Array<any> = [];
  options : any = {
    statusList:["All","Not Assigned","Assigned","Ongoing","Completed","Canceled","Dispute"],
    selectedStatus:{
      text:"All",
      id:"All"
    },
    searchBy:"Order Id",
    page:1,
    totalJobs:1,
    startDate:"",
    endDate:""
  };
  selectedStatus: string;
  filter: LoopBackFilter= {limit:10};
  vendorSearchStr:string = "";
  reInitJobData: any = {
    startValid:true,
    isSlotSelect:true,
    slotValue : {
      text:"Select",
      id:0
    },
    minDate:new Date()
  };
  minDateEE = new Date();
  reInitSlots = [{
    text:"09:00 AM - 11:00 AM",
    id : 9
  },{
    text:"11:00 AM - 01:00 PM",
    id : 11
  },{
    text:"1:00 PM - 03:00 PM",
    id : 13
  },{
    text:"3:00 PM - 05:00 PM",
    id : 15
  },{
    text:"05:00 PM - 07:00 PM",
    id : 17
  }]

  errSuccAssVen:any = {
    isError:false,
    isSuccess:false,
    succMsg:"",
    errMsg:""
  } 

  aggregate:Array<any> = [];
  isLoading = false;
  constructor(private toastr: ToastrService, private peopleApi:PeopleApi,private requestJobApi:RequestjobApi, private router:Router) { 
    this.baseUrl = LoopBackConfig.getPath();
    this.assignVendorInfo.id = "";
    this.reInitJobData.minDate = new Date();
    // console.log(this.reInitJobData)
  }

  ngOnInit() {
    this.filter.where = {};
    this.getVendors();
  	this.getJobs();
  }

  getJobs(){
    this.aggregate = [];
    // this.filter.order = "createdAt DESC";
    this.filterSetup();
    this.filterSetup2();

    if(this.selectedStatus == "Not Assigned"){
      this.aggregate.push({ 
        $sort : { 
          createdAt : -1
        } 
      })    
    }else if(this.selectedStatus == "All" || this.selectedStatus == undefined){
      
      this.aggregate.push({ 
        $sort : { 
          startDate : -1
        } 
      })
    }else if(this.selectedStatus == "Ongoing"){
      this.aggregate.push({ 
        $sort : { 
          startDate : 1
        } 
      })  
    }else if(this.selectedStatus == "Assigned"){
      this.aggregate.push({ 
        $sort : { 
          startDate : 1
        } 
      })  
    }else if(this.selectedStatus == "Canceled"){
      this.aggregate.push({ 
        $sort : { 
          "cancelJob.cancelledDate" : -1
        } 
      })  
    }else if(this.selectedStatus == "Dispute"){
      this.aggregate.push({ 
        $sort : { 
          "completeJob.completedAt" : -1
        } 
      })  
    }else if(this.selectedStatus == "Completed"){
      this.aggregate.push({ 
        $sort : { 
          "completeJob.completedAt" : -1
        } 
      })  
    }

    // console.log(this.aggregate);
    this.isLoading = true;
  	this.requestJobApi.getAllJobs(this.aggregate,this.filter.skip,this.filter.limit).subscribe((success)=>{
  		this.options.totalJobs = success.success.count;
      this.jobs = success.success.data;
      // console.log(this.jobs)
      this.isLoading = false;
      // console.log(this.jobs)
  	},(error)=>{
  		// console.log(error);
      this.isLoading = false;
      this.toastr.error(error.message);
  	})
  }

  reInitJobModel(jobInst){
    this.reInitJobData = {
      startValid:true,
      isSlotSelect:true,
      slotValue : {
        text:"Select",
        id:0
      },
      selectedJob:jobInst

    };
    $("#reInitJob").modal("show");
  }

  reInitJob(reInitJob?:any){

    if(!this.reInitJobData.startDate || this.reInitJobData.startDate == "")
      this.reInitJobData.startValid = false;
    else
      this.reInitJobData.startValid = true;

    if(this.reInitJobData.slotValue.id == 0)
      this.reInitJobData.isSlotSelect = false;
    else
      this.reInitJobData.isSlotSelect = true;

    if(!this.reInitJobData.isSlotSelect  || !this.reInitJobData.startValid)
      return;

    let requestjobId = this.reInitJobData.selectedJob.id;
    let startDate = new Date(this.reInitJobData.startDate);
    startDate.setHours(this.reInitJobData.slotValue.id,0,0,0);
    let endDate = new Date(this.reInitJobData.startDate);
    endDate.setHours(this.reInitJobData.slotValue.id+2,0,0,0);
    let $btn = $('#reInitJobBtn');
    $btn.button('loading');
    this.requestJobApi.reassignJob(requestjobId,startDate,endDate).subscribe((success)=>{
      // console.log(success);
      $btn.button('reset');
      $("#reInitJob").modal("hide");
      this.toastr.success("Successfully created");
      this.getJobs();
      this.openAssignModal(success.success.data);
      
    },(error)=>{
      this.toastr.error(error.message);
      $btn.button('reset');
    })
  }

  selectedSlot(data){
     this.reInitJobData.slotValue = data;
  }  

  afterDatePick(value, evt){
    if(value == "start"){
      if(typeof this.options.endDate == 'string' || this.options.endDate<this.options.startDate){
        this.options.endDate = "";
      }
    }else{
      if(typeof this.options.startDate == 'string' || this.options.endDate<this.options.startDate){
        this.options.startDate = "";
      }
    }
  }

  filterSetup(){

    let where:any = {};
    where.$and = [];
    this.filter.skip = (this.options.page-1) * this.filter.limit;
    if(typeof this.options.startDate == 'object' && typeof this.options.endDate == 'object'){
      this.options.startDate.setHours(0,0,0,0);
      this.options.endDate.setHours(23,59,59,999);
      where.$and.push({startDate : {$gt:this.options.startDate, $lt:this.options.endDate}});
    }

    if(this.filter.where.status){
       where.$and.push({status:this.filter.where.status}); 
    }

    if(!!this.options.searchStr && this.options.searchStr != '' ){
      if(this.options.searchBy == 'Order Id'){
        where.$and.push({orderId:{$regex : this.options.searchStr,$options:"i"}}); 
      }else{
        where.$and.push({"address.value":{$regex : this.options.searchStr,$options:"i"}}); 
      }
    }


    if(where.$and.length)
      this.aggregate.push({$match:where});

    // console.log(this.aggregate)
  }

  filterSetup2(){

    this.aggregate.push({
      $lookup:{
        from: "Category",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }  
    })

    this.aggregate.push({
      $unwind:
        {
          path: "$category",
          preserveNullAndEmptyArrays: true
        }
    })


    this.aggregate.push({
      $lookup:{
        from: "Products",
        localField: "productId",
        foreignField: "_id",
        as: "product"
      }  
    })

    this.aggregate.push({
      $unwind:
        {
          path: "$product",
          preserveNullAndEmptyArrays: true
        }
    })

    this.aggregate.push({
      $lookup:{
        from: "Brand",
        localField: "brandId",
        foreignField: "_id",
        as: "brand"
      }  
    })

    this.aggregate.push({
      $unwind:
        {
          path: "$brand",
          preserveNullAndEmptyArrays: true
        }
    })

    this.aggregate.push({
      $lookup:{
        from: "People",
        localField: "engineerId",
        foreignField: "_id",
        as: "engineer"
      }  
    })

    this.aggregate.push({
      $unwind:
        {
          path: "$engineer",
          preserveNullAndEmptyArrays: true
        }
    })    

    this.aggregate.push({
      $lookup:{
        from: "People",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendor"
      }  
    })

    this.aggregate.push({
      $unwind:
        {
          path: "$vendor",
          preserveNullAndEmptyArrays: true
        }
    })    

    this.aggregate.push({
      $lookup:{
        from: "People",
        localField: "customerId",
        foreignField: "_id",
        as: "customer"
      }  
    })

    this.aggregate.push({
      $unwind:
        {
          path: "$customer",
          preserveNullAndEmptyArrays: true
        }
    })    
  }


  relationSetup(){
     this.aggregate.push({

     }) 
  }

  changePage(){
    setTimeout(()=>{
      this.getJobs();
    },0)
  }

  navigate(url,params){
    this.router.navigate([url]);
  }

  getVendors(){
    this.peopleApi.getAllUsers({where:{realm:"vendor",isAvailable:true,active:true,adminVerifiedStatus:"approved"}}).subscribe((success)=>{
      this.allVendors = success.success.data;

    },(error)=>{
      this.toastr.error(error.message);
    })
  }

  selected(data){
     this.options.selectedStutus = data;
     this.getStatus(this.options.selectedStutus);
     this.getJobs();
  }

  getStatus(data){
    this.selectedStatus = data.text;
    if(data.text=="All"){
      this.filter.where.status = undefined;
    }else if(data.text=="Not Assigned"){
      this.filter.where.status = {$eq:"requested"};
    }else if(data.text=="Assigned"){
      this.filter.where.status = {$eq:"pending"};
    }else if(data.text=="Ongoing"){
      this.filter.where.status = {$in:["vendorAccepted","on the way","scheduled","inprocess","outForDelivery","billGenerated","paymentDone"]};
    }else if(data.text=="Completed"){
      this.filter.where.status = {$eq: "completed"}
    }else if(data.text=="Canceled"){
      this.filter.where.status = {$eq: "canceled"}
    }else if(data.text=="Dispute"){
      this.filter.where.status = {$eq: "indispute"}
    }
  }

  openAssignModal(jobInfo){
    this.vendorSearchStr = "";
    this.selectedJob = jobInfo;
    this.assignVendorInfo.id= ""; 
    this.peopleApi.getAllUsers({where:{realm:"vendor",isAvailable:true,active:true,adminVerifiedStatus:"approved"}}).subscribe((success)=>{
      this.allVendors = success.success.data;
      $("#VendorAssignModal").modal("show");
    },(error)=>{
      this.toastr.error(error.message);
    })
  }

  assignVendor(assignForm?:any){
    this.errSuccAssVen = {isError:false,isSuccess:false,succMsg:"",errMsg:""};
    let $btn = $('#assignBtn');
    $btn.button('loading');
    this.requestJobApi.vendorAssign(this.selectedJob.id,this.assignVendorInfo.id).subscribe((success)=>{
      // console.log(success);
      $btn.button('reset');
      this.toastr.success("Successfully assigned");
      if(success.success.data.oldJobId){
        this.router.navigate(["/job-request-info/"+success.success.data.id]);
      }else{
        this.getJobs();
      }

      
      $("#VendorAssignModal").modal("hide");
    },(error)=>{
      this.toastr.error(error.message);
      $btn.button('reset');
    })

  }

  sendMessage(job){
    // console.log(job);
    this.requestJobApi.sendMessage(job.id).subscribe((success)=>{
      this.toastr.success("Successfully sent message");
    },(error)=>{
      this.toastr.error(error.message);
    })
  }

  getExpetedFormat(){

  }


}
