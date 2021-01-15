import { Injectable } from '@angular/core';

@Injectable()
export class ResizeImageService {

	constructor() {}
	
	/*showimagepreview(input){ //image preview after select image
		if (input.files && input.files[0]){
		var filerdr = new FileReader();

		filerdr.onload = function(e){
			var img = new Image();
			img.onload = function(){
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				canvas.width = 250;
				canvas.height = canvas.width * (img.height / img.width);
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				// SEND THIS DATA TO WHEREVER YOU NEED IT
				var data = canvas.toDataURL('image/png');

				$('#imgprvw').attr('src', img.src);
				//$('#imgprvw').attr('src', data);//converted image in variable 'data'
			}
			img.src = e.target.result;
		}
		filerdr.readAsDataURL(input.files[0]);
		}
	}*/
	
	// The function that scales an images with canvas then runs a callback.
	/*scaleImage(url, width, height, liElm, callback){
		let img = new Image();

		// When the images is loaded, resize it in canvas.
		img.onload = function(){
			let canvas = <HTMLCanvasElement> document.createElement("canvas"),
			ctx = canvas.getContext("2d");

			canvas.width = width;
			canvas.height= height;

			// draw the img into canvas
			ctx.drawImage(this, 0, 0, width, height);

			// Run the callback on what to do with the canvas element.
			callback(canvas, liElm);
		};

		img.src = url;
	}*/
	
	/*// List of imgur images
	let images = ['u0s09PV','bdRlP3o','o7lwgZo','wvOjdUJ','D0lsDQz','sB46sHZ','nvRcyJM'],
	imagesList = document.getElementById('imagesList');

	// Loop through the images.
	for(i in images){
		// make an li we can use in the callback.
		liElm = document.createElement('li');
	
		// append the currently empty li into the ul.
		imagesList.appendChild(liElm);

		scaleImage('http://i.imgur.com/'+images[i]+'.jpg', 150, 150, liElm, function(canvas, liElm){
			// Append the canvas element to the li.
			liElm.appendChild(canvas);
		});
	}*/
}
