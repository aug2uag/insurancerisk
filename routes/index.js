#!/usr/bin/env node

var API = require('../app/controllers/api');
var path = require('path');

module.exports = function(express) {
  var router = express.Router();

  router.all('/api/*',function(req, res, next) {
    console.log(req.headers)
    if (true) {
      next();
    } else {
      res.send(403);
    }
  });

  /* GET */
  router.get('/', function(req, res) {
    var _path = path.resolve('public', 'index.html');
    return res.sendfile(_path);
  });
  router.get('/api/v1/score', API.retrieveScore);

  return router;
};
