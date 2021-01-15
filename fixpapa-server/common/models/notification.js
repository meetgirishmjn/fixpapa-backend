'use strict';

var admin = require("firebase-admin");

var msg = require("../messages/notification-msg.json");

var serviceAccount = require("../../server/fixpapa.json");
var notyMsg = require("../services/notifications-msg");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fixpapa-550d6.firebaseio.com"
});


var disableAllMethods = require('../../server/disableMethods.js').disableAllMethods;


module.exports = function(Notification) {

   disableAllMethods(Notification, ['find','deleteById']);

    function updateNotyCount(peopleId,isAdmin,isNewrequest){
      let incObj = {$inc:{newNotification:1}};
      if(isAdmin && isNewrequest){
        incObj.$inc.newJobRequest = 1;
      }
      Notification.app.models.People.updateAll(
        {id:peopleId.toString()},incObj,{allowExtendedOperators: true},
      function(error,success){})
    }


  function sendNotification(token, payload,obj){
    //console.log("payload:-",payload)

    if(obj.isTokenDel){
      console.log("obj noty ",obj);
      Notification.destroyAll({where:{peopleId:obj.peopleId,requestjobId:obj.requestjobId,notificationId:{neq:obj.notificationId}}},function(err,success){
       /* if(success){
        }  */
      });

     /* console.log("***************************** Check Tokens **************************************");
      console.log(token);
      console.log("***************************** Check Tokens **************************************");*/
      token = token || [];
      if(!token.length)
        return;
        admin.messaging().sendToDevice(token, payload)
        .then(function(response) {
          //cb(null, response);
         /* console.log("******************** Come in first part *******************************");
          console.log(response);
          console.log("******************** come in first part *******************************");*/
          console.log("noty send :-",response);
          return response;
          
        })
        .catch(function(error) {
          //cb(error, null);
          /*console.log("******************** Come in first part error *******************************");
          console.log(error);
          console.log("******************** Come in first part error *******************************");*/
          return error;
          
        });
    }else{
      token = token || [];
      console.log("token :",token);
      if(!token.length)
        return;
     /* console.log("****************************** second part token ************************");
      console.log(token);
      console.log("****************************** second part token ************************");*/

      admin.messaging().sendToDevice(token, payload)
      .then(function(response) {
        //cb(null, response);
        /*console.log("******************** Come in second part *******************************");
        console.log(response);
        console.log("******************** Come in second part *******************************");*/
       console.log("noty send niche :-",response);
        return response;
        
      })
      .catch(function(error) {
        //cb(error, null);
        console.log("******************** Come in second part error *******************************");
        console.log(error);
        console.log("******************** Come in second part error *******************************");
        return error;
        
      });
    }  
  } 


   function sendSilentNotification(token, payload,obj){
   // console.log("payload:-",payload)
      token = token || "";
      console.log("token :",token);
      if(!token)
        return;
     /* console.log("****************************** second part token ************************");
      console.log(token);
      console.log("****************************** second part token ************************");*/

      admin.messaging().sendToDevice(token, payload)
      .then(function(response) {
        //cb(null, response);
        /*console.log("******************** Come in second part *******************************");
        console.log(response);
        console.log("******************** Come in second part *******************************");*/
       console.log("noty send niche :-",response);
        return response;
        
      })
      .catch(function(error) {
        //cb(error, null);
        console.log("******************** Come in second part error *******************************");
        console.log(error);
        console.log("******************** Come in second part error *******************************");
        return error;
        
      });
      
  } 


  //var adminId = Notification.app.models.People.

  Notification.createJobNoty = function(job, cb) {

    Notification.app.models.People.findOne({
      where: {
        realm: "admin"
      },
      include: {
        relation: "accessTokens"
      }
      
    }, function(error, admins) {
      if (error) return cb(error, null);
      let adminInst = admins.toJSON();
     // // //console.log("Admins =",admins)
      Notification.create({
        type:"new_job",
        requestjobId:job.id,
        creatorId:job.customerId,
        peopleId:adminInst.id,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
       // removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(adminInst.id);
        console.log("********************* createJobNoty **************************");
        let fireTokenArr = [];
        adminInst.accessTokens.forEach(function(token) {
          if (token.firebaseToken)
            fireTokenArr.push(token.firebaseToken);
        })  
        console.log("firebase Token arr admin -",fireTokenArr)

        let jobInstNew = job.toJSON();
        let notyDate = new Date();
        let obj = notyMsg.addJobNoty(jobInstNew, adminInst, "en");
        var payload = {
          data: obj,
          notification: obj
        };

          // //console.log("hello payload=",payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";

          // sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:"sdfsdfsdfsdfds",jobId:"sfsdfsdfdsfsd"});
          sendNotification(fireTokenArr,payload, {isTokenDel:false});
          console.log("***********************************create job**************************");
/*          admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            cb(null, response);
          })
          .catch(function(error) {
            cb(error, null);
          });*/
        
      })

    })
  }

  Notification.remoteMethod("createJobNoty", {
    accepts: [
      { arg: "job", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })




///////////////////////for reassignment///////////////////////////////////////////////////
Notification.reassignJobNoty = function(job, cb) {

    Notification.app.models.People.findById(job.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
        
        Notification.create({
       
        type:"reassigned_job",
        requestjobId:job.id,
        //creatorId:"5adaeccc34c10768d01da8fb",
        creatorId:"5b8e29ff0da54b58f3070e1e",
        peopleId:job.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("***********************************Reassign noty**************************")
         let fireTokenArr = [];
        custInst.accessTokens.forEach(function(token) {
          if (token.firebaseToken)
            fireTokenArr.push(token.firebaseToken);
        }) 

        let jobInstNew = job.toJSON();
        
        let obj = notyMsg.addJobNoty1(jobInstNew, custInst, "en");
        var payload = {
          data: obj,
          notification: obj
        };
          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});

         /* admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);*/
          });
        })
        // //console.log("********************* vendorAccepted **************************");
      }

  Notification.remoteMethod("reassignJobNoty", {
    accepts: [
      { arg: "job", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })











////////////////////create job notification//////////////////////////////////



  Notification.vendorAssignedNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.vendorId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
       if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
     
      Notification.create({
        type:"vendor_assigned",
        requestjobId:jobInst.id,
        
        creatorId:"5b8e29ff0da54b58f3070e1e",
        peopleId:jobInst.vendorId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);

        updateNotyCount(vendorInst.id);
        console.log("***********************************vendorAssignedNoty**************************")
        let fireTokenArr = [];
        vendorInst.accessTokens.forEach(function(token) {
          if (token.firebaseToken)
            fireTokenArr.push(token.firebaseToken);
        })  

        let jobInstNew = jobInst.toJSON();
       
        let obj = notyMsg.vendorAssigned(jobInstNew, vendorInst, "en");
        var payload = {
          data: obj,
          notification: obj
        };

          console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});


        /*  admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* vendorAssigned **************************");
      })

    })
  }

  Notification.remoteMethod("vendorAssignedNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })

///////////////////////////////////////Vendor Assigned////////////////////////////////////


   Notification.vendorAccept = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
        
        Notification.create({
       // type:"vendor_accept",
        type:jobInst.status == "vendorAccepted"? "vendor_accept":"vendor_cancel",
        requestjobId:jobInst.id,
        creatorId:jobInst.vendorId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
       console.log("***********************************vendorAccept noty**************************")
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
          if (token.firebaseToken)
            fireTokenArr.push(token.firebaseToken);
          }) 
            let notyInst = success.toJSON();
           let jobInstNew = jobInst.toJSON();
          let obj = notyMsg.vendorAcceptedCust(jobInstNew,custInst,notyInst,"en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log("hello payload=",payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

          
        })
        // //console.log("********************* vendorAccepted **************************");
      })

    
  }

  Notification.remoteMethod("vendorAccept", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


  Notification.vendorAccept_admin = function(jobInst, cb) {

    Notification.app.models.People.findOne({where: {
        
        realm: "admin"
       
      },
      include: {
        relation: "accessTokens"
      }
      
    }, function(error, admin) {
       if (error) return cb(error, null);
      let adminInst = admin.toJSON();
     
        Notification.create({
        type:jobInst.status == "vendorAccepted"? "vendor_accept_admin":"vendor_cancel_admin",
        requestjobId:jobInst.id,
        creatorId:jobInst.vendorId,
        peopleId:adminInst.id,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(adminInst.id);
        console.log("********************* vendorAccepted admin noty**************************");
          let fireTokenArr = [];
          adminInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
            let notyInst = success.toJSON();
           let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.vendorAcceptedAdmin(jobInstNew, adminInst,notyInst,"ln");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* vendorAccepted **************************");
      })

    })
  }

  Notification.remoteMethod("vendorAccept_admin", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })

/////////////////////////////vendor Accepted/////////////////////////////////
  





  
Notification.engineerAssigned = function(jobInstNew,engineer, cb) {
    //console.log("job inst data in notification => ",jobInstNew);
    Notification.app.models.People.findById(engineer.id,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, engineer) {
     

      if (error) return cb(error, null);


      let engiInst = engineer.toJSON();
     
        Notification.create({
        type:"engineer_assign",
        requestjobId:jobInstNew.id,
        creatorId:jobInstNew.vendorId,
        peopleId: jobInstNew.engineerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);

        updateNotyCount(engiInst.id);
       console.log("********************* engineerAssignedEngineer **************************");
        let fireTokenArr = [];
          engiInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
        })  
          let jobInstNew1 = jobInstNew.toJSON();
          let obj = notyMsg.engineerAssignd(jobInstNew1, engiInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* engineerAssignedEngineer **************************");
      })

    })
  }

  Notification.remoteMethod("engineerAssigned", {
    accepts: [
      { arg: "jobInstNew", type: "object" },
      { arg: "engineer", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })



Notification.engineerAssignedNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"engineer_assign_cust",
        requestjobId:jobInst.id,
        creatorId:jobInst.vendorId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("***********************************engineerAssignedNoty noty**************************")
         let fireTokenArr = [];
        custInst.accessTokens.forEach(function(token) {
          if (token.firebaseToken)
            fireTokenArr.push(token.firebaseToken);
        })  
        
          let jobInstNew = jobInst.toJSON();
          let obj = notyMsg.engineerAssigndCust(jobInstNew, custInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

        /*  admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* vendorAccepted **************************");
      })

    })
  }

  Notification.remoteMethod("engineerAssignedNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


  /////////////////////////////////enginer Assigned////////////////////////////////////


Notification.engineerOntheway = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"engineer_ontheway",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
       // removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* engineer on the way **************************");
        let fireTokenArr = [];
        custInst.accessTokens.forEach(function(token) {
          if (token.firebaseToken)
            fireTokenArr.push(token.firebaseToken);
        })  
          let jobInstNew = jobInst.toJSON();
          let obj = notyMsg.engineerOnTheWay(jobInstNew, custInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});
        /*  admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* engineer on the way **************************");
      })

    })
  }

  Notification.remoteMethod("engineerOntheway", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


  Notification.engiOnthewayVenNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.vendorId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
       if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
     
        Notification.create({
        type:"engineer_ontheway_ven",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:jobInst.vendorId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(vendorInst.id);
        console.log("********************* engiOnthewayVenNoty on the way **************************");
        let fireTokenArr = [];
        vendorInst.accessTokens.forEach(function(token) {
          if (token.firebaseToken)
            fireTokenArr.push(token.firebaseToken);
        })  
          let jobInstNew = jobInst.toJSON();
          let obj = notyMsg.engineerOnTheWayVen(jobInstNew, vendorInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* engineer on the way **************************");
      })

    })
  }

  Notification.remoteMethod("engiOnthewayVenNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })

/////////////////////////////////////engineer on the way//////////////////////////////////


  Notification.engiScheduleCustNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"engineer_schedule",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* engineer schedule Job Noty**************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.scheduleJob(jobInstNew, custInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
             // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
             // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* engineer schedule job **************************");
      })

    })
  }

  Notification.remoteMethod("engiScheduleCustNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })



    Notification.engiScheduleVenNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.vendorId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
       if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
      
        Notification.create({
        type:"engineer_schedule_ven",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:jobInst.vendorId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
       // removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(vendorInst.id);
        console.log("********************* engiOnthewayVenNoty schedule Job **************************");
          let fireTokenArr = [];
          vendorInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let jobInstNew = jobInst.toJSON();
          let obj = notyMsg.scheduleJobVen(jobInstNew, vendorInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
           sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

         /* admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* engineer schedule job **************************");
      })

    })
  }

  Notification.remoteMethod("engiScheduleVenNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })

//////////////////////////////////////Schedule Job //////////////////////////////////////////

  
  Notification.startJobVenNoty = function(jobData, cb) {

    Notification.app.models.People.findById(jobData.vendorId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
       if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
     
        Notification.create({
        type:"start_job",
        requestjobId:jobData.id,
        creatorId:jobData.engineerId,
        peopleId:jobData.vendorId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);

        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);

        updateNotyCount(vendorInst.id);
        console.log("********************* startJobVenNoty **************************");
          let fireTokenArr = [];
          vendorInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  

          let obj = notyMsg.startJobVendor(jobData, vendorInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* startJobVenNoty **************************");
      })

    })
  }

  Notification.remoteMethod("startJobVenNoty", {
    accepts: [
      { arg: "jobData", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


///////////////////////////////////////////start job///////////////////////////////////////


  /////////////////////////////////////offSite /////////////////////////////////////////////

  Notification.pickProductCustNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"pick_product",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
       // removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* pickProductCustNoty **************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.pickProCust(jobInstNew, custInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

         /* admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* pickProductCustNoty **************************");
      })

    })
  }

  Notification.remoteMethod("pickProductCustNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


  Notification.pickProductVenNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.vendorId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
       if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
     
        Notification.create({
        type:"pick_product_ven",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:jobInst.vendorId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
       // removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(vendorInst.id);
        console.log("********************* pickProductVenNoty **************************");
          let fireTokenArr = [];
            vendorInst.accessTokens.forEach(function(token) {
              if (token.firebaseToken)
                fireTokenArr.push(token.firebaseToken);
            })  
          let jobInstNew = jobInst.toJSON();
          let obj = notyMsg.pickProVen(jobInstNew, vendorInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* pickProductVenNoty **************************");
      })

    })
  }

  Notification.remoteMethod("pickProductVenNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


//////////////////////////////////////pick product///////////////////////////////////////////
  

  Notification.updateStatusNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"update_status",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
       // removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* updateStatusNoty **************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let jobInstNew = jobInst.toJSON();
          let obj = notyMsg.updateStatus(jobInstNew, custInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* updateStatusNoty **************************");
      })

    })
  }

  Notification.remoteMethod("updateStatusNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })

//////////////////////////////////////////////update status///////////////////////////////////


  
  Notification.partRequestNoty = function(jobData, cb) {

    Notification.app.models.People.findById(jobData.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"part_request",
        requestjobId:jobData.id,
        creatorId:jobData.engineerId,
        peopleId:jobData.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
       // removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* partRequestNoty **************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let obj = notyMsg.requestPart(jobData, custInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});


          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* partRequestNoty **************************");
      })

    })
  }

  Notification.remoteMethod("partRequestNoty", {
    accepts: [
      { arg: "jobData", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


  //////////////////////////////////////////part request/////////////////////////////////////


  Notification.partResponseNoty = function(jobData, cb) {

    Notification.app.models.People.findById(jobData.engineerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, engineer) {
       if (error) return cb(error, null);
      let engiInst = engineer.toJSON();
     
        Notification.create({
        type:"part_response",
        requestjobId:jobData.id,
        creatorId:jobData.customerId,
        peopleId:jobData.engineerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(engiInst.id);
        console.log("********************* partResponseNoty **************************");
          let fireTokenArr = [];
          engiInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  

          let obj = notyMsg.responsePart(jobData, engiInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});


        /*  admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* partResponseNoty **************************");
      })

    })
  }

  Notification.remoteMethod("partResponseNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })

  //////////////////////////////////////// part Response/////////////////////////////////////


  Notification.updateJobStatusNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"update_job_status",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* updateJobStatusNoty **************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let jobInstNew = jobInst.toJSON();
          let obj = notyMsg.updateJobStatus(jobInstNew, custInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});


          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* updateJobStatusNoty **************************");
      })

    })
  }

  Notification.remoteMethod("updateJobStatusNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })

  ///////////////////////////////////////update job status//////////////////////////////////



  Notification.billGenerateCustNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"bill_generate",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* billGenerateCustNoty **************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let jobInstNew = jobInst.toJSON();
          let obj = notyMsg.generateBillCust(jobInstNew, custInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});


         /* admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* billGenerateCustNoty **************************");
      })

    })
  }

  Notification.remoteMethod("billGenerateCustNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })



   Notification.billGenerateVenNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.vendorId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
       if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
     
        Notification.create({
        type:"bill_generate_ven",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:jobInst.vendorId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(vendorInst.id);
        console.log("********************* billGenerateVenNoty **************************");
          let fireTokenArr = [];
          vendorInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.generateBillVen(jobInstNew, vendorInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});


         /* admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* billGenerateVenNoty **************************");
      })

    })
  }

  Notification.remoteMethod("billGenerateVenNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


//////////////////////////////////////bill generate//////////////////////////////////////


   Notification.completeJobVenNoty = function(jobInst, cb) {

    Notification.app.models.People.findById(jobInst.vendorId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
       if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
     
        Notification.create({
        type:"complete_job",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:jobInst.vendorId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(vendorInst.id);
        console.log("********************* completeJobVenNoty **************************");
          let fireTokenArr = [];
          vendorInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.completeJobVen(jobInstNew, vendorInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});


          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* completeJobVenNoty **************************");
      })

    })
  }

  Notification.remoteMethod("completeJobVenNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


  Notification.completeJobNoty = function(jobInst, cb) {

    Notification.app.models.People.findOne(
      {
      where: {
        
        realm: "admin"
       
      },
      include: {
        relation: "accessTokens"
      }
      
    }, function(error, admin) {
      if (error) return cb(error, null);
      let adminInst = admin.toJSON();
     
     
        Notification.create({
        type:"complete_job_admin",
        requestjobId:jobInst.id,
        creatorId:jobInst.engineerId,
        peopleId:adminInst.id,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(adminInst.id);
        console.log("********************* completeJobNoty **************************");
          let fireTokenArr = [];
          adminInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.completeJobAdmin(jobInstNew, adminInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});


          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* completeJobNoty **************************");
      })

    })
  }

  Notification.remoteMethod("completeJobNoty", {
    accepts: [
      { arg: "jobInst", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })

//////////////////////////////////////////complete job/////////////////////////////////

  
  Notification.cancelJobNoty = function(jobInst,personId, cb) {

    Notification.app.models.People.findOne(
      {
      where: {
        
        realm: "admin"
       
      },
      include: {
        relation: "accessTokens"
      }
      
    }, function(error, admin) {
      if (error) return cb(error, null);
      let adminInst = admin.toJSON();
      console.log("admin:-",adminInst)
     
     
        Notification.create({
        type:"cancel_job_admin",
        requestjobId:jobInst.id,
        creatorId:personId,
        peopleId:adminInst.id,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(adminInst.id);
        console.log("********************* cancelJobNoty **************************");
          let fireTokenArr = [];
          adminInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.cancelJobAdmin(jobInstNew, adminInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});


          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* cancelJobNoty **************************");
      })

    })
  }

  Notification.remoteMethod("cancelJobNoty", {
    accepts: [
      { arg: "jobInst", type: "object",required:true },
       { arg: "personId", type: "string",required:true }
    ],
    returns: { arg: "success", type: "object" }
  })


  Notification.cancelJobNotyVen = function(jobInst,personId, cb) {

    Notification.app.models.People.findById(jobInst.vendorId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
       if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
     
        Notification.create({
        type:"cancel_job",
        requestjobId:jobInst.id,
        creatorId:personId,
        peopleId:jobInst.vendorId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(vendorInst.id);
        console.log("********************* cancelJobVenNoty **************************");
          let fireTokenArr = [];
          vendorInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.cancelJobVendor(jobInstNew, vendorInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

         /* admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* cancelJobVenNoty **************************");
      })

    })
  }

  Notification.remoteMethod("cancelJobNotyVen", {
    accepts: [
      { arg: "jobInst", type: "object",required:true },
       { arg: "personId", type: "string",required:true }
    ],
    returns: { arg: "success", type: "object" }
  })


  Notification.cancelJobNotyCust = function(jobInst,personId, cb) {

    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"cancel_job_cust",
        requestjobId:jobInst.id,
        creatorId:personId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* cancelJobNotyCust **************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.cancelJobCust(jobInstNew, custInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* cancelJobNotyCust **************************");
      })

    })
  }

  Notification.remoteMethod("cancelJobNotyCust", {
    accepts: [
      { arg: "jobInst", type: "object",required:true},
      { arg: "personId", type: "string",required:true }
    ],
    returns: { arg: "success", type: "object" }
  })



  Notification.cancelJobNotyEng = function(jobInst,personId, cb) {

    Notification.app.models.People.findById(jobInst.engineerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, engineer) {
       if (error) return cb(error, null);
      let engiInst = engineer.toJSON();
     
        Notification.create({
        type:"cancel_job_eng",
        requestjobId:jobInst.id,
        creatorId:personId,
        peopleId:jobInst.engineerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(engiInst.id);
        console.log("********************* cancelJobNotyEng **************************");
          let fireTokenArr = [];
          engiInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.cancelJobEng(jobInstNew, engiInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

         // // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:true,peopleId:success.peopleId,jobId:success.requestjobId,notificationId:success.id});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* cancelJobNotyEng **************************");
      })

    })
  }

  Notification.remoteMethod("cancelJobNotyEng", {
    accepts: [
      { arg: "jobInst", type: "object",required:true },
      { arg: "personId", type: "string" ,required:true}
    ],
    returns: { arg: "success", type: "object" }
  })



  ///////////////////////////////////////////payment notification/////////////////////////////////////////





  Notification.cashPaymentNoty = function(jobInst,pDate, cb) {
    
    Notification.app.models.People.findById(jobInst.vendorId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
       if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
     
        Notification.create({
        type:"cash_payment",
        requestjobId:jobInst.id,
        creatorId:jobInst.customerId,
        peopleId:jobInst.vendorId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(vendorInst.id);
        console.log("********************* cashPaymentNoty **************************");
          let fireTokenArr = [];
          vendorInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.paymentCash(jobInstNew, vendorInst,pDate, "en");
          var payload = {
            data: obj,
            notification: obj
          };

         // // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* cashPaymentNoty **************************");
      })

    })
  }

  Notification.remoteMethod("cashPaymentNoty", {
    accepts: [
      { arg: "jobInst", type: "object",required:true },
      { arg: "pDate", type: "date",required:true }
      
    ],
    returns: { arg: "success", type: "object" }
  })





  Notification.cashPaymentCustNoty = function(jobInst,pDate, cb) {
    
    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"cash_payment_cust",
        requestjobId:jobInst.id,
        creatorId:jobInst.customerId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* cashPaymentNoty **************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.paymentCashCust(jobInstNew, custInst,pDate, "en");
          var payload = {
            data: obj,
            notification: obj
          };

         // // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* cashPaymentNoty **************************");
      })

    })
  }

  Notification.remoteMethod("cashPaymentNoty", {
    accepts: [
      { arg: "jobInst", type: "object",required:true },
      { arg: "pDate", type: "date",required:true }
      
    ],
    returns: { arg: "success", type: "object" }
  })




   Notification.chequePaymentNoty = function(jobInst,pDate, cb) {

    Notification.app.models.People.findById(jobInst.vendorId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
       if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
     
        Notification.create({
        type:"cheque_payment",
        requestjobId:jobInst.id,
        creatorId:jobInst.customerId,
        peopleId:jobInst.vendorId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(vendorInst.id);
        console.log("********************* chequePaymentNoty **************************");
          let fireTokenArr = [];
          vendorInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.paymentCheque(jobInstNew, vendorInst,pDate, "en");
          var payload = {
            data: obj,
            notification: obj
          };

         // // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});

         /* admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* chequePaymentNoty **************************");
      })

    })
  }

  Notification.remoteMethod("chequePaymentNoty", {
    accepts: [
      { arg: "jobInst", type: "object",required:true },
      { arg: "pDate", type: "date",required:true }
      
    ],
    returns: { arg: "success", type: "object" }
  })

  Notification.chequePaymentCustNoty = function(jobInst,pDate, cb) {

    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"cheque_payment_cust",
        requestjobId:jobInst.id,
        creatorId:jobInst.customerId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* chequePaymentNoty cust**************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.paymentChequeCust(jobInstNew, custInst,pDate, "en");
          var payload = {
            data: obj,
            notification: obj
          };

         // // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});

         /* admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* chequePaymentNoty **************************");
      })

    })
  }

  Notification.remoteMethod("chequePaymentCustNoty", {
    accepts: [
      { arg: "jobInst", type: "object",required:true },
      { arg: "pDate", type: "date",required:true }
      
    ],
    returns: { arg: "success", type: "object" }
  })



   Notification.onlinePaymentNoty = function(jobInst,pDate, cb) {

    Notification.app.models.People.findById(jobInst.vendorId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
       if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
     
        Notification.create({
        type:"online_payment",
        requestjobId:jobInst.id,
        creatorId:jobInst.customerId,
        peopleId:jobInst.vendorId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(vendorInst.id);
        console.log("********************* onlinePaymentNoty **************************");
          let fireTokenArr = [];
          vendorInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.paymentOnline(jobInstNew, vendorInst,pDate, "en");
          var payload = {
            data: obj,
            notification: obj
          };

         // // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});

         /* admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* onlinePaymentNoty **************************");
      })

    })
  }

  Notification.remoteMethod("onlinePaymentNoty", {
    accepts: [
      { arg: "jobInst", type: "object",required:true },
      { arg: "pDate", type: "date",required:true }
      
    ],
    returns: { arg: "success", type: "object" }
  })


  Notification.onlinePaymentCustNoty = function(jobInst,pDate, cb) {

    Notification.app.models.People.findById(jobInst.customerId,
      {include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
       if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
        Notification.create({
        type:"online_payment_cust",
        requestjobId:jobInst.id,
        creatorId:jobInst.customerId,
        peopleId:jobInst.customerId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* onlinePaymentNoty **************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let  jobInstNew = jobInst.toJSON();
          let obj = notyMsg.paymentOnlineCust(jobInstNew, custInst,pDate, "en");
          var payload = {
            data: obj,
            notification: obj
          };

         // // //console.log(payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});

         /* admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* onlinePaymentNoty **************************");
      })

    })
  }

  Notification.remoteMethod("onlinePaymentCustNoty", {
    accepts: [
      { arg: "jobInst", type: "object",required:true },
      { arg: "pDate", type: "date",required:true }
      
    ],
    returns: { arg: "success", type: "object" }
  })

  //******************************************silent notification************************************************
 //People.app.models.Notification.loginNoty(peopleInst,function(){});
  Notification.loginNoty = function(peopleId, cb) {

    // Notification.app.models.People.findById(peopleObj.id,
    // {include: {
    //     relation: "accessTokens"
    //   }
    // }, 
      Notification.app.models.AccessToken.findOne({where:{userId:peopleId}},function(error, userToken) {
      if (error) return cb(error, null);
      if(!userToken) return;
      console.log("userToken::::>>",userToken);
      Notification.create({
        type:"session_out",
        peopleId:peopleId,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        
        console.log("********************* login noty **************************");
         // let fireTokenArr = [];
          /*userInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })*/ 
         /* Notification.app.models.People.findById(peopleId,function(err,user){
            if(err) return cb(err,null)
            let userInst = user.toJSON();*/
          
            let fireToken = userToken.firebaseToken;
             let obj = notyMsg.loginNotyy(userToken, "en");
               var payload = {
                  data: obj,
                  notification: obj
                  //content_available:true
                };

          
          //console.log("-------------------Notification done-------------->>",payload);
            sendSilentNotification(fireToken,payload);
          //})
        })
    })
  }

  Notification.remoteMethod("loginNoty", {
    accepts: [
      { arg: "peopleId", type: "string" }
    ],
    returns: { arg: "success", type: "object" }
  })

  //***************************************************silent notification**************************************




  //////////////////////////////////////cron job auto cancel///////////////////////////////////
  Notification.cronNoty = function(job, cb) {

    Notification.app.models.People.findOne({
      where: {
        realm: "admin"
      },
      include: {
        relation: "accessTokens"
      }
      
    }, function(error, admin) {
      if (error) return cb(error, null);
      let adminInst = admin.toJSON();
     // // //console.log("Admins =",admins)
      Notification.create({
        type:"notify",
        requestjobId:job.id,
        creatorId:job.customerId,
        peopleId:adminInst.id,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(adminInst.id);
        console.log("********************* cronNoty **************************");
          let fireTokenArr = [];
          adminInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let jobInstNew = job.toJSON();
          let notyDate = new Date();
          let obj = notyMsg.autoCancel(jobInstNew, adminInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log("hello payload=",payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});


          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* createJobNoty **************************");
      })

    })
  }

  Notification.remoteMethod("cronNoty", {
    accepts: [
      { arg: "job", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })



  Notification.cronVenNoty = function(job, cb) {

    Notification.app.models.People.findOne(job.vendorId,{
      include: {
        relation: "accessTokens"
      }
      
    }, function(error, vendor) {
      if (error) return cb(error, null);
      let vendorInst = vendor.toJSON();
     
      Notification.create({
        type:"notify_vendor",
        requestjobId:job.id,
        creatorId:job.customerId,
        peopleId:vendorInst.id,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(vendorInst.id);
        console.log("********************* cronVenNoty **************************");
          let fireTokenArr = [];
          vendorInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let jobInstNew = job.toJSON();
          let notyDate = new Date();
          let obj = notyMsg.autoVenCancel(jobInstNew, vendorInst,"en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log("hello payload=",payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* createJobNoty **************************");
      })

    })
  }

  Notification.remoteMethod("cronVenNoty", {
    accepts: [
      { arg: "job", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


   Notification.cronVenResponse = function(job, cb) {

    Notification.app.models.People.findOne({
      where: {
        realm: "admin"
      },
      include: {
        relation: "accessTokens"
      }
      
    }, function(error, admin) {
      if (error) return cb(error, null);
      let adminInst = admin.toJSON();
     // // //console.log("Admins =",admins)
      Notification.create({
        type:"notify_vendor_response",
        requestjobId:job.id,
        creatorId:job.customerId,
        peopleId:adminInst.id,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(adminInst.id);
        console.log("********************* cronVenResponse **************************");
          let fireTokenArr = [];
          adminInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let jobInstNew = job.toJSON();
          let notyDate = new Date();
          let obj = notyMsg.autoVenCancelAdmin(jobInstNew, adminInst,"en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log("hello payload=",payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* createJobNoty **************************");
      })

    })
  }

  Notification.remoteMethod("cronVenResponse", {
    accepts: [
      { arg: "job", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


  ////////////////////////////////////////////customer  notification////////////////////////////////////////////


  Notification.cronCustNoty = function(job, cb) {

    Notification.app.models.People.findOne(job.customerId,{
      include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
      if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
      Notification.create({
        type:"notify_cust",
        requestjobId:job.id,
        creatorId:"",
        peopleId:custInst.id,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* cronCustNoty **************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let jobInstNew = job.toJSON();
          let notyDate = new Date();
          let obj = notyMsg.cronCust1(jobInstNew, custInst,"en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log("hello payload=",payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});
          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* createJobNoty **************************");
      })

    })
  }

  Notification.remoteMethod("cronCustNoty", {
    accepts: [
      { arg: "job", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })




   Notification.cronCust2Noty = function(job, cb) {

    Notification.app.models.People.findOne(job.customerId,{
      include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
      if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
      Notification.create({
        type:"notify_cust2",
        requestjobId:job.id,
        creatorId:jobInst.vendorId,
        peopleId:custInst.id,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* notify_cust2 **************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let jobInstNew = job.toJSON();
          let notyDate = new Date();
          let obj = notyMsg.cronCust2(jobInstNew, custInst,"en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log("hello payload=",payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* createJobNoty **************************");
      })

    })
  }

  Notification.remoteMethod("cronCust2Noty", {
    accepts: [
      { arg: "job", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })


  Notification.cronCust3Noty = function(job, cb) {

    Notification.app.models.People.findOne(job.customerId,{
      include: {
        relation: "accessTokens"
      }
      
    }, function(error, customer) {
      if (error) return cb(error, null);
      let custInst = customer.toJSON();
     
      Notification.create({
        type:"notify_cust3",
        requestjobId:job.id,
        creatorId:jobInst.vendorId,
        peopleId:custInst.id,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(custInst.id);
        console.log("********************* cronCust3Noty **************************");
          let fireTokenArr = [];
          custInst.accessTokens.forEach(function(token) {
            if (token.firebaseToken)
              fireTokenArr.push(token.firebaseToken);
          })  
          let jobInstNew = job.toJSON();
          let notyDate = new Date();
          let obj = notyMsg.cronCust3(jobInstNew, custInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log("hello payload=",payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});

          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* createJobNoty **************************");
      })

    })
  }

  Notification.remoteMethod("cronCust3Noty", {
    accepts: [
      { arg: "job", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })










  /////////////////////////////////////cron job auto cancel////////////////////////////////////

Notification.cronVenEng = function(job, cb) {

    Notification.app.models.People.findOne({
      where: {
        realm: "admin"
      },
      include: {
        relation: "accessTokens"
      }
      
    }, function(error, admin) {
      if (error) return cb(error, null);
      let adminInst = admin.toJSON();
     // // //console.log("Admins =",admins)
      Notification.create({
        type:"notify_vendor_eng",
        requestjobId:job.id,
        creatorId:job.customerId,
        peopleId:adminInst.id,
        createdAt:new Date(),
        updatedAt:new Date()  
      },function(error,success){

        if(error) return cb(error,null);
        // For remove old notifications
        //removeOldNoty(success.peopleId,success.id,success.requestjobId);
        updateNotyCount(adminInst.id);
        console.log("********************* cronVenEng **************************");
         let fireTokenArr = [];
        adminInst.accessTokens.forEach(function(token) {
          if (token.firebaseToken)
            fireTokenArr.push(token.firebaseToken);
        })  
          let jobInstNew = job.toJSON();
          let notyDate = new Date();
          let obj = notyMsg.autoVenEngAdmin(jobInstNew, adminInst, "en");
          var payload = {
            data: obj,
            notification: obj
          };

          // //console.log("hello payload=",payload);

          // payload.notification.click_action =  ".Activity.NotificationJobActivity";
          sendNotification(fireTokenArr,payload, {isTokenDel:false});


          /*admin.messaging().sendToDevice(token.firebaseToken, payload)
          .then(function(response) {
            // // //console.log(response.results);
            cb(null, response);
          })
          .catch(function(error) {
            // // //console.log(error)
            cb(error, null);
          });
        })*/
        // //console.log("********************* createJobNoty **************************");
      })

    })
  }

  Notification.remoteMethod("cronVenEng", {
    accepts: [
      { arg: "job", type: "object" }
    ],
    returns: { arg: "success", type: "object" }
  })















































   Notification.getNotifications = function(req,cb){
    let peopleId = req.accessToken.userId;
    let ln = req.accessToken.ln || "en";
    let filter ={};
    if(!filter)
      filter = {};
    
    if(!filter.where)
      filter.where = {};

    filter.include = [
     
      {
        relation:"creator"
      },
      {
        relation:"people"
      },
      {
        relation:"requestjob",
        scope:{
              include: [{ 
        relation: 'customer', 
        scope: {
          fields:{"id":true ,"fullName":true,"email":true,"mobile":true,"image":true} 
        }
      },
      { 
        relation: 'engineer', 
        scope: {
          fields:{"id":true ,"fullName":true,"email":true,"mobile":true,"image":true} 
        }
      },
      { 
        relation: 'vendor', 
        scope: {
          fields:{"id":true ,"fullName":true,"email":true,"mobile":true,"image":true} 
        }
      },
      { 
        relation: 'category', 
        
      }
      ]
        }
      }
      
    ]

    filter.order = "createdAt DESC";
    filter.where.peopleId = peopleId;  
     
    Notification.find(filter,function(error,notifications){
      if(error)
        cb(error,null);
      else{
        // return cb(null,{data:[],msg:msg.getNotifications});
        let notyArr = [];
        //console.log("***********************************************************");
        notifications.forEach(function(value){

          let noty = value.toJSON();
          noty.requestjob = noty.requestjob || {};
          noty.creator = noty.creator || {}; 
          noty.people = noty.people || {}; 

         // noty.transaction = noty.transaction || {}; 

          if(noty.type == "new_job"){
            notyArr.push(notyMsg.addJobNoty(noty.requestjob,noty.people,ln));
          }else if(noty.type == "reassigned_job"){
            notyArr.push(notyMsg.addJobNoty1(noty.requestjob,noty.people,ln));
          }else if(noty.type == "vendor_assigned"){
            notyArr.push(notyMsg.vendorAssigned(noty.requestjob,noty.people,ln));
          }
          else if(noty.type == "vendor_accept" || noty.type == "vendor_cancel"){
            notyArr.push(notyMsg.vendorAcceptedCust(noty.requestjob,noty.people,noty,ln));
          }else if(noty.type == "vendor_accept"|| noty.type == "vendor_cancel"){
            notyArr.push(notyMsg.vendorAcceptedAdmin(noty.people,noty.people,noty,ln));s
          }else if(noty.type == "engineer_assign"){
            notyArr.push(notyMsg.engineerAssignd(noty.requestjob,noty.people,ln));
          }else if(noty.type == "engineer_assign_cust"){
            notyArr.push(notyMsg.engineerAssigndCust(noty.requestjob,noty.people,ln));
          }else if(noty.type == "engineer_ontheway"){
            notyArr.push(notyMsg.engineerOnTheWay(noty.requestjob,noty.people,ln));
          }else if(noty.type == "engineer_ontheway_ven"){
            //console.log("engineerNoty:=",noty)
            notyArr.push(notyMsg.engineerOnTheWayVen(noty.requestjob,noty.people,ln));
          }else if(noty.type == "engineer_schedule"){
            notyArr.push(notyMsg.scheduleJob(noty.requestjob,noty.people,ln));
          }else if(noty.type == "engineer_schedule_ven"){
            notyArr.push(notyMsg.scheduleJobVen(noty.requestjob,noty.people,ln));
          }else if(noty.type == "start_job"){
            notyArr.push(notyMsg.startJobVendor(noty.requestjob,noty.people,ln));
          }else if(noty.type == "pick_product"){
            notyArr.push(notyMsg.pickProCust(noty.requestjob,noty.people,ln));
          }else if(noty.type == "pick_product_ven"){
            notyArr.push(notyMsg.pickProVen(noty.requestjob,noty.people,ln));
          }else if(noty.type == "update_status"){
            notyArr.push(notyMsg.updateStatus(noty.requestjob,noty.people,ln));
          }else if(noty.type == "part_request"){
            notyArr.push(notyMsg.requestPart(noty.requestjob,noty.people,ln));
          }else if(noty.type == "part_response"){
            notyArr.push(notyMsg.responsePart(noty.requestjob,noty.people,ln));
          }else if(noty.type == "update_job_status"){
            notyArr.push(notyMsg.updateJobStatus(noty.requestjob,noty.people,ln));
          }else if(noty.type == "bill_generate"){
            notyArr.push(notyMsg.generateBillCust(noty.requestjob,noty.people,ln));
          }else if(noty.type == "bill_generate_ven"){
            notyArr.push(notyMsg.generateBillVen(noty.requestjob,noty.people,ln));
          }else if(noty.type == "complete_job"){
            notyArr.push(notyMsg.completeJobVen(noty.requestjob,noty.people,ln));
          }else if(noty.type == "complete_job_admin"){
            notyArr.push(notyMsg.completeJobAdmin(noty.requestjob,noty.people,ln));
          }else if(noty.type == "cancel_job_admin"){
            notyArr.push(notyMsg.cancelJobAdmin(noty.requestjob,noty.people,ln));
          }else if(noty.type == "cancel_job"){
            notyArr.push(notyMsg.cancelJobVendor(noty.requestjob,noty.people,ln));
          }else if(noty.type == "cancel_job_cust"){
            notyArr.push(notyMsg.cancelJobCust(noty.requestjob,noty.people,ln));
          }else if(noty.type == "cancel_job_eng"){
            notyArr.push(notyMsg.cancelJobEng(noty.requestjob,noty.people,ln));
          }else if(noty.type == "cash_payment"){
            notyArr.push(notyMsg.paymentCash(noty.requestjob,noty.people,ln));
          }else if(noty.type == "cheque_payment"){
            notyArr.push(notyMsg.paymentCheque(noty.requestjob,noty.people,noty.createdAt,ln));
          }else if(noty.type == "online_payment"){
            noty.requestjob.paymentDoneDate = noty.requestjob.paymentDoneDate || new Date();
            notyArr.push(notyMsg.paymentOnline(noty.requestjob,noty.people,noty.requestjob.paymentDoneDate,ln));
          }else if(noty.type == "notify"){
            notyArr.push(notyMsg.autoCancel(noty.requestjob,noty.people,ln));
          }else if(noty.type == "notify_vendor"){
            notyArr.push(notyMsg.autoVenCancel(noty.requestjob,noty.people,ln));
          }else if(noty.type == "notify_vendor_response"){
            notyArr.push(notyMsg.autoVenCancelAdmin(noty.requestjob,noty.people,ln));
          }else if(noty.type == "notify_vendor_response"){
            notyArr.push(notyMsg.autoVenCancelAdmin(noty.requestjob,noty.people,ln));
          }else if(noty.type == "notify_vendor_eng"){
            notyArr.push(notyMsg.autoVenEngAdmin(noty.requestjob,noty.people,ln));
          }else if(noty.type == "notify_cust"){
            notyArr.push(notyMsg.cronCust1(noty.requestjob,noty.people,ln));
          }else if(noty.type == "notify_cust2"){
            notyArr.push(notyMsg.cronCust2(noty.requestjob,noty.people,ln));
          }else if(noty.type == "notify_cust3"){
            notyArr.push(notyMsg.cronCust3(noty.requestjob,noty.people,ln));
          }else if(noty.type == "cash_payment_cust"){
            notyArr.push(notyMsg.paymentCashCust(noty.requestjob,noty.people,new Date(),ln));
          }else if(noty.type == "cheque_payment_cust"){
            notyArr.push(notyMsg.paymentChequeCust(noty.requestjob,noty.people,new Date(),ln));
          }else if(noty.type == "online_payment_cust"){
            notyArr.push(notyMsg.paymentOnlineCust(noty.requestjob,noty.people,new Date(),ln));
          }
        })
        cb(null,{data:notyArr,msg:msg.getNotifications});
      }
    })
  }

  Notification.remoteMethod("getNotifications",{
    accepts : [
    //  {arg:"filter",type:"object",http:{source:"body"}}
      {arg:"req",type:"object",http:{source:"req"}}
    ],
    returns : {arg:"success",type:"object"},
    http:{verb:"get"}
  })



  Notification.readAllNoty = function(req,cb){
    let peopleId = req.accessToken.userId;
    Notification.app.models.People.findById(peopleId,function(error,peopleInst){
      if(error) return cb(error,null);
      peopleInst.newNotification = 0;
      peopleInst.save(function(errorV,success){
        if(errorV) return cb(error,null);
        cb(null,{data:success,msg:msg.readAllNoty});
      })
    })
  }

  Notification.remoteMethod("readAllNoty",{
    accepts : [
      {arg:"req",type:"object",http:{source:"req"}}
    ],
    returns : {arg:"success",type:"object"},
    http:{verb:"get"}
  })


  Notification.readRequestCount = function(req,cb){
    let peopleId = req.accessToken.userId;
    Notification.app.models.People.findById(peopleId,function(error,peopleInst){
      if(error) return cb(error,null);
      peopleInst.newJobRequest = 0;
      peopleInst.save(function(errorV,success){
        if(errorV) return cb(error,null);
        cb(null,{data:success,msg:msg.readAllNoty});
      })
    })
  }

  Notification.remoteMethod("readRequestCount",{
    accepts : [
      {arg:"req",type:"object",http:{source:"req"}}
    ],
    returns : {arg:"success",type:"object"},
    http:{verb:"get"}
  })

  /*function removeOldNoty(peopleId,notificationId,requestjobId){
    Notification.destroyAll({peopleId:peopleId,requestjobId:requestjobId,id:{neq:notificationId}},function(err,success){
      console.log("destroy notificatioin count");
       console.log(success)
       if(success){

       }  
    });
  }*/

};
