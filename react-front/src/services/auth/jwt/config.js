import axios from 'axios';
import { baseURL } from 'config';

export default axios.create({
  // baseURL: `http://g-axon.work/jwtauth/api/`, //YOUR_API_URL HERE
  baseURL: baseURL, //YOUR_API_URL HERE
  headers: {
    'Content-Type': 'application/json',
  },
});
