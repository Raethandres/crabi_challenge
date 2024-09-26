import * as dotenv from 'dotenv';
dotenv.config();
import {createServer} from './src/server';
import {mongoMain} from './src/infrastructure/db/mongo';

process.title='crabi';
const PORT = process.env.PORT || 3000;

const date:Date=new Date();
console.log('currentDate',date.toString(),'currentDateUTC',date.toUTCString());
console.log('env',process.env,'\nrelease',process.release,'\n__dirname',__dirname,'\nprocess pid',process.pid);

const terminate=(signal:any):void=>{
	console.error('TERMINATING',signal);
	process.exit(1);
};

createServer(mongoMain.client,null).listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
});


process.on('SIGTERM',terminate);

