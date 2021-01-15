import { Component, OnInit } from '@angular/core';
import { SeoService } from './../../services/seo/seo.service';

declare var seoData:any;
@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.css']
})
export class TermsAndConditionComponent implements OnInit {

  constructor(private seoService:SeoService) { 
    this.seoService.generateTags(seoData.termsAndConditionPage);
  }

  ngOnInit() {
  }

}
