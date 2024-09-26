import {Request} from 'express';
import {UserJWT} from './user-jwt.dto';

export interface TypedRequest<T> extends Request,user{
	file:any;
	body:T;
}

class user{
	user:UserJWT;
}