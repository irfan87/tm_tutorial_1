let mongoose = require('mongoose');

// create article's schema
let articleSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

let article = module.exports = mongoose.model('article', articleSchema);