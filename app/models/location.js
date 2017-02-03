#!/usr/bin/env node

var mongoose = require('../lib/mongoose');

var schema = new mongoose.Schema({
  "name": {
    "type": String
  },
  "zip_code_value": {
    "type": Number
  },
  "lat": {
    "type": Number
  },
  "lng": {
    "type": Number
  },
  "adjacent_zip_codes": {
    "type": Array
  },
  "mean_property_price": {
    "type": Number
  },
  "currency": {
    "type": String,
    "default": "USD"
  }
}, {
  "versionKey" : false
});

exports.Location = mongoose.model('Location', schema);
