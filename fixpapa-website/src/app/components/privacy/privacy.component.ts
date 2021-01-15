import { Component, OnInit } from '@angular/core';
import { SeoService } from './../../services/seo/seo.service';
declare var seoData:any;
@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  constructor(private seoService:SeoService) { 
    this.seoService.generateTags(seoData.privacyAndSecurityPage);	
  }

  ngOnInit() {
  }

}
