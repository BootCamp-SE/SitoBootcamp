const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			required: true,
		},
		tags: {
			type: Array,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		author_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		date: {
			type: mongoose.Schema.Types.Date,
			required: true,
			default: () => {
				return new Date();
			},
		},
	},
	{ versionKey: false }
);

const Article = new mongoose.model('article', articleSchema);
module.exports = Article;
