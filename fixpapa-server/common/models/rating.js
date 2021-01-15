'use strict';

var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/rating-msg.json");
module.exports = function(Rating) {
	disableAllMethods(Rating, ['find']);
	Rating.validatesInclusionOf('userRating', {in: [1,2,3,4,5]});
	/*Rating.giveRating = function(req, requestjobId, userRating, comment, cb){
		console.log("userRating = ",userRating);
        let providerId = req.accessToken.userId;
		Rating.app.models.Job.findById(requestjobId,function(error,jobInst){
			if(error) return cb(error,null);
			if(!jobInst) return cb(new Error("No job found"),null);
			

			Rating.findOne({
				where:{
					requestjobId:requestjobId,
					providerId:providerId
				}
			},function(error,ratingInst){
				if(error) return cb(error,null);

				if(ratingInst) return cb(new Error("Rating already exist"),null);
				console.log("hey this is running",providerId)
				
				//console.log("ji ha m hu khalnayak",peopleId)
				
				
				let peopleId = providerId.toString() == jobInst.creatorId.toString() ? jobInst.driverId : jobInst.creatorId;
				let rateBy = providerId.toString() == jobInst.creatorId.toString() ? "didCustGiveRate" : "didDriveGiveRate";

				Rating.app.models.People.findById(peopleId,function(error,peopleInst){
					if(error) return cb(error,null);

					Rating.create({
						jobId       : jobId,
						providerId  : providerId,
						peopleId    : peopleId,
						comment     : comment,
						userRating  : userRating
					},function(error,success){
						if(error) return cb(error,null);
						
						if(!peopleInst.rating){
							peopleInst.rating = {
								totalUsers  : 0,
								totalRating : 0,
								avgRating   : 0
							}
						}

						peopleInst.rateThisJob = null;
						peopleInst.rating.totalUsers++;
						peopleInst.rating.totalRating += userRating;
						peopleInst.rating.avgRating = peopleInst.rating.totalRating/peopleInst.rating.totalUsers; 

						jobInst[rateBy] = true;
						jobInst.save(function(){});
						
						peopleInst.save(function(error,success){
							cb(null,{data:success,msg:msg.giveRatingSuccess});
						})
						
					})	
				})
			})
			
		})
	}

	Rating.remoteMethod("giveRating",{
		accepts : [
			{arg:"req",type:"object",http:{source:"req"}},
			{arg:"jobId",type:"string", required:true, http:{source:"form"}},
			{arg:"userRating",type:"number", required:true, http:{source:"form"}},
			{arg:"comment",type:"string", required:false, http:{source:"form"}}
		],
		returns : {arg: "success",type:"object"}
	})*/


	Rating.giveRating =function(req,requestjobId,userRating,comment,cb){

		let providerId = req.accessToken.userId;
		let rateUserId ;
		let forUser;
		Rating.app.models.Requestjob.findById(requestjobId, function(err,jobInst){

			if(err)
				return cb(err,null)
			if(!jobInst)
				return cb(new Error("Job not found!!"),null)
			if(jobInst.customerId.toString() == providerId.toString()){
				forUser ="engineer";
				rateUserId = jobInst.engineerId;
			}else{
				forUser ="customer";
				rateUserId = jobInst.customerId;
			}

            var index = jobInst.ratedetail.findIndex(function(value){
           		return value.providerId.toString() == providerId.toString();
            })

            if(index == -1){
           		jobInst.ratedetails.create({//previously it was create if err occur change it to create method
					providerId : providerId,
					userRating: userRating,
					comment  : comment,
					forUser   : forUser
    			},function(err,success){
    				if(err) return cb(err,null);

    				updateUser();
    			})
            }
            else{
            	Rating.app.models.People.findById(providerId,function(err,peopleInst){
            		if(err) return cb(err,null);
	           		peopleInst.rateThisJob = null;
	           		peopleInst.save(function(){});        
	           		return cb(new Error("Rating already exists!!"));
	           	})	
            }

	            function updateUser(){
	           		Rating.app.models.People.findById(rateUserId,function(err,peopleInst){
						if(err) return cb(err,null)
						if(!peopleInst.rating){
							peopleInst.rating = {
								totalUsers  : 0,
								totalRating : 0,
								avgRating   : 0
							}
						}

						peopleInst.rateThisJob = null;
						peopleInst.rating.totalUsers++;
						peopleInst.rating.totalRating += userRating;
						peopleInst.rating.avgRating = peopleInst.rating.totalRating/peopleInst.rating.totalUsers; 

						peopleInst.save(function(err,success){
						 if(err)
						 	return cb(err,null)

			            	cb(null,{data:success,msg:msg.giveRatingSuccess})

						});
					});  	
		        }
 			
		});

	};
		Rating.remoteMethod("giveRating",{
		accepts : [
			{arg:"req",type:"object",http:{source:"req"}},
			{arg:"requestjobId",type:"string", required:true, http:{source:"form"}},
			{arg:"userRating",type:"number", required:true, http:{source:"form"}},
			{arg:"comment",type:"string", required:false, http:{source:"form"}}

		],
		returns : {arg: "success",type:"object"}
	})









	Rating.getRatings = function(peopleId, cb){
		Rating.find({
			where:{
				peopleId:peopleId
			},
			include:{
				relation:"provider",
				scope:{
					fields:{name:true,profileImage:true}
				}
			}
		},function(error,ratings){
			if(error) return cb(error,null);
			cb(null,{data:ratings, msg:msg.getRatings});
		})
	}

	Rating.remoteMethod("getRatings",{
		accepts : [
			{arg:"peopleId", type:"string", required:true}
		],
		returns : {arg:"success", type:"object"},
		http:{verb:"get"} 
	})
};
