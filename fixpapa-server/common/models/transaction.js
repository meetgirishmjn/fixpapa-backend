'use strict';
/*var crypto=require('crypto');

var now= (new Date()).valueOf().toString();
var random = Math.random().toString();*/
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var config = require("../../server/config.json");
var paytm_checksum = require('../services/Paytm_Web_Sample_Kit_NodeJs-master/checksum/checksum');
var msg = require("../messages/transaction-msg.json");
var config = require("../../server/config.json");
var MID = "FIXPAP29847308876050";
var merchantKey ="BE_ObbEs8!&AAdr_"
var request = require("request");

module.exports = function(Transaction) {

	/*function createHashkey(TransactionId){

		var hash = crypto.createHash('sha1').update(now+random).digest('hex');     //this is your unique hash
		console.log("hash key",hash);
	}*/
	disableAllMethods(Transaction, ['find','deleteById']);

	Transaction.generateChecksum =function(data,cb){
		//console.log("before",data);
		//return cb(null,data);
		
		
		
		
		paytm_checksum.genchecksum(data, merchantKey, function (err, success) {
					
					if(err)
						return cb(err,null)
					else{
						console.log("success",success)
						//cb(null,{data:success,msg:msg.generateChecksum});
						cb(null,success)

					}
						
					});
	}


	Transaction.remoteMethod('generateChecksum',{
		accepts:[
		 { arg: 'data', type: 'object', http: { source: 'body' } },
	  

		],
		returns :{arg:"success",type :"object",root:true},
		http :{verb:'post'}

	})



	Transaction.paytmResponseUrl =function(req,res,cb){
		let response = res.req.body;
		
		console.log("paytmResponseUrl",response);
		var merchantKey ="BE_ObbEs8!&AAdr_";
		var resp = paytm_checksum.verifychecksum(response,merchantKey);

		//console.log("verified checksum :",resp);
		


		console.log(" Paytm response:-",response);
		if(resp == true && response.STATUS !="TXN_FAILURE"){
			Transaction.findById(response.ORDERID,function(err,tranInst){
				if(err)
					return cb(err,null);
				else{
					console.log("tranInst data",tranInst);
					response.status = "done";
					tranInst.updateAttributes(response,function(err,success){
		               if(err)
			 	         return cb(err,null);
		               else{


		               	Transaction.app.models.Requestjob.findById(tranInst.JobId,function(err,jobInst){
							if(err)
								return cb(err,null);
							else{
								jobInst.status ="paymentDone";
								jobInst.paymentDoneDate=new Date();
								jobInst.save(function(err,success){});
								Transaction.app.models.Notification.onlinePaymentNoty(jobInst,new Date(), function() {});
								Transaction.app.models.Notification.onlinePaymentCustNoty(jobInst,new Date(), function() {});
							}
						})
						
		   		         
		   		         return res.redirect('/api/Transactions/payment-success');
		               }

		   	            


		   	         });
			        }
		        })
		}
		else
		{
			//var obj = {'STATUS':"INVALID"};
			return res.redirect('/api/Transactions/payment-failure');
			//res.redirect(config.redirectUrl+'payment-failure');
		}
		
		/*Transaction.checksumVerify(response,function(err,verifies){
			if(err)
				return cb(err,null)
			else{

				Transaction.create(response,function(err,success){
			    if(err)
				 return cb(err,null)
			    else
			    res.render('paytm-response',{success:success});
				 //cb(null,{data:success,msg:msg.redirectUrl});
		     })
		   }
		})*/
		
		
	}


	Transaction.remoteMethod('paytmResponseUrl',{
		accepts:[
	   { arg: 'req', type: 'object', http: { source: 'req' } },
	   { arg: 'res', type: 'object', http: { source: 'res' } }
		],
		returns :{arg:"success",type :"object"},
		http :{verb:'post'}

	})

	Transaction.checksumVerify =function(data,cb){

		let obj ={}

		obj = data;
		var merchantKey ="BE_ObbEs8!&AAdr_"

		paytm_checksum.verifychecksum(obj,merchantKey,function(err,success){
			if(err)
				return cb(err,null)
			else
			//cb(null,{data:success,msg:msg.checksumVerified});
			console.log("success verify",success)
		    cb(null,success)
		})
	}


	Transaction.remoteMethod('checksumVerify',{
		accepts:[
	  {arg: 'data', type: 'object', http: { source: 'form' } }
		],
		returns :{arg:"success",type :"object",root:true},
		http :{verb:'post'}

	})


	/*Transaction.payment =function(req,res,cb){

		/*let data ={
		  MID: 'FIXPAP78716680122755',
          ORDER_ID: 'FP-rJknA5jem',
		  CUST_ID: '5af963cebf50076a2a898860',
		  INDUSTRY_TYPE_ID: 'Retail',
		  CHANNEL_ID: 'WEB',
		  TXN_AMOUNT: '1',
		  WEBSITE: 'WEBSTAGING',
		  EMAIL: 'dollygarg137@gmail.com',
		  MOBILE_NO: '7777777777'

		}
		
		
		var merchantKey ="gc9r70IY8AC4wwfs"
		console.log("req data", req.body);
		paytm_checksum.genchecksum(req.body, merchantKey, function (err, success) {
					
					if(err)
						return cb(err,null)
					else{
						console.log("success",success)
						//cb(null,{data:success,msg:msg.generateChecksum});
						//cb(null,success)
						res.render('paytm-payment', { restdata: success});


					}
						
					});
	}


	Transaction.remoteMethod('payment',{
		accepts:[
	 // {arg: 'data', type: 'object', http: { source: 'form' } },
	  {arg: 'req', type: 'object', http: { source: 'req' } },
	  {arg: 'res', type: 'object', http: { source: 'res' } }
		],
		returns :{arg:"success",type :"object",root:true},
		http :{verb:'get'}

	})*/


	Transaction.payment =function(req,res,cb){
		let pDate = new Date();
		var merchantKey ="BE_ObbEs8!&AAdr_"
		console.log("req.body ka data:",req.body);
		var orderId = req.body.ORDER_ID;
		let filter ={}
         if (!filter.where)
        
       filter.where = {};
   			filter.where.orderId = orderId;
     
      filter.include = [{
            relation: "category"
          },
          {
            relation: "product"
          },
          {
            relation: "brand"
          },
          {
            relation:"engineer",
            scope:{
              fields:{fullName:true,mobile:true,exp:true,image:true}
            }
          },
          {
            relation:"vendor",
            scope:{
              fields:{fullName:true,mobile:true,exp:true}
            }
          },
          {
            relation:"customer",
            scope:{
              fields:{fullName:true,mobile:true,email:true,image:true}
            }
          }
          ]
		Transaction.app.models.Requestjob.findOne(filter,function(err,jobInst){
			if(err)
				return cb(err,null)
			else
			{
				if(!jobInst)
					return cb(new Error("Job not found"),null);
				let data ={
				  JobId  :  jobInst.id,
		          orderId: jobInst.orderId,
				  ProviderId: jobInst.customerId,
				  modeOfPayment : "online",
				  Email: jobInst.customer.email,
				  Mobile: jobInst.customer.mobile,
				  VendorId : jobInst.vendorId,
				  status   : "pending",
				  paymentDate:new Date()
				}

				Transaction.create(data,function(err,success){

					if(err)  return cb(err,null)
					else{
						
						Transaction.app.models.Requestjob.findById(success.JobId,function(err,job){
							if(err) return cb(err,null)
							job.updateAttributes({transactionId:success.id},function(err,done){
								if(err)
									return cb(err,null)
								else
								{
							req.body.ORDER_ID=success.id.toString();	
					      console.log("req data", req.body);
					      paytm_checksum.genchecksum(req.body, merchantKey, function (err, success) {
								
								if(err)
									return cb(err,null)
								else{
									console.log("success",success)
									//cb(null,{data:success,msg:msg.generateChecksum});
									//cb(null,success)
									res.render('paytm-payment', { restdata: success});


								}
									
								});
								}
							})	

						

						    
						})
					}


				});

				


			}
		})


		

		
	}


	Transaction.remoteMethod('payment',{
		accepts:[
	 // {arg: 'orderId', type: 'string', http: { source: 'form' } },
	  {arg: 'req', type: 'object', http: { source: 'req' } },
	  {arg: 'res', type: 'object', http: { source: 'res' } }
		],
		returns :{arg:"success",type :"object",root:true},
		http :{verb:'post'}

	})


	Transaction.cashPayment =function(orderId,cb){
		let pDate = new Date();
		let filter ={}
         if (!filter.where)
        
       filter.where = {};
   filter.where.orderId =orderId;
     
      filter.include = [{
            relation: "category"
          },
          {
            relation: "product"
          },
          {
            relation: "brand"
          },
          {
            relation:"engineer",
            scope:{
              fields:{fullName:true,mobile:true,exp:true,image:true}
            }
          },
          {
            relation:"vendor",
            scope:{
              fields:{fullName:true,mobile:true,exp:true}
            }
          },
          {
            relation:"customer",
            scope:{
              fields:{fullName:true,mobile:true,email:true,image:true}
            }
          }
          ]
		Transaction.app.models.Requestjob.findOne(filter,function(err,jobInst){
			if(err)
				return cb(err,null)
			else
			{
				if(!jobInst)
					return cb(new Error("Job not found"),null);
				let data ={
				  JobId  :  jobInst.id,
		          orderId: jobInst.orderId,
				  ProviderId: jobInst.customerId,
				  modeOfPayment : "cash",
				  Email: jobInst.customer.email,
				  Mobile: jobInst.customer.mobile,
				  Amount : jobInst.bill.total,
				  VendorId : jobInst.vendorId,
				  status   : "pending",
				  paymentDate: new Date()
				}
				console.log("data",data);

				jobInst.updateAttributes({status:"paymentDone"},function(err,success){})

				Transaction.create(data,function(err,success){
					if(err)
						return cb(err,null)
					else{

						Transaction.app.models.Requestjob.findById(success.JobId,function(err,job){
							if(err) return cb(err,null)
							job.updateAttributes({transactionId:success.id},function(err,done){})	

						})
						cb(null,{data:success,msg:msg.cashPayment});
						Transaction.app.models.Notification.cashPaymentNoty(jobInst,new Date(), function() {});
						Transaction.app.models.Notification.cashPaymentCustNoty(jobInst,new Date(), function() {});

					}
					
				});


			}
		})

	}


	Transaction.remoteMethod('cashPayment',{
		accepts:[
	 {arg: 'orderId', type: 'string', http: { source: 'form' } }
	 
	  ],
		returns :{arg:"success",type :"object"},
		http :{verb:'post'}

	})


	Transaction.paymentSuccess =function(req,res){

		res.render('payment-success');
	}

	Transaction.remoteMethod('paymentSuccess',{
		accepts:[
	 {arg: 'req', type: 'object', http: { source: 'req' } },
	 {arg: 'res', type: 'object', http: { source: 'res' } }
	  ],
		//returns :{arg:"success",type :"object"},
		http :{verb:'get',path:"/payment-success"}

	})



	Transaction.paymentFailure =function(req,res){

		res.render('payment-failure');
	}

	Transaction.remoteMethod('paymentFailure',{
		accepts:[
	 {arg: 'req', type: 'object', http: { source: 'req' } },
	 {arg: 'res', type: 'object', http: { source: 'res' } }
	  ],
		//returns :{arg:"success",type :"object"},
		http :{verb:'get',path:"/payment-failure"}

	})


	Transaction.getStatus =function(orderId,cb){

		// getTxnStatus({"MID":"MID","ORDERID":"ORDERID","CHECKSUMHASH":"CHECKSUMHASH"},function(err,success){

		// })
		let data = {
			MID:MID,
			ORDERID:orderId
		}
		paytm_checksum.genchecksum(data, merchantKey, function (err, success) {
			if(err) return cb(err,null);
			// cb(null,success);
			
			success.CHECKSUMHASH = encodeURI(success.CHECKSUMHASH);
			console.log(success)
			let options = {
				method : "POST",
				url : "https://securegw.paytm.in/merchant-status/getTxnStatus",
				'content-type': 'application/json',
				body:success,
				json:true
			}
			request(options, function (error, response, body) {
				if (!error && response.statusCode == 200) {
				    var info = body;
				    cb(null,info);
				}else{
					cb(error, null);
				}
			});
			console.log(success)

		})

	}

	Transaction.remoteMethod("getStatus",{
		accepts:[
			{arg:"orderId",type:"string",http:{source:"query"}}
		],
		returns : {arg:"success",type:"object",root:true},
		http:{verb:"get"}
	})


	Transaction.chequePayment =function(orderId,bankName,chequeNumber,chequeDate,cb){
		//let pDate = new Date();
		
		let filter ={}
         if (!filter.where)
        
       filter.where = {};
   		filter.where.orderId =orderId;
     
      filter.include = [{
            relation: "category"
          },
          {
            relation: "product"
          },
          {
            relation: "brand"
          },
          {
            relation:"engineer",
            scope:{
              fields:{fullName:true,mobile:true,exp:true,image:true}
            }
          },
          {
            relation:"vendor",
            scope:{
              fields:{fullName:true,mobile:true,exp:true}
            }
          },
          {
            relation:"customer",
            scope:{
              fields:{fullName:true,mobile:true,email:true,image:true}
            }
          }
          ]
		Transaction.app.models.Requestjob.findOne(filter,function(err,jobInst){
			if(err)
				return cb(err,null)
			else
			{
				if(!jobInst)
					return cb(new Error("Job not found"),null);
				let data ={
				  JobId  :  jobInst.id,
		          orderId: jobInst.orderId,
				  ProviderId: jobInst.customerId,
				  modeOfPayment : "cheque",
				  Email: jobInst.customer.email,
				  Mobile: jobInst.customer.mobile,
				  Amount : jobInst.bill.total,
				  VendorId : jobInst.vendorId,
				  status   : "done",
				  bankName : bankName,
				  chequeNumber : chequeNumber,
				  chequeDate   : chequeDate,
				  paymentDate : new Date()
				}
				console.log("data",data);

				jobInst.updateAttributes({status:"paymentDone"},function(err,success){})

				Transaction.create(data,function(err,success){
					if(err)
						return cb(err,null)

					else{

						Transaction.app.models.Requestjob.findById(success.JobId,function(err,job){
							if(err) return cb(err,null)
							job.updateAttributes({transactionId:success.id},function(err,done){})	

						    cb(null,{data:success,msg:msg.chequePayment});
						    Transaction.app.models.Notification.chequePaymentNoty(jobInst,new Date(), function() {});
						    Transaction.app.models.Notification.chequePaymentCustNoty(jobInst,new Date(), function() {});
						})
					}
					
				});


			}
		})

	}


	Transaction.remoteMethod('chequePayment',{
		accepts:[
	 {arg: 'orderId', type: 'string', http: { source: 'form' } },
	 {arg: 'bankName', type: 'string', http: { source: 'form' } },
	 {arg: 'chequeNumber', type: 'string', http: { source: 'form' } },
	 {arg: 'chequeDate', type: 'string', http: { source: 'form' } }
	 
	  ],
		returns :{arg:"success",type :"object"},
		http :{verb:'post'}

	})






	

















};
