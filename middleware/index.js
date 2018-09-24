var middlewareobj={};

middlewareobj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash("error","Please Login First !!");
		res.redirect("/login");
	}
}

middlewareobj.owner=function(req,res,next){
	//does user logged in?
		if(req.isAuthenticated()){
			Campground.findById(req.params.id,function(err,foundCamp){
				if(err){
					req.flash("error","Campground not found");
					res.redirect("back");
				}
				else{
					//does user own the campgrounds
					if(foundCamp.author.id.equals(req.user._id))
					{
						next();
					}
					else{
						req.flash("error","You don't have the permission to do that.");
						res.redirect("back");
					}
				}
			});
		}
		else
		{
			req.flash("error","You need to be logged in to do that !");
			res.redirect("back");
		}
}

middlewareobj.commentOwner=function(req,res,next){
	//does user logged in?
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id,function(err,foundComment){
				if(err){
					res.redirect("back");
				}
				else{
					//does user own the campgrounds
					if(foundComment.author.id.equals(req.user._id))
					{
						next();
					}
					else{
						res.redirect("back");
					}
				}
			});
		}
		else
		{
			res.redirect("back");
		}
}

module.exports=middlewareobj