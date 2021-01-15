import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {

	currentTab : any;
	orderType :any = 'pending';
	constructor() { 
		this.currentTab = 'myOrders';
		this.orderType = 'pending';
	}

	ngOnInit() {
	}

}
