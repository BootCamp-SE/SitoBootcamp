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
		discord: {
			id: {
				type: String,
				required: false,
				unique: true,
				default: Date.now(),
			},
			name: {
				type: String,
				required: false,
				default: 'disbob',
			},
		},
		steam: {
			id: {
				type: String,
				required: false,
				unique: true,
				default: Date.now() + 1,
			},
			name: {
				type: String,
				required: false,
				default: 'steamcord',
			},
		},
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
