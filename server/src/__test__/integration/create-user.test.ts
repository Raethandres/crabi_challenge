import * as dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import { mongoMain } from '../../infrastructure/db/mongo';
import { createServer } from '../../server';
import { CreateUserDTO } from '../../application/dtos/create-user.dto';

describe('POST /api/auth/signup', () => {
	let app;
	const email=`testuser${new Date().toString()}@example.com`
	beforeAll((done) => {
		mongoMain.client.on('serverHeartbeatSucceeded', async():Promise<void>=>{
			console.log('Connected to MongoDB');
			app = await createServer(mongoMain.client);
			done();
		});
		mongoMain.client.on('serverHeartbeatFailed', (err) => {
			console.error('Failed to connect to MongoDB', err);
			done(err);
		});
	});
	
	afterAll(async () => {
		await mongoMain.client.close();
	});
	
	it('should create a new user and return 201', async () => {
		const newUser: CreateUserDTO = {
			dni:'123',
			firstName: 'test',
			lastName: 'user',
			email: email,
			password: 'securePassword123'
		};
		
		const response = await request(app)
		.post('/api/auth/signup')
		.send(newUser)
		.expect(201);
		
		expect(response.body).toHaveProperty('user');
		expect(response.body.user).toHaveProperty('id');
		expect(response.body.user.email).toBe(newUser.email);
	});
	
	it('should return 400 if email already exists', async () => {
		const existingUser: CreateUserDTO = {
			dni:'123',
			firstName: 'duplicate',
			lastName: 'user',
			email: email,
			password: 'anotherSecurePassword123'
		};
		
		const response = await request(app)
		.post('/api/auth/signup')
		.send(existingUser)
		.expect(400);
		
		expect(response.body).toHaveProperty('message');
		expect(response.body.message).toBe('Error al registrar el usuario');
		expect(response.body).toHaveProperty('error');
	});
	
	it('should return 400 reported pld', async () => { //TODO mock pld api
		const existingUser: CreateUserDTO = {
			dni:'30254482577571',
			firstName: 'Blair',
			lastName: 'Bourthoumieux',
			email: email,
			password: 'anotherSecurePassword123'
		};
		
		const response = await request(app)
		.post('/api/auth/signup')
		.send(existingUser)
		.expect(400);
		
		expect(response.body).toHaveProperty('message');
		expect(response.body.message).toBe('Error al registrar el usuario');
		expect(response.body).toHaveProperty('error');
	});
	
});
