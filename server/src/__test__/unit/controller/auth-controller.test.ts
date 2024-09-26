import {Request,Response} from 'express';
import {AuthService} from '../../core/domain/services/auth-service';
import {PLDService} from '../../infrastructure/external-services/external-pld-service';
import {AuthController} from '../../application/controllers/auth-controller';
import {CreateUserDTO} from '../../application/dtos/create-user.dto';
import {LoginDTO} from '../../application/dtos/login.dto';

const mockAuthService={
	register:jest.fn(),
	login:jest.fn()
};

const mockPLDService={
	get:jest.fn()
};

describe('AuthController',()=>{
	let authController:AuthController;
	let req:Partial<Request>;
	let res:Partial<Response>;
	let statusMock:jest.Mock;
	let jsonMock:jest.Mock;
	
	beforeEach(()=>{
		authController=new AuthController(
			mockAuthService as unknown as AuthService,
			mockPLDService as unknown as PLDService
		);
		
		req={
			body:{}
		};
		
		jsonMock=jest.fn();
		statusMock=jest.fn().mockReturnValue({json:jsonMock});
		res={
			status:statusMock
		};
	});
	
	afterEach(()=>{
		jest.clearAllMocks();
	});
	
	describe('register',()=>{
		it('debería registrar un usuario y devolver un código 201',async()=>{
			const mockUser:CreateUserDTO={
				firstName:'Juan',
				lastName:'Pérez',
				dni:'12345678',
				email:'juan@example.com',
				password:'password123'
			};
			
			req.body=mockUser;
			
			mockPLDService.get.mockResolvedValueOnce(null); // No hay problemas de PLD
			mockAuthService.register.mockResolvedValueOnce(mockUser);
			
			await authController.register(req as Request,res as Response);
			
			expect(mockPLDService.get).toHaveBeenCalledWith('search-user',{
				firstName:mockUser.firstName,
				lastName:mockUser.lastName,
				DNI:mockUser.dni
			});
			expect(mockAuthService.register).toHaveBeenCalledWith(mockUser);
			expect(statusMock).toHaveBeenCalledWith(201);
			expect(jsonMock).toHaveBeenCalledWith({
				message:'Usuario registrado exitosamente',
				user:mockUser
			});
		});
		
		it('debería devolver un error si el usuario está en la lista PLD',async()=>{
			const mockUser:CreateUserDTO={
				firstName:'Juan',
				lastName:'Pérez',
				dni:'12345678',
				email:'juan@example.com',
				password:'password123'
			};
			
			req.body=mockUser;
			
			mockPLDService.get.mockResolvedValueOnce(true);
			
			await authController.register(req as Request,res as Response);
			
			expect(mockPLDService.get).toHaveBeenCalledWith('search-user',{
				firstName:mockUser.firstName,
				lastName:mockUser.lastName,
				DNI:mockUser.dni
			});
			expect(mockAuthService.register).not.toHaveBeenCalled();
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				message:'Error al registrar el usuario',
				error:'PLD REPORTED'
			});
		});
		
		it('debería devolver un error si hay un problema en el registro',async()=>{
			const mockUser:CreateUserDTO={
				firstName:'Juan',
				lastName:'Pérez',
				dni:'12345678',
				email:'juan@example.com',
				password:'password123'
			};
			
			req.body=mockUser;
			
			mockPLDService.get.mockResolvedValueOnce(null);
			mockAuthService.register.mockRejectedValueOnce(new Error('Fallo en el registro'));
			
			await authController.register(req as Request,res as Response);
			
			expect(mockPLDService.get).toHaveBeenCalledWith('search-user',{
				firstName:mockUser.firstName,
				lastName:mockUser.lastName,
				DNI:mockUser.dni
			});
			expect(mockAuthService.register).toHaveBeenCalledWith(mockUser);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				message:'Error al registrar el usuario',
				error:'Fallo en el registro'
			});
		});
	});
	
	describe('login',()=>{
		it('debería loguear un usuario correctamente y devolver un token',async()=>{
			const mockLoginDto:LoginDTO={
				email:'juan@example.com',
				password:'password123'
			};
			
			req.body=mockLoginDto;
			
			const mockToken='abc123';
			mockAuthService.login.mockResolvedValueOnce(mockToken);
			
			await authController.login(req as Request,res as Response);
			
			expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				message:'Login exitoso',
				token:mockToken
			});
		});
		
		it('debería devolver un error si las credenciales son inválidas',async()=>{
			const mockLoginDto:LoginDTO={
				email:'juan@example.com',
				password:'password123'
			};
			
			req.body=mockLoginDto;
			
			mockAuthService.login.mockRejectedValueOnce(new Error('Credenciales inválidas'));
			
			await authController.login(req as Request,res as Response);
			
			expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
			expect(statusMock).toHaveBeenCalledWith(401);
			expect(jsonMock).toHaveBeenCalledWith({
				message:'Credenciales inválidas',
				error:'Credenciales inválidas'
			});
		});
	});
});
