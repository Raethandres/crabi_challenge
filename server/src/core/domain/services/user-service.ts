import {UserRepository} from '../../ports/repositories/user-repository';
import {User} from '../models/user';

export class UserService {
	private userRepository: UserRepository;
	
	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}
	
	public async getUser(id: string): Promise<User> {
		
		return  await this.userRepository.findById(id);
	}
}
