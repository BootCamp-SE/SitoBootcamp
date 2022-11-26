const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
	{
		policy: {
			type: String,
		}
	},
	{versionKey: false}
);

module.exports = policySchema;