// 1- get a reference to MOngodb module  ref
let mongodb = require('mongodb');
// 2- from ref get the cleint
let mongoDBClient = mongodb.MongoClient;
let bodyParter = require('body-parser');
// 3- from the client get the db

let express = require('express');
let app = express();

app.use(bodyParter.urlencoded({
    extended: false
}));

let db = null;
let col = null;
let url = "mongodb://localhost:27017";
mongoDBClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, client) {

    db = client.db("week5lec2");
    col = db.collection("users");

});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
    // col.insertOne({fullName:'John',salary:4500});
    // res.send('thank you!!');
});

app.post('/newdocument', function (req, res) {

    let newDoc = {
        name: req.body.fullName,
        age: parseInt(req.body.age)
    };

    col.insertOne(newDoc);
    res.send("Thank you!!!");
});

/* 
select * from users;
select * from users where name='Tim'; 
select * from users where age>20; 
select * from users where age>20 and name='Alex'; 
*/



app.get('/getAll', function (req, res) {
    let query = {};
    let sort = {
        age: -1
    };
    col.find(query).sort(sort).limit(5).toArray(function (err, data) {
        res.send(data);
    })

});

app.get('/deleteName/:name2Delete', function (req, res) {
    let nameDel = req.params.name2Delete;
    let query = {
        name: nameDel
    };
    col.deleteOne(query, function (err, obj) {
        console.log(obj);

        col.find({}).toArray(function (err, data) {
            res.send(data);
        })
    })

})

//  1<=age <57  $and $or
// {$and:[{age:{$gte:1}},{age:{$lt:57}]}

app.get('/getAllN', function (req, res) {
    let query = {
        age: {
            $ne: 34
        }
    };
    col.find(query).toArray(function (err, data) {
        res.send(data);
    })

});

app.get('/addAge/:newAge',function(req,res){
    let theNewAge=parseInt(req.params.newAge);
    let query={};
    let theUpdate={$mul:{age:2}};
    col.updateMany(query,theUpdate,{ upsert: true },function(err,obj){
        col.find({}).toArray(function (err, data) {
            res.send(data);
        })
    
    })

})

app.listen(8080);