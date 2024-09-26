import {UserService} from '../../core/domain/services/user-service';
import {UserRepository} from '../../core/ports/repositories/user-repository';
import {User} from '../../core/domain/models/user';

describe('UserService', () => {
	let userService: UserService;
	let userRepository: jest.Mocked<UserRepository>;
	
	beforeEach(() => {
		userRepository = {
			findById: jest.fn(),
		} as unknown as jest.Mocked<UserRepository>;
		
		userService = new UserService(userRepository);
	});
	
	describe('getUser', () => {
		it('should return a user by id', async () => {
			const userId = 'testUserId';
			const user: User = {
				firstName:'',lastName:'',
				id: userId,
				email: 'testuser@example.com',
				password: 'hashedPassword'
			};
			
			userRepository.findById.mockResolvedValueOnce(user);
			
			const result = await userService.getUser(userId);
			
			expect(userRepository.findById).toHaveBeenCalledWith(userId);
			expect(result).toEqual(user);
		});
		
		it('should return null if user not found', async () => {
			const userId = 'nonExistentUserId';
			
			userRepository.findById.mockResolvedValueOnce(null);
			
			const result = await userService.getUser(userId);
			
			expect(userRepository.findById).toHaveBeenCalledWith(userId);
			expect(result).toBeNull();
		});
	});
});
