'use strict';
var globalFunction = require("../services/global-function");
//var msg = require("../messages/otp-msg.json");
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var gf = require("../services/global-function");
const request = require("request");

module.exports = function(Otp) {

		disableAllMethods(Otp, ["find"]);

		Otp.sendSMS = function(smsData,cb){
		var apiKey="Wmaxn7FmgAP";
		var senderid = "FIXPAA";
		var serviceName = "TEMPLATE_BASED";
		var msg = `<#> ${smsData.otp} is your OTP for logging into the FixPapa. Valid for 5 minutes. CV6JcAMLA/L`;
		//var msg =	`Your otp is ${smsData.otp}. Valid for 5 minutes.`
		let encodedMsg = encodeURIComponent(msg) 
		var url = `https://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=${apiKey}&MobileNo=${smsData.mobile}&SenderID=${senderid}&Message=${encodedMsg}&ServiceName=${serviceName}`;
		console.log("uRL:::",url)
		//url= encodeURIComponent(url);
       	//url += "&contacts="+smsData.mobile;
        //url += "&msg="+msg;
		// ?uname=ankshademo&password=123456&sender=SMSOTP&receiver=9649165819&route=TA&msgtype=1&sms=This is your otp 1234
		//url = encodeURI(url);
		// cb(null,{success:"success"});
		console.log("****************Url**********************");
		console.log(url);
		console.log("****************Url**********************");
		request.get(url,function(error, response, body){
				if(error)
				{
					return cb(error,null);
					console.log("Error coming",error);
				}

				else
				{
					cb(null,{success:body});
					console.log("success part",{success:body});
				}

			}
		)	
	}

	Otp.remoteMethod("sendSMS",{
		accepts : [
			{"arg":"smsData","type":"object",http:{source:"body"}}
				  ],
		returns : {arg:"success",type:"object"}
	})


	Otp.sendSecondSMS = function(smsData,cb){
		var apiKey="Wmaxn7FmgAP";
		var senderid = "FIXPAA";
		var serviceName = "TEMPLATE_BASED";
		var msg = `Currently we are not available at your desired location.We will definitely contact you once we will reach at your location.
Regards FIXPAPA.`;
		//var msg =	`Your otp is ${smsData.otp}. Valid for 5 minutes.`
		let encodedMsg = encodeURIComponent(msg) 
		var url = `https://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=${apiKey}&MobileNo=${smsData.mobile}&SenderID=${senderid}&Message=${encodedMsg}&ServiceName=${serviceName}`;
		console.log("uRL:::",url)
		//url= encodeURIComponent(url);
       	//url += "&contacts="+smsData.mobile;
        //url += "&msg="+msg;
		// ?uname=ankshademo&password=123456&sender=SMSOTP&receiver=9649165819&route=TA&msgtype=1&sms=This is your otp 1234
		//url = encodeURI(url);
		// cb(null,{success:"success"});
		console.log("****************Url**********************");
		console.log(url);
		console.log("****************Url**********************");
		request.get(url,function(error, response, body){
				if(error)
				{
					return cb(error,null);
					console.log("Error coming",error);
				}

				else
				{
					cb(null,{success:body});
					console.log("success part",{success:body});
				}

			}
		)	
	}

	Otp.remoteMethod("sendSecondSMS",{
		accepts : [
			{"arg":"smsData","type":"object",http:{source:"body"}}
				  ],
		returns : {arg:"success",type:"object"}
	})



};
