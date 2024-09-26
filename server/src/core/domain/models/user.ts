export class User {
	id?: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	
	constructor(
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		id?: string,
	) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.id = id;
	}
}
