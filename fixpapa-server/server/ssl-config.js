var path = require('path');
var fs = require('fs');

exports.privateKey = fs.readFileSync('/etc/letsencrypt/live/fixpapa.com/privkey.pem').toString();
exports.certificate = fs.readFileSync('/etc/letsencrypt/live/fixpapa.com/cert.pem').toString();
