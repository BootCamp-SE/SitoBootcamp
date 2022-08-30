const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const crewSchema = new mongoose.Schema(
	{
		ship_id: {
			type: mongoose.Schema.Types.ObjectId,
			require: false,
			unique: true,
		},
		members: [
			{
				id: {
					type: mongoose.Schema.Types.ObjectId,
					require: false,
					unique: true,
				},
				roles: [
					{
						type: String,
						require: false,
					},
				],
			},
		],
	},
	{ versionKey: false }
);

crewSchema.plugin(uniqueValidator, '{PATH} già esistente!');

const Crew = new mongoose.model('crew', crewSchema);
module.exports = Crew;
