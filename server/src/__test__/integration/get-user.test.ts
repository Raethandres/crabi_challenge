import * as dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import { mongoMain } from '../../infrastructure/db/mongo';
import { createServer } from '../../server';
import jwt from 'jsonwebtoken';

describe('GET /api/users/me', () => {
	let app;
	
	beforeAll((done) => {
		mongoMain.client.on('serverHeartbeatSucceeded', async():Promise<void>=>{
			console.log('Connected to MongoDB');
			app = await createServer(mongoMain.client,null);
			// await app.close();
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
	
	it('debería devolver la información del usuario 200', async () => {
		
		const payload:any = { id: '66f4abfb03c94cf72d1b4933', email: 'testuser@example.com' };
		const secretKey:string = process.env.JWT_SECRET || 'defaultSecretKey';
		const token=jwt.sign(payload,secretKey,{expiresIn:'1h'});
		
		const response = await request(app)
		.get('/api/users/me')
		.set('access-token',token)
		.expect(200);
		
		expect(response.body).toHaveProperty('user');
		expect(response.body.user).toHaveProperty('id');
	});

	
});
