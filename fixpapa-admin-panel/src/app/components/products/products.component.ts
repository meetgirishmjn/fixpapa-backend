import { Component, OnInit } from '@angular/core';
import { BrandApi , LoopBackAuth, ProductsApi} from './../../sdk/index';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  brands : Array<any> = [];	
  product : any = {};
  products : Array<any> = [];
  selectedBrands : Array<any> = [];
  errSuccProduct : any = {
    isError : false,
    isSuccess : false,
    succMsg : "",
    errMsg : ""
  }

  isLoading = false;

  constructor(private toastr: ToastrService, private brandApi:BrandApi, private productsApi:ProductsApi) { 

  }

  ngOnInit() {
  	this.getBrands();
  	this.product.values = [];
  	this.getProducts();
  }

  openModal(product?:any){
    
    $("#productForm")[0].reset();
    if(product) 
      this.product = Object.assign({}, product);
    else
      this.product = {};
    
    this.selectedBrands = this.product.brand || [];
    this.product.values = this.product.values || [];
    this.selectedBrands.map(a=>{
      a.text = a.name;
      return a;
    })

    this.errSuccProduct = {
      isError:false,
      isSuccess:false,
      succMsg:"",
      errMsg:""
    }

  	$("#productModal").modal("show")
  }

  getProducts(){
    this.isLoading = true;
  	this.productsApi.getProducts().subscribe((success)=>{
  		this.products = success.success.data;
      this.isLoading = false;
  	},(error)=>{
      this.isLoading = false;
      this.toastr.error(error.message);
  	})
  }

  addProduct(productForm){

  	let brandIds = this.selectedBrands.map(a=>a.id);

    // if(productForm.valid && brandIds.length){
    if(productForm.valid){  
      let $btn = $('#productBtn');
      $btn.button('loading');
      this.errSuccProduct = {isError:false,isSuccess:false,succMsg:"",errMsg:""};      
      if(!this.product.id){
        this.productsApi.addProduct(
          this.product.name,
          this.product.values,
          brandIds
        ).subscribe((success)=>{
          productForm._submitted = false;
          $btn.button('reset');
          $("#productModal").modal("hide");
          this.toastr.success("Successfully added");
          this.getProducts();
        },(error)=>{
          $btn.button('reset');
          // console.log(error)
          this.errSuccProduct = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
        })        
      }else{
        this.productsApi.editProduct(
          this.product.name,
          this.product.values,
          brandIds,
          this.product.id
        ).subscribe((success)=>{
          productForm._submitted = false;
          $btn.button('reset');
          $("#productModal").modal("hide");
          this.toastr.success("Successfully edited");
          this.getProducts();
        },(error)=>{
          $btn.button('reset');
          this.errSuccProduct = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
        })        
      }
    }

  }

  trackByIndex(index: number, value: number) {
    return index;
  }

  getBrands(){
  	this.brandApi.getAllBrands().subscribe((success)=>{
  		// console.log(success)
  		this.brands = success.success.data;
  	},(error)=>{
      this.toastr.error(error.message);
  		// console.log(error);
  	})
  }

  /*public selected(value:any):void {
  	console.log(value);
    // this.selectedBrands = value;
  }*/
 
 /* public removed(value:any):void {
   	this.selectedBrands = value;
  }
*/
  public selectData(data:any):void {
  	this.selectedBrands = data;
  }
  

}
