import { Request, Response } from 'express';
import {LoginDTO,validateLoginDTO} from '../dtos/login.dto';
import {CreateUserDTO,validateCreateUserDTO} from '../dtos/create-user.dto';
import { AuthService } from '../../core/domain/services/auth-service';
import {PLDService} from '../../infrastructure/external-services/external-pld-service';

export class AuthController {
	private authService: AuthService;
	private pldService: PLDService;
	
	constructor(authService: AuthService, pldService:PLDService) {
		
		this.authService = authService;
		this.pldService = pldService;
	}
	
	public async register(req: Request, res: Response): Promise<Response> {
		try {
			const registerUserDto: CreateUserDTO = validateCreateUserDTO(req.body);
			const pld= await this.pldService.get('search-user',{firstName:registerUserDto.firstName,lastName:registerUserDto.lastName,email:registerUserDto.email});
			if(pld)
				throw new Error('PLD REPORTED');
			const data = await this.authService.register(registerUserDto);
			
			return res.status(201).json({
				message: 'Usuario registrado exitosamente',
				...data
			});
		} catch (error) {
			console.error(error.message);
			return res.status(400).json({
				message: 'Error al registrar el usuario',
				error: error.message,
			});
		}
	}
	
	public async login(req: Request, res: Response): Promise<Response> {
		try {
			const loginDto: LoginDTO = validateLoginDTO(req.body);
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
