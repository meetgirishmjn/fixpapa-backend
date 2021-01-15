import { Component, OnInit, AfterViewInit, ViewChild, NgZone, ElementRef,EventEmitter,Output } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { RequestjobApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';

declare var $ : any;

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.css']
})
export class UpdateStatusComponent implements OnInit {
	
	updateStatusForm : FormGroup;
	requestjobId : FormControl;
	offlineStatus : FormControl;
	disabled : boolean = false;
	constructor(private globalFunctionService : GlobalFunctionService, private requestjobApi : RequestjobApi){ }

	ngOnInit(){
	}
	
	createForm(jobId){
		this.requestjobId = new FormControl(jobId,[
			Validators.required
		]);
		this.offlineStatus = new FormControl('',[
			Validators.required
		]);
		this.updateStatusForm = new FormGroup({
			offlineStatus : this.offlineStatus,
			requestjobId  : this.requestjobId
		});
	}
	
	openModal(data){
		$('#update-status').modal({backdrop : 'static', keyboard : false});
		this.createForm(data.jobId);
	}
	
	closeModal(){
		$('#update-status').modal('hide');
	}
	
	updateStatus(){
		if(this.updateStatusForm.valid){
			this.disabled = true;
			let _self = this;
			let offsiteStatus1 = {
				text:this.updateStatusForm.value.offlineStatus
			};
			console.log(offsiteStatus1);
			this.requestjobApi.updateStatus(this.updateStatusForm.value.requestjobId, offsiteStatus1).subscribe(
				(success)=>{
					console.log("status updated : ", success);
					_self.globalFunctionService.successToast('status updated','');
					_self.disabled = false;
					_self.closeModal();
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
