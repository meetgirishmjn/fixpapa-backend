import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PeopleApi,CategoryApi,LoopBackConfig, RequestjobApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

	@Input() engineersArr 		: any;
	@Input() jobId		  		: any;
	@Output() successAssign = new EventEmitter();
	isMobile : boolean = false;
	searchText : any;
	constructor(private requestjobApi : RequestjobApi,private globalFunctionService : GlobalFunctionService) { }

	ngOnInit(){
	}
	
	clearText(){
		this.searchText = "";
	}
  
	openNav(){
		console.log("width : ", window.screen.width);
		if(window.screen.width <= 499 ){
			this.isMobile = true;
			document.getElementById("mySidenav").style.width = "100%";
		}
		else if(window.screen.width > 499  && window.screen.width < 601){
			this.isMobile = true;
			document.getElementById("mySidenav").style.width = "80%";
		}else{
			this.isMobile = false;
			document.getElementById("mySidenav").style.width = "45%";
		}
	}

	closeNav() {
		document.getElementById("mySidenav").style.width = "0";
	}
	
	assignJob(id){
		let _self = this;
		console.log("job Id : ", this.jobId);
		this.requestjobApi.assignEngineer(this.jobId,id).subscribe(
			(success)=>{
				console.log("engineer assigned job : ", success);
				_self.globalFunctionService.successToast("Engineer is Assigned the Job",'');
				_self.closeNav();
				_self.successAssign.emit(success.success.data);
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
