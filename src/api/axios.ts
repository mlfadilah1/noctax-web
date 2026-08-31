import axios from 'axios';

// Buat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: 'https://noctax-api.noctaxstudio.workers.dev/api', 
  
  // 🔥 TAMBAHKAN BARIS INI: Wajib agar browser mau mengirim cookie
  withCredentials: true,
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ❌ INTERCEPTOR REQUEST LAMA DIHAPUS 
// (Karena token sekarang otomatis dikirim lewat HttpOnly Cookie oleh browser)

// ✅ INTERCEPTOR RESPONSE TETAP ADA (Untuk menangani token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Hanya bersihkan data tampilan
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
      
      // Paksa kembali ke halaman login jika token cookie sudah mati
      if (window.location.pathname.startsWith('/admin')) {
         window.location.href = '/akses-brewok'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;