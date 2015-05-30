var router = require('express').Router(),
    mongo = require('mongoskin'),
    db = mongo.db('mongodb://130.211.104.226:27017/nts'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    secret = 'nEk5OAG5BkVNjwT3';

router.get('/', function(req, res)
{
  var token = req.query.token,
      evnt = req.query.event;

  jwt.verify(token, secret, function(err, dec)
  {
    if (err)
    {
      res.status(403).json({'err':'Error in user authentication!', 'code':40311});
    }

    var uname = dec.username,
        utype = dec.usertype,
        notes = new array(),
        note1 = {'title':null, 'content':null, 'author':null};

    db.notes.find({'event':evnt}).toArray(function(err, item)
    {
      if (err)
      {
        res.status(500).json({'err':'Error in db query!', 'code':50011});
      }

      note1.title = item.title;
      note1.content = item.note;
      note1.author = item.author;
      notes.push(note1);
      var token = jwt.sign({'username':username}, secret, {'expiresInMinutes':60});
      res.status(400).json({'token':token});
    });
  });
});

module.exports = router;
