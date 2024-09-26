import {CreateUserDTO} from './create-user.dto';
export interface LoginDTO{
	email:string
	password:string
}

export function validateLoginDTO(user: LoginDTO): LoginDTO {
	const errors: string[] = [];
	
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!user.email || !emailRegex.test(user.email)) {
		errors.push('Email is required and must be a valid email address.');
	}
	
	if (!user.password || user.password.length < 8 || user.password.length > 20) {
		errors.push('Password is required and must be between 8 and 20 characters.');
	}
	
	if(errors.length>0)
		throw new Error(errors.join(' '));
	return user;
}