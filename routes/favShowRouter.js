const router = require('express').Router();
const auth = require('../utils/auth');
const FavShow = require('../models/favShowModel');

// Todas as rotas usam o auth para verificar
// Porque somente um user logado pode acessar os favoritos

router.post('/', auth, async (req, res) => {
	try {
		const {
			genres,
			id,
			image,
			language,
			name,
			premiered,
			rating,
			runtime,
			summary,
		} = req.body;

		// Validacao do body
		if (
			!genres ||
			!id ||
			!image ||
			!language ||
			!name ||
			!premiered ||
			!rating ||
			!runtime ||
			!summary
		)
			return res.status(400).json({
				msg: 'Please verify if all body elements are not undefined.',
			});

		// Definindo a estrutura
		const newFavShow = new FavShow({
			userId: req.user,
			show: {
				genres,
				id,
				image,
				language,
				name,
				premiered,
				rating,
				runtime,
				summary,
			},
		});

		// Salvando no banco
		const savedFavShow = await newFavShow.save();
		res.json(savedFavShow);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/all', auth, async (req, res) => {
	// Retorna todos os favoritos vinculadas a esse id
	const favShows = await FavShow.find({ userId: req.user });
	res.json(favShows);
});

router.delete('/', auth, async (req, res) => {
	// Tentei pegar req.body mas nao deu certo, query funcionou blz
	let { favId } = req.query;
	// Encontra a entrada pelo _id
	const favShow = await FavShow.findOne({
		userId: req.user,
		_id: favId,
	});

	if (!favShow)
		return res
			.status(400)
			.json({ msg: 'FavShow not found with this id for the current user.' });

	// Exclui a entrada pelo _id
	const deletedFavShow = await FavShow.findByIdAndDelete(favId);
	res.json(deletedFavShow);
});

module.exports = router;
