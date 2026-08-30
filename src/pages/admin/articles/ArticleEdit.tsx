import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Loader2, CheckCircle2, Eye, Edit3 } from 'lucide-react';
import api from '../../../api/axios';
import type { Article } from '../../../types';
import ReactMarkdown from 'react-markdown';

export default function ArticleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toastMsg, setToastMsg] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', category: '', status: 'draft', content: '', published_at: ''
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  const { isLoading: isFetching } = useQuery({
    queryKey: ['admin-article', id],
    queryFn: async () => {
      const res = await api.get<{success: boolean, data: Article}>(`/admin/articles/${id}`);
      const article = res.data.data;
      
      const formattedDate = article.published_at 
        ? new Date(article.published_at).toISOString().split('T')[0] 
        : '';

      setFormData({
        title: article.title, 
        category: article.category,
        status: article.status, 
        content: article.content,
        published_at: formattedDate
      });
      return article;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (dataToSubmit: typeof formData) => await api.put(`/admin/articles/${id}`, dataToSubmit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      showToast('Artikel berhasil diperbarui!');
      setTimeout(() => navigate('/admin/articles'), 1500);
    },
    onError: () => alert('Gagal memperbarui artikel!')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isFetching) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-techblue" /></div>;

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
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Edit Artikel</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label className="block text-sm mb-2 dark:text-zinc-300">Judul Artikel</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white" />
          </div>
          <div>
            <label className="block text-sm mb-2 dark:text-zinc-300">Kategori</label>
            <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white" />
          </div>
          <div>
            <label className="block text-sm mb-2 dark:text-zinc-300">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2 dark:text-zinc-300">Tanggal Publish</label>
            <input 
              type="date" 
              value={formData.published_at}
              onChange={e => setFormData({...formData, published_at: e.target.value})} 
              className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white" 
            />
            <p className="text-[10px] text-zinc-500 mt-1">*Kosongkan untuk otomatis hari ini</p>
          </div>
        </div>

        {/* FITUR PREVIEW UNTUK KONTEN ARTIKEL */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm dark:text-zinc-300">Konten (Markdown)</label>
            <button 
              type="button" 
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 hover:text-techblue transition-colors"
            >
              {isPreview ? <><Edit3 className="w-4 h-4" /> Mode Edit</> : <><Eye className="w-4 h-4" /> Pratinjau</>}
            </button>
          </div>
          {isPreview ? (
            <div className="w-full p-6 rounded-xl border dark:border-white/10 bg-white dark:bg-[#0a0a0a] min-h-[300px]">
              <article className="prose prose-zinc dark:prose-invert max-w-none">
                <ReactMarkdown>{formData.content || '*Belum ada konten...*'}</ReactMarkdown>
              </article>
            </div>
          ) : (
            <textarea required rows={15} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-4 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white font-mono text-sm leading-relaxed"></textarea>
          )}
        </div>

        <button type="submit" disabled={updateMutation.isPending} className="w-full py-4 bg-techblue hover:bg-techblue-hover text-white rounded-xl font-bold flex items-center justify-center gap-2">
          {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Simpan Perubahan</>}
        </button>
      </form>
    </div>
  );
}