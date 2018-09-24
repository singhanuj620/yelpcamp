var mongoose = require('mongoose');

// CREATE COMMENT SCHEMA
var commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type:mongoose.Schema.Types.ObjectId,
			ref:"user"
		},
		username: String
	}
});

//set up model
module.exports = mongoose.model("Comment", commentSchema);