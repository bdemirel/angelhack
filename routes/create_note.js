var router = require('express').Router(),
    mongo = require('mongoskin'),
    db = mongo.db('mongodb://130.211.104.226:27017/nts'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    secret = 'nEk5OAG5BkVNjwT3';

router.use(bodyParser.json());
router.post('/', function(req, res)
{
  var token = req.body.token,
      note = req.body.content,
      auth = req.body.author,
      titl = req.body.title,
      topc = req.body.topic,
      evnt = req.body.event;

  jwt.verify(token, secret, function(err, dec)
  {
    if (err)
    {
      res.status(403).json({'err':'Error in user authentication!', 'code':40311});
    }

    var uname = dec.username,
        utype = dec.usertype;

    db.notes.insert({'event':evnt, 'title':titl, 'note':note, 'author':auth, 'topic':topc}, {'w':1}, function(err, doc)
    {
      if(err)
      {
        res.status(500).json({'err':'Error in db query!', 'code':50011});
      }

      var token = jwt.sign({'username':username}, secret, {'expiresInMinutes':60});
      res.status(200).json({'token':token});
    });
  });
});

module.exports = router;
