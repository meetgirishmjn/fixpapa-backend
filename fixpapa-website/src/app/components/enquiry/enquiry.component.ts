import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { PeopleApi,LoopBackConfig } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { MultipartService } from './../../services/multipart/multipart.service';
import { validateMobile } from './../../validators/mobile.validator';

declare var $ : any;
@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent implements OnInit {

	//date: Date = new Date();
    settings = {};
	opened : boolean = false; 
	
	enquiryForm : FormGroup;
	timeofCalling : FormControl;
	mobileNo : FormControl;
	service : FormControl;
	@ViewChild("container") container;
	@HostListener('document:click', ['$event'])
	  clickout(event) {
	    if(!this.container.nativeElement.contains(event.target) && this.opened){
	    	this.openEnq();
	    }
	  }
	constructor(private globalFunctionService : GlobalFunctionService,private peopleApi : PeopleApi) {
		let today = new Date();
		this.settings = {
			bigBanner: true,
			timePicker: false,
			format: 'dd-MMM-yyyy',
			defaultOpen: false,
			closeOnSelect : true,
			disableUntil: {year: 2018, month: 11, day: 26}
		};
	}

	ngOnInit(){
		this.createForm();
		this.enquiryForm.controls['service'].setValue("")
	}

	createForm(){
		this.timeofCalling = new FormControl(new Date(),[
			Validators.required
		]);
		this.mobileNo = new FormControl('',[
			Validators.required,
			validateMobile
		]);
		this.service = new FormControl('Service',[
			Validators.required
		]);
		this.enquiryForm = new FormGroup({
			timeofCalling : this.timeofCalling,
			mobileNo : this.mobileNo,
			service : this.service
		});
	}
	
	onDateSelect(evt){
		console.log("date time : ", evt);
	}
	
	sendEnq(){
		console.log("form : ", this.enquiryForm.value);
		let _self = this;
		if(this.enquiryForm.valid){
			this.peopleApi.quickCall(this.enquiryForm.value.service, this.enquiryForm.value.mobileNo, this.enquiryForm.value.timeofCalling).subscribe(
				(success)=>{
					console.log("quick call : ", success);
					_self.globalFunctionService.successToast("Thanks for generating the enquiry",'Our team will connect to you soon');
					_self.openEnq();
				},
				(error)=>{
					if(error === 'Server error'){
						_self.globalFunctionService.navigateToError('server');
					}else{
						_self.globalFunctionService.errorToast(error.message,'oops');
					}
					console.log("error : ", error);
				}
			);
		}else{
			this.enquiryForm.controls['mobileNo'].markAsTouched();
			this.enquiryForm.controls['service'].markAsTouched();
		}
	}

	easeOutBounce(x, t, b, c, d){
		if ((t/=d) < (1/2.75)){
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	}

	Animate(elem, propName, duration, start, end)  {
		var start_time = new Date().getTime();
		var interval = setInterval(()=> {
			var current_time = new Date().getTime(),
			remaining = Math.max(0, start_time + duration - current_time),
			temp = remaining / duration || 0,
			percent = 1 - temp;

			if (start_time + duration < current_time) clearInterval(interval);

			var pos = this.easeOutBounce(null, duration * percent, 0, 1, duration),
			current = (end - start) * pos + start;

			elem.style[propName] = current + 'px';
		}, 1);
	}

	openEnq() {
		setTimeout(()=>{
			var elem = document.getElementById('contactform');
			if (this.opened) {
				this.Animate(elem, 'left', 800, 0, -305);    
				this.opened = false;
			} else {
				this.Animate(elem, 'left', 800, -305, 0);
				this.opened = true;  
			}  
		},0)
		
	}
}
