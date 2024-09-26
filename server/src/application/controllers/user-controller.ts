import { Request, Response } from 'express';
import { UserService } from '../../core/domain/services/user-service';
import {TypedRequest} from '../dtos/request.dto';

export class UserController {
	private userService: UserService;
	
	constructor(userService: UserService) {
		this.userService = userService;
	}
	
	public async getUser(req: TypedRequest<null>, res: Response): Promise<Response> {
		try {
			const userId = req.user.id;
			
			const user = await this.userService.getUser(userId);
			res.set('Content-Type','application/json; charset=utf-8');
			return res.status(200).json({
				message: 'Información del usuario',
				user,
			});
		} catch (error) {
			console.log(error);
			res.set('Content-Type','application/json; charset=utf-8');
			return res.status(404).json({
				message: 'Usuario no encontrado',
				error: error.message,
			});
		}
	}
}
