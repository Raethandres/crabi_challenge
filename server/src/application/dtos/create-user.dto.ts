export interface CreateUserDTO {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	dni?:string;
}

export function validateCreateUserDTO(user: CreateUserDTO): CreateUserDTO {
	const errors: string[] = [];
	
	if (!user.firstName || typeof user.firstName !== 'string') {
		errors.push('First name is required and must be a string.');
	}
	
	if (!user.lastName || typeof user.lastName !== 'string') {
		errors.push('Last name is required and must be a string.');
	}
	
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