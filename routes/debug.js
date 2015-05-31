var mongo = require('mongodb'),
Server = mongo.Server,
    Db = mongo.Db;

var db = new Db('nts', new Server('130.211.104.226', 27017));
db.open(function(err, db)
{
  if (err)
  {
    console.log(err);
  }
});

module.exports = db;
