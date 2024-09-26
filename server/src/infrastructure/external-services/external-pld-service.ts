import axios, { AxiosResponse } from 'axios';

export class PLDService {
	private baseUrl: string;
	
	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}
	
	async get(endpoint: string, params?: Record<string, any>): Promise<boolean> {
		const url = `${this.baseUrl}${endpoint}`;
		
		try {
			const response: AxiosResponse<any> = await axios.post(url, params);
			return response.data.is_in_blacklist;
		} catch (error) {
			if (error.status === 404) {
				return false;
			}
			throw new Error(`API request failed: ${error.message}`);
		}
	}
}
