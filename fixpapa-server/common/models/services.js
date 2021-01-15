'use strict';
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/services-msg.json");


module.exports = function(Services) {

    disableAllMethods(Services, ['find','delete']);



    	Services.addService =function(name,cb){

        let data = {
          name: name
        }

        data.createdAt = new Date();
        data.updatedAt = new Date();
  

      Services.create(data, function(err, success) {
        if (err)
          cb(err, null);
        else
          cb(null,{data:success,msg:msg.addService});
          
          
      })
    }

  
	Services.remoteMethod('addService',{
		accepts:[
		 { arg: 'name', type: 'string', http: { source: 'form' } }
         //{ arg: 'res', type: 'object', http: { source: 'res' } }
		
		],
		returns :{arg:"success",type :"object"},
		http :{verb:'post'}

	})

	Services.getAllServices = function(cb) {
    Services.find(function(err, success) {
      if (err) {
        cb(err, null)
      } else {
         
        cb(null, {data:success,msg:msg.getServices});
      }
    })
  }

  Services.remoteMethod("getAllServices", {
    returns: { arg: "success", type: "object" },
    http: { verb: "get" }
  })

  Services.getService =function(serviceId,cb){

    Services.findById(serviceId,function(err,success){
      if(err)
         return cb(err,null)
       else
          cb(null,{data: success, msg: msg.getService});

    })
  }

    Services.remoteMethod('getService',{

    accepts: [
      { arg: "serviceId", type: "string",required: true }
      
    ],
    returns: { arg: "success", type: "object" },
    http :{verb:'get'}


  })


    Services.edit =function(name,serviceId,cb){

    let data ={

          name : name
            }
            data.updatedAt = new Date();

        Services.findById(serviceId, function(err, serviceInst) {
        if (err) return cb(err, null);

        serviceInst.updateAttributes(data,function(err,success){
        if(err)
          return cb(err,null)
        else
          cb(null,{data: success, msg: msg.editService});
      })
    })
  }


  Services.remoteMethod("edit", {
  accepts: [
    { arg: "name", type: "string", http: { source: "form" } },
    { arg: "serviceId", type: "string", required: true}
  
  ],
  returns: { arg: "success", type: "object" }
})







};
