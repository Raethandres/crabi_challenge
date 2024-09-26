import * as dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import { mongoMain } from '../../infrastructure/db/mongo';
import { createServer } from '../../server';
import jwt from 'jsonwebtoken';

describe('GET /api/users/me', () => {
	let app;
	
	beforeAll((done) => {
		mongoMain.client.on('serverHeartbeatSucceeded', async (): Promise<void> => {
			console.log('Connected to MongoDB');
			app = await createServer(mongoMain.client, null);
			done();
		});
	});
	
	afterAll(async () => {
		await mongoMain.client.close();
	});
	
	// Caso de éxito
	it('debería devolver la información del usuario 200', async () => {
		const payload: any = { id: '66f4abfb03c94cf72d1b4933', email: 'testuser@example.com' };
		const secretKey: string = process.env.JWT_SECRET || 'defaultSecretKey';
		const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
		
		const response = await request(app)
		.get('/api/users/me')
		.set('access-token', token)
		.expect(200);
		
		expect(response.body).toHaveProperty('user');
		expect(response.body.user).toHaveProperty('id');
		expect(response.body.user.id).toEqual(payload.id);
	});
	
	it('debería devolver un error 401 cuando no se proporciona el token', async () => {
		const response = await request(app)
		.get('/api/users/me')
		.expect(401);
		
		expect(response.body).toHaveProperty('message', 'token not found');
	});
	
	it('debería devolver un error 401 cuando el token es inválido', async () => {
		const invalidToken = 'invalidTokenString';
		
		const response = await request(app)
		.get('/api/users/me')
		.set('access-token', invalidToken)
		.expect(401);
		
		expect(response.body).toHaveProperty('message', 'jwt malformed');
	});
	
	it('debería devolver un error 401 cuando el token está expirado', async () => {
		const payload: any = { id: '66f4abfb03c94cf72d1b4933', email: 'testuser@example.com' };
		const secretKey: string = process.env.JWT_SECRET || 'defaultSecretKey';
		const expiredToken = jwt.sign(payload, secretKey, { expiresIn: '-1h' }); // Token expirado
		
		const response = await request(app)
		.get('/api/users/me')
		.set('access-token', expiredToken)
		.expect(401);
		
		expect(response.body).toHaveProperty('message', 'jwt expired');
	});
	
	it('debería devolver un error 404 cuando el usuario no existe', async () => {
		const payload: any = { id: 'nonexistentUserId', email: 'nonexistent@example.com' };
		const secretKey: string = process.env.JWT_SECRET || 'defaultSecretKey';
		const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
		
		const response = await request(app)
		.get('/api/users/me')
		.set('access-token', token)
		.expect(404);
		
		expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
	});
	
});
