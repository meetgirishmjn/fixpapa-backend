import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  
  params : any;	
  
  constructor(private router : Router, private route: ActivatedRoute) { }

  ngOnInit() {
  	this.route.params.subscribe( params => {
  		this.params = params;
  	});
  }

}
