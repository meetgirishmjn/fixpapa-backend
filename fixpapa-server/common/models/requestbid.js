'use strict';
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/bid-msg.json");
var objectID = require('mongodb').ObjectID;

module.exports = function(Requestbid) {
			
		disableAllMethods(Requestbid, ['find']);
		Requestbid.validatesInclusionOf('status', { in: ['requested', 'accepted', 'canceled','deleted'] });
		//Requestbid.validatesInclusionOf('setupType', { in: ['Small IT Setup (Home User)','Medium IT Setup (Office User)', 'Large IT Setup (Industry User)'] });


	Requestbid.createBid =function(req,bidDetail,description,startDate,endDate,estiBudget,address,bidId,cb){
		
		let peopleId = req.accessToken.userId;

		let data ={
			peopleId	 :      peopleId,
			description	 :      description,
			startDate	 :      startDate,
			endDate      :      endDate,
			estiBudget	 :      estiBudget,
			address      :      address,
			bidId		 :      bidId,
			status		 :      "requested",
			createdAt    :      new Date(),
        	updatedAt    :      new Date()
		};
			
		let isAllIdRight = true;
		let arr = [];
		bidDetail.forEach(function(detail){
			// console.log(detail.servicesId,objectID.isValid(detail.servicesId))
			if(!objectID.isValid(detail.servicesId))
				isAllIdRight = false;

			arr.push(detail.servicesId);		
		});

		// console.log(bidDetail)
		if(!isAllIdRight){
			return  cb(new Error("Invalid job info"),null);
		}
		console.log("*********************************************");
		console.log("come in first part")
		Requestbid.app.models.Services.find({where:{id:{inq:arr}}},function(errorS,servicesList){
			if(errorS) return cb(errorS,null);
			console.log("come in second part")
			servicesList.forEach(function(service){
				bidDetail.forEach(function(detail){
					if(detail.servicesId.toString() == service.id.toString()){
						detail.jobName = service.name;
					}
				});
			});

			Requestbid.create(data,function(error,request){
	      		if(error) return cb(error,null);
		        bidDetail.forEach(function(detail){
		            request.bidDetails.create(detail,function(err,success){});
		        });
		        cb(null,{data:request,msg:msg.createBid});
	    	});

		});

	};

	Requestbid.remoteMethod("createBid", {
	    accepts: [
		    { arg: "req", type: "object", http: { source: "req" } },
		    { arg: "bidDetail", type: "array", http: { source: "form" } },
			{ arg: "description", type: "string", http: { source: "form" } },
		    { arg: "startDate", type: "Date", http: { source: "form" } },
		    { arg: "endDate", type: "Date", http: { source: "form" } },
		    { arg: "estiBudget", type: "number", http: { source: "form" } },
		    { arg: "address", type: "string", http: { source: "form" } },
		    { arg: "bidId", type: "string", http: { source: "form" } }
	    ],
	  	returns: { arg: "success", type: "object" }
	});

	Requestbid.getAllBidReq =function(skip,limit,cb){
		limit = limit || 10;
    	// let filter ={};
    	// filter.skip=skip;
    	// filter.limit =limit;
    	// if (!filter.where)
    	// filter.where = {};
	    // filter.order = "date DESC";
    	// Requestbid.find(filter,function(err, requests) {
		   //  if (err) {
		   //      cb(err, null);
		   //  } 
	        let aggregate ={  
		       	aggregate:[
			       	{
						$lookup:{
				           from: "People",
				           localField: "peopleId",
				           foreignField: "_id",
				           as: "people"
				        }
					},
					{
			       		$unwind :{
			       			path :"$people",
			       			preserveNullAndEmptyArrays: false
			       		}
			       	},
			       	{
						$project:{
							"_id"                  : 1,
							"address"              : 1,
							"description"          : 1,
							"startDate"            : 1,
							"endDate"              : 1,
							"estiBudget"           : 1,
							"status"               : 1,
							"peopleId"             : 1,
							"createdAt"            : 1,
							"updatedAt"            : 1,
							"people.realm"         : "$people.realm",
							"people.fullName"      : "$people.fullName",
							"people.email"         : "$people.email",
							"people.mobile"        : "$people.mobile",
							"people.image"         : "$people.image",
							"bidDetail"            : "$bidDetail",
							"bidId"                : "$bidId",
						}
					},
					{ $sort : { createdAt : -1} },
			    ]
			};
	        Requestbid.aggregate(aggregate,{},function(error,requests){
	            if(error) 
	          		return cb(error,null);
	            else {
	            	let arr  = [];
				    skip = skip || 0;
			        arr = requests.slice(skip,skip+limit); 
	            	// let totalCount = 0;
	                cb(null, { data: arr,count:requests.length, msg: msg.getBidRequest });
	        	}
        	});
	    // });
    };
	

	Requestbid.remoteMethod('getAllBidReq', {
    accepts: [
    {arg :"skip",type :"number"},
    {arg :"limit",type :"number"}
    	],
    returns: {
      arg: 'success',type: 'object'},
    http: { verb: 'get' },
  });




};
