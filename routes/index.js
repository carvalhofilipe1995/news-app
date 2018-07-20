var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://127.0.0.1:27017/web-app';

const MongoClient = mongodb.MongoClient;

// Home Page
router.get('/', (req, res, next) => {
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err)
      throw err;
    var dbase = db.db("web-app");
    var collection = dbase.collection('news');
    collection.find({}).toArray(function (err, result) {
      if (err)
        throw err;
      else if (result.length >= 0) {
        res.render('index', {
          news: result
        });
      } else {
        res.render('index', {
          info: 'No news found!'
        });
      }
    });
    db.close();
  });
});

router.get('/createNews', (req, res, next) => {
  res.render('createNews', {
    errors: req.session.errors
  });
});

router.post('/create',
  (req, res, next) => {
    req.check('title', 'Invalid Title! Title should have at least 5 characters!')
      .notEmpty()
      .isLength({
        min: 5
      });
    req.check('description', 'Invalid Description! Description should have at least 10 characters!')
      .notEmpty()
      .isLength({
        min: 10
      });
    req.check('creationDate', 'Invalid Date!')
      .notEmpty();

    if (!req.files)
      return res.status(400).send('No Image were uploaded.');

    let fileName = req.files;

    console.log(fileName);

    var errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect('/createNews')
    } else {
      var news = {
        title: req.body.title,
        description: req.body.description,
        creationDate: req.body.creationDate,
        image: req.files.uploadedImage.data,
        content: req.files.uploadedImage.mimetype
      };
      MongoClient.connect(url, {
        useNewUrlParser: true
      }, function (err, db) {
        if (err)
          throw err;
        var dbase = db.db("web-app");
        var collection = dbase.collection('news');
        collection.insert([news], (err, result) => {
          if (err)
            throw err;
          console.log('Info: Sucessfully added!');
        });
      });
      res.redirect('/');
    }

  });

router.post('/delete/:id', (req, res, next) => {
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err)
      throw err;
    var myquery = {
      "_id": ObjectID(req.params.id)
    };
    console.log(myquery);
    var dbase = db.db("web-app");
    var collection = dbase.collection('news');
    collection.remove(myquery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
  res.redirect('/');
})

router.get('/update/:id', (req, res, next) => {
  res.render('updateNews', {
    id: req.params.id
  });
});


router.post('/update/:id', (req, res, next) => {
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err)
      throw err;
    var news = {
      $set: {}
    };
    if (req.body.title !== null && req.body.title.length > 5) {
      news.$set.title = req.body.title;
    }
    if (req.body.description !== null && req.body.description.length > 10) {
      news.$set.description = req.body.description;
    }
    if (Object.keys(news.$set).length !== 0) {
      var dbase = db.db("web-app");
      var collection = dbase.collection('news');
      collection.update({
        "_id": ObjectID(req.params.id)
      }, news, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
      });
    } else {
      db.close();
    }
  });
  res.redirect('/');
})

router.get
module.exports = router;