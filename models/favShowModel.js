const mongoose = require('mongoose');

const favShowSchema = new mongoose.Schema({
	userId: { type: String, require: true },
	show: {
		genres: { type: String, required: true },
		id: { type: Number, required: true },
		image: {
			medium: { type: String, required: true },
			original: { type: String, required: true },
		},
		language: { type: String, required: true },
		name: { type: String, required: true },
		premiered: { type: String, required: true },
		rating: { type: String, required: true },
		runtime: { type: String, required: true },
		summary: { type: String, required: true },
	},
});

module.exports = FavShow = mongoose.model('favShows', favShowSchema);
