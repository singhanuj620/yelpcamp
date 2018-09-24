//adding express package
var express = require("express");
var app=express();

//adding body-parser package
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
//making .ejs extension to work without it
app.set("view engine","ejs"); 
app.use( express.static( "public" ) );

//adding mongoose
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");

//connecting models export file
Campground = require("./models/campground");
Comment = require("./models/comment");

//adding flash messages
var flash=require("connect-flash");

//adding middleware
var middleware=require("./middleware");

//adding seedDb file
var seedDB= require("./seeds");
// seedDB();

//user for authentication
var User = require("./models/user");


//configuring passport
var passport = require("passport");
var LocalStrategy = require("passport-local");

app.use(require("express-session")({
	secret: "my yelp camp is the best",
	resave: false,
	saveUninitialized: false
}));

//using flash
app.use(flash());

//for updating and deleteing campgrounds
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});



//making Schema
//in campground.js file
//in commment.js file





//entry in DB
/*Campground.create({
	name:"Kerla",  
	image:"http://121clicks.com/wp-content/uploads/2011/12/beautiful_india_06.jpg" 
},function(err,campground){
	if(err){
		console.log("ERROR OCCURED");
		console.log(err);
	}
	else
	{
		console.log("Campground Added");
		console.log(campground);
	}
});*/






//===================================================================
//ROUTES
//===================================================================
//route of landing page
app.get("/",function(req,res){
	res.render("landing");
});



//route for campground list page
app.get("/campgrounds",function(req,res){
	Campground.find({},function(err,allCamps){
		if(err){
			console.log(err);
		}
		else
		{
			res.render("campgrounds/index",{campgrounds:allCamps, currentUser: req.user});		
		}
	});
	
});

//route for post campground
app.post("/campgrounds",function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var des=req.body.des;
	//adding user
	//can be done in
	// newCampground.author.id=req.user._id
	//doing in alternative way
	var author={
		id:req.user._id,
		username:req.user.username
	};
	var newCampground= {name: name , image: image , des: des,author:author};
	//adding to DB
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			req.flash("error","Something went wrong.");
			console.log(err);
		}
		else{
			req.flash("success","Campground added");
			res.redirect("/campgrounds");
		}
	});
	//campgrounds.push(newCampground);
	//redirect to campgrounds page
	
});

//new post route
app.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

//SHOW campground route
app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
});

//=================================
//Updating Routes
//=================================

//edit
app.get("/campgrounds/:id/edit",middleware.owner,function(req,res){
	// Campground.findById(req.params.id,function(err,foundCamp){
	// 	if(err){
	// 		res.redirect("/campgrounds");
	// 	}
	// 	else{
	// 		res.render("campgrounds/edit",{campgrounds:foundCamp});	
	// 	}
	// });
		
		//does user logged in?
		// if(req.isAuthenticated()){
		// 	Campground.findById(req.params.id,function(err,foundCamp){
		// 		if(err){
		// 			res.redirect("/campgrounds");
		// 		}
		// 		else{
		// 			//does user own the campgrounds
		// 			if(foundCamp.author.id.equals(req.user._id))
		// 			{
		// 				res.render("campgrounds/edit",{campgrounds:foundCamp});
		// 			}
		// 			else{
		// 				res.send("YOU DON'THAVE PERMISSIOPN TO DO THAT");
		// 			}
		// 		}
		// 	});
		// }
		// else
		// {
		// 	res.send("YOU NEED TO BE LOGGEDIN TO CONTINUE !!!");
		// }

	Campground.findById(req.params.id,function(err,foundCamp){
		res.render("campgrounds/edit",{campgrounds:foundCamp});
	});
});


//update
app.put("/campgrounds/:id",middleware.owner,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updateCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

//destroy

app.delete("/campgrounds/:id",function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else
		{
			res.redirect("/campgrounds");
		}
	});
})

//comments routes

//COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res) {
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			res.redirect("/campground");
		}
		else{
			res.render("comments/new",{campgrounds:campground});
		}
	});
});


app.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong, check console.log()");
					console.log(err);
				}
				else{
					//add username and id to the comment
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					//save the comment
					comment.save();


					campground.comments.push(comment);
					campground.save();
					req.flash("success","comment created.");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//edit comment
app.get("/campgrounds/:id/comments/:comment_id/edit",middleware.commentOwner,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}
		else
		{
			res.render("comments/edit",{campground_id:req.params.id , comment:foundComment});
		}
	});
});

//update comment
app.put("/campgrounds/:id/comments/:comment_id",middleware.commentOwner,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success","comment updated");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

//delete comment
app.delete("/campgrounds/:id/comments/:comment_id",middleware.commentOwner,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err)
		{
			res.redirect("back");
		}
		else
		{
			req.flash("success","comment deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});


//========================
//Authentication Routes
//========================


app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			res.render("register");
		}
		else{
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome "+user.username);
			res.redirect("/campgrounds");
		});
		}
	});
});



app.get("/login",function(req,res){
	//coz message will pass onto login only
	//adding in current user section so that it will pass on the every template
	// res.render("login",{message:req.flash("error")});
	res.render("login");
});

app.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){

});


app.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You are now logged out !!! Come back !");
	res.redirect("/campgrounds");
});

//middleware

//now shifted to middleware/index.js

//isLoggedIn()
//owner()
//commentOwner()


//=======================================================================
//starting server
app.listen(3000,function()
	{
		console.log("Yelp camp server is been started");
	});