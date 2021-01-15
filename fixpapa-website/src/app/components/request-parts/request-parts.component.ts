import { Component, OnInit, AfterViewInit, ViewChild, NgZone, ElementRef,EventEmitter,Output } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { RequestjobApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';

declare var $ : any;

@Component({
  selector: 'app-request-parts',
  templateUrl: './request-parts.component.html',
  styleUrls: ['./request-parts.component.css']
})
export class RequestPartsComponent implements OnInit {

	addPart : any = [];
	jobId : any;
	disabled : boolean = false;
	partName : any;
	partNumber : any;
	partCost : any;
	previousPart : any = [];
	constructor(private globalFunctionService : GlobalFunctionService, private requestjobApi : RequestjobApi){
	}

	ngOnInit(){
	}
	
	addParts(){
		if(this.addPart.length == 0){
			this.addPart.push({'index' : 1, 'value' : { "partName" :"", "partNumber" :"", "partCost" :"" }});
		}else{
			let index = +this.addPart[this.addPart.length-1].index + 1;
			this.addPart.push({'index' : index, 'value' : { "partName" :"", "partNumber" :"", "partCost" :"" }});
		}
	}
	
	deletePart(part){
		for(var i=0;i<=this.addPart.length-1;i++){
			if(part.index == this.addPart[i].index){
				this.addPart.splice(i,1);
				break;
			}
		}
	}
	
	openModal(data){
		$('#request-parts').modal({backdrop : 'static' , keyboard : false});
		this.jobId = data.jobId;
		this.checkForJob(this.jobId);
	}
	
	checkForJob(jobId){
		let _self = this;
		this.requestjobApi.getJobById(jobId).subscribe(
			(success)=>{
				console.log("job : ", success.success.data);
				_self.previousPart = success.success.data.bill.addPart;
			},
			(error)=>{
				console.log("error : ", error);
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
			}
		);
	}
	
	closeModal(){
		$('#request-parts').modal('hide');
	}
		
	checkForParts(parts){
		let addPart = [];
		addPart.push({ 'partName' : this.partName, 'partNumber' : this.partNumber, 'partCost' : +this.partCost });
		for(var i=0;i<=parts.length-1;i++){
			parts[i].value.partCost = +parts[i].value.partCost;
			addPart.push(parts[i].value);
		}
		return addPart;
	}
	
	requestParts(){
		let partsToSend = this.checkForParts(this.addPart);
		console.log(partsToSend);
		if(this.jobId && partsToSend.length > 0 ){
			let _self = this;
			_self.disabled = true;
			let parts = partsToSend.concat(this.previousPart);
			this.requestjobApi.partRequest(parts,this.jobId).subscribe(
				(success)=>{
					_self.disabled = false;
					console.log("part request : ", success);
					_self.closeModal();
					_self.globalFunctionService.successToast('Sent Part Request','');
				},
				(error)=>{
					_self.disabled = false;
					console.log("error : ", error);
					if(error === 'Server error'){
						_self.globalFunctionService.navigateToError('server');
					}else if(error.statusCode === 401){
						_self.globalFunctionService.navigateToError('401');
					}else{
						_self.globalFunctionService.errorToast(error.message,'oops');
					}
				}
			);
		}
	}
}
