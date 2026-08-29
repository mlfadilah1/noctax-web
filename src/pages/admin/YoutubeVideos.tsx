import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { YouTubeVideo, PaginatedResponse } from '../../types';
import { Loader2, Plus, Trash2, X, PlaySquare, CheckCircle2 } from 'lucide-react';

export default function YoutubeVideos() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    video_id: '',
    season_number: 1,
    episode_number: 1,
    description: ''
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-youtube-videos'],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<YouTubeVideo>>('/admin/youtube-videos');
      return res.data.data.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (newData: typeof formData) => await api.post('/admin/youtube-videos', newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-youtube-videos'] });
      setIsModalOpen(false);
      showToast('Video berhasil ditambahkan!');
      setFormData({ title: '', video_id: '', season_number: 1, episode_number: 1, description: '' });
    },
    onError: () => alert('Gagal menyimpan video.')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/admin/youtube-videos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-youtube-videos'] });
      showToast('Video berhasil dihapus!');
    }
  });

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
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">YouTube Videos</h2>
          <p className="text-sm text-zinc-500">Kelola galeri video konten IT & Gaming Analysis.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-techblue text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-techblue-hover transition-colors">
          <Plus className="w-5 h-5" /> Tambah Video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-techblue" /></div>
        ) : data?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500">Belum ada video yang ditambahkan.</div>
        ) : (
          data?.map((video) => (
            <div key={video.id} className="bg-white dark:bg-abyss-light rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col hover:border-techblue/30 transition-colors">
              <div className="aspect-video w-full bg-black relative">
                <iframe 
                  src={`https://www.youtube.com/embed/${video.video_id}`} 
                  title={video.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-techblue mb-2 bg-techblue/10 w-fit px-2.5 py-1 rounded-md">
                    <PlaySquare className="w-4 h-4" /> Season {video.season_number} • Ep {video.episode_number}
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-1 line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4">
                    {video.description || 'Tidak ada deskripsi.'}
                  </p>
                </div>
                <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-white/5">
                  <button 
                    onClick={() => { if (window.confirm('Yakin ingin menghapus video ini?')) deleteMutation.mutate(video.id); }} 
                    className="text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-abyss-light w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-zinc-200 dark:border-white/10 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-white/5">
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Tambah Video YouTube</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-5">
              <div>
                <label className="block text-sm mb-1.5 font-medium dark:text-zinc-300">Judul Video</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:ring-2 focus:ring-techblue outline-none transition-all" placeholder="Analisis Taktik Futsal..." />
              </div>
              
              <div>
                <label className="block text-sm mb-1.5 font-medium dark:text-zinc-300">YouTube Video ID</label>
                <input required type="text" value={formData.video_id} onChange={e => setFormData({...formData, video_id: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:ring-2 focus:ring-techblue outline-none transition-all" placeholder="Cth: dQw4w9WgXcQ" />
                <p className="text-xs text-zinc-500 mt-1.5">Ambil kombinasi huruf/angka setelah "v=" pada URL YouTube.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1.5 font-medium dark:text-zinc-300">Season</label>
                  <input required type="number" min="1" value={formData.season_number} onChange={e => setFormData({...formData, season_number: Number(e.target.value)})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:ring-2 focus:ring-techblue outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 font-medium dark:text-zinc-300">Episode</label>
                  <input required type="number" min="1" value={formData.episode_number} onChange={e => setFormData({...formData, episode_number: Number(e.target.value)})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:ring-2 focus:ring-techblue outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1.5 font-medium dark:text-zinc-300">Deskripsi Singkat (Opsional)</label>
                <textarea 
                  rows={3} 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white focus:ring-2 focus:ring-techblue outline-none transition-all resize-none" 
                  placeholder="Ceritakan sedikit tentang video ini..." 
                />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={saveMutation.isPending} className="w-full py-3.5 bg-techblue hover:bg-techblue-hover text-white rounded-xl font-bold transition-colors flex items-center justify-center">
                  {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}