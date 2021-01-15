import { Component, OnInit } from '@angular/core';
import { ServicesApi,LoopBackAuth} from './../../sdk/index';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

	selectedService:any = {};
	errSuccService :any = {
  		isError:false,
  		isSuccess:false,
  		succMsg:"",
  		errMsg:""
  	}
  	services:Array<any> = [];
  	isLoading = false;
    constructor(private toastr: ToastrService, private servicesApi:ServicesApi) { }

	ngOnInit() {
		this.getAllServices();
  	}

  	openServiceModal(service?:any){
  		
	  	if(service) 
	  		this.selectedService = Object.assign({}, service);
	  	else{
	  		$("#serviceForm")[0].reset();
	  		this.selectedService = {};
	  	}

	  	this.errSuccService = {
	  		isError:false,
	  		isSuccess:false,
	  		succMsg:"",
	  		errMsg:""
	  	}
  		$("#serviceModal").modal("show");
  	}

  	addService(serviceForm){
		if(serviceForm.valid){
	  		let $btn = $('#serviceBtn');
	  		$btn.button('loading');
	  		this.errSuccService = {isError:false,isSuccess:false,succMsg:"",errMsg:""};
	  		if(!this.selectedService.id){
	  			this.servicesApi.addService(
			        this.selectedService.name
			    ).subscribe((success)=>{
			    	serviceForm._submitted = false;
			    	$btn.button('reset');
			    	$("#serviceModal").modal("hide");
			    	this.toastr.success("Successfully added");
			     	this.getAllServices();
			    },(error)=>{
			    	$btn.button('reset');
			    	// console.log(error)
			    	this.errSuccService = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
			    })		
	  		}else{
	  			this.servicesApi.editService(
			        this.selectedService.name,
			        this.selectedService.id
			    ).subscribe((success)=>{
			    	serviceForm._submitted = false;
			    	$btn.button('reset');
			    	$("#serviceModal").modal("hide");
			    	this.toastr.success("Successfully edited");
			     	this.getAllServices();
			    },(error)=>{
			    	$btn.button('reset');
			    	// console.log(error)
			    	this.errSuccService = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
			    })		
	  		}
		  	
	  	}
  	}

  	getAllServices(){
  		this.isLoading = true;
  		this.servicesApi.getAllServices().subscribe((success)=>{
  			// console.log(success);
  			this.services = success.success.data;
  			this.isLoading = false;
  		},(error)=>{
  			this.toastr.error(error.message);
  			this.isLoading = false;
  			// console.log(error)
  		})
  	}

}
