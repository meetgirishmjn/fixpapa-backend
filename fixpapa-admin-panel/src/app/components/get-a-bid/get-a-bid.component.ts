import { Component, OnInit } from '@angular/core';
import { ServicesApi, BidApi ,LoopBackAuth, LoopBackConfig} from './../../sdk/index';
import { MultipartService } from '../../services/multipart/multipart.service';
import { ImageHeightWidthService } from '../../services/image-height-width/image-height-width.service';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-get-a-bid',
  templateUrl: './get-a-bid.component.html',
  styleUrls: ['./get-a-bid.component.css']
})
export class GetABidComponent implements OnInit {
  
    services: Array<any> = [];	
    selectedBid: any = {};
    selectedServices: Array<any> = [];
    errSuccBid:any = {
	    isError:false,
	    isSuccess:false,
	    succMsg:"",
	    errMsg:""
    } 
    files:any;
    allBids:Array<any> = [];
    baseUrl:string;
    imgSize:any = {
	  	height:500,
	  	width:500,
	  	isError:false,
	  	error:"noError"
    };
    isLoading = false;
    role:string = "";
    constructor(private auth:LoopBackAuth, private toastr: ToastrService, private imgHeightWidthApi:ImageHeightWidthService, private bidApi:BidApi, private servicesApi:ServicesApi, private multipartApi:MultipartService) { 
    	this.baseUrl = LoopBackConfig.getPath();
    }

    ngOnInit() {
    	this.role = this.auth.getCurrentUserData().realm;
	  	this.getAllBids();
	  	this.getServices();
    }


    openModal(bid?:any){
	    if(bid){
	    	this.selectedBid = JSON.parse(JSON.stringify(bid));
	    } 
		else{
			$("#bidForm")[0].reset();
		    this.selectedBid = {};
		}
		this.imgSize.error = "noError";
		this.imgSize.isError = false;
		this.selectedServices = this.selectedBid.services || [];
		this.selectedBid.noOfSystems = this.selectedBid.noOfSystems || [];
		this.selectedServices.map(a=>{
		    a.text = a.name;
		    return a;
		})

	    this.errSuccBid = {
	        isError:false,
	        isSuccess:false,
	        succMsg:"",
	        errMsg:""
	    }    

	    $("#bidModal").modal("show");
    }

    addBid(bidForm){
    
	    let servicesIds = this.selectedServices.map(a=>a.id);
		this.imgHeightWidthApi.checkHeightWidthEqual(this.files, this.imgSize.width, this.imgSize.height).then((error)=>{
	 		this.imgSize.error = error;
	 		if(this.imgSize.error === "sizeError"){
	 			this.imgSize.isError = true;
	 		}else{
	 			if(this.imgSize.error === "imgNotFound" && !this.selectedBid.image){
	 				this.imgSize.isError = true;
	 			}
	 		}

		    if(bidForm.valid && servicesIds.length && !this.imgSize.isError){
		      	this.selectedBid.servicesIds = servicesIds;
		     	let $btn = $('#bidBtn');
		      	$btn.button('loading');
		      	this.errSuccBid = {isError:false,isSuccess:false,succMsg:"",errMsg:""};

		      	let data = Object.assign({}, this.selectedBid);
		      	let params = {
		      		bidId:this.selectedBid.id
		      	}

		     	delete data.id;
		      	/*let addOrEditBid = this.selectedBid.id!= undefined ? this.multipartApi.editBidApi:this.multipartApi.addBidApi;
		      	addOrEditBid.bind(this)*/

		 	    if(!this.selectedBid.id){
			      	this.multipartApi.addBidApi({params:params,data:data,files:{image:this.files}}).subscribe((success:any)=>{
				        bidForm._submitted = false;
				        $btn.button('reset');
				        $("#bidModal").modal("hide");
				        this.toastr.success("Successfully added");
				        this.getAllBids();
				    },(error)=>{
				        // console.log("addError => ",error);
				        $btn.button('reset');
				        this.errSuccBid = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
				    })	
			    }else{
			      	this.multipartApi.editBidApi({params:params,data:data,files:{image:this.files}}).subscribe((success:any)=>{
				        bidForm._submitted = false;
				        $btn.button('reset');
				        this.toastr.success("Successfully edited");
				        $("#bidModal").modal("hide");
				        this.getAllBids();
				    },(error)=>{
				        $btn.button('reset');
				        this.errSuccBid = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
				    })
			    }
		    }
	    })	      
    }

    getAllBids(){
    	this.isLoading = true;
		this.bidApi.getAllBid().subscribe((success)=>{
	  		this.allBids = success.success.data;
	  		this.isLoading = false;
	      	// console.log("Bids=> ",this.allBids);
	  	},(error)=>{
	  		this.isLoading = false;
	  		this.toastr.error(error.message);
	  		// console.log(error);
	  	})
    }

    getServices(){
	  	this.servicesApi.getAllServices().subscribe((success)=>{
	  		this.services = success.success.data;
	  		// console.log("Services => ",this.services);
	  	},(error)=>{
	  		this.toastr.error(error.message);
	  		// console.log(error)
	  	})
    }

    openDelModal(bid){
	    this.selectedBid = JSON.parse(JSON.stringify(bid));
	    $("#deleteModal").modal("show");
    }

    deleteData(delData?:any){
	    let $btn = $('#delBtn');
	    $btn.button('loading');
	    this.bidApi.delete(this.selectedBid.id).subscribe((success)=>{
	      this.toastr.success("Successfully deleted");
	      $("#deleteModal").modal("hide");
	      this.getAllBids();
	      $btn.button('reset');
	    },(error)=>{
	      $btn.button('reset');
	      this.toastr.error(error.message);
	      // console.log(error);
	    })  
    }

    trackByIndex(index: number, value: number) {
      	return index;
    }

    public selectData(data:any):void {
  		this.selectedServices = data;
    }

}
