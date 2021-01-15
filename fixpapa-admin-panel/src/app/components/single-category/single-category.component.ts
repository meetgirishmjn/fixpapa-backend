import { Component, OnInit } from '@angular/core';
import { ProductsApi, CategoryApi, ProblemApi ,LoopBackAuth} from './../../sdk/index';
import {ActivatedRoute, Router} from "@angular/router";
declare const $: any;
@Component({
  selector: 'app-single-category',
  templateUrl: './single-category.component.html',
  styleUrls: ['./single-category.component.css']
})
export class SingleCategoryComponent implements OnInit {

	items:Array<any> = [
	  	{text:"abc",id:123},
	  	{text:"pqr",id:124}
	];

  	problems:Array<any>=[];
  	params : any;
  	selectedProblem:any={};	
  	category:any = {};
  	errSuccProb:any = {
  		isError:false,
  		isSuccess:false,
  		succMsg:"",
  		errMsg:""
  	}

  	errSuccProd:any = {
  		isError:false,
  		isSuccess:false,
  		succMsg:"",
  		errMsg:""
  	}

  	selectedProducts:Array<any> = [];
  	allProducts:Array<any>=[];

 	constructor(private productsApi:ProductsApi, private categoryApi:CategoryApi, private problemApi: ProblemApi, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
	  	this.route.params.subscribe( params => {
			this.params = params;
		});
		this.getProblems();
		this.getAllProducts();
		this.getCategory();
    }

    getCategory(){

    	this.categoryApi.getCategory(this.params.categoryId).subscribe((success)=>{
    		this.category = success.success.data;
    		console.log(this.category)
    	},(error)=>{
    		console.log(error);
    	})

    }

    addProduct(productForm){
    	let productIds = this.selectedProducts.map(a=>a.id);
	    if(productIds.length){

	    	let $btn = $('#productBtn');
	  		$btn.button('loading');
	  		this.errSuccProd = {isError:false,isSuccess:false,succMsg:"",errMsg:""};

	    	this.categoryApi.addProduct(
	    		this.params.categoryId,
	    		productIds
	    	).subscribe((success)=>{
	    		productForm._submitted = false;
		    	$btn.button('reset');
		    	$("#productModal").modal("hide");
		     	this.getCategory();
	    		// console.log(success);
	    	},(error)=>{
	    		$btn.button('reset');
		    	console.log(error)
		    	this.errSuccProb = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
	    	})		
	    }
    }

    getAllProducts(){
    	this.productsApi.getProducts().subscribe((success)=>{
    		this.allProducts = success.success.data;
    	},(error)=>{
    		console.log(error);
    	})
    }

    openProductModal(){

    	$("#productForm")[0].reset();
    	this.selectedProducts = this.category.products.slice();
	    
	    this.selectedProducts.map(a=>{
	      a.text = a.name;
	      return a;
	    })

    	this.errSuccProd = {
	  		isError:false,
	  		isSuccess:false,
	  		succMsg:"",
	  		errMsg:""
	  	}

  		$("#productModal").modal("show");

    }

    openProblemModal(value?:any){
	  	
	  	if(value){
	  		this.selectedProblem = JSON.parse(JSON.stringify(value));
	  		// this.selectedProblem = Object.assign({}, value);
	  	}else{
	  		$("#problemForm")[0].reset();
	  		this.selectedProblem = {};
	  	}

	  	this.errSuccProb = {
	  		isError:false,
	  		isSuccess:false,
	  		succMsg:"",
	  		errMsg:""
	  	}
	  	$("#problemModal").modal("show");
    }

    addProblem(problemForm){
	  	if(problemForm.valid){
	  		let $btn = $('#problemBtn');
	  		$btn.button('loading');
	  		this.errSuccProb = {isError:false,isSuccess:false,succMsg:"",errMsg:""};
		  	
	  		if(!this.selectedProblem.id){
	  			this.problemApi.addProblem(
			        this.selectedProblem.probContent,
			        parseFloat(this.selectedProblem.price),
			        this.params.categoryId
			    ).subscribe((success)=>{
			    	problemForm._submitted = false;
			    	$btn.button('reset');
			    	$("#problemModal").modal("hide");
			     	this.getCategory();
			    },(error)=>{
			    	$btn.button('reset');
			    	console.log(error)
			    	this.errSuccProb = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
			    	
			    })	
	  		}else{
	  			this.problemApi.editProblem(
			        this.selectedProblem.probContent,
			        parseFloat(this.selectedProblem.price),
			        this.selectedProblem.id
			    ).subscribe((success)=>{
			    	problemForm._submitted = false;
			    	$btn.button('reset');
			    	$("#problemModal").modal("hide");
			     	this.getCategory();
			    },(error)=>{
			    	$btn.button('reset');
			    	console.log(error)
			    	this.errSuccProb = {isError:true,isSuccess:false,succMsg:"",errMsg:error.message};
			    	
			    })	
	  		}
		  	
	  	}
    }

	getProblems(){
	  	this.problemApi.getProb().subscribe((success)=>{
	  		this.problems = success.success.data;
	  	},(error)=>{
	  		console.log(error);
	  	})
	}

	public selected(value:any):void {
	    console.log('Selected value is: ', value);
	}
 
  	public removed(value:any):void {
    	console.log('Removed value is: ', value);
  	}
 	
 	public selectData(data:any):void {
  		this.selectedProducts = data;
  	}
 

}
