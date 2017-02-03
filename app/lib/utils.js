#!/usr/bin/env node

var request = require('request');

/**
 * Gather nearby zip codes
 *
 * @api private
 * @param {val} zip code to query
 * @param {cb} callback
 *                      
 */
exports.nearbyZipCodes = function(val, cb) {
	var reqURL = 'http://api.geonames.org/findNearbyPostalCodesJSON?postalcode=' + val + '&maxRows=10&username=aug2uag&country=US';
	request(reqURL, function(err, res, body) {
	    if (err) return cb(err);
	    if (!body) return cb(new Error("no response nearby zip codes"));
	    var _body = JSON.parse(body);
	    var codes = _body.postalCodes;
	    var agg = codes.map(function(c) {
	    	return {
	    		code: c.postalCode,
	    		lng: c.lng,
	    		lat: c.lat,
	    		stateCode: c.adminCode1,
	    		cityName: c.placeName
	    	}
	    });
	    cb(null, agg)
  });
}

/**
 * Gather crime data
 *
 * @api private
 * @param {loc} location object
 * @param {localized} boolean for localized or general area
 * @param {cb} callback
 *                      
 */
exports.crimeStats = function(loc, localized, cb) {
	var radius = localized ? 0.01 : 0.05;
	var rOpt = {
		url: "http://api.spotcrime.com/crimes.json",
		json: true,
		qs: {
			lat: loc.lat,
			lon: loc.lng,
			key: '.',
			radius: radius
		}
	};

	request(rOpt, function(err, res, body) {
		if (err) return cb(err);
		if (!body) return cb(new Error("no response for crimes data"));
		cb(null, body.crimes);
	});

};

/**
 * Hacked weather catastrophe data, national site was not functioning
 *
 * @api private
 * @param {loc} location object
 * @param {localized} boolean for localized or general area
 * @param {cb} callback
 *                      
 */
exports.weatherStats = function(loc, localized, cb) {
	var _d = new Date();
	dYear = _d.getYear() + 1900;
	dMonth = _d.getMonth();
	var agg = [];
	for (var i = 0; i < 10; i++) {
		var __d = 'history_' + (dYear - i) + dMonth + '01';
		agg.push(__d);
	};
	var results = [];
	var snow = 0, fog = 0, rain = 0, hail = 0, tornado = 0, thunder = 0;
	function series(d) {
		if (d) {
			getWeatherByYear(loc, d, localized, function(err, observations) {
				if (err) {
					return cb(err);
				};
				observations.forEach(function(o) {
			    	snow += parseInt(o.snow);
			    	fog += parseInt(o.fog);
			    	rain += parseInt(o.rain); 
			    	hail += parseInt(o.hail); 
			    	tornado += parseInt(o.tornado); 
			    	thunder += parseInt(o.thunder);
			    });
				series(agg.shift());
			});
		} else {
			cb(null, {
				snow: snow,
				fog: fog,
				rain: rain,
				hail: hail,
				tornado: tornado,
				thunder: thunder
			});
		}
	}
	series(agg.shift());
};


/**
 * Gather weather catastrophe data for aggregating score
 *
 * @api private
 * @param {loc} location object
 * @param {time} historical query
 * @param {localized} boolean for localized or general area
 * @param {cb} callback
 *                      
 */
function getWeatherByYear(loc, time, localized, cb) {
	var reqURL = 'http://api.wunderground.com/api/7965613c4a99c7b3/'+ time + '/q/' + loc.stateCode;
	if (localized) {
		reqURL += '/' + loc.cityName + '.json';
	} else {
		reqURL += '.json';
	}
	request(reqURL, function(err, res, body) {
	    if (err) return cb(err);
	    if (!body) return cb(new Error("no response nearby weather data"));
	    var _body = JSON.parse(body);
	    var history = _body.history || {};
	    var observations = history.observations || [];
	    cb(null, observations);
  });
}

/**
 * Gather property values
 *
 * @api private
 * @param {loc} location object
 * @param {cb} callback
 *                      
 */
exports.neighborhoodValuation = function(loc, cb) {
	var reqURL = 'http://www.zillow.com/webservice/GetRegionChildren.htm?zws-id=X1-ZWz1fiww8j5jij_8w9nb&state=' + loc.stateCode + '&city=' + loc.cityName + '&childtype=neighborhood';
	request(reqURL, function(err, res, body) {
	    if (err) return cb(err);
	    if (!body) return cb(new Error("no response nearby zip codes"));
	    var index0 = body.indexOf('<zindex currency="USD">');
	    var index1 = body.indexOf('</zindex>');
	    var valuation = body.substr(index0, (index1 - index0));
	    valuation = valuation.split('<zindex currency="USD">')[1];
	    cb(null, valuation);
  });
}