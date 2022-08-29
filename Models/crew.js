const mongoose = require('mongoose');

const crewSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
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
				}
			]
		}
	],
});

const Crew = new mongoose.model('crew', crewSchema);
module.exports = Crew;