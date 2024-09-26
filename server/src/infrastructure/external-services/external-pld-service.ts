import axios, { AxiosResponse } from 'axios';

export class PLDService {
	private baseUrl: string;
	
	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}
	
	async get(endpoint: string, params?: Record<string, any>): Promise<boolean> {
		const url = `${this.baseUrl}${endpoint}`;
		console.log(url);
		try {
			const response: AxiosResponse<any> = await axios.post(url, params);
			return response.data.is_in_blacklist;
		} catch (error) {
			throw new Error(`API request failed: ${error.message}`);
		}
	}
}
