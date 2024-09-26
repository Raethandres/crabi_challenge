import axios, { AxiosResponse } from 'axios';

export class PLDService {
	private baseUrl: string;
	
	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}
	
	async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
		try {
			const url = `${this.baseUrl}${endpoint}`;
			const response: AxiosResponse<T> = await axios.get(url, { params });
			
			return response.data;
		} catch (error) {
			console.error(`Error during GET request to ${endpoint}:`, error);
			throw new Error('API request failed');
		}
	}
}
