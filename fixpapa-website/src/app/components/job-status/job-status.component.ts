import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-job-status',
  templateUrl: './job-status.component.html',
  styleUrls: ['./job-status.component.css']
})
export class JobStatusComponent implements OnInit {

	@Input() jobToCheckStatus : any;
	value : any;
	constructor(){
		this.value = 1;
	}
	
	ngOnInit() {
		this.checkForJob(this.jobToCheckStatus);
	}

	checkForJob(job){
		if(job.isEngineerAssigned){
			this.value = 2;
			for (var key in job){
				if (job.hasOwnProperty(key)){
					if(key === 'status' && job[key] === 'on the way'){
						this.value = 3;
					}
					if(key === 'status' && (job[key] === 'inprocess' || job[key] === 'outForDelivery' || job[key] === 'billGenerated' || job[key] === 'paymentDone' )){
						this.value = 4;
					}
					if(key === 'status' && (job[key] === 'completed' ||job[key] === 'indispute' )){
						this.value = 5;
					}
				}
			}
			// console.log("value : ", this.value);
		}
	}
}
