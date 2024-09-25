import { Request, Response } from 'express';
import { UserService } from '../../core/domain/services/user-service';

export class UserController {
	private userService: UserService;
	
	constructor(userService: UserService) {
		this.userService = userService;
	}
	
	public async getUser(req: Request, res: Response): Promise<Response> {
		try {
			const userId = req.user.id; // Asume que el middleware de autenticación agrega el ID del usuario autenticado a la request.
			
			const user = await this.userService.getUser(userId);
			
			return res.status(200).json({
				message: 'Información del usuario',
				user,
			});
		} catch (error) {
			return res.status(404).json({
				message: 'Usuario no encontrado',
				error: error.message,
			});
		}
	}
}
