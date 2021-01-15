import { Component, OnInit } from '@angular/core';
import { ProductsApi, NewpurchaseApi, LoopBackAuth, LoopBackConfig} from './../../sdk/index';
import { MultipartService } from '../../services/multipart/multipart.service';
import { ImageHeightWidthService } from '../../services/image-height-width/image-height-width.service';
import { ToastrService } from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-hardware-purchase',
  templateUrl: './hardware-purchase.component.html',
  styleUrls: ['./hardware-purchase.component.css']
})
export class HardwarePurchaseComponent implements OnInit {
  selectedHardware:any={};	
  hardwares:Array<any>=[];
  products:Array<any> = [];
  selectedProducts:Array<any>=[];
  errSuccHardware:any={
    isError:false,
    isSuccess:false,
    succMsg:"",
    errMsg:""
  } 
  files:any;
  baseUrl:string;
  imgSize:any = {
    height:500,
    width:500,
    isError:false,
    error:"noError"
  };
  isLoading = false;
  role:string = "";
  constructor(private auth:LoopBackAuth, private toastr: ToastrService, private imgHeightWidthApi:ImageHeightWidthService, private multipartApi:MultipartService,private productsApi:ProductsApi, private newpurchaseApi:NewpurchaseApi) { 
    this.baseUrl = LoopBackConfig.getPath();
  }

  ngOnInit() {
    this.role = this.auth.getCurrentUserData().realm;
    this.getHardware();
    this.getProducts();
  }

  openModal(hardware?:any){
    this.selectedHardware = Object.assign({}, hardware) ;

    // $("#hardwareForm")[0].reset();
    if(hardware) 
      this.selectedHardware = Object.assign({}, hardware);
    else
      this.selectedHardware = {};
    
    this.imgSize.error = "noError";
    this.imgSize.isError = false;

    this.selectedProducts = this.selectedHardware.products || [];
    this.selectedProducts.map(a=>{
      a.text = a.name;
      return a;
    })

    this.errSuccHardware = {
      isError:false,
      isSuccess:false,
      succMsg:"",
      errMsg:""
    }    

    $("#hardwareModal").modal("show");
  }

  addHardware(hardwareForm){
    
    let productsIds = this.selectedProducts.map(a=>a.id);

    this.imgHeightWidthApi.checkHeightWidthEqual(this.files, this.imgSize.width, this.imgSize.height).then((error)=>{
      this.imgSize.error = error;
      if(this.imgSize.error === "sizeError"){
        this.imgSize.isError = true;
      }else{
        if(this.imgSize.error === "imgNotFound" && !this.selectedHardware.image){
          this.imgSize.isError = true;
        }
      }

      if(hardwareForm.valid && productsIds.length){
        this.selectedHardware.productsIds = productsIds;
        let $btn = $('#hardwareBtn');
        $btn.button('loading');
        this.errSuccHardware = {isError:false,isSuccess:false,succMsg:"",errMsg:""};

        let data = Object.assign({}, this.selectedHardware);
        let params = {
          newpurchaseId:this.selectedHardware.id
        }

        delete data.id;

        if(!this.selectedHardware.id){
          this.multipartApi.addHardwareApi({params:params,data:data,files:{image:this.files}}).subscribe((success:any)=>{
            hardwareForm._submitted = false;
            $btn.button('reset');
            $("#hardwareModal").modal("hide");
            this.toastr.success("Successfully added");
            this.getHardware();
          },(error)=>{
            $btn.button('reset');
            this.errSuccHardware = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
          })
        }else{
          this.multipartApi.editHardwareApi({params:params,data:data,files:{image:this.files}}).subscribe((success:any)=>{
            hardwareForm._submitted = false;
            $btn.button('reset');
            $("#hardwareModal").modal("hide");
            this.toastr.success("Successfully edited");
            this.getHardware();
          },(error)=>{
            $btn.button('reset');
            this.errSuccHardware = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
          })
        }  
      }
    })  

  }

  getHardware(){
    this.isLoading = true;
  	this.newpurchaseApi.getPurchases().subscribe((success)=>{
      this.isLoading = false;
  		this.hardwares = success.success.data;
      // console.log("hardware=> ",this.hardwares);
  	},(error)=>{
      this.isLoading = false;
      this.toastr.error(error.message);
  		// console.log(error);
  	})
  }

  getProducts(){
    
    this.productsApi.getProducts().subscribe((success)=>{
      this.products = success.success.data;
      // console.log("products => ",this.products);
    },(error)=>{
      this.toastr.error(error.message);
      // console.log(error)
    })
  }

  openDelModal(hardware){
    this.selectedHardware = Object.assign({}, hardware) ;
    $("#deleteModal").modal("show");
  }

  deleteData(delData?:any){
    let $btn = $('#delBtn');
    $btn.button('loading');
    this.newpurchaseApi.delete(this.selectedHardware.id).subscribe((success)=>{
      this.toastr.success("Successfully deleted");
      $("#deleteModal").modal("hide");
      this.getHardware();
      $btn.button('reset');
    },(error)=>{
      $btn.button('reset');
      this.toastr.error(error.message);
      // console.log(error);
    })  
  }



  public selectData(data:any):void {
    this.selectedProducts = data;
  }


}
