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
		return user ? { ...user, id: user._id.toString() } : null;
	}
	
	async findById(id: string): Promise<User | null> {
		const db = this.client.db();
		const user = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) });
		return user ? { ...user, id: user._id.toString() } : null;
	}
}
