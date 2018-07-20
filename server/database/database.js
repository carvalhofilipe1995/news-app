var MongoClient = require('mongodb');
var url = 'mongodb://127.0.0.1:27017/web-app';

var news = require('./news.json')

MongoClient.connect(url, {
    useNewUrlParser: true
}, function (err, db) {
    if (err)
        throw err;
    console.log('Info: Database created:' + db);
    var dbase = db.db("web-app");
    dbase.createCollection('news', (error, result) => {
        if (error)
            throw error;
        console.log("Info: Collection News created!");
        db.close();
    })
    var collection = dbase.collection('news');
    collection.insert(news, (error, result) => {
        if (error)
            throw error;
        console.log("Info: Some News were added to the database!");
    });
});