const express = require('express');
// Para conectar com o MongoDB
const mongoose = require('mongoose');
// Seguranca de comunicacao Cross Origin Resource Sharing do browser - UjozQOaGt1k
const cors = require('cors');
// Constantes de acordo com o ambiente
require('dotenv').config();

// Set up express
const app = express();
// middleware executado sempre que alguma rota for acessada
// json body parser
app.use(express.json());
app.use(cors());

// Pegando uma porta do ambiente caso exista, se o site estiver online provavelmente vai receber uma porta diferente em 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`));

// Set up mongoose
mongoose.connect(
	process.env.MONGODB_CON,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
	(err) => {
		if (err) throw err;
		console.log('MongoDB connection established!');
	}
);

// Set up routes
// Caso entre em /users será extendido para userRouter (/users/<userRouter_POSSIVEIS_ROTAS>)
app.use('/users', require('./routes/userRouter'));
app.use('/favShows', require('./routes/favShowRouter'));
