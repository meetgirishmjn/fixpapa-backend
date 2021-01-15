/*import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject'; 

@Injectable()
export class MessagingService {
	private messaging = firebase.messaging();
	private messageSource = new Subject();
	currentMessage = this.messageSource.asObservable() // message observable to show in Angular component
	constructor(private afs: AngularFirestore) {}
 
	getPermission() {
		let _self = this;
		this.messaging.requestPermission()
		.then(() => {
			console.log('Notification permission granted.');
			return this.messaging.getToken();
		})
		.then(token => {
			console.log("requested token : ",token);
			//_self.globalFunctionService.setToken(token);
		})
		.catch((err) => {
			console.log('Unable to get permission to notify.', err);
		});
	}
	
	requestToken(){
		let _self = this;
		this.messaging.getToken()
		.then(token => {
			console.log("requested token : ", token);
			_self.peopleApi.updateToken(token).subscribe(
					(success)=>{
						console.log("token updated : ",success);
					},
					(error)=>{
						console.log("error : ", error);
					}
				);
		})
		.catch((error)=>{
			console.log("firebase access token error : ", error);
		})
	}
	
	monitorRefresh(){
		let _self = this;
		this.messaging.onTokenRefresh(() => {
			_self.messaging.getToken()
			.then(refreshedToken => {
				console.log('Token refreshed.', refreshedToken);
				_self.peopleApi.updateToken(refreshedToken).subscribe(
					(success)=>{
						console.log("token updated : ",success);
					},
					(error)=>{
						console.log("error : ", error);
					}
				);
			})
			.catch( err => console.log(err, 'Unable to retrieve new token') )
		});
	}
	
	private saveToken(user, token): void {
		const currentTokens = user.fcmTokens || { }
		if (!currentTokens[token]){
		  const userRef = this.afs.collection('users').doc(user.uid)
		  const tokens = { currentTokens, [token]: true }
		  userRef.update({ fcmTokens: tokens })
		}
	}
}*/