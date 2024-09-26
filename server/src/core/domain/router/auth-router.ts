import express, { Router } from 'express';
import { AuthController } from '../../../application/controllers/auth-controller';

export const authRouter = (controller: AuthController): Router => {
	const router: Router = express.Router();
	
	router.route('/login').post((req, res) => controller.login(req, res));
	router.route('/signup').post((req, res) => controller.register(req, res));
	
	return router;
};
