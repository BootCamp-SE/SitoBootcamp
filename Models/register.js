const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const idNameSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
	}
})

idNameSchema.plugin(uniqueValidator, {message: '{PATH} esiste già!'})

const registerSchema = new mongoose.Schema({
	user_id: {
		type: ObjcetId,
		required: true,
		unique: true
	},
	grado: {
		type: String,
		required: true
	},
    equipaggio: {
		type: String,
		required: true
	},
    equipaggio_secondario: {
		type: String,
		required: false
	},
    specializzazioni: {
        type: Array,
		required: true
    },
    discord:{
        type: idNameSchema,
        required: true
    },
    steam:{
        type: idNameSchema,
        required: true
    },
    note_private:{
        type: String,
        required: false,
        maxLength: 255 
    },
    note_pubbliche:{
        type: String,
        required: false,
        maxLength: 255 
    }

});

registerSchema.plugin(uniqueValidator,)

const Register = new mongoose.model('register', registerSchema);
module.exports = Register;
