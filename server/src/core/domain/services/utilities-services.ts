import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserJWT } from '../../../application/dtos/user-jwt.dto';

export class UtilitiesService {
	Auth(request: Request, response: Response): UserJWT | undefined {
		const token: any = request.headers['access-token'];
		
		if (!token) {
			response.set('Content-Type', 'application/json; charset=utf-8');
			response.status(401).json({
				message: 'token not found',
				error: 'token not found',
			});
			return;  // Detiene la ejecución si no se encuentra el token
		}
		
		try {
			const decoded: any = jwt.verify(token, process.env['JWT_SECRET']);
			if (decoded) {
				return decoded as UserJWT;
			}
			throw new Error('unauthorized');
		} catch (error) {
			response.set('Content-Type', 'application/json; charset=utf-8');
			response.status(401).json({
				message: error.message,
				error: error.message,
			});
			return;  // Detiene la ejecución si hay un error en la verificación del token
		}
	}
}
