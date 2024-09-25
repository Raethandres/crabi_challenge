import express,{NextFunction,Response,Router} from 'express';
import jwt from 'jsonwebtoken';
import {UserController} from '../../../application/controllers/user-controller';
import {TypedRequest} from '../../../application/dtos/request.dto';
import {UtilitiesService} from '../services/utilities-services';
const router:Router=express.Router();
const utilities:UtilitiesService = new UtilitiesService();

export const userRouter=(controller:UserController):Router=>{
	router.route('*')
	.all(async(request:TypedRequest<any>,response:Response,next:NextFunction):Promise<any>=>{
		request.user= await utilities.Auth(request,response);
		response.set('Content-Type','text/html; charset=utf-8');
		next();
	});
	
	router.route('/me').get(controller.getUser)
	return router;
}

