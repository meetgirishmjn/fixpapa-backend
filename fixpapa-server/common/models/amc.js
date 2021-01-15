'use strict';

var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/amc-msg.json");

module.exports = function(Amc) {

	  disableAllMethods(Amc, ['find']);


	 // Amc.validatesInclusionOf('userType', { in: ['Home', 'Office', 'Industry'] });
	 // Amc.validatesInclusionOf('typeOfAmc', { in: ['Comphrehensive', 'Non-Comphrehensive'] });



	Amc.addAmcType =function(req,res,cb){
		
		function uploadFile() {
      Amc.app.models.Container.imageUpload(req, res, { container: 'images' }, function(err, success) {
        if (err)
          cb(err, null);
        else
          if (success.data) {
          success.data = JSON.parse(success.data);
          createAmc(success);
        } else {
          cb(new Error("data not found"), null);
        }
          //createUser(success);
      })
    }

    function createAmc(obj) {
      let amcId = req.query.amcId;

      var data = {
        //name: obj.data.name,
        name        :        obj.data.name,
		    categoryIds	:        obj.data.categoryIds,
		    noOfUnits	  :        obj.data.noOfUnits,
        deleted     :        false
        }

      
      data.createdAt = new Date();
      data.updatedAt = new Date();
     
      
      if (obj.files) {
        if (obj.files.image)
          data.image = obj.files.image[0].url;
    
      }

      if(!amcId)
      {
       Amc.create(data, function(err, success) {
        if (err)
          cb(err, null);
        else
           cb(null,{data:success,msg:msg.addAmcType});
        
      })
     }
     else{
      Amc.findById(amcId, function(err, amcInst) {
        
        if (err) return cb(err, null);

        data.updatedAt =new Date();
      amcInst.updateAttributes(data, function(err, success) {
        if (err)
          cb(err, null);
        else
           cb(null,{data:success,msg:msg.editAmc});
       
           })
      })

     }
    }

    uploadFile();
  }


	Amc.remoteMethod('addAmcType',{
		accepts:[
		 { arg: 'req', type: 'object', http: { source: 'req' } },
	   { arg: 'res', type: 'object', http: { source: 'res' } }

		],
		returns :{arg:"success",type :"object"},
		http :{verb:'post'}

	})


    Amc.getAllAmc = function(filter,cb) {
        
        if (!filter)
            filter = {};
        if (!filter.where)
            filter.where = {};
        
        filter.where.deleted = {neq:true};
        filter.order = "name ASC";
        filter.include = {
      
          relation:"category",
          scope: {
          fields:{"id":true ,"name":true} 
            }
          }
      

        Amc.find(filter, function(error, success) {
            if (error)
               return  cb(error, null);
            cb(null, { data: success, msg: msg.getAllAmc });

        })
    }

        Amc.remoteMethod("getAllAmc", {
        accepts: [
            { "arg": "filter", "type": "object" }
        ],
        returns: { "arg": "success", "type": "object" },
        http: { "verb": "get" }
    })


    Amc.edit =function(req,res,cb){

    console.log(req.query);
        //cb(null,req.query);
        if(!req.query.amcId)
          return cb(new Error("AMC is not defined"),null);
        else
        {
          Amc.addAmcType(req,res,cb);
        }
  }


  Amc.remoteMethod("edit", {
  accepts: [
    { arg: "req", type: "object", http: { source: "req" } },
    { arg: "res",type: "object", http: { source: "res" } }
  
  ],
  returns: { arg: "success", type: "object" }
})

  Amc.getAmc =function(amcId,cb){

    Amc.findById(amcId,{
        include:{
          relation:"category",
          scope: {
          fields:{"id":true ,"name":true} 
        }

        }
    },function(err,success){
      if(err)
         return cb(err,null)
       else
          cb(null,{data: success, msg: msg.getAmc});

    })
  }

    Amc.remoteMethod('getAmc',{

    accepts: [
      { arg: "amcId", type: "string", required: true }
      
    ],
    returns: { arg: "success", type: "object" },
    http :{verb:'get'}

  })


    Amc.delete = function(amcId, req, cb) {
        Amc.findById(amcId, function(error, amcInst) {
            if (error)
                cb(error, null);
            else {
                if (amcInst) {
                    if (!amcInst.deleted) {
                        amcInst.deleted = true;
                        amcInst.deletedDate = new Date();
                        amcInst.save(function(error, inst) {
                            if (error)
                                cb(error, null);
                            else
                                cb(null, {data: inst, msg: msg.deleteAmc });
                        })
                    } else {
                        cb(new Error("Aready deleted"), null);
                    }
                } else {
                    cb(new Error("No instance found"), null);
                }
            }
        })
    }

    Amc.remoteMethod("delete", {
        accepts: [
            { arg: "amcId", type: "string", require: true },
            { arg: "req", type: "object", http: { source: "req" } }
        ],
        returns: { arg: "success", type: "object" }
    })





    

        


};



  








