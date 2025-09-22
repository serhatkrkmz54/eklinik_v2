import axios from "axios";
import { getToken } from "./authStorage";

const API_URL = "https://api.apiyonetim.gen.tr/api";

export const fetcher = (key) => {
  if (Array.isArray(key)) {
    const [url, startDate, endDate] = key;
    return api
      .get(url, { params: { startDate, endDate } })
      .then((res) => res.data);
  }
  return api.get(key).then((res) => res.data);
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiPublic = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
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
