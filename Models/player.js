const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const playerSchema = new mongoose.Schema(
	{
		grado: {
			type: String,
			required: true,
			default: 'Recluta',
		},
		equipaggio: {
			type: String,
			required: true,
			default: 'Carrier',
		},
		equipaggio_secondario: {
			type: String,
			required: false,
			default: '',
		},
		specializzazione: {
			type: String,
			required: true,
			default: 'Componentistica Navale',
		},
		// Discord
		discord_id: {
			type: String,
			required: false,
			unique: false,	// TODO: Change this with UI overhaul
			default: '',
		},
		discord_name: {
			type: String,
			required: false,
			default: '',
		},
		//Steam
		steam_id: {
			type: String,
			required: false,
			unique: false,	// TODO: Change this with UI overhaul
			default: '',
		},
		steam_name: {
			type: String,
			required: false,
			default: '',
		},
		// Notes
		note_private: {
			type: String,
			required: false,
			maxLength: 255,
			default: '',
		},
		note_pubbliche: {
			type: String,
			required: false,
			maxLength: 255,
			default: '',
		},
	},
	{ versionKey: false }
);

playerSchema.plugin(uniqueValidator, { message: '{PATH} già esistente!' });

const Player = new mongoose.model('player', playerSchema);
module.exports = Player;
