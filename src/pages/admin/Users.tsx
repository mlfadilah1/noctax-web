import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { User, PaginatedResponse } from '../../types';
import { Loader2, Plus, Trash2, X, CheckCircle2, AlertTriangle, Pencil } from 'lucide-react';

export default function Users() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<number | string | null>(null);
  const [editId, setEditId] = useState<number | string | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'petugas' });

  // Fungsi memunculkan notifikasi Toast
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000); // Hilang dalam 3 detik
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get<PaginatedResponse<User>>('/admin/users')).data.data.data
  });

  // Mutasi untuk Tambah dan Edit (Digabung)
  const saveMutation = useMutation({
    mutationFn: async (newData: typeof formData) => {
      if (editId) {
        // Mode Edit: Gunakan PUT
        return await api.put(`/admin/users/${editId}`, newData);
      } else {
        // Mode Tambah: Gunakan POST
        return await api.post('/admin/users', newData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      closeModal();
      showToast(editId ? 'Akun berhasil diperbarui!' : 'Berhasil menambahkan admin baru!');
    },
    onError: (error) => {
      console.error('Gagal menyimpan data:', error);
      alert('Gagal menyimpan data. Pastikan email belum digunakan.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => await api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDeleteModal(null);
      showToast('Akun berhasil dihapus!');
    }
  });

  // Handler untuk membuka modal tambah
  const openAddModal = () => {
    setEditId(null);
    setFormData({ name: '', email: '', password: '', role: 'petugas' });
    setIsModalOpen(true);
  };

  // Handler untuk membuka modal edit
  const openEditModal = (user: User) => {
    setEditId(user.id);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setIsModalOpen(true);
  };

  // Handler untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ name: '', email: '', password: '', role: 'petugas' });
  };

  return (
    <div className="space-y-6 relative">
      
      {/* TOAST NOTIFICATION (POP UP FLOATING) */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">{toastMsg}</span>
        </div>
      )}

      <div className="flex justify-between items-center bg-white dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Data Pengelola</h2>
          <p className="text-sm text-zinc-500">Kelola akses sistem Noctax Studio.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-techblue text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-techblue-hover transition-all">
          <Plus className="w-5 h-5" /> Tambah Akun
        </button>
      </div>

      <div className="bg-white dark:bg-abyss-light rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-techblue" /></div>
        ) : (
          <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
            <thead className="bg-zinc-50 dark:bg-white/5 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {data?.map(user => (
                <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md border text-xs font-bold ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' 
                        : 'bg-techblue/10 text-techblue border-techblue/20'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    {/* Tombol Edit */}
                    <button onClick={() => openEditModal(user)} className="p-2 text-zinc-500 hover:text-techblue hover:bg-techblue/10 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    {/* Tombol Hapus */}
                    <button onClick={() => setDeleteModal(user.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL TAMBAH / EDIT USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-abyss-light w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-white/10 zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-white/5">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                {editId ? 'Edit Pengelola' : 'Tambah Pengelola'}
              </h3>
              <button onClick={closeModal}><X className="w-5 h-5 text-zinc-500 hover:text-red-500" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(formData); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm mb-1 font-medium dark:text-zinc-300">Nama</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none transition-colors" placeholder="Nama lengkap..." />
              </div>
              
              <div>
                <label className="block text-sm mb-1 font-medium dark:text-zinc-300">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none transition-colors" placeholder="email@noctax.studio" />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium dark:text-zinc-300">Role Pengguna</label>
                <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none transition-colors">
                  <option value="petugas">Petugas (Konten & Layanan)</option>
                  <option value="admin">Administrator (Akses Penuh)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium dark:text-zinc-300">
                  Password {editId && <span className="text-zinc-400 font-normal text-xs">(Biarkan kosong jika tidak diubah)</span>}
                </label>
                <input 
                  type="password" 
                  required={!editId} // Wajib diisi jika tambah baru, opsional jika edit
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none transition-colors" 
                  placeholder={editId ? '********' : 'Masukkan password...'} 
                />
              </div>

              <button type="submit" disabled={saveMutation.isPending} className="w-full flex justify-center py-3 mt-4 bg-techblue hover:bg-techblue-hover text-white rounded-xl font-bold transition-all disabled:opacity-50">
                {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (editId ? 'Simpan Perubahan' : 'Simpan Akun')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-abyss-light w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl border border-zinc-200 dark:border-white/10">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Hapus Akun?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Aksi ini tidak dapat dibatalkan. Pengguna tidak akan bisa mengakses sistem lagi.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-white font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">Batal</button>
              <button 
                onClick={() => deleteMutation.mutate(deleteModal)} 
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 flex justify-center bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}