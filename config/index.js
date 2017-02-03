#!/usr/bin/env node

var nconf = require('nconf');

nconf.argv().env().file({
  file : __dirname + '/config.json'
});

module.exports = nconf;
