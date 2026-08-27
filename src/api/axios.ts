import axios from 'axios';

// Buat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: 'https://noctax-api.vercel.app/api', // Sesuaikan dengan port backend Laravel kamu
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor untuk menyisipkan Bearer Token secara otomatis (jika user login)
api.interceptors.request.use(
  (config) => {
    // Kita simpan token di localStorage nanti saat proses login
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor opsional: Jika token expired (401), otomatis arahkan ke halaman login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      // window.location.href = '/login'; // Buka komentar ini nanti setelah routing siap
    }
    return Promise.reject(error);
  }
);

export default api;