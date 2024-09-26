import {Response} from 'express';
import {UserService} from '../../core/domain/services/user-service';
import {TypedRequest} from '../../application/dtos/request.dto';
import {UserController} from '../../application/controllers/user-controller';

const mockUserService={
	getUser:jest.fn()
};

describe('UserController',()=>{
	let userController:UserController;
	let req:Partial<TypedRequest<null>>;
	let res:Partial<Response>;
	let statusMock:jest.Mock;
	let jsonMock:jest.Mock;
	
	beforeEach(()=>{
		userController=new UserController(mockUserService as unknown as UserService);
		
		req={
			user:{id:'123'}
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
	
	describe('getUser',()=>{
		it('debería devolver la información del usuario correctamente',async()=>{
			const mockUser={
				id:'123',
				firstName:'Juan',
				lastName:'Pérez',
				email:'juan@example.com'
			};
			
			mockUserService.getUser.mockResolvedValueOnce(mockUser);
			
			await userController.getUser(req as TypedRequest<null>,res as Response);
			
			expect(mockUserService.getUser).toHaveBeenCalledWith('123');
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				message:'Información del usuario',
				user:mockUser
			});
		});
		
		it('debería devolver un error si no se encuentra el usuario',async()=>{
			mockUserService.getUser.mockRejectedValueOnce(new Error('Usuario no encontrado'));
			
			await userController.getUser(req as TypedRequest<null>,res as Response);
			
			expect(mockUserService.getUser).toHaveBeenCalledWith('123');
			expect(statusMock).toHaveBeenCalledWith(404);
			expect(jsonMock).toHaveBeenCalledWith({
				message:'Usuario no encontrado',
				error:'Usuario no encontrado'
			});
		});
	});
});
