var express = require('express'),
    bodyParser = require('body-parser');
var path = require('path');

var db = require('mongoskin').db("localhost/testdb", { w: 0});
    db.bind('event');

var app = express();
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.urlencoded({
      extend: true
    }));
    app.use(bodyParser.json());

    app.listen(3000);
