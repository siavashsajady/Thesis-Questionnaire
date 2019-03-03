var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect('mongodb://localhost:27017/sami-pro-v5', { useNewUrlParser: true });
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");


//SCHEMA SETUP

var projectSchema = new mongoose.Schema({
    ques : String,
    answ : String
});

var Project = mongoose.model("Project", projectSchema);

// Project.create({
//      ques :" What would be the requirements for the use of internal and external TI?",
//     answ : "lab lab lab laaab labb laaababa and so it "
// }, function(err,myque){
//     if(err){
//         console.log("Error!!!");
//         console.log(err);
//     } else {
//         console.log("This is Resul of Question: ");
//         console.log(myque);
//     }
// });



// ROUTE

// INDEX - show home page
app.get("/", function(req,res){
    res.render("home");
});

// About - show about page
app.get("/about",function(req, res) {
    res.render("about");
});

// 
app.get("/signup", function(req,res){
   res.render("signup"); 
});


app.get("/consentform", function(req,res){
   res.render("consentform"); 
});

app.get("/question", function(req,res){
    
             res.render("question");
});

app.post("/question", function(req,res){
   var ques = req.body.ques;
   var answ = req.body.answ; 
   var newAnswer = {ques: ques, answ : answ}
   
   //create a new qesform and save in DB
   Project.create(newAnswer, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           res.redirect("/question");
       }
   });
});




app.get("/answer", function(req,res){
   // get all ques and answ from DB
    Project.find({}, function(err,allanswers){
        if(err){
            console.log(err);
        } else {
             res.render("answer", {anyname : allanswers});
        }
    });
});


app.listen(process.env.PORT, process.env.IP,function(){
    console.log("The Server is Starting!!!")
});