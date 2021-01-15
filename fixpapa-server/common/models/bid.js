'use strict';
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/bid-msg.json");

module.exports = function(Bid) {

	disableAllMethods(Bid, ['find']);


	  //Bid.validatesInclusionOf('setupType', { in: ['Small', 'Medium', 'Large'] });
	  //Bid.validatesInclusionOf('typeOfAmc', { in: ['Comphrehensive', 'Non-Comphrehensive'] });



	Bid.addBidType =function(req,res,cb){
	
    function uploadFile() {
      Bid.app.models.Container.imageUpload(req, res, { container: 'images' }, function(err, success) {
        if (err)
          cb(err, null);
        else
          if (success.data) {
          success.data = JSON.parse(success.data);
          createBid(success);
        } else {
          cb(new Error("data not found"), null);
        }
          //createUser(success);
      });
    }

    function createBid(obj) {
      let bidId =req.query.bidId;

      var data = {
        //name: obj.data.name,
       name   :      obj.data.name,
      servicesIds :      obj.data.servicesIds,
      noOfSystems :      obj.data.noOfSystems,
      deleted     :      false
        };

      
      data.createdAt = new Date();
      data.updatedAt = new Date();
     
      
      if (obj.files) {
        if (obj.files.image)
          data.image = obj.files.image[0].url;

        }

      if(!bidId)
      {
       Bid.create(data, function(err, success) {
        if (err)
          cb(err, null);
        else
           cb(null,{data:success,msg:msg.addBidType});
          
          //cb(null,success)
      });
     }
     else{
      Bid.findById(bidId, function(err, bidInst) {
        if (err) return cb(err, null);
        data.updatedAt =new Date();

    bidInst.updateAttributes(data, function(err, success) {
        if (err)
          cb(err, null);
        else
           cb(null,{data:success,msg:msg.editBid});
       
           });
        });
    }
  }
  uploadFile();
  };

	Bid.remoteMethod('addBidType',{
    accepts:[
     { arg: 'req', type: 'object', http: { source: 'req' } },
     { arg: 'res', type: 'object', http: { source: 'res' } }

    ],
    returns :{arg:"success",type :"object"},
    http :{verb:'post'}

  });
  
	/*Bid.getAllBid = function(cb) {
    Bid.find({
        include:{
          relation:"services",
          scope: {
          fields:{"id":true ,"name":true} 
        }

      }
    },function(err, success) {
      if (err) {
        cb(err, null)
      } else {
        
        cb(null, { data: success, msg: msg.getAmc });
      }
    })
  }

	  Bid.remoteMethod("getAllBid", {
	    returns: { arg: "success", type: "object" },
	    http: { verb: "get" }
	  })

*/    
    Bid.getAllBid = function(filter,cb) {
        
        if (!filter)
            filter = {};
        if (!filter.where)
            filter.where = {};
        
        filter.where.deleted = {neq:true};
        filter.order = "name ASC";
        filter.include = {
        
          relation:"services",
          scope: {
          fields:{"id":true ,"name":true} 
            }
          };
        

        Bid.find(filter, function(error, success) {
            if (error)
               return  cb(error, null);
            cb(null, { data: success, msg: msg.getBids });

        });
    };

        Bid.remoteMethod("getAllBid", {
        accepts: [
            { "arg": "filter", "type": "object" }
        ],
        returns: { "arg": "success", "type": "object" },
        http: { "verb": "get" }
    });


	  Bid.edit =function(req,res,cb){

      console.log(req.query,"hello");
       // cb(null,req.query);

      console.log(req.query);
        //cb(null,req.query);
        if(!req.query.bidId)
          return cb(new Error("Id is not defined"),null);
        else
        {
          Bid.addBidType(req,res,cb);
        }
         
  };


    Bid.remoteMethod("edit", {
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "res", type: "object", http: { source: "res" } }
     
   ],
    returns: { arg: "success", type: "object" }
  });

  Bid.getBid =function(bidId,cb){

    Bid.findById(bidId,{
        include:{
          relation:"services",
          scope: {
          fields:{"id":true ,"name":true} 
        }

        }
    },function(err,success){
      if(err)
         return cb(err,null);
       else
          cb(null,{data: success, msg: msg.getBid});

    });
  };

    Bid.remoteMethod('getBid',{

    accepts: [
      { arg: "bidId", type: "string",required: true }
      
    ],
    returns: { arg: "success", type: "object" },
    http :{verb:'get'}


  });


    Bid.delete = function(bidId, req, cb) {
        Bid.findById(bidId, function(error, bidInst) {
            if (error)
                cb(error, null);
            else {
                if (bidInst) {
                    if (!bidInst.deleted) {
                        bidInst.deleted = true;
                        bidInst.deletedDate = new Date();
                        bidInst.save(function(error, inst) {
                            if (error)
                                cb(error, null);
                            else
                                cb(null, {data: inst, msg: msg.deleteBid });
                        });
                    } else {
                        cb(new Error("Aready deleted"), null);
                    }
                } else {
                    cb(new Error("No instance found"), null);
                }
            }
        });
    };

    Bid.remoteMethod("delete", {
        accepts: [
            { arg: "bidId", type: "string", require: true },
            { arg: "req", type: "object", http: { source: "req" } }
        ],
        returns: { arg: "success", type: "object" }
    });









};
