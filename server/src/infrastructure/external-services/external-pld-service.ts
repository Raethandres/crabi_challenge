import axios, { AxiosResponse } from 'axios';

export class PLDService {
	private baseUrl: string;
	
	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}
	
	async get<T>(endpoint: string, params?: Record<string, any>): Promise<boolean> {
		const url = `${this.baseUrl}${endpoint}`;
		
		try {
			const response: AxiosResponse<T> = await axios.get(url, { params });
			if (response.status === 200) {
				return true;
			}
			if (response.status === 404) {
				return false;
			}
			throw new Error(`Unexpected status code: ${response.status}`);
		} catch (error) {
			if (error.status === 404) {
				return false;
			}
			throw new Error(`API request failed: ${error.message}`);
		}
	}
}
