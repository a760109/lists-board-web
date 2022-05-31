import axios from 'axios';
import Config from 'config';

const api = axios.create({
  baseURL: Config.apiBaseURL,
  headers: {
    'AUTH0-TOKEN': localStorage.getItem('auth0Token'),
  },
});

export default api;
