var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Answer          = require("./models/answer"),
    User            = require("./models/user"),
    bodyParser      = require("body-parser");

mongoose.connect('mongodb://localhost:27017/sami-pro-v8', { useNewUrlParser: true });
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");



//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req,res,next){
   res.locals.currentUser = req.user; 
   next();
});

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
    console.log(req.user);
    res.render("home", {currentUser : req.user});
});

// About - show about page
app.get("/about",isLoggedIn,function(req, res) {
    res.render("about");
});

// AUTH ROUTES
// ============//

//show register form
app.get("/register", function(req,res){
   res.render("register"); 
});

//handle signup logic
app.post("/register", function(req, res) {
   var newUser = new User({username : req.body.username});
   User.register(newUser,req.body.password, function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req,res,function(){
           res.redirect("/consentform");
       });
   });
});


// show login form
app.get("/login", function(req, res) {
    res.render("login");
});


// handeling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect : "/",
        failureRedirect : "/login",
        }),function(req,res){
});


//logout route
app.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/");
});




// show consentform

app.get("/consentform",isLoggedIn, function(req,res){
   res.render("consentform"); 
});

// Qestion - Display a list of qestions

app.get("/question",isLoggedIn, function(req,res){
     Project.find({}, function(err,allquestions){
        if(err){
            console.log(err);
        } else {
             res.render("question", {allquestions : allquestions});
        }
    });
});


// 
app.post("/question",isLoggedIn, function(req,res){
  var answ = req.body.answ; 
  var newAnswer = { answ : answ}
   
  //create a new qesform and save in DB
  Project.create(newAnswer, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else {
          res.redirect("/question");
      }
  });
});

//Show - Shows the answer about one person 


// app.get("/question/:id", function(req, res) {
//     // find the answer with provided ID
//     Project.findById(req.params.id, function(err,foundAnswer){
//       if(err){
//           console.log(err);
//       } else {
//           // Render show template with that questions
//             res.render("show", {question :foundAnswer});
//       }
//     });
// });



app.get("/answer", isLoggedIn,function(req,res){
  // get all ques and answ from DB
    Project.find({}, function(err,allanswers){
        if(err){
            console.log(err);
        } else {
             res.render("answer", {anyname : allanswers});
        }
    });
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("The Server is Starting!!!")
});