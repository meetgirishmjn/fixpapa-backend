import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions,RequestOptionsArgs } from '@angular/http';
import { GlobalFunctionService } from './../../services/global-function.service';
import { LoopBackConfig, LoopBackAuth, RatingApi, RequestjobApi } from './../../sdk/index';

declare var $ : any;

@Component({
  selector: 'app-give-feedback',
  templateUrl: './give-feedback.component.html',
  styleUrls: ['./give-feedback.component.css']
})
export class GiveFeedbackComponent implements OnInit {
	
	review : any = {};
	jobId : any;
	baseUrl : any;
	job : any = {};
	realm : any;
	constructor(private requestjobApi : RequestjobApi, private ratingApi : RatingApi, private http: Http, private auth : LoopBackAuth, private globalFunctionService : GlobalFunctionService){
		this.baseUrl = LoopBackConfig.getPath();
	}

	ngOnInit(){
		this.realm = this.globalFunctionService.getUserCredentials().realm;
	}
	
	setOption(){
		let loopBackId = this.auth.getAccessTokenId();
		let options: RequestOptionsArgs = new RequestOptions();
		options.headers = new Headers();
		console.log("lop back id : ", loopBackId);
		options.headers.append("Authorization", loopBackId);
		
		return options;
	}
	
	openModal(data){
		this.jobId = data.jobId;
		this.review.requestjobId = this.jobId;
		this.getJob(this.jobId);
	}
	
	closeModal(){
		$('#feedback-modal').modal('hide');
		this.review = {};
	}
	
	submitReview(){
		let _self = this;	
		console.log(this.review);
		if(this.review.userRating){
			//var options = _self.setOption();
			//let url = _self.baseUrl + "/api/Ratings/giveRating";	
			this.review.userRating = +this.review.userRating;
			//_self.http.post(url,this.review,options)
			this.ratingApi.giveRating({},this.review.requestjobId, +this.review.userRating, this.review.comment).subscribe(
				(success)=>{
					console.log("review : ", success);
					_self.globalFunctionService.successToast("Thanks for reviewing us",'');
					_self.closeModal();
				},
				(error)=>{
					if(error === 'Server error'){
						_self.globalFunctionService.navigateToError('server');
					}else if(error.statusCode === 401){
						_self.globalFunctionService.navigateToError('401');
					}else{
						_self.globalFunctionService.errorToast(error.message,'oops');
					}
					console.log("error : ", error);
				}
			);
		}
	}
	
	getJob(id){
		let _self = this;
		this.requestjobApi.getJobById(id).subscribe(
			(success)=>{
				console.log("job : ", success);
				success.success.data.engineer.image = _self.baseUrl + success.success.data.engineer.image;
				success.success.data.customer.image = _self.baseUrl + success.success.data.customer.image;
				_self.job = success.success.data;
				$('#feedback-modal').modal({backdrop : 'static' , keyboard : false});
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ", error);
			}
		);
	}
}
