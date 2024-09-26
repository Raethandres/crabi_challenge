import express from 'express';
import bodyParser from 'body-parser';
import { AuthController } from './application/controllers/auth-controller';
import { UserController } from './application/controllers/user-controller';
import { AuthService } from './core/domain/services/auth-service';
import { UserRepository } from './core/ports/repositories/user-repository';
import { UserService } from './core/domain/services/user-service';
import { authRouter } from './core/domain/router/auth-router';
import { userRouter } from './core/domain/router/user-router';
import { MongoClient } from 'mongodb';
import {PLDService} from './infrastructure/external-services/external-pld-service';

const PORT = process.env.PORT || 3000;

export const createServer = async (client: MongoClient,pldServiceMock:PLDService): Promise<express.Application> => {
	const userRepository: UserRepository = new UserRepository(client);
	const authService: AuthService = new AuthService(userRepository);
	const userService: UserService = new UserService(userRepository);
	const pldService: PLDService = new PLDService(process.env['PLD_HOST']);
	const authController: AuthController = new AuthController(authService,pldServiceMock||pldService);
	const userController: UserController = new UserController(userService);
	const app = express();
	
	app.use(bodyParser.json());
	
	app.use('/api/auth', authRouter(authController));
	app.use('/api/users', userRouter(userController));
	
	app.use((err, req, res, next) => {
		console.error(err.stack);
		res.status(500).send('Something broke!');
	});
	
	// app.listen(PORT, () => {
	// 	console.log(`Server is running on http://localhost:${PORT}`);
	// });
	
	return app;
};