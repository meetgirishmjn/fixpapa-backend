import { Component, OnInit } from '@angular/core';
import { PeopleApi,LoopBackConfig} from './../../sdk/index';

declare var $ : any;

@Component({
  selector: 'app-hsn-codes',
  templateUrl: './hsn-codes.component.html',
  styleUrls: ['./hsn-codes.component.css']
})
export class HsnCodesComponent implements OnInit {

	hsnCodes : any = [];
	constructor(private peopleApi : PeopleApi) { }

	ngOnInit(){
	}
	
	openModal(){
		this.getHsn();
	}
	
	closeModal(){
		$('#hsn-modal').modal('hide');
	}
	
	getHsn(){
		let _self = this;
		this.peopleApi.getHsnCodes({}).subscribe(
			(success)=>{
				console.log("hsn codes : ", success);
				_self.hsnCodes = success.success.data;
				$('#hsn-modal').modal({ backdrop : 'static', keyboard : false });
			},
			(error)=>{
				console.log("error : ", error);
			}
		);
	}
}
