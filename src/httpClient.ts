import axios from 'axios';
import { config } from './config';

export const httpClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});
