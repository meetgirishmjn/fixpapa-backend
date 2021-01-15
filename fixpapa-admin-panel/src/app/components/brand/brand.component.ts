import { Component, OnInit } from '@angular/core';
import { BrandApi ,LoopBackAuth} from './../../sdk/index';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {

  selectedBrand:any={};	
  brands:Array<any>=[];
  errSuccBrand:any={
    isError:false,
    isSuccess:false,
    succMsg:"",
    errMsg:""
  } 
  isLoading = false
  constructor(private toastr: ToastrService, private brandApi: BrandApi) { 
  }

  ngOnInit() {
  	this.getBrands();
  }

  getBrands(){
    this.isLoading = true;
  	this.brandApi.getAllBrands().subscribe((success)=>{
  		this.brands = success.success.data;
      this.isLoading = false;
  	},(error)=>{
      this.isLoading = false;
      this.toastr.error(error.message);
  		// console.log(error);
  	})

  }

  addBrand(brandForm){
    if(brandForm.valid){

      let $btn = $('#brandBtn');
      $btn.button('loading');
      this.errSuccBrand = {isError:false,isSuccess:false,succMsg:"",errMsg:""};
      if(!this.selectedBrand.id){
        this.brandApi.addBrand(this.selectedBrand.name).subscribe((success)=>{
          brandForm._submitted = false;
          $btn.button('reset');
          $("#brandModal").modal("hide");
          this.toastr.success("Successfully added");
          this.getBrands();
        },(error)=>{
          $btn.button('reset');
          this.toastr.error(error.message);
          this.errSuccBrand = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
        })
      }else{
        this.brandApi.editBrand(this.selectedBrand.name,this.selectedBrand.id).subscribe((success)=>{
          brandForm._submitted = false;
          $btn.button('reset');
          $("#brandModal").modal("hide");
          this.toastr.success("Successfully edited");
          this.getBrands();
        },(error)=>{
          $btn.button('reset');
          this.toastr.error(error.message);
          this.errSuccBrand = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
        })
      }
      
    }
  	
  }

  openModal(brand?:any){

  	this.selectedBrand = Object.assign({}, brand) ;

    $("#brandForm")[0].reset();
    if(brand) 
      this.selectedBrand = Object.assign({}, brand);
    else
      this.selectedBrand = {};
    
    this.errSuccBrand = {
      isError:false,
      isSuccess:false,
      succMsg:"",
      errMsg:""
    }    

  	$("#brandModal").modal("show");

  }

}
