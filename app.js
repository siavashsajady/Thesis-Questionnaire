var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");

// ROUTE

 var questions = [
      {ques : "what is your name?", answ : "siavash"},
      {ques : "where do yuo leave?", answ : "stockholm"}
      ]

app.get("/", function(req,res){
    res.render("home");
});

app.get("/about",function(req, res) {
    res.render("about");
});

app.get("/signup", function(req,res){
   res.render("signup"); 
});


app.get("/consentform", function(req,res){
   res.render("consentform"); 
});

app.get("/question", function(req,res){
 
   res.render("question", {anyname : questions}); 
});

app.post("/question", function(req,res){
   var ques = req.body.ques;
   var answ = req.body.answ; 
   var newAnswer = {ques: ques, answ : answ}
   
   questions.push(newAnswer);
   //redirect
   res.redirect("/question");
});

// app.get("/answer", function(req,res){
//   res.render("answer"); 
// });


app.listen(process.env.PORT, process.env.IP,function(){
    console.log("The Server is Starting!!!")
});