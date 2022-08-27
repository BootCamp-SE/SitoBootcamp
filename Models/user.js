const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},

	password: {
		type: String,
		required: true,
	},

	roles: {
		type: Array,
		required: false,
	},
});

userSchema.pre('save', async (next) => {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.statics.login = async function (username, password) {
	const user = await this.findOne({ username });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error('Incorrect password!');
	}
	throw Error('Incorrect username!');
};

const User = new mongoose.model('user', userSchema);
module.exports = User;
