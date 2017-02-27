'use strict';

var app = require('./app');
var db = require('./db/database');

var port = process.env.PORT || 9000;

db.sync().then(function() {
  app.listen(port);
});

console.log('App listening on port ' + port);
