import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest, HttpParams, HttpResponse } from '@angular/common/http';
import { LoopBackAuth, LoopBackConfig }  from './../../sdk/index';
import { Observable } from 'rxjs';
import { catchError, map, filter } from 'rxjs/operators';
@Injectable()
export class MultipartService {

  base:string;
  urls: any;

  constructor(private http:HttpClient,private auth:LoopBackAuth) { 
  	this.base = LoopBackConfig.getPath();
  	this.urls = {
  		addCategory: this.base+"/api/Categories/addCategory",
      editCategory: this.base+"/api/Categories/edit",
      
      addHardware: this.base+"/api/Newpurchases/addItem",
      editHardware: this.base+"/api/Newpurchases/edit",
      
      addAMC:this.base+"/api/AMCs/addAmcType",
      editAMC:this.base+"/api/AMCs/edit",
      
      addBid:this.base+"/api/Bids/addBidType",
      editBid:this.base+"/api/Bids/edit",
      
  	}
  }

  request(url,data){
    return this.http.post(url,this.getFormObj(data),this.getOption(data.params)).pipe(map((res: HttpResponse<{}>) => res.body),catchError((errorResponse) => {return Observable.throw(errorResponse.error.error || 'Server error');}));
  }

  getFormObj(obj){
  	let fd = new FormData();
    if(obj.data && typeof obj.data == 'object'){

  		if(obj.data.extra){
  			delete obj.data.extra;
  		}

  		if(obj.data.address){
  			delete obj.data.address;
  		}

  		fd.append('data',JSON.stringify(obj.data));
    }

  	for(let x in obj.files){

  		for(let y in obj.files[x]){
  			fd.append(x,obj.files[x][y]);   
  		}

    }

  	return fd;
  }

  getOption(paramsData){
    paramsData = paramsData || {}; 
    let headers  = new HttpHeaders();
    
    for(let x in paramsData){
      if(paramsData[x] == undefined){
        delete paramsData[x];
      }
    }

    let params = Object.getOwnPropertyNames(paramsData)
                 .reduce((p, key) => p.set(key, paramsData[key]), new HttpParams());

    if (this.auth.getAccessTokenId()) {
      headers = headers.append(
        'Authorization',
        LoopBackConfig.getAuthPrefix() + this.auth.getAccessTokenId()
      );
    }
    return {headers:headers,params:params};
  }

  addCategoryApi(data){
  	return this.request(this.urls.addCategory,data);
  }

  editCategoryApi(data){
    return this.request(this.urls.editCategory,data);
  }  

  addHardwareApi(data){
    return this.request(this.urls.addHardware,data);
  }

  editHardwareApi(data){
    return this.request(this.urls.editHardware,data);
  }

  addAMCApi(data){
   return this.request(this.urls.addAMC,data); 
  }

  editAMCApi(data){
   return this.request(this.urls.editAMC,data); 
  }

  addBidApi(data){
   return this.request(this.urls.addBid,data); 
  }
  editBidApi(data){
   return this.request(this.urls.editBid,data); 
  }

}
