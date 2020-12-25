const mongoose = require('mongoose');

// Formato que o <user> vai estar no db
const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 6 },
	username: { type: String, required: true, minlength: 3 },
});

// colecao onde sera armazenado, e formato do schema
// .model(<collection>, <formated_schema>)
module.exports = User = mongoose.model('user', userSchema);
