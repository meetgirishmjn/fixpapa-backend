import { Component, OnInit } from '@angular/core';
import { SeoService } from './../../services/seo/seo.service';

declare var seoData:any;
@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.css']
})
export class RefundPolicyComponent implements OnInit {

  constructor(private seoService:SeoService) { 
    this.seoService.generateTags(seoData.refundPolicyPage);	
  }

  ngOnInit() {
  }

}
