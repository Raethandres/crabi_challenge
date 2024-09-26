import * as dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import { mongoMain } from '../../infrastructure/db/mongo';
import { createServer } from '../../server';
import jwt from 'jsonwebtoken';
import {LoginDTO} from '../../application/dtos/login.dto';

describe('POST /api/auth/login', () => {
	let app;
	
	beforeAll((done) => {
		mongoMain.client.on('serverHeartbeatSucceeded', async():Promise<void>=>{
			console.log('Connected to MongoDB');
			app = await createServer(mongoMain.client,null);
			// await app.close();
			done();
		});
		// mongoMain.client.on('serverHeartbeatFailed', (err) => {
		// 	console.error('Failed to connect to MongoDB', err);
		// 	done(err);
		// });
	});
	
	afterAll(async () => {
		await mongoMain.client.close();
	});
	
	it('debería devolver la información del usuario 200', async () => {
		const data:LoginDTO={
			email:'testuserThu Sep 26 2024 08:25:54 GMT-0500 (Colombia Standard Time)@example.com',password:'securePassword123'
		}
		
		const response = await request(app)
		.post('/api/auth/login')
		.send(data)
		.expect(200);
		
		expect(response.body).toHaveProperty('token');
	});
	
	it('debería devolver un error 401 cuando las credenciales son incorrectas', async () => {
		const data: LoginDTO = {
			email: 'testuser@example.com',
			password: 'wrongPassword'
		};
		
		const response = await request(app)
		.post('/api/auth/login')
		.send(data)
		.expect(401);
		
		expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
	});
	
	// it('debería devolver un error 400 cuando el email no se proporciona', async () => {
	// 	const data: LoginDTO = {
	// 		email: '',  // Email vacío
	// 		password: 'securePassword123'
	// 	};
	//
	// 	const response = await request(app)
	// 	.post('/api/auth/login')
	// 	.send(data)
	// 	.expect(400);
	//
	// 	expect(response.body).toHaveProperty('message', 'El email es obligatorio');
	// });
	//
	// it('debería devolver un error 400 cuando la contraseña no se proporciona', async () => {
	// 	const data: LoginDTO = {
	// 		email: 'testuser@example.com',
	// 		password: ''  // Contraseña vacía
	// 	};
	//
	// 	const response = await request(app)
	// 	.post('/api/auth/login')
	// 	.send(data)
	// 	.expect(400);
	//
	// 	expect(response.body).toHaveProperty('message', 'La contraseña es obligatoria');
	// });
	
	it('debería devolver un error 404 cuando el usuario no se encuentra', async () => {
		const data: LoginDTO = {
			email: 'nonexistentuser@example.com',
			password: 'securePassword123'
		};
		
		const response = await request(app)
		.post('/api/auth/login')
		.send(data)
		.expect(401);
		
		expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
	});
	
	
});
