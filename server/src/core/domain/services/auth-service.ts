import {UserRepository} from '../../ports/repositories/user-repository';
import {CreateUserDTO} from '../../../application/dtos/create-user.dto';
import {LoginDTO} from '../../../application/dtos/login.dto';
import {User} from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
	private userRepository: UserRepository;
	
	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}
	
	public async register(createUserDto: CreateUserDTO): Promise<{user:User,token:string}> {
		const { email, password } = createUserDto;
		
		const existingUser = await this.userRepository.findByEmail(email);
		if (existingUser) {
			throw new Error('El usuario ya existe');
		}
		
		const hashedPassword = await bcrypt.hash(password, 10);
		
		const user: User = {
			...createUserDto,
			password: hashedPassword
		};
		
		return await this.userRepository.create(user).then((user:User):{user:User,token:string}=>({user,token:this.generateToken(user)}));
	}
	
	public async login(loginDto: LoginDTO): Promise<string> {
		const { email, password } = loginDto;
		
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			throw new Error('Credenciales incorrectas');
		}
		
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new Error('Credenciales incorrectas');
		}

		return this.generateToken(user);
	}
	
	private generateToken(user: User): string {
		const payload:any = { id: user.id, email: user.email };
		const secretKey:string = process.env.JWT_SECRET || 'defaultSecretKey';
		return jwt.sign(payload,secretKey,{expiresIn:'1h'});
	}
}
