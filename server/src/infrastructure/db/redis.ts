import { createClient } from 'redis';

const redisClient = createClient({
	url:process.env['REDIS_URL'],
});

redisClient.on('error', (err) => {
	console.error('Error connecting to Redis:', err);
});

redisClient.connect();

export default redisClient;
