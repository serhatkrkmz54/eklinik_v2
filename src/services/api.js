import axios from 'axios';
import { getToken } from './authStorage';

const API_URL = 'http://192.168.1.33:8080/api';

export const fetcher = (key) => {
    // Eğer key bir dizi ise (slots isteği gibi), onu ayrıştır.
    if (Array.isArray(key)) {
        const [url, startDate, endDate] = key;
        return api.get(url, { params: { startDate, endDate } }).then(res => res.data);
    }
    // Eğer key normal bir string ise (doktor detayı gibi), doğrudan istek at.
    return api.get(key).then(res => res.data);
};

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
