import express from 'express';
import bodyParser from 'body-parser';
import { AuthController } from './application/controllers/auth-controller';
import { UserController } from './application/controllers/user-controller';
import {mongoMain} from './infrastructure/db/mongo';
import {AuthService} from './core/domain/services/auth-service';
import {UserRepository} from './core/ports/repositories/user-repository';
import {UserService} from './core/domain/services/user-service';
import {authRouter} from './core/domain/router/auth-router';
import {userRouter} from './core/domain/router/user-router';

const userRepository:UserRepository=new UserRepository(mongoMain.client)
const authService:AuthService=new AuthService(userRepository);
const userService:UserService=new UserService(userRepository);
const authController=new AuthController(authService);
const userController=new UserController(userService);

export default async():Promise<any>=>{
	const app=express();
	const PORT=process.env.PORT || 3000;
	
	app.use(bodyParser.json());
	
	app.use('/api/auth',authRouter(authController));
	app.use('/api/users',userRouter(userController));
	
	app.use((err,req,res,next)=>{
		console.error(err.stack);
		res.status(500).send('Something broke!');
	});
	
	app.listen(PORT,()=>{
		console.log(`Server is running on http://localhost:${PORT}`);
	});
}