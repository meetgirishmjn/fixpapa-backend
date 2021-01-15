import { Component, OnInit } from '@angular/core';
import { CategoryApi, AMCApi ,LoopBackAuth, LoopBackConfig} from './../../sdk/index';
import { MultipartService } from '../../services/multipart/multipart.service';
import { ImageHeightWidthService } from '../../services/image-height-width/image-height-width.service';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-amc-contact',
  templateUrl: './amc-contact.component.html',
  styleUrls: ['./amc-contact.component.css']
})
export class AmcContactComponent implements OnInit {
  
  selectedCategories:Array<any> = [];	
  categories:Array<any> = [];
  selectedAMC:any = {};
  errSuccAMC:any = {
    isError:false,
    isSuccess:false,
    succMsg:"",
    errMsg:""
  }; 
  baseUrl:string;
  files:any;
  allAMC:Array<any> = [];
  imgSize:any = {
    height:500,
    width:500,
    isError:false,
    error:"noError"
  };
  isLoading = false;
  role:string = "";
  constructor(private auth:LoopBackAuth, private toastr: ToastrService, private imgHeightWidthApi:ImageHeightWidthService,private multipartApi:MultipartService,private amcApi:AMCApi,private categoryApi:CategoryApi) { 
    this.baseUrl = LoopBackConfig.getPath();
  }

  ngOnInit() {
    this.role = this.auth.getCurrentUserData().realm;
  	this.selectedAMC.noOfUnits = [];
  	this.getCategories();
  	this.getAllAMC();
  }


  openModal(amc?:any){
    // $("#AMCForm")[0].reset();

  	if(amc) 
  	    this.selectedAMC = Object.assign({}, amc);
  	else{
      this.selectedAMC = {};
    }
  	    
  	 
    this.imgSize.error = "noError";
    this.imgSize.isError = false;
      
  	this.selectedCategories = this.selectedAMC.category || [];
  	this.selectedAMC.noOfUnits = this.selectedAMC.noOfUnits || [];
  	this.selectedCategories.map(a=>{
  	    a.text = a.name;
  	    return a;
  	})


    this.errSuccAMC = {
        isError:false,
        isSuccess:false,
        succMsg:"",
        errMsg:""
    }    

    $("#amcModal").modal("show");
  }


  addAMC(AMCForm){
    let categoryIds = this.selectedCategories.map(a=>a.id);

    this.imgHeightWidthApi.checkHeightWidthEqual(this.files, this.imgSize.width, this.imgSize.height).then((error)=>{
       this.imgSize.error = error;
       if(this.imgSize.error === "sizeError"){
         this.imgSize.isError = true;
       }else{
         if(this.imgSize.error === "imgNotFound" && !this.selectedAMC.image){
           this.imgSize.isError = true;
         }
       }

      if(!this.imgSize.isError && AMCForm.valid && categoryIds.length){
        this.selectedAMC.categoryIds = categoryIds;
        let $btn = $('#amcBtn');
        $btn.button('loading');
        this.errSuccAMC = {isError:false,isSuccess:false,succMsg:"",errMsg:""};

        let data = Object.assign({}, this.selectedAMC);
        let params = {
          amcId:this.selectedAMC.id
        }

        delete data.id;

        if(!this.selectedAMC.id){
          this.multipartApi.addAMCApi({params:params,data:data,files:{image:this.files}}).subscribe((success:any)=>{
            AMCForm._submitted = false;
            $btn.button('reset');
            this.toastr.success("Successfully added");
            $("#amcModal").modal("hide");
            this.getAllAMC();
          },(error)=>{
            // console.log("addError => ",error);
            $btn.button('reset');
            this.errSuccAMC = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
          })
        }else{
          this.multipartApi.editAMCApi({params:params,data:data,files:{image:this.files}}).subscribe((success:any)=>{
            AMCForm._submitted = false;
            $btn.button('reset');
            this.toastr.success("Successfully edited");
            $("#amcModal").modal("hide");
            this.getAllAMC();
          },(error)=>{
            // console.log("addError => ",error);
            $btn.button('reset');
            this.errSuccAMC = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
          })
        }  

      }
    })  

  }

  getAllAMC(){
    this.isLoading = true;
	  this.amcApi.getAllAmc().subscribe((success)=>{
  		this.allAMC = success.success.data;
      this.isLoading = false;
      // console.log("AMC=> ",this.allAMC);
  	},(error)=>{
      this.toastr.error(error.message);
      this.isLoading = false;
  		// console.log(error);
  	})
  }

  getCategories(){
  	this.categoryApi.getAllCategories().subscribe((success)=>{
  		this.categories = success.success.data;
  		// console.log("Categories => ",this.categories);
  	},(error)=>{
      this.toastr.error(error.message);
  		// console.log(error)
  	})
  }

  openDelModal(amc){
    this.selectedAMC = Object.assign({}, amc);
    $("#deleteModal").modal("show");
  }

  deleteData(delData?:any){
    let $btn = $('#delBtn');
    $btn.button('loading');
    this.amcApi.delete(this.selectedAMC.id).subscribe((success)=>{
      this.toastr.success("Successfully deleted");
      $("#deleteModal").modal("hide");
      this.getAllAMC();
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
    this.selectedCategories = data;
  }



}
