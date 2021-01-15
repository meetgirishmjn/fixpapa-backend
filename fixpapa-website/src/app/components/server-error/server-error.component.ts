import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CategoryApi } from './../../sdk/index';
import { SeoService } from './../../services/seo/seo.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var seoData:any;

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {

	constructor(private seoService:SeoService,
		private router: Router,
		private _location : Location,
		private categoryApi : CategoryApi) { 
	this.seoService.generateTags(seoData.serverError);	
  }

	ngOnInit() {
		
	}
  
	checkForUrl() {
		this.router.navigate(['/']);
	}
	
	getAllCategories() {
		let _self = this;
		_self.categoryApi.allData().subscribe(
			(success)=>{
				console.log("all categories : ", success);
				_self.checkForUrl();
			},
			(error)=>{
				//console.log("error : ", error);
				if(error === 'Server error') {
					
				} else {
					_self.checkForUrl();
				}
			}
		);
	}

}
