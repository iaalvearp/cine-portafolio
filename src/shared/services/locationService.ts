import { API_ENDPOINTS, buildUrl } from '@/config/api';
import { apiFetch } from '@/lib/localApi';

export interface City {
    id: string;
    name: string;
}

export interface Cinema {
    id: string;
    name: string;
    cityId: string;
    address: string;
}

export const getCities = async (): Promise<City[]> => {
    try {
        const response = await apiFetch(API_ENDPOINTS.CITIES);
        if (!response.ok) {
            throw new Error('Error fetching cities');
        }
        const data = await response.json();
        return data.map((city: any) => ({
            id: city.id.toString(),
            name: city.name,
        }));
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
};

export const getCinemas = async (cityId?: string): Promise<Cinema[]> => {
    try {
        const response = await apiFetch(buildUrl(API_ENDPOINTS.CINEMAS, cityId ? { city: cityId } : undefined));
        if (!response.ok) {
            throw new Error('Error fetching cinemas');
        }
        const data = await response.json();

        return data.map((cinema: any) => ({
            id: cinema.id.toString(),
            name: cinema.name,
            cityId: cinema.cityId,
            address: cinema.address,
        }));
    } catch (error) {
        console.error('Error fetching cinemas:', error);
        return [];
    }
};
