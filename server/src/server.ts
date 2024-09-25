import express from 'express';
import bodyParser from 'body-parser';
import { AuthController } from './application/controllers/auth-controller';
import { UserController } from './application/controllers/user-controller';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
