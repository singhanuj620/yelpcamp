var mongoose = require("mongoose");

var campgroundSchema= new mongoose.Schema({
	name: String,
	image: String,
	des: String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"user"
		},
		username:String
	},
	comments: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}]
});


module.exports = mongoose.model("Campground", campgroundSchema);