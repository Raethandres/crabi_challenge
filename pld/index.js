const express = require('express');
const bodyParser = require('body-parser');
const users = require('./MOCK_DATA.json');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.post('/search-user', (req, res) => {
	const { firstName, lastName, DNI } = req.body;
	
	const matchingUsers = users.filter(user =>
		user.firstName === firstName &&
		user.lastName === lastName &&
		user.DNI === DNI
	);
	
	if (matchingUsers.length > 0) {
		return res.status(200).json({ message: 'Usuario encontrado', users: matchingUsers });
	} else {
		return res.status(404).json({ message: 'Usuario no encontrado' });
	}
});

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
