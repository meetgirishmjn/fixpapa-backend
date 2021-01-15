import { Component, OnInit} from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable'; 
import { MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';

import { RequestjobApi } from './../../sdk/index';
import { GlobalFunctionService } from './../../services/global-function.service';

declare var $:any;

@Component({
  selector: 'app-live-location',
  templateUrl: './live-location.component.html',
  styleUrls: ['./live-location.component.css']
})
export class LiveLocationComponent implements OnInit {

	jobId : any;
	formatted_address : any;
	pos : any = {};
	constructor(private globalFunctionService : GlobalFunctionService, private requestjobApi : RequestjobApi, private afd : AngularFireDatabase, private mapsAPILoader : MapsAPILoader) {
		this.pos = { lat : -1, lng : -1, rem_distance : -1, rem_duration : -1};
	}

	ngOnInit(){
	}
	
	openModal(data){
		this.jobId = data.jobId;
		$('#live-location').modal({backdrop : 'static', keyboard : false});
		this.formatted_address = "";
		this.getJobById(this.jobId);
	}
	
	closeModal(){
		$('#live-location').modal('hide');
	}
	
	getJobById(id){
		let _self = this;
		this.requestjobApi.getJobById(id).subscribe(
			(success)=>{
				console.log("job : ", success);
				if(success.success.data.status === 'on the way'){
					_self.checkForLiveLocation(id);
				}else{
					_self.globalFunctionService.infoToast(success.success.data.status);
				}
			},
			(error)=>{
				if(error === 'Server error'){
					_self.globalFunctionService.navigateToError('server');
				}else if(error.statusCode === 401){
					_self.globalFunctionService.navigateToError('401');
				}else{
					console.log('error : ', error);
					_self.globalFunctionService.errorToast(error.message,'oops');
				}
				console.log("error : ", error);
			}
		);
	}
	
	checkForLiveLocation(jobId){
		this.pos = { lat : -1, lng : -1, rem_distance : -1, rem_duration : -1};
		let _self = this;
		var locationRef = this.afd.database.ref(`locations/${jobId}`);

		locationRef.orderByValue().limitToLast(7).on("value", function(snapshot){
			console.log("snapshot : ", snapshot);
			let obj = {};
			snapshot.forEach(function(data){
				let keys = Object.keys(_self.pos);
				for(var i=0;i<=keys.length-1;i++){
					if(keys[i] === data.key){
						if(data.key == 'lat'){
							_self.pos.lat = data.val();
						}
						if(data.key == 'lng'){
							_self.pos.lng = data.val();
						}
						if(data.key == 'rem_duration'){
							_self.pos.rem_duration = data.val();
						}
						if(data.key == 'rem_distance'){
							_self.pos.rem_distance = data.val();
						}
					}
					// console.log("The " + data.key + " score is " + data.val());
				}
				// console.log("pos : ", _self.pos);
				return false;
			});
			//_self.checkForAddress(_self.pos);
		});
	}
	
	checkForAddress(pos){
		let _self = this;
		_self.formatted_address = '';
		this.mapsAPILoader.load().then(()=>{
			console.log("map loaded");
			_self.pos = pos;
			//let infoWindow = new google.maps.InfoWindow;
			// Try HTML5 geolocation.
			if (navigator.geolocation){
				let geocoder = new google.maps.Geocoder();
				geocoder.geocode({ location: new google.maps.LatLng(this.pos.lat,this.pos.lng)}, function(results, status) {
					if (results) {
						console.log("results : ", results);
						_self.formatted_address = results[0].formatted_address;
						//infoWindow.setContent(formatted_address);
					}else{
						console.log('Geocode was not successful for the following reason: ' + status);
					}
				});
			}else{
				// Browser doesn't support Geolocation
				let browserHasGeolocation = false;
				_self.formatted_address = browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.';
			}
		});
    }
}
