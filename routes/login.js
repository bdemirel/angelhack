var route = require('express').Router(),
    mongo = require('mongoskin'),
    db = mongo.db('mongodb://130.211.104.226:27017/nts'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    secret = 'nEk5OAG5BkVNjwT3';

route.use(bodyParser.json());
route.post('/', function(req, res)
{
  var username = req.body.username,
      password = req.body.password;

  db.users.find({'uname':username}).toArray(function(err, user)
  {
    if (err)
    {
      res.status(500).json({'err':'Error in db query!', 'code':50011})
    }

    var pword = user.pword,
        utype = user.utype,
        uid = user._id;
        salt = uid.slice(0,3)+username.slice(3,5)+uid.slice(5,10);

    crypto.pbkdf2(password, salt, 256, 128, 'sha256', function(err, hash)
    {
      if (err)
      {
        res.status(500).json({'err':'Error in crypto!', 'code':50021});
      }

      if(pword = hash)
      {
        var token = jwt.sign({'username':username, 'usertype':utype}, secret, {'expiresInMinutes':60});
        res.status(200).json({'token':token});
      }
      else
      {
        res.status(403).json({'err':'Wrong username or password!', 'code':40311});
      }
    });

  });

});

module.exports = route;
