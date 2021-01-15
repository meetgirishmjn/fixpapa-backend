'use strict';
var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;
var msg = require("../messages/job-msg.json");
var gf = require("../services/global-function");
var async = require("async");
var shortid = require('shortid');
var path = require("path");

//var cron = require('cron');
/*var CronJob = require('cron').CronJob;
var job = new CronJob('* * * * * *', function() {
 

 
  // //console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
*/

var loopback = require('loopback');
var datasourceFile = require("./../../server/datasources.json"); 
var mailSentEmailId = datasourceFile.Email.transports[0].auth.user;
module.exports = function(Requestjob) {
	
		disableAllMethods(Requestjob, ['find','deleteById']);
		Requestjob.validatesInclusionOf('status', { in: ['requested','pending','vendorAccepted','on the way','scheduled','inprocess','outForDelivery','billGenerated','paymentDone','canceled','indispute','completed'] });
		//Requestjob.validatesInclusionOf('siteType', { in: ['Onsite','Offsite'] });
    



////////////////////////////////////////////////////////
	Requestjob.createJob =function(req,res,cb){
		
		function uploadFile() {
      Requestjob.app.models.Container.imageUpload(req, res, { container: 'images' }, function(err, success) {
        if (err)
          cb(err, null);
        else
          if (success.data) {
          success.data = JSON.parse(success.data);
          createjob(success);
        } else {
          cb(new Error("data not found"), null);
        }
          //createUser(success);
      })
    }

    function createjob(obj) {
      let customerId = req.accessToken.userId;

      var data = {
        customerId     :        customerId,
        categoryId     :        obj.data.categoryId,
        productId      :        obj.data.productId,
        brandId        :        obj.data.brandId,
        problems       :        obj.data.problems,
		    problemDes	   :        obj.data.problemDes,
        startDate      :        obj.data.startDate,
        endDate        :        obj.data.endDate,
		    address	       :        obj.data.address,
        totalPrice     :        obj.data.totalPrice,
        otp            :        gf.getOTP(),
        orderId        :        "FP-"+shortid.generate(),
		    status		     :        "requested",
        isVendorAssigned    :   false,
        isEngineerAssigned  :   false,
        siteType            :   "Onsite",
       
        
        bill                :   {
          totalAmount    :    0,
          addServiceCost :    0,
          discount       :    0,
          addPart        :    [],
          total          :    0,
          clientResponse :    "",
          paymentId      :    ""

        }
        }

       

        

      
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.autoCancelDate   =   new Date(data.startDate);
      data.autoCancelDate.setHours(data.autoCancelDate.getHours() - 2);

      data.autoNotification      =   {
           autoNotifyDate   :   new Date(data.startDate),

           isNotySend       :   false       
        }

      data.autoNotification.autoNotifyDate.setHours(data.autoNotification.autoNotifyDate.getHours()-4);

    
      
      if (obj.files) {
        if (obj.files.image)
        data.image = gf.getImageArray(obj.files.image);
      }

      if(!data.categoryId)
        return cb(new Error("category not selected!!"),null);

      console.log("job data***********",data);

       Requestjob.create(data, function(err, job) {
        if (err)
          cb(err, null);
        else{
          
           cb(null,{data:job,msg:msg.createJob});

           Requestjob.app.models.Notification.createJobNoty(job, function() {}); 
            Requestjob.sendReceipt(job,function(){});
        }


        
      })
     }
    	uploadFile();
  }

  Requestjob.remoteMethod('createJob',{
		accepts:[
		 { arg: 'req', type: 'object', http: { source: 'req' } },
	   { arg: 'res', type: 'object', http: { source: 'res' } }

		],
		returns :{arg:"success",type :"object"},
		http :{verb:'post'}

	})

////////////////////////order receipt/////////////////////////////////////////


    Requestjob.sendReceipt = function(job,cb) {

       Requestjob.app.models.People.findById(job.customerId,function(err,customer){
        if(err)
          return cb(err,null)
        let custInst = customer.toJSON();
        // //console.log(custInst.email);
        let verifyOptions = {
            to: custInst.email,
            from: mailSentEmailId,
            subject: 'Order_Receipt',
            job   : job,
            template: path.resolve(__dirname, '../../server/views/kaccha-bill.ejs')
            // html : `your orderId is ${job.orderId}`
        }
        createVerificationEmailBody(verifyOptions, undefined, function(err, html) {
          if (err) return cb(err);
          
          verifyOptions.html = html;

          Requestjob.app.models.Email.send(verifyOptions, function(err, mail) {
            // //console.log('email sent!',mail);

            // //console.log(err);
            cb(err);
          });

        });


    })
  }
  


   Requestjob.remoteMethod('sendReceipt',{
    accepts:[
     { arg: 'job', type: 'object'}
     ],
    returns :{arg:"success",type :"object"},
    http :{verb:'post'}

  })



  Requestjob.getAllJobs = function(filter, cb) {
    if (!filter.where)
      filter.where = {};
      filter.order = "startDate DESC";
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
            fields:{fullName:true,mobile:true,exp:true}
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
            fields:{fullName:true,mobile:true,exp:true,email:true}
          }
        }
      ];
      Requestjob.find(filter,function(err, success) {
        if (err) {
          cb(err, null);
        } else {
          Requestjob.count(filter.where,function (err,totalCount) {
            if(err)
              return cb(err,null);
             cb(null, { data: success,count:totalCount, msg: msg.allJobs });
          });
        }
      });
  };

  Requestjob.remoteMethod("getAllJobs", {
    accepts:[
     {arg :"filter",type :"object"}
    ],
    returns: { arg: "success", type: "object" },
    http: { verb: "get" }
  });



  Requestjob.getAllJobByAdmin = function(aggregate,skip,limit,cb){
    if(!aggregate) aggregate = [];
   
    if(aggregate[0].$match && aggregate[0].$match.$and[0].startDate){
      aggregate[0].$match.$and[0].startDate.$lt = new Date(aggregate[0].$match.$and[0].startDate.$lt);
      aggregate[0].$match.$and[0].startDate.$gt = new Date(aggregate[0].$match.$and[0].startDate.$gt);
    }

    Requestjob.aggregate({aggregate:aggregate},{},function(error,success){
      if(error) return cb(error,null);
      let arr  = [];
      let count = 0;
      if(limit){
        skip = skip || 0;
        arr = success.slice(skip,skip+limit);  
      }
      

      cb(null, { data: arr,count:success.length, msg: msg.allJobs });
    });
  };


  Requestjob.remoteMethod("getAllJobByAdmin",{
    accepts:[
     {arg :"aggregate",type :"array"},
     {arg :"skip",type :"number"},
     {arg :"limit",type :"number"}
    ],
    returns: { arg: "success", type: "object" },
    http: { verb: "get" }
  });


   /* Requestjob.afterRemote('getAllJobs', function (ctx, instance, next) {
      var jobInst = instance.success.data;
      var fil = ctx.args.filter.where;
      //// //console.log("filter =",fil);

    });*/





   

    Requestjob.getMeJobs = function(cb) {
      //let peopleId = req.accessToken.userId;
      let filter = {};
     // let fil ={};

      if (!filter.where)
        filter.where = {};

       // filter.where.customerId = req.accessToken.userId;
       // let fil =filter.where.status="requested";
       //fil = filter.where 
        filter.order = "startDate DESC";

      
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
              fields:{fullName:true,mobile:true,exp:true}
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
              fields:{fullName:true,mobile:true,exp:true}
            }
          },

            {
            relation:"transaction"
           
          }
          ]
    Requestjob.find(filter,function(err, success) {
      if (err) {
        cb(err, null)
      } else {
        
        cb(null, { data: success, msg: msg.allJobs });
      }
    })
  }

    Requestjob.remoteMethod("getMeJobs", {
      accepts:[
       //{arg :"filter",type :"object"}
      ],
      returns: { arg: "success", type: "object" },
      http: { verb: "get" }
    });


     /*Requestjob.afterRemote('getMeJobs', function (ctx, instance, next) {
      var jobInst = instance.success.data;
      var fil = ctx.args.filter.where;
      //// //console.log("filter =",fil);
        Requestjob.count(fil).then(function (totalCount) {
            ctx.result = {
                jobCount: totalCount,
                items: jobInst
            };
            next();
        });
    });*/

      




    Requestjob.getPeopleJobs = function(peopleId,realm,cb){
      //let peopleId = req.accessToken.userId;


      let filter = {};

      if (!filter.where)
        filter.where = {};
       if(realm=="customer")
        filter.where.customerId = peopleId;
      else if(realm == "vendor")
        filter.where.vendorId = peopleId;
      else
        filter.where.engineerId = peopleId;
        

        filter.order = "startDate DESC";

      
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
              fields:{fullName:true,mobile:true,exp:true}
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
              fields:{fullName:true,mobile:true,exp:true,email:true}
            }
          }
          ]
    Requestjob.find(filter,function(err, success) {
      if (err) {
        cb(err, null)
      } else {
        
        cb(null, { data: success, msg: msg.allJobs });
      }
    })
  }

    Requestjob.remoteMethod("getPeopleJobs", {
      accepts:[
       {arg :"peopleId",type :"string",required:true},
       {arg :"realm",type :"string",required:true}
      ],
      returns: { arg: "success", type: "object" },
      http: { verb: "get" }
    });

  

  Requestjob.custAllJobs =function(req,cb){
    let customerId = req.accessToken.userId;
    let filter={};
    if (!filter.where)
        filter.where = {};
        filter.where.customerId = customerId;
       // filter.order = "date DESC";
        filter.order = "startDate DESC"

      
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
              fields:{fullName:true,mobile:true,exp:true}
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
              fields:{fullName:true,mobile:true,exp:true,email:true}
            }
          },

            {
            relation:"transaction"
           
          }
          ]
          Requestjob.find(filter,function(err,success){
        if(err)
          return cb(err,null);
        
        cb(null, { data: success, msg: msg.allJobs });
      })
    }
    
      Requestjob.remoteMethod("custAllJobs",{
        accepts : [
        {arg :"req",type :"object",http:{source:'req'}}

        ],
        returns : {arg:"success",type:"object"},
        http:{verb:"get"}
      })
  





    Requestjob.getJobById =function(requestjobId,cb){
      let filter = {};

    if (!filter.where)
      filter.where = {};
      //filter.where = {vendorId : vendorId,isEngineerAssigned : false,startDate: {gt: Date.now()},status:"pending"};
     
    //filter.order = "date DESC";
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
              fields:{fullName:true,mobile:true,exp:true,image:true,email:true}
            }
          },
          {
            relation:"vendor",
            scope:{
              fields:{fullName:true,mobile:true,exp:true,firmName:true,gstNumber:true,image:true}
            }
          },
          {
            relation:"customer",
            scope:{
              fields:{fullName:true,mobile:true,gstNumber:true,image:true,email:true}
            }
          },
            {
            relation:"transaction"
           
          }
          ]

      Requestjob.findById(requestjobId,filter,function(err,success){
        if(err)
          return cb(err,null)

        cb(null, { data: success, msg: msg.getJob });

      })
    }

       Requestjob.remoteMethod("getJobById", {
      accepts:[
        {arg :"requestjobId",type :"string",required:true}
      ],
      returns: { arg: "success", type: "object" },
      http: { verb: "get" }
    });

    


    Requestjob.vendorAssign =function(requestjobId,vendorId,cb){
        let data ={
          vendorId         : vendorId,
          status           :"pending",
          updatedAt        : new Date(),
          isVendorAssigned : true,
          vendorAssignedDate :new Date()
        }




        let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
      filter.include = [{
            relation: "category"
          },
          {
            relation: "product"
          },
          {
            relation: "brand"
          },
          // {
          //   relation:"engineer",
          //   scope:{
          //     fields:{fullName:true,mobile:true,exp:true,image:true}
          //   }
          // },
          // {
          //   relation:"vendor",
          //   scope:{
          //     fields:{fullName:true,mobile:true,exp:true}
          //   }
          // },
          {
            relation:"customer",
            scope:{
              fields:{fullName:true,mobile:true,image:true}
            }
          }
        ];

      Requestjob.findById(requestjobId,filter,function(err,jobInst){
        if(err)
          return cb(err,null);
       if(!jobInst) return cb(new Error("No job request found"),null);

        data.autoVenCancelDate   =   new Date(jobInst.startDate);
      data.autoVenCancelDate.setHours(data.autoVenCancelDate.getHours() - 2);

      data.autoVenNotification      =   {
           autoVenNotifyDate   :   new Date(jobInst.startDate),

           isNotySend       :   false       
        }

      data.autoVenNotification.autoVenNotifyDate.setHours(data.autoVenNotification.autoVenNotifyDate.getHours()-24);
         
            jobInst.updateAttributes(data,function(err, success) {
            if (err) 
              return cb(error, null);
          
            cb(null, {data:success, msg: msg.vendorAssign});
            Requestjob.app.models.Notification.vendorAssignedNoty(jobInst, function() {});  
            


           });

      });
    }

    Requestjob.remoteMethod("vendorAssign",{
    accepts : [
      {arg:"requestjobId",type:"string",required:true,http:{source:"form"}},
      {arg: "vendorId", type: "string", required:true, http: { source: "form"} }
      ], 
      returns : {arg:"success",type:"object"}
    })

    Requestjob.vendorJobs =function(vendorId,cb){

      //let vendorId = req.accessToken.userId;
   
    let filter = {};

    if (!filter.where)
      filter.where = {};
      filter.where = {vendorId : vendorId,isEngineerAssigned : false,startDate: {gt: Date.now()},status:"pending"};
     
    filter.order = "date DESC";
    filter.include = [{
      relation: "category"
    },
    {
      relation :"product"
    },
    {
      relation :"brand"
    },
    {
      relation:"engineer",
      scope:{
        fields:{fullName:true,mobile:true}
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
        fields:{fullName:true,mobile:true,exp:true,email:true}
      }
    },
      {
            relation:"transaction"
           
     }

    ]
   // // //console.log("hello filter",filter);

    
   
    Requestjob.find(filter,function(err,success){
      if(err)
        return cb(null,success)
      cb(null,{data:success,msg:msg.vendorJobs});

    })
    
  }

   Requestjob.remoteMethod("vendorJobs", {
    accepts: [
      { arg: "vendorId", type: "string",required:true}
      //{ arg: 'realm', type: "string", required: true },
      ],
    returns: { arg: "success", type: "object" },
    http: { verb: "get" }
})


   Requestjob.vendorAllJobs =function(vendorId,cb){

      //let vendorId = req.accessToken.userId;
      let inqStatus =['vendorAccepted','on the way','scheduled','inprocess','billGenerated','paymentDone','canceled','completed','outForDelivery','indispute'];
   
    let filter = {};

    if (!filter.where)
      filter.where = {};
      filter.where = {vendorId : vendorId,status:{inq:inqStatus},};
     
    filter.order = "date DESC";
    filter.include = [{
      relation: "category"
    },
    {
      relation :"product"
    },
    {
      relation :"brand"
    },
    {
      relation:"engineer",
      scope:{
        fields:{fullName:true,mobile:true}
      }
    },
    {
      relation:"vendor",
      scope:{
        fields:{fullName:true,mobile:true}
      }
    },
    {
      relation:"customer",
      scope:{
        fields:{fullName:true,mobile:true}
      }
    }
    ]
   // // //console.log("hello filter",filter);

    
   
    Requestjob.find(filter,function(err,success){
      if(err)
        return cb(null,success)
      cb(null,{data:success,msg:msg.vendorJobs});

    })
    
  }

   Requestjob.remoteMethod("vendorAllJobs", {
    accepts: [
      { arg: "vendorId", type: "string",required:true}
      //{ arg: 'realm', type: "string", required: true },
      ],
    returns: { arg: "success", type: "object" },
    http: { verb: "get" }
})


   Requestjob.vendorAcceptorCancel =function(req,requestjobId,status,cb){
    var vendorId =req.accessToken.userId;
   /* let data ={
      status :status,
      updatedAt:new Date()
    }*/
    let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
      filter.include = [{
            relation: "category"
          },
          {
            relation: "product"
          },
          {
            relation: "brand"
          },
          // {
          //   relation:"engineer",
          //   scope:{
          //     fields:{fullName:true,mobile:true,exp:true,image:true}
          //   }
          // },
          {
            relation:"vendor",
            scope:{
              fields:{fullName:true,mobile:true,exp:true}
            }
          },
          {
            relation:"customer",
            scope:{
              fields:{fullName:true,mobile:true,image:true}
            }
          }
      ]
    Requestjob.findById(requestjobId,filter,function(err,jobInst){
      if(err)
        return cb(err,null)
      if(!jobInst)
        return cb(new Error("job not found!!"),null);
      //// //console.log("jobInst =",jobInst);
      if(status=="requested")
      {
          jobInst.updateAttributes({
              vendorId:"",
              isVendorAssigned:false,
              updatedAt:new Date(),
              status:status,
              vendorAssignedDate:""
          },function(err,success){
              if(err)
                return cb(err,null)

              cb(null,{data:success,msg:msg.vendorAccept});
              Requestjob.app.models.Notification.vendorAccept(jobInst, function() {});
              Requestjob.app.models.Notification.vendorAccept_admin(jobInst, function() {});

          })
      }
      else if(status=="vendorAccepted"){
         jobInst.updateAttributes({updatedAt:new Date(),
                                 status:status},function(err,success){
        if(err)
          return cb(err,null)

        cb(null,{data:success,msg:msg.vendorAccept});
        Requestjob.app.models.Notification.vendorAccept(jobInst, function() {});
        Requestjob.app.models.Notification.vendorAccept_admin(jobInst, function() {});

        })
      }else
      {
         return cb(new Error("Not valid value"),null);
      }
     
    })
  }
  Requestjob.remoteMethod("vendorAcceptorCancel", {
    accepts: [
      { arg: "req", type: "object",required:true,http:{source:"req"}},
      { arg: 'requestjobId', type: "string",required:true,http:{source:"form"}},
      { arg: 'status', type: "string",required:true,http:{source:"form"}}

      ],
    returns: { arg: "success", type: "object" },
    http: { verb: "post" }
})


     Requestjob.assignEngineer =function(requestjobId,engineerId,cb){
      let data ={
          engineerId       : engineerId,
          updatedAt        : new Date(),
          isEngineerAssigned : true
        }
        let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
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
              fields:{fullName:true,mobile:true,image:true}
            }
          }
          ]
        Requestjob.app.models.People.findById(engineerId,function(err,peopleInst){
          if(err) return cb(err,null);
          if(!peopleInst)
            return cb(new Error("Engineer not found!!"),null)

          peopleInst.updateAttributes({isJobAssigned : true},function(err,success){})
            /*if(err) return cb(err,null)
              else{*/
          Requestjob.findById(requestjobId,filter,function(err,jobInst){
        /*if(err)
          return cb(err,null);*/
       if(!jobInst) return cb(new Error("No job request found"),null);
         else {
            
             data.autoEngCancelDate   =   new Date(jobInst.startDate);
             data.autoEngCancelDate.setHours(data.autoEngCancelDate.getHours() - 1);

            jobInst.updateAttributes(data,function(err, jobInstNew) {
            if (err) 
              return cb(error, null);
               jobInstNew.__data.engineer = peopleInst.toJSON();

              cb(null, {data:jobInstNew, msg: msg.engineerAssign});
              // //console.log("new data ==",jobInstNew);
              Requestjob.app.models.Notification.engineerAssigned(jobInstNew, peopleInst, function() {});
              Requestjob.app.models.Notification.engineerAssignedNoty(jobInst, function() {});
              })
            }
            })
          //}
        //})
      })
      }

      Requestjob.remoteMethod("assignEngineer",{
      accepts : [
        {arg:"requestjobId",type:"string",required:true,http:{source:"form"}},
        {arg: "engineerId", type: "string", required:true, http: { source: "form"} }
        ], 
        returns : {arg:"success",type:"object"}
      })





      Requestjob.engineerAllJobs =function(req,cb){

      let engineerId = req.accessToken.userId;
      let inqStatus = ['on the way','inprocess','outForDelivery','billGenerated','paymentDone','canceled','completed','indispute']
      let filter = {};

      if (!filter.where)
        filter.where = {};
        filter.where = {engineerId : engineerId,status:{inq:inqStatus}}
        filter.order = "date DESC";
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
          fields:{fullName:true,mobile:true,exp:true}
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
          fields:{fullName:true,mobile:true,exp:true}
        }
      }
      ]


      Requestjob.find(filter,function(err,requests){

      
        if(err)
          return cb(err,null);

        cb(null, {data:requests,msg: msg.vendorJobs});

      })
    }

      Requestjob.remoteMethod("engineerAllJobs",{
      accepts : [
       {arg: "req", type: "object",http:{source:"req"}}
        ], 
        returns : {arg:"success",type:"object"},
        http: { verb: "get"}
      })


      Requestjob.engineerNewJobs =function(req,cb){

      let engineerId = req.accessToken.userId;
      let inqStatus = ['vendorAccepted','scheduled']
      let filter = {};

      if (!filter.where)
        filter.where = {};
        filter.where = {engineerId : engineerId,status:{inq:inqStatus}}
        filter.order = "date DESC";
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
          fields:{fullName:true,mobile:true,exp:true}
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
          fields:{fullName:true,mobile:true,exp:true}
        }
      }
      ]


      Requestjob.find(filter,function(err,requests){

      
        if(err)
          return cb(err,null);

        cb(null, {data:requests,msg: msg.vendorJobs});

      })
    }

      Requestjob.remoteMethod("engineerNewJobs",{
      accepts : [
       {arg: "req", type: "object",http:{source:"req"}}
        ], 
        returns : {arg:"success",type:"object"},
        http: { verb: "get"}
      })

    Requestjob.engineerAccept =function(req,requestjobId,cb){
      let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
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
              fields:{fullName:true,mobile:true,image:true}
            }
          }
          ]

      Requestjob.findById(requestjobId,filter,function(err, jobInst){
        if(err)
          return cb(err,null)
        if(!jobInst)
          return cb(new Error("No request found!!"));
        //console.log("jobInst=",jobInst);

        jobInst.updateAttributes({status:"on the way",updatedAt:new Date()},function(err,success){
          if(err)
            return cb(err,null)

          cb(null, {data:success,msg: msg.engineerAccepted});
          Requestjob.app.models.Notification.engineerOntheway(jobInst, function() {});
          Requestjob.app.models.Notification.engiOnthewayVenNoty(jobInst, function() {});

        })
      })
    }

      Requestjob.remoteMethod("engineerAccept",{
      accepts : [
       {arg: "req", type: "object",required:true,http:{source:"req"}},
       {arg: "requestjobId", type: "string",required:true}
        ], 
        returns : {arg:"success",type:"object"},
        
      })


      Requestjob.engineerSchedule =function(req,requestjobId,eStartDate,eEndDate,cb){
        let engineerId = req.accessToken.userId;
        let data={
          status     :   "scheduled",
          updatedAt : new Date(),
          schedule :{
            eStartDate :   eStartDate,
            eEndDate   :   eEndDate
          }
        
        }
        let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
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
              fields:{fullName:true,mobile:true,image:true}
            }
          }
          ]
      Requestjob.findById(requestjobId,filter,function(err, jobInst){
        if(err)
          return cb(err,null)
        if(!jobInst)
          return cb(new Error("No request found!!"));

        jobInst.updateAttributes(data,function(err,success){
          if(err)
            return cb(err,null)

          cb(null, {data:success,msg: "Job scheduled"});
          Requestjob.app.models.Notification.engiScheduleCustNoty(jobInst, function() {});
          Requestjob.app.models.Notification.engiScheduleVenNoty(jobInst, function() {});
        })
      })
    }

      Requestjob.remoteMethod("engineerSchedule",{
      accepts : [
       {arg: "req", type: "object",required:true,http:{source:"req"}},
       {arg: "requestjobId", type: "string",required:true,http:{source:"form"}},
        {arg: "eStartDate", type: "date",required:true,http:{source:"form"}},
         {arg: "eEndDate", type: "date",required:true,http:{source:"form"}}
        ], 
        returns : {arg:"success",type:"object"},
       
      })

      Requestjob.startJob =function(requestjobId,req, otp,cb){
        let engineerId = req.accessToken.userId;
        let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
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
              fields:{fullName:true,mobile:true,image:true}
            }
          }
          ]
        
        Requestjob.findById(requestjobId,filter,function(err,jobInst){
          if(err)
            return cb(err,null);
          if(!jobInst) return cb(new Error("No job found!!"),null)
          if(jobInst.otp==otp){
            //jobInst.otp=null;
            jobInst.status="inprocess";
            jobInst.updatedAt=new Date();
            let jobData = jobInst.toJSON();

          jobInst.save(function(err,success){
            if(err)
              return cb(err,null);

              cb(null, {data:success,msg: msg.startJob});
              Requestjob.app.models.Notification.startJobVenNoty(jobData, function() {});
              
            })
          }
          else{
            return cb(new Error("wrong otp"),null)
          }
        })
      }

       Requestjob.remoteMethod("startJob",{
      accepts : [
        { arg: 'requestjobId',required:true, type: 'string'},
        { arg: 'req', type: 'object',required:true, http: { source: 'req' } },
        { arg: 'otp', type: 'string',required:true, http: { source: 'form' } }

        ], 
        returns : {arg:"success",type:"object"}
        
      })


    
      Requestjob.generateBill =function(requestjobId,req,res,cb){

       function uploadFile() {
      Requestjob.app.models.Container.imageUpload(req, res, { container: 'sign' }, function(err, success) {
        if (err)
          cb(err, null);
        else
          if (success.data) {
          success.data = JSON.parse(success.data);
          createBill(success);
        } else {
          cb(new Error("data not found"), null);
        }
          //createUser(success);
      })
    }

    function createBill(obj) {

        let data ={
          status      :   "billGenerated",
          updatedAt   :   new Date(),
          bill        :    {
          totalAmount    :    obj.data.totalAmount,
          addServiceCost :    obj.data.addServiceCost,
          discount       :    obj.data.discount,
          addPart        :    obj.data.addPart,
          total          :    obj.data.total,
          clientResponse :    "done",
          generatedAt    :    new Date(),
          updatedAt      :    new Date(),
          paymentId      :    shortid.generate()
         } 
         }
         

      

  
      if (obj.files) {
        if (obj.files.custSign)
        data.bill.custSign = obj.files.custSign[0].url;
      }
      let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
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
              fields:{fullName:true,mobile:true,image:true}
            }
          }
          ]

       Requestjob.findById(requestjobId,filter,function(err,jobInst){
          if(err)
            return cb(err,null)
          if(!jobInst)
            return cb(new Error("No job found!!"),null)
        //  jobInst.bill.clientResponse =   "Done";
          
          
          jobInst.updateAttributes(data,function(err,success){
            if(err)
              return cb(err,null)
            cb(null, {data:success,msg: msg.generateBill});
            Requestjob.app.models.Notification.billGenerateCustNoty(jobInst, function() {});
            Requestjob.app.models.Notification.billGenerateVenNoty(jobInst, function() {});
           })
        })
     }
      uploadFile();
  }


       Requestjob.remoteMethod("generateBill",{
      accepts : [
        { arg: 'requestjobId', type: 'string', required:true },
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'form' } }
        
        ], 
        returns : {arg:"success",type:"object"}
      })
        
    

    Requestjob.pickProduct =function(requestjobId,req,res,cb){

       function uploadFile() {
      Requestjob.app.models.Container.imageUpload(req, res, { container: 'sign' }, function(err, success) {
        if (err)
          cb(err, null);
        else
          if (success.data) {
          success.data = JSON.parse(success.data);
          pick(success);
        } else {
          cb(new Error("data not found"), null);
        }
          //createUser(success);
      })
    }

    function pick(obj) {

      var data = {
          /*engineerId : obj.data.engineerId,
          requestjobId :obj.data.requestjobId,
          customerId : obj.data.customerId,*/
          siteType        :      "Offsite",
          updatedAt       :      new Date(),
          pick       :       
          {
          proCondition    :      obj.data.proCondition,
          damage          :      obj.data.damage,
          details         :      obj.data.details,
          duration        :      obj.data.duration,

          offsiteStatus   :      [{
                                   text:"product picked for offsite repair!!",
                                   workDate:new Date()
                                  }],
          createdAt       :      new Date(),
          updatedAt       :      new Date()
          }
        }
      if (obj.files) {
        if (obj.files.custSign)
        data.pick.custSign = obj.files.custSign[0].url;
      }
      let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
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
              fields:{fullName:true,mobile:true,image:true}
            }
          }
          ]

        Requestjob.findById(requestjobId,filter, function(err,jobInst){
          if(err)
            return cb(err,null);
          if(!jobInst)
            return cb(new Error("No job found !!"),null)
          jobInst.updateAttributes(data,function(err,success){
            if(err)
              return cb(err,null)
            cb(null, {data:success,msg: msg.pickup});
            Requestjob.app.models.Notification.pickProductCustNoty(jobInst, function() {});
            Requestjob.app.models.Notification.pickProductVenNoty(jobInst, function() {});

          })
        })
     }
      uploadFile();
  }

        Requestjob.remoteMethod('pickProduct',{
          accepts:[
           { arg: 'requestjobId', type: 'string',required:true},
           { arg: 'req', type: 'object', http: { source: 'req' } },
           { arg: 'res', type: 'object', http: { source: 'res' } }

          ],
          returns :{arg:"success",type :"object"},
          http :{verb:'post'}

        })

        Requestjob.partRequest =function(addPart,requestjobId,cb){

         let filter = {};

        if (!filter.where)
        filter.where = {};
       // filter.where.customerId = req.accessToken.userId;
        //filter.where.status="requested";
        filter.order = "startDate DESC";

      
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
              fields:{fullName:true,mobile:true,exp:true}
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
              fields:{fullName:true,mobile:true,exp:true}
            }
          }
          ]
          Requestjob.findById(requestjobId,filter,function(err,jobInst){
          if(err)
            return cb(err,null)
          if(!jobInst)
            return cb(new Error("No job found!!"),null)
          jobInst.updatedAt =new Date();
          jobInst.bill.addPart = addPart;
          jobInst.bill.clientResponse = "requested";
          let jobData = jobInst.toJSON();
          //// //console.log("job data",jobData);
          jobInst.save(function(err,success){
            if(err)
              return cb(err,null)
            cb(null, {data:success,msg: msg.requestPart});
            Requestjob.app.models.Notification.partRequestNoty(jobData, function() {});
          })
         })
       }


       Requestjob.remoteMethod("partRequest",{
      accepts : [
        
        { arg: 'addPart', type: 'array', http: { source: 'form' } },
        { arg: 'requestjobId', type: 'string',required:true}
        
        ], 
        returns : {arg:"success",type:"object"}
        
      })


        Requestjob.partResponse =function(addPart,requestjobId,r_status,cb){
       let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
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
              fields:{fullName:true,mobile:true,image:true}
            }
          }
          ]

        Requestjob.findById(requestjobId,filter,function(err,jobInst){
          if(err)
            return cb(err,null)
          if(!jobInst)
            return cb(new Error("No job found!!"),null)
          jobInst.updatedAt = new Date();
          jobInst.bill.addPart = addPart;
          jobInst.bill.clientResponse = r_status;
          let jobData = jobInst.toJSON();


          jobInst.save(function(err,success){
            if(err)
              return cb(err,null)

            cb(null, {data:success,msg: msg.responsePart});
            Requestjob.app.models.Notification.partResponseNoty(jobData, function() {});
          })
        })
      }    

      Requestjob.remoteMethod("partResponse",{
      accepts : [
        
        { arg: 'addPart', type: 'array', http: { source: 'form' } },
        { arg: 'requestjobId', type: 'string',required:true},
        { arg: 'r_status', type: 'string',required:true}
        
        ], 
        returns : {arg:"success",type:"object"}
        
      })

      Requestjob.cancelJob =function(req,reason,comment,realm,requestjobId,cb){

      let personId = req.accessToken.userId;
      
     

        let data={
          status : "canceled",
          updatedAt : new Date(),
          cancelJob :{
            reason : reason,
            comment : comment,
            cancelledDate : new Date(),
            cancelledBy : realm
          }
        }
       //data.cancelledDate = new Date();
        let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
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
              fields:{fullName:true,mobile:true,image:true}
            }
          }
          ]


        Requestjob.findById(requestjobId,filter,function(err,jobInst){
            if(err)
              return cb(err,null)
            if(!jobInst)
              return cb(new Error("Job not found!!"),null)
            if(jobInst.status=="canceled")
              return cb(new Error("Job is already cancelled!!"),null)
            else{
              //data.cancelJob.realm =  jobInst.people.realm;
             // data.cancelJob.fullName =  jobInst.people.fullName;
              jobInst.updateAttributes(data,function(err,success){
                if(err)
                  return cb(err,null)

                cb(null, {data:success,msg: msg.cancelJob});
                 Requestjob.app.models.Notification.cancelJobNoty(jobInst,personId, function() {});
                 Requestjob.app.models.Notification.cancelJobNotyVen(jobInst,personId, function() {});
                 Requestjob.app.models.Notification.cancelJobNotyCust(jobInst,personId, function() {});
                 Requestjob.app.models.Notification.cancelJobNotyEng(jobInst,personId, function() {});
              })
            }
          })
        }

         Requestjob.remoteMethod("cancelJob",{
      accepts : [
        
        { arg: 'req', type: 'object',required:true, http: { source: 'req' } },
        { arg: 'reason', type: 'string',required:true, http: { source: 'form' } },
        { arg: 'comment', type: 'string', http: { source: 'form' } },
        { arg: 'realm', type: 'string',required:true, http: { source: 'form' } },
        { arg: 'requestjobId', type: 'string',required:true}

        
        ], 
        returns : {arg:"success",type:"object"}
        
      })


      Requestjob.updateStatus =function(requestjobId,offsiteStatus,cb){
       
       //let data ={}
       let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
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
              fields:{fullName:true,mobile:true,image:true}
            }
          }
          ]
        Requestjob.findById(requestjobId,filter,function(err,jobInst){
          if(err)
            return cb(err,null)
          if(!jobInst)
            return cb(new Error("job not found!!"),null)
          jobInst.updatedAt = new Date();
         jobInst.pick.offsiteStatus =jobInst.pick.offsiteStatus || []; 
          offsiteStatus.workDate = new Date();
          jobInst.pick.offsiteStatus.push(offsiteStatus);
          
          jobInst.save(function(err,success){
            if(err)
              return cb(err,null)
             cb(null, {data:success,msg: msg.updateStatus});
             Requestjob.app.models.Notification.updateStatusNoty(jobInst, function() {});
          })
        })
      }


       Requestjob.remoteMethod("updateStatus",{
      accepts : [
        
        //{ arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'requestjobId', type: 'string',required:true},
        { arg: 'offsiteStatus', type: 'object',http: { source: 'form' }}

        ], 
        returns : {arg:"success",type:"object"}
        
      })

        Requestjob.updateJobStatus =function(requestjobId,status,cb){
       
       let data ={status :status,
        updatedAt: new Date()}

       let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
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
              fields:{fullName:true,mobile:true,image:true}
            }
          }
          ]
        Requestjob.findById(requestjobId,filter,function(err,jobInst){
          if(err)
            return cb(err,null)
          if(!jobInst)
            return cb(new Error("job not found!!"),null)
          
          
          jobInst.updateAttributes(data,function(err,success){
            if(err)
              return cb(err,null)
             cb(null, {data:success,msg: msg.updateStatus});
             Requestjob.app.models.Notification.updateJobStatusNoty(jobInst, function() {});
          })
        })
      }


       Requestjob.remoteMethod("updateJobStatus",{
      accepts : [
        
        //{ arg: 'req', type: 'object', http: { source: 'req' } },

        { arg: 'requestjobId', type: 'string',required:true},
        { arg: 'status', type: 'string',required:true,http: { source: 'form' }}

        ], 
        returns : {arg:"success",type:"object"}
        
      })


       Requestjob.completeJob =function(requestjobId,customerId,engineerId,isPaymentDone,modeOfPayment,comment,cb){
        //let engineerId = req.accessToken.userId;
        let data ={
          status :  "completed",
          venToAdmin : false,
          adminToCust : false,
          updatedAt : new Date(),
          completeJob :{
            isPaymentDone  : isPaymentDone,
            modeOfPayment  : modeOfPayment,
            comment        : comment,
            completedAt    : new Date(),
            adminInvoiceId : "GL-"+shortid.generate(),
            custInvoiceId  : shortid.generate(),
            venInvoiceId   : shortid.generate()



          }
        }
       data.completeJob.dueDate = new Date();
       data.completeJob.dueDate.setDate(data.completeJob.completedAt.getDate()+15);
        
    


        let filter ={}
         if (!filter.where)
        
       filter.where = {};
     
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
              fields:{fullName:true,mobile:true,exp:true,firmName:true}
            }
          },
          {
            relation:"customer",
            scope:{
              fields:{fullName:true,mobile:true,image:true}
            }
          }
          ]
       

          if(data.completeJob.modeOfPayment=="cash"||data.completeJob.modeOfPayment=="cheque")
          {

            Requestjob.findById(requestjobId,filter,function(err,jobInst){
              if(err) return cb(err,null)
              else{
                /*  if(data.completeJob.paymentDone== true){
                   data.completeJob.adminInvoiceId = "GL"+shortid.generate();
                   data.completeJob.custInvoiceId =   jobInst.customer.fullName+shortid.generate();
                   data.completeJob.venInvoiceId =   jobInst.vendor.firmName+shortid.generate();
                  }*/

                  Requestjob.app.models.Transaction.findOne({where:{orderId:jobInst.orderId}},function(err,TranInst){
                    if(err)
                    return cb(err,null)
                   else
                  {
                    if(!TranInst)
                      return cb(new Error("transaction not created"),null)

                    TranInst.updateAttributes({status:"done"},function(err,success){})
                    
                    //////////////////////try code////////////////////
                    jobInst.updateAttributes(data,function(err,success){
                      if(err)
                        return cb(err,null);
                      else{
                        Requestjob.app.models.People.findById(engineerId,function(err,engiInst){
                      if(err)
                        return cb(err,null)
                      engiInst.updateAttributes({rateThisJob:requestjobId,customerName:jobInst.customer.fullName,totalCost:jobInst.bill.total},function(err,success){})

                      })
                          Requestjob.app.models.People.findById(customerId,function(err,engiInst){
                      if(err)
                        return cb(err,null)
                      engiInst.updateAttributes({rateThisJob:requestjobId,engineerName:jobInst.engineer.fullName,totalCost:jobInst.bill.total},function(err,success){})

                      })


                        cb(null, {data:success,msg: msg.completeJob});
                        Requestjob.app.models.Notification.completeJobVenNoty(jobInst, function() {});
                        Requestjob.app.models.Notification.completeJobNoty(jobInst, function() {});
                      }
                      })
                /////////////////////////try code end////////////////////////////////////// 

            }

                  
                  })
              }
           })
          }

        else {
        Requestjob.findById(requestjobId,filter,function(err,jobInst){
          if(err)
            return cb(err,null);
          if(!jobInst) return cb(new Error("No job found!!"),null)
            

         if(data.completeJob.isPaymentDone==false)
        {
            
            data.status="indispute";

             jobInst.updateAttributes(data,function(err,success){
            if(err)
              return cb(err,null);
            else{
             /* Requestjob.app.models.People.findById(engineerId,function(err,engiInst){
            if(err)
              return cb(err,null)
            engiInst.updateAttributes({rateThisJob:requestjobId},function(err,success){})

            })
                Requestjob.app.models.People.findById(customerId,function(err,engiInst){
            if(err)
              return cb(err,null)
            engiInst.updateAttributes({rateThisJob:requestjobId},function(err,success){})

            })*/


              cb(null, {data:success,msg: "Job in dispute!!"});
              Requestjob.app.models.Notification.completeJobVenNoty(jobInst, function() {});
              Requestjob.app.models.Notification.completeJobNoty(jobInst, function() {});
            }
            })
           }


           //////////////////////////else part//////////////////////
           else if(data.completeJob.isPaymentDone==true)
           {

            jobInst.updateAttributes(data,function(err,success){
            if(err)
              return cb(err,null);
            else{
              Requestjob.app.models.People.findById(engineerId,function(err,engiInst){
            if(err)
              return cb(err,null)
            engiInst.updateAttributes({rateThisJob:requestjobId,customerName:jobInst.customer.fullName,totalCost:jobInst.bill.total,picture:jobInst.customer.image},function(err,success){})

            })
                Requestjob.app.models.People.findById(customerId,function(err,engiInst){
            if(err)
              return cb(err,null)
            engiInst.updateAttributes({rateThisJob:requestjobId,engineerName:jobInst.engineer.fullName,totalCost:jobInst.bill.total,picture:jobInst.engineer.image},function(err,success){})

            })


              cb(null, {data:success,msg: msg.completeJob});
              Requestjob.app.models.Notification.completeJobVenNoty(jobInst, function() {});
              Requestjob.app.models.Notification.completeJobNoty(jobInst, function() {});
            }
            })
           }
           else{
            return cb(new Error("Invalid value!!"),null);
           }
          
          
        })
      }
      }

       Requestjob.remoteMethod("completeJob",{
      accepts : [
        { arg: 'requestjobId', type: 'string',required:true,http:{source:'form'}},
        { arg: 'customerId', type: 'string',required:true,http: { source: 'form' }},
        { arg: 'engineerId', type: 'string', required:true,http: { source: 'form' }},
        { arg: 'isPaymentDone', type: 'boolean',required:true, http: { source: 'form' }},
        { arg: 'modeOfPayment', type: 'string', http: { source: 'form' }},
        { arg: 'comment', type: 'string',http: { source: 'form' }}

        ], 
        returns : {arg:"success",type:"object"}
        
      })



  Requestjob.getJobsAdmin = function(filter ,cb) {
      //let peopleId = req.accessToken.userId;
      
    Requestjob.find(filter,function(err, success) {
      if (err) {
        cb(err, null)
      } else {
        
        cb(null, { data: success, msg: msg.allJobs });
      }
    })
  }

    Requestjob.remoteMethod("getJobsAdmin", {
      accepts:[
        {arg :"filter",type :"object"}
      ],
      returns: { arg: "success", type: "object" },
      http: { verb: "get" }
    });



    Requestjob.reassignJob = function(requestjobId,startDate,endDate,cb) {
     //let data ={}
      
    Requestjob.findById(requestjobId,function(err, jobInst) {
      if (err) {
        cb(err, null)
      } else {
       // let data = jobInst.toJSON();
       let data ={
          
          customerId     :        jobInst.customerId,
          categoryId     :        jobInst.categoryId,
          productId      :        jobInst.productId,
          brandId        :        jobInst.brandId,
          problems       :        jobInst.problems,
          problemDes     :        jobInst.problemDes,
          startDate      :        new Date(startDate),
          endDate        :        new Date(endDate),
          address        :        jobInst.address,
          totalPrice     :        jobInst.totalPrice,
          otp            :        gf.getOTP(),
          orderId        :        "FP-"+shortid.generate(),
          status         :        "requested",
          isVendorAssigned    :   false,
          isEngineerAssigned  :   false,
          siteType            :   "Onsite",
          oldJobId            :   jobInst.id,
          bill                :   {
            totalAmount    :    0,
            addServiceCost :    0,
            discount       :    0,
            addPart        :    [],
            total          :    0,
            clientResponse :    "",
            paymentId      :    ""
        },
          createdAt      :          new Date(),
          updatedAt      :          new Date()

       }

        ///////////////////////////////////////copied/////////////////////////////////////
        
        
        Requestjob.create(data,function(err,job){
          if(err)
            return cb(err,null)

           Requestjob.app.models.Notification.reassignJobNoty(job, function() {});
          cb(null,{data:job,msg:msg.createJob});


        })

        

      
          
        jobInst.updateAttributes({"newJob":"created"},function(err,updated){})
        
      }
    })
  }

    Requestjob.remoteMethod("reassignJob", {
      accepts:[
        {arg :"requestjobId",type :"string",http: { source: 'form' }},
        {arg :"startDate",type :"Date",http: { source: 'form' }},
        {arg :"endDate",type :"Date",http: { source: 'form' }}
      ],
      returns: { arg: "success", type: "object" },
      http: { verb: "post" }
    });


    

      Requestjob.cronNotifyJobs =function(cb){
       
      let currentDate = new Date();

       let filter ={}
         if (!filter.where)
          filter.where = {};
          filter.where = {autoNotifyDate: {lt: currentDate},status:"requested"}
     
      Requestjob.find(filter,function(err,jobs){
        if(err) return cb(err,null)
         else{
          jobs.forEach(function(value){

          value.updateAttributes({isNotySend:true},function(err,job){
            if(err) return cb(err,null)
            else
            { 

              Requestjob.app.models.Notification.cronNoty(job, function() {});
              cb(null,{data:updated,msg:"notification send!!"});
            }  
          })

          })

         }
      })
    }

      Requestjob.remoteMethod("cronNotifyJobs", {
      accepts:[
        
      ],
      returns: { arg: "success", type: "object" },
      http: { verb: "post" }
    });


      Requestjob.cronCancelJobs =function(cb){
       
      let currentDate = new Date();

       let data={
          status : "canceled",
          updatedAt : new Date(),
          cancelJob :{
            reason : "Admin did not assign vendor on time!",
            comment : "",
            cancelledDate : new Date(),
            cancelledBy : "system"
          }
        }

       let filter ={}
         if (!filter.where)
          filter.where = {};
          filter.where = {autoCancelDate: {lt: currentDate},status:"requested"}
     
      Requestjob.find(filter,function(err,jobs){
        if(err) return cb(err,null)
         else{
          jobs.forEach(function(value){

          value.updateAttributes(data,function(err,updated){
            if(err) return cb(err,null)
            else
            {
              //Requestjob.app.models.Notification.cronNoty(jobs, function() {});
              cb(null,{data:updated,msg:"Job cancelled, as you did not assign vendor on time!!"});
            }  
          })

          })

         }
      })
    }

      Requestjob.remoteMethod("cronCancelJobs", {
      accepts:[
        
      ],
      returns: { arg: "success", type: "object" },
      http: { verb: "post" }
    });


   Requestjob.cronVenCancelJobs =function(cb){
       
      let currentDate = new Date();

       let data={
          status : "canceled",
          updatedAt : new Date(),
          cancelJob :{
            reason : "vendor did not responded within  time!",
            comment : "",
            cancelledDate : new Date(),
            cancelledBy : "system"
          }
        }

       let filter ={}
         if (!filter.where)
          filter.where = {};
          filter.where = {autoVenCancelDate: {lt: currentDate},status:"pending",isEngineerAssigned:false}
     
      Requestjob.find(filter,function(err,jobs){
        if(err) return cb(err,null)
         else{
          jobs.forEach(function(value){

          value.updateAttributes(data,function(err,job){
            if(err) return cb(err,null)
            else
            {
              Requestjob.app.models.Notification.cronVenResponse(job, function() {});
              cb(null,{data:job,msg:"Job cancelled, as vendor did not responded on time!!"});
            }  
          })

          })

         }
      })
    }

      Requestjob.remoteMethod("cronVenCancelJobs", {
      accepts:[
        
      ],
      returns: { arg: "success", type: "object" },
      http: { verb: "post" }
    });






      Requestjob.cronEngCancelJobs =function(cb){
       
      let currentDate = new Date();

       let data={
          status : "canceled",
          updatedAt : new Date(),
          cancelJob :{
            reason : "vendor did not assigned within time!",
            comment : "",
            cancelledDate : new Date(),
            cancelledBy : "system"
          }
        }

       let filter ={}
         if (!filter.where)
          filter.where = {};
          filter.where = {autoEngCancelDate: {lt: currentDate},status:"vendorAccepted",isEngineerAssigned:false}
     
      Requestjob.find(filter,function(err,jobs){
        if(err) return cb(err,null)
         else{
          jobs.forEach(function(value){

          value.updateAttributes(data,function(err,job){
            if(err) return cb(err,null)
            else
            {
              Requestjob.app.models.Notification.cronVenEng(job, function() {});
              cb(null,{data:job,msg:"Job cancelled, as vendor did not assigned engineer on time!!"});
            }  
          })

          })

         }
      })
    }

      Requestjob.remoteMethod("cronEngCancelJobs", {
      accepts:[
        
      ],
      returns: { arg: "success", type: "object" },
      http: { verb: "post" }
    });

      /////////////////////////////////before 24 hours////////////////////////////////////////////////

      Requestjob.cronNotifyVenJobs =function(cb){
       
      let currentDate = new Date();

       let filter ={}
         if (!filter.where)
          filter.where = {};
          filter.where = {autoVenNotifyDate: {lt: currentDate},status:"pending"}
     
      Requestjob.find(filter,function(err,jobs){
        if(err) return cb(err,null)
         else{
          jobs.forEach(function(value){

          value.updateAttributes({isNotySend:true},function(err,job){
            if(err) return cb(err,null)
            else
            { 

              Requestjob.app.models.Notification.cronVenNoty(job, function() {});
              cb(null,{data:updated,msg:"notification send!!"});
            }  
          })

          })

         }
      })
    }


    Requestjob.remoteMethod("cronNotifyVenJobs", {
      accepts:[],
      returns: { arg: "success", type: "object" },
      http: { verb: "post" }
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////



   // People.app.models.Otp.sendSMS({otp:success.mobOtp.otp,mobile:success.mobile},function(){});


Requestjob.sendMessage =function(requestjobId,cb){
       
      
     
    Requestjob.findById(requestjobId,function(err,job){
        if(err) return cb(err,null)
        else{
          	 Requestjob.app.models.People.findById(job.customerId,function(err,success){
          	 	if(err) return cb(err,null)
          	 	else{
          	 		Requestjob.app.models.Otp.sendSecondSMS({mobile:success.mobile},function(){});
          	 		cb(null,{data:success,msg:"message send!!"});
          	 	}
          	 })
		}  
    })
}


Requestjob.remoteMethod("sendMessage", {
  accepts:[
  {arg :"requestjobId",type :"string",http: { source: 'form' }}
  ],
  returns: { arg: "success", type: "object" },
  http: { verb: "post" }
});






























     



        


        /////////////////////PaymentDone api /////////////////////////

  function createVerificationEmailBody(verifyOptions, options, cb) {
    var template = loopback.template(verifyOptions.template);
    var body = template(verifyOptions);
    cb(null, body);
  }








    




    
    

};
