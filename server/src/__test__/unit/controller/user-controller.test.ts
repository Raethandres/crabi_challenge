import { Request, Response } from 'express';
import {UserService} from '../../../core/domain/services/user-service';
import {UserController} from '../../../application/controllers/user-controller';
import {TypedRequest} from '../../../application/dtos/request.dto';
import {User} from '../../../core/domain/models/user';

describe('UserController', () => {
	let userService: jest.Mocked<UserService>;
	let userController: UserController;
	let req: Partial<TypedRequest<null>>;
	let res: Partial<Response>;
	
	beforeEach(() => {
		
		userService ={
			getUser:jest.fn()
		} as unknown as jest.Mocked<UserService>;
		
		userController = new UserController(userService);
		
		req = {
			user: {
				id: '123',
			},
		};
		
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			set: jest.fn(),
		};
	});
	
	it('debería devolver la información del usuario (200)', async () => {
		const mockUser:User = {email:'test@test.com',password:'password',id: '123', firstName: 'john',lastName:'doe' };
		userService.getUser.mockResolvedValue(mockUser);
		
		await userController.getUser(req as TypedRequest<null>, res as Response);
		
		expect(userService.getUser).toHaveBeenCalledWith('123');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Información del usuario',
			user: mockUser,
		});
		expect(res.set).toHaveBeenCalledWith('Content-Type', 'application/json; charset=utf-8');
	});
	
	it('debería devolver un error si el usuario no existe (404)', async () => {
		const error = new Error('User not found');
		userService.getUser.mockRejectedValue(error);
		
		await userController.getUser(req as TypedRequest<null>, res as Response);
		
		expect(userService.getUser).toHaveBeenCalledWith('123');
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Usuario no encontrado',
			error: error.message,
		});
		expect(res.set).toHaveBeenCalledWith('Content-Type', 'application/json; charset=utf-8');
	});
});
