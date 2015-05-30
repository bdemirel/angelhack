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
        utype = dec.usertype;

    db.events.findById(evnt).toArray(function(err, item)
    {
      if (err)
      {
        res.status(500).json({'err':'Error in db query!', 'code':50011});
      }

      var token = jwt.sign({'username':username}, secret, {'expiresInMinutes':60}),
          etime = item.time,
          edate = item.date,
          eauth = item.author,
          edesc = item.desciption,
          etitl = item.title;

      res.status(200).json({'event':{'title':etitl, 'description':edesc, 'author':eauth, 'date':edate, 'time':etime}, 'token':token})
    });
  });
});

module.exports = router;
