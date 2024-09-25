import jwt,{JwtPayload} from 'jsonwebtoken';
import {Request,Response} from 'express';
import {UserJWT} from '../../../application/dtos/user-jwt.dto';

export class UtilitiesService{
	Auth(request: Request, response: Response): UserJWT {
		const token: any = request.headers['access-token'];
		
		if (!token) {
			return undefined;
		}
		
		try {
			const decoded: any =jwt.verify(token,process.env['JWT_KEY']);
			if (decoded) {
				return decoded as UserJWT;
			}
		} catch (error) {
			throw error;
		}
	}
}