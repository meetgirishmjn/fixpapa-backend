import { Component, OnInit } from '@angular/core';
import { SeoService } from './../../services/seo/seo.service';

declare var seoData:any;
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor(private seoService:SeoService) { 
    this.seoService.generateTags(seoData.servicePage);	
  }

  ngOnInit() {
  }

}
