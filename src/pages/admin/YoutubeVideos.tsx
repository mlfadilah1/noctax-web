import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { YouTubeVideo, PaginatedResponse } from '../../types';
import { Loader2, Plus, Trash2, X, PlaySquare } from 'lucide-react';

export default function YoutubeVideos() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    video_id: '',
    season_number: 1,
    episode_number: 1,
    description: ''
  });

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
      setFormData({ title: '', video_id: '', season_number: 1, episode_number: 1, description: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/admin/youtube-videos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-youtube-videos'] })
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">YouTube Videos</h2>
          <p className="text-sm text-zinc-500">Kelola galeri video konten IT & Gaming Analysis.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-techblue text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-techblue-hover">
          <Plus className="w-5 h-5" /> Tambah Video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-techblue" /></div>
        ) : (
          data?.map((video) => (
            <div key={video.id} className="bg-white dark:bg-abyss-light rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col">
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
                  <div className="flex items-center gap-2 text-xs font-bold text-techblue mb-2">
                    <PlaySquare className="w-4 h-4" /> S{video.season_number} E{video.episode_number}
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-2 line-clamp-2">{video.title}</h3>
                </div>
                <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-white/5 mt-4">
                  <button onClick={() => { if (confirm('Hapus video ini?')) deleteMutation.mutate(video.id); }} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-abyss-light w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-zinc-200 dark:border-white/10 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-white/5">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Tambah Video YouTube</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 dark:text-zinc-300">Judul Video</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white" />
              </div>
              <div>
                <label className="block text-sm mb-1 dark:text-zinc-300">YouTube Video ID (Cth: dQw4w9WgXcQ)</label>
                <input required type="text" value={formData.video_id} onChange={e => setFormData({...formData, video_id: e.target.value})} className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 dark:text-zinc-300">Season Number</label>
                  <input required type="number" min="1" value={formData.season_number} onChange={e => setFormData({...formData, season_number: Number(e.target.value)})} className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm mb-1 dark:text-zinc-300">Episode Number</label>
                  <input required type="number" min="1" value={formData.episode_number} onChange={e => setFormData({...formData, episode_number: Number(e.target.value)})} className="w-full p-2.5 rounded-lg border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white" />
                </div>
              </div>
              <button type="submit" disabled={saveMutation.isPending} className="w-full py-3 bg-techblue text-white rounded-xl font-bold mt-2">
                {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Simpan Video'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}