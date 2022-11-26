const mongoose = require('mongoose');
const {policySchema} = require('./policy');
const uniqueValidator = require('mongoose-unique-validator');

const routePolicySchema = new mongoose.Schema(
	{
		route: {
			type: mongoose.Schema.Types.String,
			required: true,
			unique: true,
		},

		policies: {
			type: [policySchema],
			required: true,
			default: [],
		}
	}
	,{versionKey: false}
);

routePolicySchema.plugin(uniqueValidator, { message: '{PATH} già esistente!' });

const RoutePolicy = new mongoose.model('routePolicy',routePolicySchema,'routesPolicies');
module.exports = RoutePolicy;