'use strict'

module.exports ={

	
	getOTP : function(){
	    var val = Math.floor(1000 + Math.random() * 9000);
	    return val;
	},

	timeCoversion : function(startTime){

		var startTime;
		
		var a = startTime.split(':');
		var minutes = (+a[0]) * 60 + (+a[1]);
		return minutes;

	},
	getImageArray : function(arr){
		let newArr = [];
		arr.forEach(function(value){
			newArr.push(value.url);
		})
		return newArr;
	}
}