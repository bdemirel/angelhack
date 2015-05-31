var mongo = require('mongodb'),
Server = mongo.Server,
route = require('express').Router(),
    Db = mongo.Db;

route.get('/', function(req, res)
{
  var db = new Db('nts', new Server('130.211.104.226', 27017), {'w':1});
  db.open(function(err, db)
  {
    if (err)
    {
      console.log(err);
    }
    db.listCollections().toArray(function(err, item)
    {
      console.log('coll:'+item);
    });

    var coll = db.collection('events');
    coll.find().toArray(function(err, item)
    {
      console.log(item);
    });
  });
});

module.exports = route;
