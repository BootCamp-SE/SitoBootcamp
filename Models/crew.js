const mongoose = require('mongoose');

const crewSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	}
});

const Crew = new mongoose.model('crew', crewSchema);
module.exports = Crew;