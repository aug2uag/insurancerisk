#!/usr/bin/env node

var express = require('express');
var app = module.exports = express(), errorHandler;
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
app.set('trust proxy', true);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(require('cookie-parser')());
app.use(require('morgan')('dev'));
app.use((errorHandler = require('errorhandler')(), errorHandler));
app.use(require('./app/middleware/sendHttpError'));
app.use('/', require('./routes')(express));
app.use(express.static(__dirname + '/public'));

var port = process.env.OPENSHIFT_NODEJS_PORT || 4112;
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
server.listen(port, ipaddr, function() {
  console.log('Farmers risk score server listening on port ' + server.address().port + ' at ' + server.address().address);
});
