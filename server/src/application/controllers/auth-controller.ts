import { Request, Response } from 'express';
import { LoginDTO } from '../dtos/login.dto';
import {CreateUserDTO} from '../dtos/create-user.dto';
import {AuthService} from '../../core/domain/services/auth-service';

export class AuthController {
	private authService: AuthService;
	
	constructor(authService: AuthService) {
		this.authService = authService;
	}
	
	public async register(req: Request, res: Response): Promise<Response> {
		try {
			const registerUserDto: CreateUserDTO = req.body;
			
			const user = await this.authService.register(registerUserDto);
			
			return res.status(201).json({
				message: 'Usuario registrado exitosamente',
				user,
			});
		} catch (error) {
			return res.status(400).json({
				message: 'Error al registrar el usuario',
				error: error.message,
			});
		}
	}
	
	public async login(req: Request, res: Response): Promise<Response> {
		try {
			const loginDto: LoginDTO = req.body;
			
			const token = await this.authService.login(loginDto);
			
			return res.status(200).json({
				message: 'Login exitoso',
				token,
			});
		} catch (error) {
			return res.status(401).json({
				message: 'Credenciales inválidas',
				error: error.message,
			});
		}
	}
	
}
