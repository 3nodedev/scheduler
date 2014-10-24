var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path');

var db = require('mongoskin').db("localhost/testdb", { w: 0});
db.bind('event');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

app.get('/init', function(req, res) {
  db.event.insert({
    text:"Make Don a cake",
    start_date: new Date(2014, 9, 21),
    end_date:   new Date(2014, 9, 22),
    color: "#DD8616"
  });
  res.send("Test events were added to the database")
});

app.get('/data', function(req, res) {
  db.event.find().toArray(function(err, data){
    for (var i = 0; i < data.length; i++)
      data[i].id = data[i]._id;
    res.send(data);
  });
});

app.post('/data', function(req, res){
  var data = req.body;
  var mode = data["!nativeeditor_status"];
  var sid = data.id;
  var tid = sid;

  delete data.id;
  delete data.gr_id;
  delete data["!nativeeditor_status"];

  function update_response(err, result){
    if (err)
      mode = "error";
    else if (mode == "inserted")
      tid = data._id;

    res.setHeader("Content-Type", "text/xml");
    res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
  }

  if (mode == "updated")
    db.event.updateById(sid, data, update_response);
  else if (mode == "inserted")
    db.event.insert(data, update_response);
  else if (mode == "deleted")
    db.event.removeById(sid, update_response);
  else
    res.send("Not supported operation");

});

app.listen(3000);
