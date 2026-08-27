import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { Loader2, CheckCircle2, UserCircle, KeyRound, AlertCircle, Save } from 'lucide-react';
import type { User } from '../../types';

export default function Profile() {
  const queryClient = useQueryClient();
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // State untuk melacak apakah data sudah dimasukkan ke form
  const [syncedUserId, setSyncedUserId] = useState<number | string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    current_password: '', 
    new_password: '' 
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // AMBIL DATA PROFIL DARI BACKEND
  const { data: user, isLoading: loadUser } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      // Kita panggil GET /admin/profile sesuai dengan route baru di Laravel
      const res = await api.get('/admin/profile'); 
      
      // Laravel mengirimkan: { success: true, data: { id: 1, name: "...", ... } }
      // Axios menaruhnya di res.data. Jadi objek usernya ada di res.data.data
      return res.data.data as User;
    }
  });

  // MASUKKAN DATA KE DALAM FORM (Jika user sudah berhasil di-load)
  if (user && user.id && user.id !== syncedUserId) {
    setSyncedUserId(user.id);
    setFormData(prev => ({ 
      ...prev, 
      name: user.name || '', 
      email: user.email || '' 
    }));
  }

  // UPDATE DATA KE BACKEND
  const updateMutation = useMutation({
    mutationFn: async (newData: typeof formData) => {
      // Menembak PUT /admin/profile
      return await api.put('/admin/profile', newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      setErrorMsg('');
      showToast('Profil berhasil diperbarui!');
      setFormData(prev => ({ ...prev, current_password: '', new_password: '' }));
      
      if (formData.name) {
        localStorage.setItem('user_name', formData.name);
      }
    },
    onError: (error: unknown) => {
      console.error('Update Profile Error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err.response?.data?.message || 'Terjadi kesalahan saat memperbarui profil.';
      setErrorMsg(msg);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.new_password && !formData.current_password) {
      setErrorMsg('Masukkan password lama untuk mengonfirmasi perubahan password baru.');
      return;
    }
    if (formData.new_password && formData.new_password.length < 6) {
      setErrorMsg('Password baru minimal 6 karakter.');
      return;
    }

    updateMutation.mutate(formData);
  };

  // JIKA SEDANG LOADING, TAMPILKAN SPINNER
  if (loadUser) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-techblue" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6 relative">
      
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">{toastMsg}</span>
        </div>
      )}

      <div className="bg-white dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-techblue/10 rounded-full flex items-center justify-center text-techblue">
          <UserCircle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Profil Saya</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Kelola informasi akun dan amankan kredensial Anda. 
            <span className="ml-2 inline-block px-2 py-0.5 bg-zinc-100 dark:bg-white/5 text-xs font-bold rounded-md uppercase">
              {/* Jika data user berhasil ditarik, ini akan menampilkan ADMIN/PETUGAS, bukan default PENGGUNA */}
              {user?.role || 'PENGGUNA'}
            </span>
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-abyss-light rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
        
        <div className="p-6 md:p-8 space-y-6 border-b border-zinc-200 dark:border-white/5">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-techblue" /> Informasi Dasar
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2 font-medium text-zinc-700 dark:text-zinc-300">Nama Lengkap</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium text-zinc-700 dark:text-zinc-300">Alamat Email</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none transition-colors" />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-techblue" /> Ubah Password
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 -mt-4 mb-4">Biarkan kosong jika Anda tidak ingin mengubah password.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2 font-medium text-zinc-700 dark:text-zinc-300">Password Lama</label>
              <input type="password" value={formData.current_password} onChange={e => setFormData({...formData, current_password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none transition-colors" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium text-zinc-700 dark:text-zinc-300">Password Baru</label>
              <input type="password" value={formData.new_password} onChange={e => setFormData({...formData, new_password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none transition-colors" placeholder="Minimal 6 karakter..." />
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-200 dark:border-white/5 flex justify-end">
          <button type="submit" disabled={updateMutation.isPending} className="flex items-center gap-2 bg-techblue hover:bg-techblue-hover text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50">
            {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
            Simpan Perubahan
          </button>
        </div>

      </form>
    </div>
  );
}