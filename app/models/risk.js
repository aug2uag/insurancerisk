#!/usr/bin/env node

var mongoose = require('../lib/mongoose');

var schema = new mongoose.Schema({
  "locationId": {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      index: true
  },
  "date": {
      "type": Date
  },
  "weather_score": {
      "type": Number
  },
  "local_crime_score": {
      "type": Number
  },
  "general_crime_score": {
      "type": Number
  }
}, {
  "versionKey" : false
});


schema.statics.returnRisks = function (limit, cb) {
  var _limit = limit || 100;
  mongoose.model('Risk').find({}).limit(_limit).exec(cb);
}

schema.statics.removeRisk = function(locationId, cb) {
  mongoose.model('Risk').remove({locationId: locationId}).exec(cb);
}

exports.Risk = mongoose.model('Risk', schema);
