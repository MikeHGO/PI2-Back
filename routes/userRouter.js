const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../utils/auth');

// Registrar
router.post('/register', async (req, res) => {
	try {
		let { email, password, confirmPassword, username } = req.body;

		// Validacao: 400 Bad Request
		if (!email || !password || !confirmPassword || !username)
			return res.status(400).json({ msg: 'Empty fields.' });
		if (password.length < 6)
			return res
				.status(400)
				.json({ msg: 'Password needs to have 6 or more characters.' });
		if (username.length < 3)
			return res
				.status(400)
				.json({ msg: 'Username needs to have 3 or more characters.' });
		if (password !== confirmPassword)
			return res.status(400).json({ msg: "Passwords don't match." });

		// Procurando no mongoDB um User com o mesmo email
		const existingUser = await User.findOne({ email: email });
		if (existingUser)
			return res.status(400).json({ msg: 'Email already used.' });

		// Validacao de email com regex
		const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(regEx))
			return res.status(400).json({ msg: 'Invalid email.' });

		// bcrypt hashing o password
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		// Criando um User
		const newUser = new User({
			email,
			password: passwordHash,
			username,
		});

		// Salvando o User no db
		const savedUser = await newUser.save();
		res.json(savedUser);
	} catch (err) {
		// 500 Internal Server Error
		res.status(500).json({ error: err.message });
	}
});

// Logar
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validacao
		if (!email || !password)
			return res.status(400).json({ msg: 'Empty fields.' });

		const user = await User.findOne({ email: email });
		if (!user) return res.status(400).json({ msg: 'Email not registered.' });

		// Conferindo se o password bate com o hash
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ msg: 'Invalid password.' });

		// Criando um jwt baseado no id do user e senha salva no ambiente
		const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
		res.json({
			token,
			user: {
				id: user._id,
				username: user.username,
			},
		});
	} catch (error) {
		res.status(500).json({ error: err.message });
	}
});

// Apagar a conta
// auth checa se o user esta logado e retorna o userId no req.user
router.delete('/delete', auth, async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.user);
		res.json(deletedUser);
	} catch (error) {
		res.status(500).json({ error: err.message });
	}
});

// Checando o JWT, retorna true ou false
router.post('/tokenIsValid', async (req, res) => {
	try {
		// Conferindo se o token existe
		const token = req.header('my-auth-token');
		if (!token) return res.json(false);

		// Conferindo se o token eh valido
		const verified = jwt.verify(token, process.env.JWT_KEY);
		if (!verified) return res.json(false);

		// Conferindo se o user existe
		const user = await User.findById(verified.id);
		if (!user) return res.json(false);

		return res.json(true);
	} catch (error) {
		res.status(500).json({ error: err.message });
	}
});

// Pegar o user que está logado
router.get('/', auth, async (req, res) => {
	const user = await User.findById(req.user);
	res.json({
		username: user.username,
		id: user._id,
	});
});

module.exports = router;
