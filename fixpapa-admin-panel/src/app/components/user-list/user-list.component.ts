import { Component, OnInit, ViewChild } from '@angular/core';
import { PeopleApi ,LoopBackAuth,LoopBackConfig, LoopBackFilter} from './../../sdk/index';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
// import { DataTable, DataTableTranslations,DataTableResource } from 'angular-4-data-table';
declare const $: any;
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users:Array<any> = []; 
  // userCounts = 0;
  baseUrl:string;
  approvalValue:string;
  selectedUser:any = {};
  blockValue: boolean;
  params:any={};
  userDefaultImage:string = "assets/img/default-images/user-default.png";
  errSuccUser:any = {
    isError:false,
    isSuccess:false,
    succMsg:"",
    errMsg:""
  } 
  filter: LoopBackFilter= {};
  options:any = {
    statusList:["All","Approved","Pending","Blocked"],
    selectedStatus: {
      text:"All",
      id:"All"
    },
    searchStr:""
  }
  isLoading = false;

  skip: number = 0;
  limit: number = 10;
  page: number = 1;
  totalCount:number = 0;
/*  films = [];
  filmCount = 10;
  filmResource :any;*/
  // @ViewChild(DataTable) filmsTable;

  constructor(private toastr: ToastrService, private peopleApi:PeopleApi, private route : ActivatedRoute, private router:Router) { 
  	this.baseUrl = LoopBackConfig.getPath();
  }

  ngOnInit() { 
    this.filter.where = {};
    this.route.params.subscribe( params => {
      this.params = params;
      this.filter.where.realm = this.params.realm.substring(0,this.params.realm.length-1);
      this.initializeDropDown();  
      this.getAllUsers();      
    })
  }

  initializeDropDown(){
    this.options.searchStr = "";
    if(this.params.realm == "vendors")
      this.options.statusList = ["All","Approved","Pending","Rejected","Blocked"];
    else
      this.options.statusList = ["All","Blocked"];

    this.options.selectedStatus = "All";
  }

  getFilterObj(){
    delete this.filter.where.adminVerifiedStatus;
    delete this.filter.where.active;
    delete this.filter.where.fullName;
    console.log("text => ",this.options.selectedStatus.text )
    if(this.options.selectedStatus.text == "Approved"){
      this.filter.where.adminVerifiedStatus = 'approved';
    }else if(this.options.selectedStatus.text == "Pending"){
      this.filter.where.adminVerifiedStatus = 'pending';
    }else if(this.options.selectedStatus.text == "Rejected"){
      this.filter.where.adminVerifiedStatus = 'rejected';
    }else if(this.options.selectedStatus.text == "Blocked"){
      this.filter.where.active = false;
    }

    if(this.options.searchStr && this.options.searchStr !=""){
      this.filter.where.fullName = {like:this.options.searchStr,options:"i"};
    }

  }

  openAddressModal(user){
    this.selectedUser = user;
    $('#addressesModal').modal("show");
  }

  getAllUsers(){
    this.getFilterObj();
    // console.log(this.filter)
    this.isLoading = true;
    this.filter.skip = (this.page-1) * this.limit;
    this.filter.limit = this.limit;
  	this.peopleApi.getAllUsers(this.filter).subscribe((success)=>{
  		this.users = success.success.data;
      this.totalCount = success.success.count;
      console.log(success.success)
      this.isLoading = false;
  	},(error)=>{
      this.isLoading = false;
      this.toastr.error(error.message);
  		// console.log(error);
  	})
  }

  changePage(){
    setTimeout(()=>{
      this.getAllUsers();
    },0)
  }

  openApprovalModal(value,user){
  	this.approvalValue = value;
  	this.selectedUser = user;
  	$("#approveModal").modal("show");
  }

  adminApproval(appForm?:any){
  	let $btn = $('#approvalBtn');
    $btn.button('loading');
  	this.errSuccUser = { isError:false, isSuccess:false, succMsg:"", errMsg:"" };
  	this.peopleApi.adminApprove(this.selectedUser.id,this.approvalValue).subscribe((success)=>{
	    $btn.button('reset');
      this.toastr.success("Successfully "+this.approvalValue);
      $("#approveModal").modal("hide");
      this.getAllUsers();
  	},(error)=>{
		  $btn.button('reset');
      this.toastr.error(error.message);
      this.errSuccUser = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
  	})
  }

  openActInactModal(blockValue, user){
    console.log("block value",blockValue)
    this.blockValue = blockValue;
    this.selectedUser = user;  
    $("#blockModal").modal("show");
  }

  activeInactiveVendor(actInactForm){
    let $btn = $('#blockBtn');
    $btn.button('loading');
    this.peopleApi.activeInactiveVendor(this.selectedUser.id,this.blockValue).subscribe((success)=>{
      $btn.button('reset');
      let msg = "Successfully ";
      // console.log("value =",this.approvalValue);
      if(!this.blockValue){
        msg += "block";
      }else{
        msg += "unblock";
      }
      this.toastr.success(msg);
      $("#blockModal").modal("hide");
      this.getAllUsers();
    },(error)=>{
      $btn.button('reset');
      this.toastr.error(error.message);

    })      
  }

  selected(data){
    this.options.selectedStatus = data;
    console.log("selected data => ",data);
    this.getAllUsers();
  }



}
