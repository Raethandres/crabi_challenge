import * as dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import { mongoMain } from '../../infrastructure/db/mongo';
import { createServer } from '../../server';
import {CreateUserDTO} from '../../application/dtos/create-user.dto';  // Asegúrate de que el path esté correcto

describe('POST /api/users', () => {
	let app;
	beforeAll((done) => {
		mongoMain.client.on('serverHeartbeatSucceeded', async():Promise<void>=>{
			console.log('Connected to MongoDB');
			app= await createServer(mongoMain.client);
			done();
		});
		mongoMain.client.on('serverHeartbeatFailed', (err) => {
			console.error('Failed to connect to MongoDB', err);
			done(err); // Para que Jest falle si no se puede conectar
		});
	});
	
	
	afterAll(async () => {
		await mongoMain.client.close();
	});
	
	it('should create a new user and return 200', async () => {
		const newUser:CreateUserDTO = {
			firstName:'test',
			lastName:'test',
			email: 'testuser@example.com',
			password: 'securePassword123'
		};
		
		const response = await request(app)
		.post('/api/auth/signup')
		.send(newUser)
		.expect(200);
		
		expect(response.body).toHaveProperty('id');
		expect(response.body.email).toBe(newUser.email);
	});
});
