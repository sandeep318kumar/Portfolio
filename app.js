var express             = require("express"),
    app                 = express(),
    User                = require("./models/user"),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override"),
    passport            = require("passport"),
    flash               = require("connect-flash"),
    LocalStrategy       = require("passport-local");
    
    
mongoose.connect("mongodb://localhost/yelpCamp");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(methodOverride("_method"));

//passport configuration
app.use(require("express-session")({
    secret: "Hare Krishna",
    resave: false,
    saveUninitialized: true
}));

// for AUTH
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    next();
});

app.get("/", function(req, res){
    res.render("index");
});

app.get("/index", function(req, res){
    res.render("index");
});

app.get("/contactus", function(req, res){
    res.render("contactus");
});

app.get("/aboutus", function(req, res){
    res.render("aboutus");
});

app.get("/projects", function(req, res){
    res.render("projects");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
   var newUser =new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
        //   console.log(err);
           req.flash("error", err.message);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Website "+ user.username);
           res.redirect("/");
       });
   });
});

app.get("/login", function(req, res){
    res.render("login");
});

// app.get('/app/:id', checkUserAuth, findApp, renderView, sendJSON);

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(err, req, res){
        if(err){
            console.log(err);
        } else{
            console.log(req);
        }
});



// function checkUserAuth(req, res, next) {
//   if (req.session.user){
//      return next();   
//   }
//   console.log(next);
//   return next(new NotAuthorizedError());
// }

app.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "logged you out!");
   res.redirect("/");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Portfolio started!");
});