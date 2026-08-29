import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../../api/axios';

export default function ArticleCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toastMsg, setToastMsg] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', category: '', status: 'draft', content: ''
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  const saveMutation = useMutation({
    mutationFn: async (newData: typeof formData) => await api.post('/admin/articles', newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      showToast('Artikel berhasil disimpan!');
      // Beri jeda 1.5 detik agar pop-up terbaca sebelum pindah halaman
      setTimeout(() => navigate('/admin/articles'), 1500);
    },
    onError: () => alert('Gagal menyimpan artikel!')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl space-y-6 relative">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">{toastMsg}</span>
        </div>
      )}

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-techblue font-medium mb-4">
        <ArrowLeft className="w-4 h-4" /> Batal & Kembali
      </button>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-abyss-light p-8 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-lg space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Tulis Artikel Baru</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm mb-2 dark:text-zinc-300">Judul Artikel</label>
            <input required type="text" onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white" />
          </div>
          <div>
            <label className="block text-sm mb-2 dark:text-zinc-300">Kategori</label>
            <input required type="text" onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white" />
          </div>
          <div>
            <label className="block text-sm mb-2 dark:text-zinc-300">Status</label>
            <select onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 dark:text-zinc-300">Konten (Markdown)</label>
          <textarea required rows={12} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-4 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white font-mono text-sm leading-relaxed" placeholder="Tulis catatan DevLog di sini..."></textarea>
        </div>

        <button type="submit" disabled={saveMutation.isPending} className="w-full py-4 bg-techblue hover:bg-techblue-hover text-white rounded-xl font-bold flex items-center justify-center gap-2">
          {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Simpan Artikel</>}
        </button>
      </form>
    </div>
  );
}