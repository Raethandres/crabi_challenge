import {MongoClient,MongoClientOptions} from 'mongodb';

class MongoMain{
	private readonly mongoClientOptions:MongoClientOptions;
	readonly client:MongoClient;
	
	constructor(){
		this.mongoClientOptions={
			tls:process.env['MONGO_TLS']=== "true",
			monitorCommands:true
		};
		this.client=new MongoClient(process.env['MONGO_MAIN_URL'],this.mongoClientOptions);
		this.client.connect()
		.catch((error:any):void=>{throw error;});
		this.observe();
		
	}
	
	private observe():void{
		this.client.on('serverOpening',():void=>{
			console.log(this.constructor.name,'client.serverOpening mongoDatabaseMain');
		});
		this.client.on('serverClosed',():void=>{
			console.log(this.constructor.name,'client.serverClosed mongoDatabaseMain');
		});
		this.client.on('serverDescriptionChanged',():void=>{
			console.log(this.constructor.name,'client.serverDescriptionChanged mongoDatabaseMain');
		});
		this.client.on('topologyOpening',():void=>{
			console.log(this.constructor.name,'client.topologyOpening mongoDatabaseMain');
		});
		this.client.on('topologyClosed',():void=>{
			console.log(this.constructor.name,'client.topologyClosed mongoDatabaseMain');
		});
		this.client.on('topologyDescriptionChanged',():void=>{
			console.log(this.constructor.name,'client.topologyDescriptionChanged mongoDatabaseMain');
		});
		this.client.on('serverHeartbeatStarted',():void=>{
			// console.log(this.constructor.name,'client.serverHeartbeatStarted');
		});
		this.client.on('serverHeartbeatSucceeded',():void=>{
			// console.log(this.constructor.name,'client.serverHeartbeatSucceeded');
		});
		this.client.on('serverHeartbeatFailed',():void=>{
			// console.log('client.serverHeartbeatFailed mongoDatabaseMain');
		});
	}
	
}
export const mongoMain:MongoMain=new MongoMain();
