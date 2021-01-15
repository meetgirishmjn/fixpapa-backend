'use strict';

module.exports = function(Container) {

  Container.imageUpload = function(req, res, containerName, cb) {

    Container.getContainer(containerName.container,function(err,success){
        if(err){
          if(err.statusCode ===404){
            Container.createContainer({name:containerName.container},function(err,success){
              if(err)
                cb(err,null)
              else
                uploadFile();
            })
          }else{
            cb(err,null);
          }
        }else{
          uploadFile();
        }
    })

    function uploadFile(){
      Container.upload(req, res, {container:containerName.container,nameConflict:"makeUnique"}, function(err, success) {
        if (err) {
          cb(err, null);
        } else {
          var obj = {};
          for (var file in success.files) {
            for (var i = 0; i < success.files[file].length; i++) {
              success.files[file][i].url = "/api/Containers/" + success.files[file][i].container + "/download/" + success.files[file][i].name;
            }
          }

          obj.files = success.files;
          for (var field in success.fields) {
            obj[field] = success.fields[field][0];
          }
          cb(null, obj);
        }
      })
    }
  }

  Container.remoteMethod("imageUpload", {
    accepts: [
      { arg: 'req', type: 'object', http: { source: 'req' } },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'containerName', type: 'string', required: true }
    ],
    returns: { arg: 'success', type: 'object' }
  })

};
