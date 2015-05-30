var route = require('express').Router(),
    mongo = require('mongoskin'),
    db = mongo.db('mongodb://130.211.104.226:27017/nts'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    secret = 'nEk5OAG5BkVNjwT3';

route.use(bodyParser.json());
route.post('/', function(req, res)
{
  var fname = req.body.firstname,
      lname = req.body.lastname,
      uname = req.body.username,
      pword = req.body.password,
      utype = req.body.email ? 1 : 0,
      email = (utype == 1) ? req.body.email : undefined;
      phone = (utype == 1) ? req.body.phone : undefined;
      cntry = (utype == 1) ? req.body.cntry : undefined;

  db.users.find({'uname':uname}).toArray(function(err, user)
  {
    if (err)
    {
      res.status(500).json({'err':'Error in db query!', 'code':50011}});
    }

    if (user.fname)
    {
      res.status(400).json({'err':'Username exists!'}, 'code':40011});
    }

    db.users.insert({'fname':fname, 'lname':lname, 'uname':uname, 'utype':utype, 'email':email, 'phone':phone, 'cntry':cntry}, {'w':1}, function(err, doc)
    {
      if (err)
      {
        res.status(500).json({'err':'Error in db insertion!', 'code':50012});
      }

      var uid = doc._id,
          salt = uid.slice(0,3)+username.slice(3,5)+uid.slice(5,10);

      crypto.pbkdf2(pword, salt, 256, 128, 'sha256', function(err, hash)
      {
        if (err)
        {
          res.status(500).json({'err':'Error in crypto!', 'code':50021}});
        }
        db.users.update({'uname':uname}, {$set:{'pword':hash}}, {'w':1}, function(err, resu)
        {
          if (err)
          {
            db.users.remove({'uname':uname}, {'w':1}, function(err, no)
            {
              if (err)
              {
                res.status(500).json({'err':'Error in db, couldn not delete!', 'code':50013}});
              }

              res.status(500).json({'err':'Error in db insertion!', 'code':50014}});
            });
          }

          var token = jwt.sign({'username':uname, 'usertype':utype}, secret, {'expiresInMinutes':60});
          res.status(201).json({'token':token});
        });
      });
    });
  });
});

module.exports = route;
