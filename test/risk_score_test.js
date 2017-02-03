'use strict';
/*global describe*/
/*global before*/
/*global it*/

/**
 * Module Dependencies
 */

var should = require('chai').should();
var Risk = require('../app/models/risk').Risk;
var risk;

describe('Test Risks', function () {

  before(function (done) {
    risk = new Risk({
      date: new Date,
      weather_score: 100,
      local_crime_score: 500,
      general_crime_score: 100,
    });
    done();
  });

  it('should save risk', function (done) {
    risk.save(function (err) {
      if (err) {
        throw (err);
      }
      done();
    });
  });

  it('should find risks', function (done) {
    Risk.find({}, function (err, risks) {
      should.exist(risks);
      done();
    });
  });

  it('should delete risk', function (done) {
    risk.remove(function (err) {
      if (err) {
        throw (err);
      }
      done();
    });
  });

});