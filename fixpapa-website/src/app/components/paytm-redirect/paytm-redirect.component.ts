import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { SeoService } from './../../services/seo/seo.service';

declare var seoData:any;
declare var $:any;

@Component({
  selector: 'app-paytm-redirect',
  templateUrl: './paytm-redirect.component.html',
  styleUrls: ['./paytm-redirect.component.css']
})
export class PaytmRedirectComponent implements OnInit {

	data : any;
	constructor(private seoService:SeoService, private route : ActivatedRoute) {
		let _self = this;
		this.seoService.generateTags(seoData.pgRedirect);	
		this.route.params.subscribe(params => {
			console.log("Json data : ",JSON.parse(params.JsonData));
			_self.data = JSON.parse(params.JsonData);
		});
	}
	
	ngOnInit(){
	}
	
	ngAfterViewInit(){
		console.log("document.hasOwnProperty('f1') : ", document.hasOwnProperty('f1'));
		if(document.hasOwnProperty('f1')){
			$(document)[0].f1.submit();
		}
	}
}