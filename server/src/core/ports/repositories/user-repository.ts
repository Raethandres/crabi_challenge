import { User } from '../../domain/models/user';
import { MongoClient, ObjectId } from 'mongodb';

export class UserRepository {
	private client: MongoClient;
	private collectionName: string = 'users';
	
	constructor(client: MongoClient) {
		this.client = client;
	}
	
	async create(user: User): Promise<User> {
		const db = this.client.db();
		const result = await db.collection(this.collectionName).insertOne(user);
		return { ...user, id: result.insertedId.toString() };
	}
	
	async findByEmail(email: string): Promise<User | null> {
		const db = this.client.db();
		const user = await db.collection(this.collectionName).findOne({ email });
		
		if (user) {
			return new User(
				user.firstName,
				user.lastName,
				user.email,
				user.password,
				user._id.toString()
			);
		}
		
		return null;
	}
	
	
	async findById(id: string): Promise<User | null> {
		const db = this.client.db();
		const _id:ObjectId= new ObjectId(id);
		const user = await db.collection(this.collectionName).findOne({ _id });
		if (user) {
			return new User(
				user.firstName,
				user.lastName,
				user.email,
				user.password,
				user._id.toString()
			);
		}
		return null;
	}
}
