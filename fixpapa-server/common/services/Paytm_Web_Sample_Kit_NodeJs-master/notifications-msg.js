'use strict'
var dateFormat = require('dateformat');
let date = require('date-and-time');
module.exports = {
	addJobNoty : function(jobInstNew,adminInst,ln){
		ln = ln || "en";
   
    jobInstNew.category = jobInstNew.category || {};
		return {

          title    : jobInstNew.category.name,
          body     : "Hi a new job posted",
          "type"   : "new_job",
          "Date"   : jobInstNew.createdAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (adminInst.newJobRequest || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1

        }
	},

  addJobNoty1 : function(jobInstNew,custInst,ln){
    ln = ln || "en";
   
    jobInstNew.category = jobInstNew.category || {};
    return {

          title    : jobInstNew.category.name,
          body     : "Your job reassigned as orderId :"+jobInstNew.orderId,
          "type"   : "reassigned_job",
          "Date"   : jobInstNew.createdAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
  vendorAssigned : function(jobInstNew,vendorInst,ln){
    ln = ln || "en";
   
    jobInstNew.category = jobInstNew.category || {};
    return {
          //title    : "New job received",
          title    : jobInstNew.category.name,
          body     : "You have got new job lead please accept ASAP.",
         "Date"   : jobInstNew.updatedAt.toISOString(),
         //"Date"   : notyDate.toISOString(),
          "type"   : "vendor_assigned",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (vendorInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },

  vendorAcceptedCust : function(jobInstNew,custInst,notyInst,ln){
    ln = ln || "en";
   
    jobInstNew.category = jobInstNew.category || {};
    jobInstNew.vendor = jobInstNew.vendor || {};
    return {
           title    : jobInstNew.category.name,
           //title   : notyInst.type == "vendor_accept" ? "Vendor Accepted":"Vendor cancelled",
           body    : notyInst.type == "vendor_accept" ? jobInstNew.vendor.fullName +" has accepted your job and he will assign engineer ASAP.": jobInstNew.vendor.fullName +" has cancelled your job.",
          "Date"   : jobInstNew.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : notyInst.type,
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
  vendorAcceptedAdmin : function(jobInstNew,adminInst,notyInst,ln){
    ln = ln || "en";
      //notyDate =  new Date();
     jobInstNew.category = jobInstNew.category || {};
     jobInstNew.vendor = jobInstNew.vendor || {};
     return {
          title    : jobInstNew.category.name,
          // title   : notyInst.type == "vendor_accept" ? "Vendor Accepted"// body     : jobInst.vendor.fullName "has accepted job.",
           body    : notyInst.type == "vendor_accept_admin" ? jobInstNew.vendor.fullName +"has accepted job.": jobInstNew.vendor.fullName+ "has cancelled job.",
          "Date"   : jobInstNew.updatedAt.toString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : notyInst.type,
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (adminInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
  engineerAssignd : function(jobInstNew1,engiInst,ln){///////////prob in  this notification///////////
    ln = ln || "en";
   // notyDate =  new Date();
    jobInstNew1.category = jobInstNew1.category || {};
    return {
          //title    : "Engineer_Assigned",
          title    : jobInstNew1.category.name,
          body     : "You have got a new job.",
          "Date"   : jobInstNew1.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "engineer_assign",
          "jobId"  : jobInstNew1.id.toString(),
          "badge"  : (engiInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
  engineerAssigndCust : function(jobInstNew,custInst,ln){
    ln = ln || "en";
   // notyDate =  new Date();
    jobInstNew.category = jobInstNew.category || {};
    return {
          //title    : "Engineer_Assigned",
           title    : jobInstNew.category.name,
          body     :  "Fixpapa expert has assigned for your job and your OTP is "+jobInstNew.otp,
          "Date"   : jobInstNew.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "engineer_assign_cust",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
  engineerOnTheWay : function(jobInstNew,custInst,ln){
    ln = ln || "en";
  
   //notyDate =  new Date();
   jobInstNew.category = jobInstNew.category || {};
   jobInstNew.engineer = jobInstNew.engineer || {};
    return {
           //title    : "Engineer_Ontheway",
           title    : jobInstNew.category.name,
           body     : "Fixpapa expert "+jobInstNew.engineer.fullName+" is on the way.",
          "Date"   : jobInstNew.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "engineer_ontheway",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
   engineerOnTheWayVen : function(jobInstNew,vendorInst,ln){
    ln = ln || "en";
    ////console.log(jobInstNew.updatedAt);
    //notyDate =  new Date();
    jobInstNew.category = jobInstNew.category || {};
    jobInstNew.engineer = jobInstNew.engineer || {};
    return {
           //title    : "Engineer_Ontheway",
          title    : jobInstNew.category.name,
          body     : jobInstNew.engineer.fullName+" is on the way to complete the job.",
          "Date"   : jobInstNew.updatedAt,
          "type"   : "engineer_ontheway_ven",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (vendorInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
  startJobVendor : function(jobData,vendorInst,ln){
    ln = ln || "en";
    
    //notyDate =  new Date();
    jobData.category = jobData.category || {};
    jobData.engineer = jobData.engineer || {};
    vendorInst = vendorInst || {};
    return {
           //title    : "Start_Job",
           title    : jobData.category.name,
           body     : jobData.engineer.fullName+" is on site and fixing the issues.",
          "Date"   : jobData.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "start_job",
          "jobId"  : jobData.id.toString(),
          "badge"  : (vendorInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
    scheduleJob : function(jobInstNew,custInst,ln){
    ln = ln || "en";
   // notyDate =  new Date();
    let newDate = new Date(jobInstNew.schedule.eStartDate);
   // let scheduleDate = date.format(newDate, 'YYYY/MM/DD HH:mm:ss');
      let scheduleDate  =newDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
      scheduleDate = dateFormat(scheduleDate,"dddd, mmmm dS, yyyy, h:MM:ss TT");
   // //console.log(newDate.getHours());
        ////console.log(newDate.getMinutes());
        jobInstNew.engineer = jobInstNew.engineer || {};
        jobInstNew.category = jobInstNew.category || {};
        return {
          // title    : "Engineer_Schedule_Job",
          title    : jobInstNew.category.name,
           body     : "Fixpapa expert "+jobInstNew.engineer.fullName+" has scheduled your job at "+scheduleDate,
           "Date"   : jobInstNew.updatedAt.toISOString(),
          // "Date"   : notyDate.toISOString(),
          "type"   : "engineer_schedule",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
   scheduleJobVen : function(jobInstNew,custInst,ln){
    ln = ln || "en";
  //notyDate =  new Date();
  let newDate = new Date(jobInstNew.schedule.eStartDate);
   // let scheduleDate = date.format(newDate, 'YYYY/MM/DD HH:mm:ss');
      let scheduleDate  =newDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
      scheduleDate = dateFormat(scheduleDate,"dddd, mmmm dS, yyyy, h:MM:ss TT");
      jobInstNew.category = jobInstNew.category || {};
      jobInstNew.engineer = jobInstNew.engineer || {};
    return {
          // title    : "Engineer_Schedule_Job",
           title    : jobInstNew.category.name,
           body     : "Fixpapa expert "+jobInstNew.engineer.fullName+" has scheduled job at "+scheduleDate,
          "Date"   : jobInstNew.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "engineer_schedule_ven",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },

  pickProCust : function(jobInstNew,custInst,ln){
    ln = ln || "en";
    //notyDate =  new Date();
    jobInstNew.category = jobInstNew.category || {};
    return {
           //title    : "Pick_Product",
           title    : jobInstNew.category.name,
           body     : "Your product picked for offsite repair and It will be delivered with in "+jobInstNew.pick.duration+" days .",
           "Date"   : jobInstNew.updatedAt.toISOString(),
          // "Date"   : notyDate.toISOString(),
          "type"   : "pick_product",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },

  pickProVen : function(jobInstNew,vendorInst,ln){
    ln = ln || "en";
   // notyDate =  new Date();
    jobInstNew.category = jobInstNew.category || {};
    jobInstNew.engineer = jobInstNew.engineer || {};
    return {
         // title    : "Pick_Product",
          title    : jobInstNew.category.name,
          body     : jobInstNew.engineer.fullName+" has picked product for offsite work.",
          "Date"   : jobInstNew.updatedAt.toISOString(),
         // "Date"   : notyDate.toISOString(),
          "type"   : "pick_product_ven",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (vendorInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
    updateStatus : function(jobInstNew,custInst,ln){
    ln = ln || "en";
    //notyDate =  new Date();
    jobInstNew.category = jobInstNew.category || {};
    return {
          
          title    : jobInstNew.category.name,
        // title     :  "Update_Status",
          body     : jobInstNew.pick.offsiteStatus[jobInstNew.pick.offsiteStatus.length-1].text,
          "Date"   : jobInstNew.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "update_status",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1

        }
  },

  requestPart : function(jobData,custInst,ln){
    ln = ln || "en";
    //notyDate =  new Date();
    jobData.category = jobData.category || {};
    jobData.engineer = jobData.engineer || {};
    return {
         // title    : "Part_Request",
          title    : jobData.category.name,
          body     : "Fixpapa expert "+jobData.engineer.fullName+" requested for additional parts.",
          "Date"   : jobData.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "part_request",
          "jobId"  : jobData.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
  responsePart : function(jobData,engiInst,ln){
    ln = ln || "en";
    //notyDate =  new Date();
    jobData.category = jobData.category || {};
    jobData.customer = jobData.customer || {};
    return {
          //title    : "Part_Response",
          title    : jobData.category.name,
          body     : jobData.customer.fullName+" sent response of part request.",
          "Date"   : jobData.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "part_response",
          "jobId"  : jobData.id.toString(),
          "badge"  : (engiInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
   updateJobStatus : function(jobInstNew,custInst,ln){
    ln = ln || "en";
   // notyDate =  new Date();
    jobInstNew.category = jobInstNew.category || {};
    return {
          //title    : "Update_Job_Status",
          title    : jobInstNew.category.name,
          body     : "Your current job status "+jobInstNew.status,
         "Date"   : jobInstNew.updatedAt.toISOString(),
         //"Date"   : notyDate.toISOString(),
         "type"   : "update_job_status",
         "jobId"  : jobInstNew.id.toString(),
         "badge"  : (custInst.newNotification || 0).toString(),
         "sound"  : "default",
         "priority":"high",
          "force-start":1
        }
  },
  generateBillCust : function(jobInstNew,custInst,ln){
    ln = ln || "en";
       //notyDate =  new Date();
       jobInstNew.category =jobInstNew.category||{};

    return {
          //title    : "Bill_Generate",
          title    : jobInstNew.category.name,
          body     : "Your issue has resolved successfully please pay your bill.",
         "Date"   : jobInstNew.updatedAt.toISOString(),
         //"Date"   : notyDate.toISOString(),
          "type"   : "bill_generate",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
   generateBillVen : function(jobInstNew,vendorInst,ln){
    ln = ln || "en";
     //notyDate =  new Date();
     jobInstNew.category =jobInstNew.category||{};
    return {
          //title    : "Bill_Generate",
          title    : jobInstNew.category.name,
          body     : jobInstNew.engineer.fullName+" has generated bill for job "+jobInstNew.orderId,
          "Date"   : jobInstNew.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "bill_generate_ven",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (vendorInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
 },
  
  completeJobVen : function(jobInstNew,vendorInst,ln){
    ln = ln || "en";
     //notyDate =  new Date();
     jobInstNew.category = jobInstNew.category || {};
     jobInstNew.engineer = jobInstNew.engineer || {};
    return {
          //title    : "Complete_Job",
          title    : jobInstNew.category.name,
          body     : jobInstNew.engineer.fullName+" has completed job "+jobInstNew.orderId,
          "Date"   : jobInstNew.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "complete_job",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (vendorInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
   completeJobAdmin : function(jobInstNew,adminInst,ln){
    ln = ln || "en";
     // notyDate =  new Date();
      jobInstNew.category = jobInstNew.category || {};
      jobInstNew.engineer = jobInstNew.engineer || {};

    return {
          //title    : "Complete_Job",
          title    : jobInstNew.category.name,
          body     : jobInstNew.engineer.fullName+" has completed job "+jobInstNew.orderId,
          "Date"   : jobInstNew.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "complete_job_admin",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (adminInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
   cancelJobAdmin : function(jobInstNew,adminInst,ln){
    ln = ln || "en";
     //notyDate =  new Date();
     jobInstNew.category = jobInstNew.category || {};
     jobInstNew.engineer = jobInstNew.engineer || {};

    return {
          title    : jobInstNew.category.name,
          body     : jobInstNew.orderId+" job is cancelled.",
           "Date"   : jobInstNew.updatedAt.toISOString(),
           //"Date"   : notyDate.toISOString(),
          "type"   : "cancel_job_admin",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (adminInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
   cancelJobVendor : function(jobInstNew,vendorInst,ln){
    ln = ln || "en";
  
     //notyDate =  new Date();
     jobInstNew.engineer = jobInstNew.engineer || {};

    return {
          title    : jobInstNew.category.name,
          body     : jobInstNew.orderId+" job is cancelled.",
          "Date"   : jobInstNew.updatedAt.toISOString(),
         //"Date"   : notyDate.toISOString(),
          "type"   : "cancel_job",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (vendorInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
     cancelJobCust : function(jobInstNew,custInst,ln){
    ln = ln || "en";
     // notyDate =  new Date();
     jobInstNew.category = jobInstNew.category || {};
    

    return {
          title    : jobInstNew.category.name,
          body     : jobInstNew.orderId+" job is cancelled.",
          "Date"   : jobInstNew.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "cancel_job_cust",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },

     cancelJobEng : function(jobInstNew,engiInst,ln){
    ln = ln || "en";
    // notyDate =  new Date();
     jobInstNew.category = jobInstNew.category || {};
     
    return {
          title    : jobInstNew.category.name,
          body     : jobInstNew.orderId+" job is cancelled.",
          "Date"   : jobInstNew.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "cancel_job_eng",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (engiInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },

   paymentCash : function(jobInstNew,vendorInst,ln){
    ln = ln || "en";
     // notyDate =  new Date();
     jobInstNew.category = jobInstNew.category || {};
     
    return {
          title    : jobInstNew.category.name,
          body     : "Payment done for orderId: "+jobInstNew.orderId,
          "Date"   : jobInstNew.updatedAt.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "cash_payment",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (vendorInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },

  paymentCheque : function(jobInstNew,vendorInst,pDate,ln){
    ln = ln || "en";
     // notyDate =  new Date();
     jobInstNew.category = jobInstNew.category || {};
     
    return {
          title    : jobInstNew.category.name,
          body     : "Payment done for orderId: "+jobInstNew.orderId,
         "Date"   : pDate.toISOString(),
         //"Date"   : notyDate.toISOString(),
          "type"   : "cheque_payment",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (vendorInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },

  paymentOnline : function(jobInstNew,vendorInst,pDate,ln){
    ln = ln || "en";
     
     jobInstNew.category = jobInstNew.category || {};
     //console.log("checking pDate before=> ",pDate)
     pDate = new Date(pDate)|| new Date();
     //console.log("checking pDate=> ",pDate)
     
    return {
          title    : jobInstNew.category.name,
          body     : "Payment done for orderId: "+jobInstNew.orderId,
          "Date"   : pDate.toISOString(),
          //"Date"   : notyDate.toISOString(),
          "type"   : "online_payment",
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (vendorInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
  autoCancel : function(jobInstNew,adminInst,ln){
    ln = ln || "en";
   let notyDate = new Date();
    jobInstNew.category = jobInstNew.category || {};
    return {

          title    : jobInstNew.category.name,
          body     : "Assign vendor asap, otherwise jobs will cancel automatically!!",
          "type"   : "notify",
          "Date"   : notyDate.toISOString(),
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (adminInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
  autoVenCancel : function(jobInstNew,vendorInst,ln){
    ln = ln || "en";
   let notyDate = new Date();
    jobInstNew.category = jobInstNew.category || {};
    return {

          title    : jobInstNew.category.name,
          body     : "Assign engineer asap,Before 22 hours otherwise jobs will cancel automatically!!",
          "type"   : "notify_vendor",
          "Date"   : notyDate.toISOString(),
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (vendorInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
   autoVenCancelAdmin : function(jobInstNew,adminInst,ln){
    ln = ln || "en";
   let notyDate = new Date();
    jobInstNew.category = jobInstNew.category || {};
    return {

          title    : jobInstNew.category.name,
          body     : "job cancelled by system as vendor did not responded!!",
          "type"   : "notify_vendor_response",
          "Date"   : notyDate.toISOString(),
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (adminInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
    autoVenEngAdmin : function(jobInstNew,adminInst,ln){
    ln = ln || "en";
    let notyDate = new Date();
    jobInstNew.category = jobInstNew.category || {};
    //jobInstNew.updatedAt
    return {

          title    : jobInstNew.category.name,
          body     : "job cancelled by system as vendor did not assigned engineer on time.",
          "type"   : "notify_vendor_eng",
          "Date"   : notyDate.toISOString(),
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (adminInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
   cronCust1 : function(jobInstNew,custInst,ln){
    ln = ln || "en";
    let notyDate = new Date();
    jobInstNew.category = jobInstNew.category || {};
    return {

          title    : jobInstNew.category.name,
          body     : "Sorry for inconvience,your job is cancelled due to unavailablity of vendor. You can create new Job/Our team will contact you soon.",
          "type"   : "notify_cust",
          "Date"   : notyDate.toISOString(),
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
  cronCust2 : function(jobInstNew,custInst,ln){
    ln = ln || "en";
    let notyDate = new Date();
    jobInstNew.category = jobInstNew.category || {};
    return {

          title    : jobInstNew.category.name,
          body     : "Sorry for inconvience,your job is cancelled due to technical issue. You can create new Job/Our team will contact you soon.",
          "type"   : "notify_cust2",
          "Date"   : notyDate.toISOString(),
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  },
  cronCust3 : function(jobInstNew,custInst,ln){
    ln = ln || "en";
    let notyDate = new Date();
    jobInstNew.category = jobInstNew.category || {};
    return {

          title    : jobInstNew.category.name,
          body     : "Sorry for inconvience,your job is cancelled due to unavailablity of engineer. You can create new Job/Our team will contact you soon.",
          "type"   : "notify_cust3",
          "Date"   : notyDate.toISOString(),
          "jobId"  : jobInstNew.id.toString(),
          "badge"  : (custInst.newNotification || 0).toString(),
          "sound"  : "default",
          "priority":"high",
          "force-start":1
        }
  }





};
