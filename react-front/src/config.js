import axios from 'axios';

// const baseURL = 'http://143.198.155.85/api/'; // live server
// const mediaURL = 'http://143.198.155.85/';

// const baseURL = 'https://10.10.13.230:5000/api/';
// const mediaURL = 'https://10.10.13.230:5000/';
const baseURL = 'https://127.0.0.1:8000/api/';
const mediaURL = 'https://127.0.0.1:8000/';

const $http = axios.create({
  baseURL,
});

$http.interceptors.request.use(request => {
  if (localStorage.getItem('token')) {
    request.headers = {
      'Content-Type': 'application/json; multipart/form-data',
      Authorization: localStorage.getItem('token'),
    };
  }
  request.mode = 'cors';
  return request;
});

export { baseURL, $http, mediaURL };
