var route = require('express').Router(),
    mongo = require('mongoskin'),
    db = mongo.db('mongodb://130.211.104.226:27017/nts'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    secret = 'nEk5OAG5BkVNjwT3';

route.use(bodyParser.json());
route.post('/', function(req, res)
{
  var token = req.body.token,
      uname = req.body.username,
      titl = req.body.title,
      locn = req.body.location,
      date = req.body.date,
      time = req.body.time,
      desc = req.body.description;
      auth = req.body.author,
      pres = req.body.presenter;

  jwt.verify(token, secret, function(err, dec)
  {
    if (err)
    {
      res.status(403).json({'err':'Error in user authentication!', 'code':40311});
    }

    var uname = dec.username,
        utype = dec.usertype;

    if (utype == 1)
    {
      db.events.insert({'title':titl, 'location':locn, 'date':date, 'time':time, 'description':desc, 'author':auth, 'presenter':pres}, {'w':1}, function(err, doc)
      {
        if (err)
        {
          res.status(500).json({'err':'Error in db insertion!', 'code':50011});
        }

        var token = jwt.sign({'username':uname, 'usertype':utype}, secret, {'expiresInMinutes':60});
        res.status(201).json({'token':token});
      });
    }
    else
    {
      res.status(403).json({'err':'Error in user authorization!', 'code':40321});
    }
  });
});

module.exports = route;
