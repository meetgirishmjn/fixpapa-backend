import { Component, OnInit } from '@angular/core';
import { PeopleApi,LoopBackConfig, RatingApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { SeoService } from './../../services/seo/seo.service';

declare var seoData:any;
declare var $ : any;

@Component({
  selector: 'app-hsn-codes',
  templateUrl: './hsn-codes.component.html',
  styleUrls: ['./hsn-codes.component.css']
})
export class HsnCodesComponent implements OnInit {

	hsnCodes : any = [];
	constructor(private seoService:SeoService, private ratingApi : RatingApi) { 
		this.seoService.generateTags(seoData.homePage);	
	}

	ngOnInit(){
	}
	
	openModal(){
		this.getHsn();
	}
	
	closeModal(){
		$('#hsn-modal').modal('hide');
	}
	
	getHsn(){
		let _self = this;
		this.ratingApi.getHsnCodes({}).subscribe(
			(success)=>{
				console.log("hsn codes : ", success);
				_self.hsnCodes = success.success.data;
				$('#hsn-modal').modal({ backdrop : 'static', keyboard : false });
			},
			(error)=>{
				console.log("error : ", error);
			}
		);
	}
}
