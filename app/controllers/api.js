#!/usr/bin/env node

var Risk = require('../models/risk').Risk;
var Error = require('../models/error').Error;
var Utils = require('../lib/utils');
var url = require('url');
var steed = require("steed")();

/**
 * 1. Gather crime activity for a zip code (burglaries) and compare it to the city (or adjacent zip codes)
 * 2. Gather weather catastrophe for a zip code (floods, hurricanes etc) and compare it to the state
 * 3. Gather average price for property in a zip code and print the cost of insurance base on the risk #1 and #2
 *
 * Valid parameter values for query include:
 *  - specific crime
 *  - specific weather catastrophe
 *  - return PDF report
 *
 * @api public
 * @param {req} request
 * @param {res} response
 *                      
 */
exports.retrieveScore = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var zip_code = query.city;
  var zip_codes;
  var crime = query.crime ? query.crime : '.';
  if (crime) crime = crime.toLowerCase();
  var localCrimeCount = 0;
  var generalCrimeCount = 0;
  var weatherStats = {};
  var valuation;
  if (!zip_code) {
    // option: create Error
    return res.send(400, 'need zip code');
  };

  steed.series([
      function(cb) {
          Utils.nearbyZipCodes(zip_code, function(err, _codes) {
            if (err) {
              // option: create Error
              return cb(err);
            };
            zip_codes = _codes;
            cb();
          });
      },
      function(cb) {
        Utils.crimeStats(zip_codes[0], true, function(err, crimes) {
          if (err) {
            // option: create Error
            return cb(err);
          };
          crimes = crimes || [];
          if (crime) {
            crimes.forEach(function(c) {
              if (c.type.toLowerCase() === crime) localCrimeCount += 1;
            });
          } else {
            localCrimeCount += crimes.length;
          }
          cb();
        });
      },
      function(cb) {
        Utils.crimeStats(zip_codes[0], false, function(err, crimes) {
          if (err) {
            // option: create Error
            return cb(err);
          };
          crimes = crimes || [];
          if (crime) {
            crimes.forEach(function(c) {
              if (c.type.toLowerCase() === crime) generalCrimeCount += 1;
            });
          } else {
            generalCrimeCount += crimes.length;
          }
          cb();
        });
      },
      function(cb) {
        Utils.weatherStats(zip_codes[0], true, function(err, _weatherStats) {
          if (err) {
            // option: create Error
            return cb(err);
          };
          weatherStats = _weatherStats;
          cb();
        });
      },
      function(cb) {
        Utils.neighborhoodValuation(zip_codes[0], function(err, _valuation) {
          if (err) {
            // option: create Error
            return cb(err);
          };
          valuation = parseInt(_valuation);
          cb();
        });
      }
  ], function(err) {
    if (err) {
      res.send(400, err);
    }
    createScore();
  });

  function weatherRisk() {
    for (var key in weatherStats) {
      if (weatherStats[key] > 10) return true;
    }
    return false;
  }

  function crimeRisk() {
    if (localCrimeCount > 10 && generalCrimeCount > 20) {
      return 3;
    } else if (localCrimeCount > 10 || generalCrimeCount > 10) {
      return 2;
    } else {
      return 1;
    }
  }

  function createScore() {
    var overallScore;
    var weatherScore = weatherRisk();
    var crimeScore = crimeRisk();
    if (valuation > 50000) {
      if (crimeScore === 3) {
        if (weatherScore) {
          overallScore = 'high risk';
        } else {
          overallScore = 'moderate risk';
        }
      } else if (crimeScore === 2) {
        if (weatherScore) {
          overallScore = 'moderate risk';
        } else {
          overallScore = 'moderate risk';
        }
      } else {
        if (weatherScore) {
          overallScore = 'moderate risk';
        } else {
          overallScore = 'low risk';
        }
      }
    } else {
      if (crimeScore === 3) {
        if (weatherScore) {
          overallScore = 'high risk';
        } else {
          overallScore = 'high risk';
        }
      } else if (crimeScore === 2) {
        if (weatherScore) {
          overallScore = 'high risk';
        } else {
          overallScore = 'moderate risk';
        }
      } else {
        if (weatherScore) {
          overallScore = 'moderate risk';
        } else {
          overallScore = 'low risk';
        }
      }
    }

    res.json({
      valuation: valuation,
      localCrimeCount: localCrimeCount,
      generalCrimeCount: generalCrimeCount,
      weatherStats: weatherStats,
      overallScore: overallScore
    });
  }
}
