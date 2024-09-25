import express,{NextFunction,Response,Router} from 'express';
import jwt from 'jsonwebtoken';
import {AuthController} from '../../../application/controllers/auth-controller';

const router:Router=express.Router();

export const authRouter=(controller:AuthController):Router=>{
	router.route('/login').post(controller.login)
	router.route('/signup').post(controller.register)
	
	return router;
}

