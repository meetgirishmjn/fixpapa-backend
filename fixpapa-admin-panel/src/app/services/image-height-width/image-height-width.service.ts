import { Injectable } from '@angular/core';

@Injectable()
export class ImageHeightWidthService {

    constructor() { }

    getHeightWidth(img){
  	    let reader:any = new FileReader();
  	    reader.readAsDataURL(img);
  	    return new Promise((resolve,reject)=>{
	  	    reader.onload = function (e) {
	    		let image:any = new Image();
	            image.src = e.target.result;
	        	image.onload = function () {
	                let height = this.height;
	                let width = this.width;
	                resolve({height,width});
	            };	
	        }
    	})
    }

    checkHeightWidth(img, startWidth, startHeight, endWidth, endHeight){

    }

    checkHeightWidthEqual(img, width, height){
    	let imgInst:any;
 	  	return new Promise((rejolve,reject)=>{
	  		
	  		if(img){
	    		imgInst = img[0];
	    		this.getHeightWidth(imgInst).then((success:any)=>{
		  			if(success.height == height && success.width == width){
						rejolve("noError");
		  			}else{
		  				rejolve("sizeError");
		  			}
		  			
		  		})	
	    	}else{
	    		rejolve("imgNotFound");
	    	}

	  	})
    }
}
