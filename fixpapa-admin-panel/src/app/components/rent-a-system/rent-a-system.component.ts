import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-rent-a-system',
  templateUrl: './rent-a-system.component.html',
  styleUrls: ['./rent-a-system.component.css']
})
export class RentASystemComponent implements OnInit {

  systems:Array<any> = [];	  
 
  constructor() { }

  ngOnInit() {
  }


}
