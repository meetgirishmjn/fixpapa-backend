import { Component, OnInit } from '@angular/core';
import { CategoryApi ,LoopBackAuth, LoopBackConfig } from './../../sdk/index';
import { MultipartService } from '../../services/multipart/multipart.service';
import { ImageHeightWidthService } from '../../services/image-height-width/image-height-width.service';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  selectedCategory:any = {};	
  categories:Array<any> = [];
  files:any;
  baseUrl:string;
  errSuccCategory:any = {
    isError:false,
    isSuccess:false,
    succMsg:"",
    errMsg:""
  } 
  imgSize:any = {
    height:500,
    width:500,
    isError:false,
    error:"noError"
  };
  isLoading = false;
  role:string = "";
  constructor(private auth:LoopBackAuth ,private toastr: ToastrService, private router:Router, private imgHeightWidthApi:ImageHeightWidthService,private multipartApi:MultipartService,private categoryApi:CategoryApi) { }

  ngOnInit() {
  	this.baseUrl = LoopBackConfig.getPath();
    this.role = this.auth.getCurrentUserData().realm;
  	this.getCategories();
  }

  navigate(url,params){
    this.router.navigate([url,params]);
    
  }

  getCategories(){
    this.isLoading = true;
  	this.categoryApi.getAllCategories().subscribe((success)=>{
  		// console.log(success)
  		this.categories = success.success.data;
      this.isLoading = false;
  	},(error)=>{
      this.isLoading = false;
      this.toastr.error(error.message);
  		// console.log(error);
  	})
    
  }

  addCategory(addCategoryForm){
    let _self = this;
    this.imgHeightWidthApi.checkHeightWidthEqual(this.files, this.imgSize.width, this.imgSize.height).then((error)=>{
       this.imgSize.error = error;
       if(this.imgSize.error === "sizeError"){
         this.imgSize.isError = true;
       }else{
         if(this.imgSize.error === "imgNotFound" && !this.selectedCategory.image){
           this.imgSize.isError = true;
         }
       }

      	if(!this.imgSize.isError && addCategoryForm.valid && this.selectedCategory.confirmPassword == this.selectedCategory.password ){

      		let $btn = $('#categoryBtn');
          $btn.button('loading');
          this.errSuccCategory = {isError:false,isSuccess:false,succMsg:"",errMsg:""};

          let data = {name:this.selectedCategory.name};
          let params = {
            categoryId:this.selectedCategory.id
          }
         
          if(!this.selectedCategory.id){
            this.multipartApi.addCategoryApi({data:data,files:{image:this.files}}).subscribe((success:any)=>{
              addCategoryForm._submitted = false;
              $btn.button('reset');
              $("#categoryModal").modal("hide");
              this.toastr.success("Successfully added");
              this.getCategories();
            },(error:any)=>{
              $btn.button('reset');
              this.errSuccCategory = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
            });  
          }else{
            this.multipartApi.editCategoryApi({params:params,data:data,files:{image:this.files}}).subscribe((success:any)=>{
              addCategoryForm._submitted = false;
              $btn.button('reset');
              $("#categoryModal").modal("hide");
              this.toastr.success("Successfully edited");
              this.getCategories();
            },(error:any)=>{
              $btn.button('reset');
              this.errSuccCategory = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
            });  
          }
      	}
    })    
  }

  openModal(category?:any){
  	this.selectedCategory = Object.assign({}, category);
    this.imgSize.error = "noError";
    this.imgSize.isError = false;
  	$("#categoryModal").modal("show");
  }

  openDelModal(category){
    this.selectedCategory = Object.assign({}, category);
    $("#deleteModal").modal("show");
  }

  deleteData(delData:any){
    let $btn = $('#delBtn');
    $btn.button('loading');
    this.categoryApi.delCategory(this.selectedCategory.id).subscribe((success)=>{
      this.toastr.success("Successfully deleted");
      $("#deleteModal").modal("hide");
      this.getCategories()
      $btn.button('reset');
    },(error)=>{
      $btn.button('reset');
      this.toastr.error(error.message);
      // console.log(error);
    })  
  }


  openAddOrRemoveRent(category){
    this.selectedCategory = Object.assign({}, category);
    this.selectedCategory.isAvailableForRent = this.selectedCategory.isAvailableForRent || false;
    $("#forRentModal").modal("show");
  }

  addOrRemoveRent(rentForm){
    
    
    let $btn = $('#rentBtn');
    $btn.button('loading');
    this.categoryApi.updateForRent(this.selectedCategory.id,!this.selectedCategory.isAvailableForRent).subscribe((success)=>{
      if(!this.selectedCategory.isAvailableForRent){
        this.toastr.success("Successfully added");  
      }else{
        this.toastr.success("Successfully removed");  
      }
      
      $("#forRentModal").modal("hide");
      this.getCategories()
      $btn.button('reset');
    },(error)=>{
      $btn.button('reset');
      this.toastr.error(error.message);
      // console.log(error);
    })  
  }



}
