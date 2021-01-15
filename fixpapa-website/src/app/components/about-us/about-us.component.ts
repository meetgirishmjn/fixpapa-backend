import { Component, OnInit } from '@angular/core';
import { SeoService } from './../../services/seo/seo.service';

declare var seoData:any;
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(private seoService:SeoService) { 
    this.seoService.generateTags(seoData.aboutUsPage);	
  }

  ngOnInit() {
  }

}
