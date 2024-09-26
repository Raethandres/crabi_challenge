import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {UserRepository} from '../../../core/ports/repositories/user-repository';
import {AuthService} from '../../../core/domain/services/auth-service';
import {CreateUserDTO} from '../../../application/dtos/create-user.dto';
import {User} from '../../../core/domain/models/user';
import {LoginDTO} from '../../../application/dtos/login.dto';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
	let authService: AuthService;
	let userRepository: jest.Mocked<UserRepository>;
	
	beforeEach(() => {
		userRepository = {
			findByEmail: jest.fn(),
			create: jest.fn(),
		} as unknown as jest.Mocked<UserRepository>;
		
		authService = new AuthService(userRepository);
	});
	
	describe('register', () => {
		it('should throw an error if the user already exists', async () => {
			const createUserDto: CreateUserDTO = {
				dni:'123',
				firstName:'',lastName:'',
				email: 'existinguser@example.com',
				password: 'password123'
			};
			
			userRepository.findByEmail.mockResolvedValueOnce({} as User);
			
			await expect(authService.register(createUserDto)).rejects.toThrow('El usuario ya existe');
		});
		
		it('should hash the password and create a new user', async () => {
			const createUserDto: CreateUserDTO = {
				dni:'123',
				firstName:'',lastName:'',
				email: 'newuser@example.com',
				password: 'password123'
			};
			
			userRepository.findByEmail.mockResolvedValueOnce(null);
			
			(bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');
			
			const newUser: User = {
				...createUserDto,
				password: 'hashedPassword',
			};
			
			userRepository.create.mockResolvedValueOnce(newUser);
			
			const result = await authService.register(createUserDto);
			
			expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
			expect(userRepository.create).toHaveBeenCalledWith(newUser);
			expect(result).toEqual(newUser);
		});
	});
	
	describe('login', () => {
		it('should throw an error if the user does not exist', async () => {
			const loginDto: LoginDTO = {
				email: 'nonexistentuser@example.com',
				password: 'password123',
			};
			
			userRepository.findByEmail.mockResolvedValueOnce(null);
			
			await expect(authService.login(loginDto)).rejects.toThrow('Credenciales incorrectas');
		});
		
		it('should throw an error if the password is incorrect', async () => {
			const loginDto: LoginDTO = {
				email: 'testuser@example.com',
				password: 'wrongpassword',
			};
			
			const user: User = {
				firstName:'',lastName:'',
				email: 'testuser@example.com',
				password: 'hashedPassword'
			};
			
			userRepository.findByEmail.mockResolvedValueOnce(user);
			
			(bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
			
			await expect(authService.login(loginDto)).rejects.toThrow('Credenciales incorrectas');
		});
		
		it('should return a JWT token if the credentials are correct', async () => {
			const loginDto: LoginDTO = {
				email: 'testuser@example.com',
				password: 'password123',
			};
			
			const user: User = {
				firstName:'',lastName:'',
				email: 'testuser@example.com',
				password: 'hashedPassword'
			};
			
			userRepository.findByEmail.mockResolvedValueOnce(user);
			
			(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
			
			(jwt.sign as jest.Mock).mockReturnValue('mockToken');
			
			const token = await authService.login(loginDto);
			
			expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
			expect(jwt.sign).toHaveBeenCalledWith({ id: user.id, email: user.email }, expect.any(String), { expiresIn: '1h' });
			expect(token).toBe('mockToken');
		});
	});
	
	describe('generateToken', () => {
		it('should generate a JWT token with the correct payload', () => {
			const user: User = {
				firstName:'',lastName:'',
				id: 'userId',
				email: 'user@example.com',
				password: 'hashedPassword'
			};
			
			(jwt.sign as jest.Mock).mockReturnValue('mockToken');
			
			const token = authService['generateToken'](user);
			
			expect(jwt.sign).toHaveBeenCalledWith({ id: 'userId', email: 'user@example.com' }, expect.any(String), { expiresIn: '1h' });
			expect(token).toBe('mockToken');
		});
	});
});
