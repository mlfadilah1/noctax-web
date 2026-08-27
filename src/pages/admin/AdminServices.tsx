import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { Service, PaginatedResponse } from '../../types';
import { Loader2, Plus, Trash2, Edit, X, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [toastMsg, setToastMsg] = useState('');
  
  // State untuk Modal & Mode Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', starting_price: 0, is_active: true
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => (await api.get<PaginatedResponse<Service>>('/admin/services')).data.data.data
  });

  // Mutasi Dinamis: Jika ada editId pakai PUT, jika tidak pakai POST
  const saveMutation = useMutation({
    mutationFn: async (newData: typeof formData) => {
      if (editId) {
        return await api.put(`/admin/services/${editId}`, newData);
      }
      return await api.post('/admin/services', newData);
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['admin-services'] }); 
      setIsModalOpen(false); 
      showToast(editId ? 'Layanan diperbarui!' : 'Layanan baru ditambahkan!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/admin/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      setDeleteModal(null);
      showToast('Layanan dihapus!');
    }
  });

  // Handler buka modal form
  const openForm = (service?: Service) => {
    if (service) {
      setEditId(service.id);
      setFormData({
        title: service.title, category: service.category, description: service.description,
        starting_price: service.starting_price || 0, is_active: service.is_active
      });
    } else {
      setEditId(null);
      setFormData({ title: '', category: '', description: '', starting_price: 0, is_active: true });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 relative">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">{toastMsg}</span>
        </div>
      )}

      <div className="flex justify-between items-center bg-white dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Katalog Kolaborasi / Layanan</h2>
          <p className="text-sm text-zinc-500">Atur penawaran riset, IT, dan kolaborasi YouTube.</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-2 bg-techblue text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-techblue-hover">
          <Plus className="w-5 h-5" /> Tambah Layanan
        </button>
      </div>

      <div className="bg-white dark:bg-abyss-light rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-techblue" /></div>
        ) : (
          <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
            <thead className="bg-zinc-50 dark:bg-white/5 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Nama Layanan</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Mulai Dari</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {data?.map(service => (
                <tr key={service.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{service.title}</td>
                  <td className="px-6 py-4">{service.category}</td>
                  <td className="px-6 py-4 font-mono text-xs">Rp {service.starting_price?.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    {/* BUTTON EDIT */}
                    <button onClick={() => openForm(service)} className="p-2 text-zinc-500 hover:text-techblue hover:bg-techblue/10 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    {/* BUTTON HAPUS (BUKA MODAL) */}
                    <button onClick={() => setDeleteModal(service.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL FORM TAMBAH/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-abyss-light w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-zinc-200 dark:border-white/10 space-y-4 zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-white/5">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{editId ? 'Edit Layanan' : 'Tambah Layanan'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-zinc-500 hover:text-red-500" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 font-medium dark:text-zinc-300">Nama Penawaran/Layanan</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none" />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium dark:text-zinc-300">Kategori</label>
                <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none" placeholder="Cth: Riset Akademis, Fullstack Web..." />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium dark:text-zinc-300">Estimasi Biaya Awal (Rp)</label>
                <input required type="number" value={formData.starting_price} onChange={e => setFormData({...formData, starting_price: Number(e.target.value)})} className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none" />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium dark:text-zinc-300">Deskripsi Ringkas</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:border-techblue outline-none"></textarea>
              </div>
              <button type="submit" disabled={saveMutation.isPending} className="w-full flex justify-center py-3 bg-techblue hover:bg-techblue-hover text-white rounded-xl font-bold transition-all mt-4">
                {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (editId ? 'Simpan Perubahan' : 'Simpan Layanan')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-abyss-light w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl border border-zinc-200 dark:border-white/10">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle className="w-8 h-8" /></div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Hapus Layanan?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Penawaran ini tidak akan tampil lagi di website publik.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-white font-bold rounded-xl transition-colors">Batal</button>
              <button onClick={() => deleteMutation.mutate(deleteModal)} className="flex-1 py-2.5 flex justify-center bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
                {deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}