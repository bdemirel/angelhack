var router = require('express').Router(),
    mongo = require('mongoskin'),
    db = mongo.db('mongodb://130.211.104.226:27017/nts'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    secret = 'nEk5OAG5BkVNjwT3';

router.get('/', function(req, res)
{
  var token = req.query.token,
      time = req.query.time;

  jwt.verify(token, secret, function(err, dec)
  {
    if (err)
    {
      res.status(403).json({'err':'Error in user authentication!', 'code':40311});
    }

    var uname = dec.username,
        utype = dec.usertype,
        today = new Date(),
        events = new Array(),
        event1 = {'title':null, 'presenter':null};

    if(time == -1)
    {
      db.collection('events').find({'date':{$lt:today}}).toArray(function(err, item)
      {
        if(err)
        {
          res.status(500).json({'err':'Error in db query!', 'code':50011});
        }

        event1.title = item.title;
        event1.presenter = item.presenter;
        events.push(event1);
        var token = jwt.sign({'username':username}, secret, {'expiresInMinutes':60});
        res.status(200).json({'events':events, 'token':token});
      });
    }
    else if(time == 0)
    {
      db.collection('events').find({'date':today}).toArray(function(err, item)
      {
        if(err)
        {
          res.status(500).json({'err':'Error in db query!', 'code':50012});
        }

        event1.title = item.title;
        event1.presenter = item.presenter;
        events.push(event1);
        res.status(200).json(events);
      });
    }
    else if(time == 1)
    {
      db.collection('events').find({'date':{$gt:today}}).toArray(function(err, item)
      {
        if(err)
        {
          res.status(500).json({'err':'Error in db query!', 'code':50013});
        }

        event1.title = item.title;
        event1.presenter = item.presenter;
        events.push(event1);
        res.status(200).json(events);
      });
    }
    else
    {
      res.status(400).json({'err':'Error in time definition!', 'code':40021});
    }
  });
});

module.exports = router;
