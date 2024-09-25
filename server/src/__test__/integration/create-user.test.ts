import request from 'supertest';
import app from '../../server';

describe('POST /api/users', () => {
	
	it('should create a new user and return 201', async () => {
		const newUser = {
			email: 'testuser@example.com',
			password: 'securePassword123',
		};
		
		const response = await request(app)
		.post('/api/users')
		.send(newUser)
		.expect('Content-Type', /json/)
		.expect(201);
		
		expect(response.body).toHaveProperty('id');
		expect(response.body.email).toBe(newUser.email);
	});
	
});
