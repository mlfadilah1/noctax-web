import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon } from 'lucide-react'; 
import axios from 'axios'; // Wajib diimport untuk mengecek tipe error
import api from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Akses Masuk | Noctax';
  }, []);

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      
      if (res.data.success) {
        // TOKEN TIDAK LAGI DISIMPAN DI SINI (Sudah diurus otomatis oleh Cookie)
        
        // Hanya menyimpan data tampilan untuk Frontend (UI Hint)
        localStorage.setItem('user_role', res.data.user.role);
        localStorage.setItem('user_name', res.data.user.name); 
        
        navigate('/admin'); 
      }
    } catch (err) {
      // 🔥 PERBAIKAN ESLINT: Tidak lagi menggunakan err: any
      console.error(err);
      if (axios.isAxiosError(err)) {
        // Jika error berasal dari response backend (misal 422 atau 403)
        alert(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Kredensial salah atau akses ditolak!');
      } else {
        // Jika error karena masalah jaringan atau kode frontend
        alert('Terjadi kesalahan pada sistem.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-abyss px-6 transition-colors duration-300 relative">
      
      <button onClick={() => navigate('/')} className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-techblue transition-colors font-medium">
        <ArrowLeft className="w-5 h-5" /> Kembali
      </button>

      <button onClick={toggleTheme} className="absolute top-8 right-8 p-3 rounded-full bg-white dark:bg-abyss-light border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors shadow-sm">
        {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-abyss-light p-8 md:p-10 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl transition-colors">
        
        <div className="flex justify-center mb-10 mt-2">
          <img 
            src="/noctax.svg" 
            alt="Noctax Logo" 
            className="h-28 md:h-32 w-auto object-contain transition-all dark:invert dark:hue-rotate-180 dark:brightness-110" 
          />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-abyss border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-techblue text-zinc-900 dark:text-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-abyss border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-techblue text-zinc-900 dark:text-white transition-colors"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 mt-2 rounded-xl bg-techblue hover:bg-techblue-hover text-white font-bold transition-all shadow-[0_0_15px_rgba(36,150,237,0.3)] disabled:opacity-50">
            {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}