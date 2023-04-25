const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const routePolicySchema = new mongoose.Schema(
	{
		route: {
			type: mongoose.Schema.Types.String,
			required: true,
			unique: true,
		},

		policies: {
			type: [String],
			required: true,
			default: [],
		}
	}
	,{versionKey: false}
);

routePolicySchema.plugin(uniqueValidator, { message: '{PATH} già esistente!' });

const RoutePolicy = new mongoose.model('routePolicy',routePolicySchema,'routesPolicies');
module.exports = RoutePolicy;