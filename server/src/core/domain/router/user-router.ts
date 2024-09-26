import express,{NextFunction,Response,Router} from 'express';
import jwt from 'jsonwebtoken';
import {UserController} from '../../../application/controllers/user-controller';
import {TypedRequest} from '../../../application/dtos/request.dto';
import {UtilitiesService} from '../services/utilities-services';
const router:Router=express.Router();
const utilities:UtilitiesService = new UtilitiesService();

export const userRouter = (controller: UserController): Router => {
	router.route('*').all(async (request: TypedRequest<any>, response: Response, next: NextFunction): Promise<any> => {
		try {
			const user = await utilities.Auth(request, response);
			if (!user) {
				return;
			}
			
			request.user = user;
			response.set('Content-Type', 'text/html; charset=utf-8');
			next();
		} catch (error) {
			console.error('Error en autenticación', error);
			return response.status(401).json({ message: 'Autenticación fallida' });
		}
	});
	
	router.route('/me').get((req: TypedRequest<any>, res) => controller.getUser(req, res));
	return router;
};


