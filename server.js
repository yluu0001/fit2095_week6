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

//use ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');

//use static assets
app.use(express.static("views"));
app.use(express.static("img"));
app.use(express.static("css"));

//setup database
let db = null;
let col = null;
let url = "mongodb://localhost:27017";
mongoDBClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, client) {

    db = client.db("week6lab");
    col = db.collection("tasks");
});


//getter
app.get('/', function (req, res) {

    res.sendFile(__dirname + "/views/index.html");

});


app.get('/newTask', function(req,res){

    res.sendFile(__dirname + "/views/newTask.html");

});

app.get('/listTasks', function(req,res){

    col.find({}).toArray(function(err,data){
        res.render('allTask', {tasks: data});
    });
});

app.get('/deleteTask', function(req,res){

    //res.sendFile(__dirname + "/views/deleteTask.html");
    col.find({}).toArray(function(err,data){
        res.render('deleteTask', {tasks: data});
    });

});

app.get('/deleteComplete', function(req,res){

    col.find({'task_status':'Complete'}).toArray(function(err,data){
        res.render('deleteComplete', {tasks: data});
    });
});

app.get('/updateTask', function(req,res){

    //res.sendFile(__dirname + "/views/updateTask.html");
    col.find({}).toArray(function(err,data){
        res.render('updateTask', {tasks: data});
    });

});

app.get('/nonSamLee', function(req,res){

    col.find({$or:[{assign_to:'Sam'}, {assign_to:'Lee'}]}).toArray(function(err,data){
        res.render('deleteSamLee', {tasks: data});
    });
})

app.post('/newTask', function(req,res){
    
    let newtask = {
        task_id:Math.round(Math.random()*1000),
        task_name:req.body.taskName,
        assign_to:req.body.assignTo,
        due_date:new Date(req.body.dueDate),
        task_status:req.body.taskStatus,
        task_desc:req.body.taskDesc
    };
    col.insertOne(newtask);
    res.redirect('/listTasks');
})

app.post('/deletetaskid', function (req, res) {

    let delete_id = {task_id: parseInt(req.body.tid) };
    col.deleteOne(delete_id);
    res.redirect('/listTasks');
});

app.post('/deleteComplete', function (req, res) {

    col.deleteMany({'task_status':'Complete'});
    res.redirect('/listTasks');
});

app.post('/updateTask', function (req, res) {

    // let update_id = {task_id: parseInt(req.body.tid) };
    let update_id = parseInt(req.body.tid);
    
    col.updateOne({task_id: update_id}, 
        {$set: {task_status: req.body.newStatus}});
    res.redirect('/listTasks');
});

app.post('/nonSamLee', function(req,res){

    let query = {$or:[{assign_to:'Sam'}, {assign_to:'Lee'}]};
    let update = {$set: {assign_to:'Anna', task_status:'In progress'}};
    col.updateMany(query,update,{ upsert: true },function(err,obj){

    })
    res.redirect('/listTasks');
})

app.listen(8080);