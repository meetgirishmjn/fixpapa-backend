import { Injectable } from '@angular/core';
import {Http, Headers,RequestOptions} from '@angular/http';
import { LoopBackAuth, LoopBackConfig }  from './../../sdk/index';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class MultipartService {

	base:string;
	urls: any;

	constructor(private http:Http,private auth:LoopBackAuth) { 
		this.base = LoopBackConfig.getPath();
		this.urls = {
			signup: this.base + "/api/People/signup",
			uploadProfilePic: this.base + "/api/People/uploadProfilePic",
			addEngineer: this.base + "/api/People/addEngineer",
			createJob: this.base + "/api/Requestjobs/createJob",
			editProfile: this.base + "/api/People/editProfile"
		}
	}

	request(url,data){
		console.log("data : ", data);
		return this.http.post(url,this.getFormObj(data),this.getOption()).map((res: any) => (res.text() != "" ? res.json() : {})).catch((error) => {return Observable.throw(error.json().error || 'Server error');});
	}

	getFormObj(obj){
		let fd = new FormData();
		if(obj.data && typeof obj.data == 'object'){
			fd.append('data',JSON.stringify(obj.data));
		}
		for(let x in obj.files){
			if(obj.files[x].constructor === Array){
				for(let y in obj.files[x]){
					fd.append(x,obj.files[x][y][0]);
				}
			}else{
				if(typeof obj.files[x] === 'string'){
					fd.append(x,obj.files[x]);
				}else{
					for(let y in obj.files[x]){
						fd.append(x,obj.files[x][y]);   
					}
				}
			}
		}
		return fd;
	}

	getOption(){
		let header : Headers = new Headers();
		header.append('Authorization',this.auth.getAccessTokenId() || "");
		let opts: RequestOptions = new RequestOptions();
		opts.headers = header;
		return opts;
	}

	signupApi(data){
		return this.request(this.urls.signup,data);
	}
  
	createJob(data){
		return this.request(this.urls.createJob,data);
	}
  
	uploadProfilePic(data){
		return this.request(this.urls.uploadProfilePic,data);
	}
  
	addEngineer(data){
		return this.request(this.urls.addEngineer,data);
	}

	editProfile(data) {
		return this.request(this.urls.editProfile, data);
	}
}