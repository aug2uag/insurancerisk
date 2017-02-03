#!/usr/bin/env node

var mongoose = require('../lib/mongoose');

var schema = new mongoose.Schema({
  "message": String,
  "code": Number
}, {
  versionKey : false
});

exports.Error = mongoose.model('Error', schema);
