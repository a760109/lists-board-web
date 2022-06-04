import axios from 'axios';
import Config from 'config';

const api = axios.create({
  baseURL: Config.apiBaseURL,
});

export function setupAPIMiddlware(auth0Token) {
  api.interceptors.request.use(config => {
    config.headers['AUTH0-TOKEN'] = auth0Token;
    return config;
  });
}

export default api;
