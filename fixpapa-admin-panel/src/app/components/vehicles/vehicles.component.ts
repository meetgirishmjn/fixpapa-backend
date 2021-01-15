import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  
  users:Array<any> = [];
  products:Array<any> = [];
  constructor() { }

  ngOnInit() {
  }

  getUsers(){
  	
  }


}
