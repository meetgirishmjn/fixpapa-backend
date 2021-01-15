import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { LoopBackConfig,CategoryApi} from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

declare var $:any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	results: any[] = [];
	categories : any[];
	searchText : FormControl;
	searchForm : FormGroup;
	
	@Output() openFixProb = new EventEmitter();
	
	constructor(private globalFunctionService : GlobalFunctionService, private categoryApi : CategoryApi) {
	}
	
	ngOnInit(){
		this.getCategory();
		this.searchText = new FormControl();
		this.searchForm = new FormGroup({
			searchText : this.searchText
		});
	}
	openFixProbForm(id,name){
		this.searchForm.controls['searchText'].setValue(name);
		this.openFixProb.emit({categoryId:id});
	}
	ngAfterViewInit() {
	}
	
	clearText(){
		this.searchForm.get('searchText').setValue('','');
	}
	
	getCategory(){
		let _self = this;
		this.categoryApi.getAllCategories().subscribe(
			(success)=>{
				console.log("categories : ", success);
				_self.categories = success.success.data;
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ", error);
			}
		);
	}
}