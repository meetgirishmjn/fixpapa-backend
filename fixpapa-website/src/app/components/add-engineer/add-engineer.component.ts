import { Component, OnInit, AfterViewInit, ViewChild, NgZone, ElementRef, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,FormArray,Validators,FormBuilder } from '@angular/forms';
import { PeopleApi,CategoryApi,LoopBackConfig,ServicesApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';
import { MultipartService } from './../../services/multipart/multipart.service';

import { validateEmail } from './../../validators/email.validator';
import { validateWorkEx } from './../../validators/yearOfExp.validator';
import { validateMobile } from './../../validators/mobile.validator';

declare var $:any;

@Component({
  selector: 'app-add-engineer',
  templateUrl: './add-engineer.component.html',
  styleUrls: ['./add-engineer.component.css']
})
export class AddEngineerComponent implements OnInit {

	addEngForm : FormGroup;
	realm : FormControl;
	fullName : FormControl;
	email : FormControl;
	mobile : FormControl;
	password : FormControl;
	confPass : FormControl;
	address : FormControl;
	expertiseIds : FormControl;
	exp : FormControl;
	vendorId : FormControl;
	engineerId : FormControl;
	profilePic : string;
	
	selectedExperties : any = [];
	
	files : any = {};
	
	servicesOffered : string[];
	noServices : boolean = false;
	
	disableEng : boolean = false;
	isEdit : boolean = false;
	loading : boolean = false;
	
	@Output() addEngModal = new EventEmitter();
	
	@ViewChild('services') set content1(content1: ElementRef){
		if(this.isEdit && this.selectedExperties.length > 0){
			if($('.service-container').length > 0){
				for(var i=0;i<=$('.service-container').length-1;i++){
					for(var j=0;j<=this.selectedExperties.length-1;j++){
						if(this.selectedExperties[j] == $('.service-container')[i].value){
							$('.service-container')[i].checked = true;
						}
					}
				}
			}
		}
	}
	
	constructor(private peopleApi : PeopleApi, private servicesApi : ServicesApi,private multipartService : MultipartService,private categoryApi : CategoryApi,private globalFunctionService : GlobalFunctionService) { 
		this.profilePic = 'assets/images/profile-img.png';
	}

	ngOnInit() {
	}
	
	openModal(data){
		console.log("data : ", data);
		this.loading = true;
		this.selectedExperties = [];
		this.noServices = false;
		this.profilePic = 'assets/images/profile-img.png';
		this.getServices();
		if(data.isEdit){
			this.isEdit = true;
			this.profilePic = data.engineer.image;
			this.selectedExperties = data.engineer.expertiseIds;
			console.log("engineer detail : ", data.engineer);
			this.createEditEngForm(data.engineer);
		}else{
			this.isEdit = false;
			this.selectedExperties = [];
			this.createAddEngForm();
		}
	}
	
	closeModal(){
		$('#largeModal8').modal('hide');
		this.resetAddEngForm();
	}
	
	createEditEngForm(engineer){
		this.fullName = new FormControl(engineer.fullName,[
			Validators.required
		]);
		this.email = new FormControl(engineer.email,[
			Validators.required,
			validateEmail
		]);
		this.mobile  = new FormControl(engineer.mobile,[
			Validators.required,
			validateMobile
		]);
		this.address = new FormControl(engineer.address,[
			Validators.required
		]);
		this.expertiseIds = new FormControl('',[
			Validators.required
		]);
		this.exp = new FormControl(engineer.exp,[
			Validators.required,
			validateWorkEx
		]);
		this.engineerId = new FormControl(engineer.id,[
			Validators.required
		]);
		this.password = new FormControl('',[
			Validators.required
		]);
		
		this.confPass = new FormControl('',[
		])
		
		this.addEngForm = new FormGroup({
			fullName		: this.fullName,
			email 			: this.email,
			address 		: this.address,
			password 		: this.password,
			confPass		: this.confPass,
			expertiseIds 	: this.expertiseIds,
			exp 			: this.exp,
			mobile			: this.mobile,
			engineerId 		: this.engineerId
		});
		
		let experties = engineer.expertiseIds.join(',');
		this.addEngForm.controls['expertiseIds'].setValue(experties);
		
		$('#largeModal8').modal({backdrop: 'static', keyboard: false});
		this.loading = false;
		//console.log("engineer data : ", this.addEngForm.value);
	}
	
	createAddEngForm(){
		this.realm = new FormControl('engineer',[
		]);
		this.fullName = new FormControl('',[
			Validators.required
		]);
		this.email = new FormControl('',[
			Validators.required,
			validateEmail
		]);
		this.mobile  = new FormControl('',[
			Validators.required,
			validateMobile
		]);
		this.password = new FormControl('',[
			Validators.required,
			Validators.minLength(6)
		]);
		this.confPass = new FormControl('',[
			Validators.required
		]);
		this.address = new FormControl('',[
			Validators.required
		]);
		this.expertiseIds = new FormControl('',[
			Validators.required
		]);
		this.exp = new FormControl('',[
			Validators.required,
			validateWorkEx
		]);
		
		if(this.globalFunctionService.getUserCredentials().userId){
			this.vendorId = new FormControl(this.globalFunctionService.getUserCredentials().userId,[
				Validators.required
			]);
		}
		
		this.addEngForm = new FormGroup({
			realm 			: this.realm,
			fullName		: this.fullName,
			email 			: this.email,
			password		: this.password,
			confPass		: this.confPass,
			address 		: this.address,
			expertiseIds 	: this.expertiseIds,
			exp 			: this.exp,
			mobile			: this.mobile,
			vendorId		: this.vendorId
		});
		
		$('#largeModal8').modal({backdrop: 'static', keyboard: false});
		this.loading = false;
	}
	
	resetAddEngForm(){
		this.addEngForm.reset();
		if(!this.isEdit)this.addEngForm.controls['realm'].setValue('engineer');
		if(!this.isEdit && this.globalFunctionService.getUserCredentials().userId){
			this.addEngForm.controls['vendorId'].setValue(this.globalFunctionService.getUserCredentials().userId);
		}
		var inputs=document.getElementsByTagName("input");
		for (var i in inputs)
			if (inputs[i].type=="checkbox") inputs[i].checked=false;
		this.files = {};
		this.isEdit = false;
		this.selectedExperties = [];
		this.noServices = false;
		this.profilePic = 'assets/images/profile-img.png';
	}
	
	changeServices(id,evt){
		let newValue;
		if(evt.target.checked){
			// if(this.addEngForm.controls['expertiseIds'].value){
				// newValue = this.addEngForm.controls['expertiseIds'].value +  ',' + id;
			// }else{
				// newValue = id;
			// }
			this.selectedExperties.push(id);
			// if(this.noServices){
				// this.noServices = false;
			// }
			let value = this.selectedExperties.join(',');
			this.addEngForm.controls['expertiseIds'].setValue(value);
		}
		else{
			// let newArr = this.addEngForm.controls['expertiseIds'].value.split(',');
			// const index = newArr.indexOf(id);
			// console.log("index : ", index);
			// if(index !== -1){
				// newArr.splice(index,1);
				// if(this.isEdit)
					// this.selectedExperties.splice(index,1);
			// }
			// if(newArr.length == 0){
				// this.addEngForm.controls['expertiseIds'].markAsTouched();
			// }
			// newValue = newArr.join(',');
			
			const index = this.selectedExperties.indexOf(id);
			console.log('index : ', index);
			
			if(index !== -1){
				this.selectedExperties.splice(index,1);
			}
			if(this.selectedExperties.length == 0){
				this.addEngForm.controls['expertiseIds'].setValue('');
				this.addEngForm.controls['expertiseIds'].markAsTouched();
			}else{
				let value = this.selectedExperties.join(',');
				this.addEngForm.controls['expertiseIds'].setValue(value);
			}
			//this.addEngForm.controls['expertiseIds'].markAsTouched();
		}
		console.log("expertiseIds : ", this.addEngForm.controls['expertiseIds'].value);
	}
	
	getServices(){
		let _self = this;
		this.servicesApi.getAllServices().subscribe(
			(success)=>{
				//console.log("services offered : ", success);
				_self.servicesOffered = success.success.data;
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
	
	checkEngineerForm(){
		if(this.isEdit){
			if(this.addEngForm.valid && this.addEngForm.value.expertiseIds &&
			this.addEngForm.value.expertiseIds.length > 0){
				this.disableEng = true;
				let expertiseIds = this.addEngForm.value.expertiseIds.split(',');
				delete this.addEngForm.value.expertiseIds;
				let obj2 = {'expertiseIds' : expertiseIds};
				let obj = Object.assign({},this.addEngForm.value, obj2);
				obj.exp = +obj.exp;
				this.editEngineer(obj);
			}else{
				this.disableEng = false;
				this.addEngForm.controls['fullName'].markAsTouched();
				this.addEngForm.controls['email'].markAsTouched();
				this.addEngForm.controls['password'].markAsTouched();
				this.addEngForm.controls['confPass'].markAsTouched();
				this.addEngForm.controls['mobile'].markAsTouched();
				this.addEngForm.controls['exp'].markAsTouched();
				this.addEngForm.controls['address'].markAsTouched();
				this.addEngForm.controls['expertiseIds'].markAsTouched();
				//this.addEngForm.controls['expertiseIds'].markAsTouched();
				// if(this.servicesOffered.length > 0){
					// this.noServices = true;
				// }else{
					// this.noServices = false;
				// }
			}
		}else{
			if((this.addEngForm.value.password === this.addEngForm.value.confPass) && 
				this.addEngForm.valid && this.addEngForm.value.expertiseIds &&
				this.addEngForm.value.expertiseIds.length > 0){
				this.disableEng = true;
				let expertiseIds = this.addEngForm.value.expertiseIds.split(',');
				delete this.addEngForm.value.confPass;
				delete this.addEngForm.value.expertiseIds;
				let obj2 = {'expertiseIds' : expertiseIds};
				let obj = Object.assign({},this.addEngForm.value, obj2);
				obj.exp = +obj.exp;
				let data = { 'data' : obj, 'files' : this.files };
				this.addEngineer(data);
			}else{
				this.disableEng = false;
				this.disableEng = false;
				this.addEngForm.controls['fullName'].markAsTouched();
				this.addEngForm.controls['email'].markAsTouched();
				this.addEngForm.controls['password'].markAsTouched();
				this.addEngForm.controls['confPass'].markAsTouched();
				this.addEngForm.controls['mobile'].markAsTouched();
				this.addEngForm.controls['exp'].markAsTouched();
				this.addEngForm.controls['address'].markAsTouched();
				this.addEngForm.controls['expertiseIds'].markAsTouched();
				// if(!this.addEngForm.value.expertiseIds){
					// this.noServices = true;
				// }
			}
		}
	}
	
	addEngineer(obj){
		let _self = this;
		console.log("data to send : ", obj);
		this.multipartService.addEngineer(obj).subscribe(
			(success)=>{
				console.log("success : ", success);
				_self.globalFunctionService.successToast('Engineer Added Successfully','');
				_self.disableEng = false;
				_self.closeModal();
				_self.addEngModal.emit(null);
			},
			(error)=>{
				_self.disableEng = false;
				console.log("error : ", error);
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else{
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
			}
		);
	}
	
	editEngineer(obj){
		let _self = this;
		console.log("data to send : ", obj);
		this.peopleApi.editEngineer(obj.fullName, obj.email, obj.mobile,obj.password, obj.exp, obj.expertiseIds,obj.address,obj.engineerId).subscribe(
			(success)=>{
				console.log("success : ", success);
				_self.globalFunctionService.successToast('Engineer Profile Edited','');
				_self.disableEng = false;
				_self.closeModal();
				_self.addEngModal.emit(null);
			},
			(error)=>{
				_self.disableEng = false;
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