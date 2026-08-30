import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2, Loader2, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import api from '../../../api/axios';
import type { Project } from '../../../types';

// Import Markdown & Math Plugins
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toastMsg, setToastMsg] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', tagline: '', problem_statement: '',
    season: 1, status: 'planning', thumbnail_url: '',
    demo_link: '', github_link: '',
    is_featured: false 
  });

  const [features, setFeatures] = useState<string[]>(['']);
  const [techStack, setTechStack] = useState<string[]>(['']);

  const showToast = (msg: string) => setToastMsg(msg);

  const { isLoading: isFetching } = useQuery({
    queryKey: ['admin-project', id],
    queryFn: async () => {
      const res = await api.get<{success: boolean, data: Project}>(`/admin/projects/${id}`);
      const project = res.data.data;
      
      setFormData({
        title: project.title || '', 
        tagline: project.tagline || '',
        problem_statement: project.problem_statement || '',
        season: project.season || 1, 
        status: project.status || 'planning',
        thumbnail_url: project.thumbnail_url || '',
        demo_link: project.demo_link || '', 
        github_link: project.github_link || '',
        is_featured: Boolean(project.is_featured) 
      });
      
      if (project.features?.length > 0) setFeatures(project.features);
      if (project.tech_stack?.length > 0) setTechStack(project.tech_stack);

      return project;
    }
  });

  const handleArrayChange = (index: number, value: string, type: 'features' | 'tech') => {
    if (type === 'features') {
      const newArr = [...features]; newArr[index] = value; setFeatures(newArr);
    } else {
      const newArr = [...techStack]; newArr[index] = value; setTechStack(newArr);
    }
  };

  const addArrayItem = (type: 'features' | 'tech') => {
    if (type === 'features') setFeatures([...features, '']);
    else setTechStack([...techStack, '']);
  };

  const removeArrayItem = (index: number, type: 'features' | 'tech') => {
    if (type === 'features') setFeatures(features.filter((_, i) => i !== index));
    else setTechStack(techStack.filter((_, i) => i !== index));
  };

  const updateMutation = useMutation({
    mutationFn: async (dataToSubmit: Record<string, unknown>) => await api.put(`/admin/projects/${id}`, dataToSubmit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      showToast('Proyek berhasil diperbarui!');
      setTimeout(() => navigate('/admin/projects'), 1500);
    },
    onError: () => alert('Gagal memperbarui proyek!')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      features: features.filter(f => f.trim() !== ''),
      tech_stack: techStack.filter(t => t.trim() !== '')
    };
    updateMutation.mutate(payload);
  };

  if (isFetching) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-techblue" /></div>;

  return (
    <div className="max-w-6xl space-y-6 relative">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">{toastMsg}</span>
        </div>
      )}

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-techblue font-medium mb-4">
        <ArrowLeft className="w-4 h-4" /> Batal & Kembali
      </button>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-abyss-light p-8 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-lg space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Edit Proyek</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm mb-2 font-bold dark:text-zinc-300">Judul Proyek</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white outline-none focus:ring-2 focus:ring-techblue" />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm mb-2 font-bold dark:text-zinc-300">URL Gambar Thumbnail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-zinc-400" />
              </div>
              <input required type="url" value={formData.thumbnail_url} placeholder="https://github.com/..." onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} className="w-full pl-10 p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white outline-none focus:ring-2 focus:ring-techblue" />
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-2 font-bold dark:text-zinc-300">Tagline Singkat</label>
            <input type="text" value={formData.tagline} placeholder="Sistem e-office responsif..." onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white outline-none focus:ring-2 focus:ring-techblue" />
          </div>

          <div>
            <label className="block text-sm mb-2 font-bold dark:text-zinc-300">Season</label>
            <input required type="number" value={formData.season} min="1" onChange={e => setFormData({...formData, season: Number(e.target.value)})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white outline-none focus:ring-2 focus:ring-techblue" />
          </div>
          <div>
            <label className="block text-sm mb-2 font-bold dark:text-zinc-300">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white outline-none focus:ring-2 focus:ring-techblue">
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="deployed">Deployed</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2 font-bold dark:text-zinc-300">Link Demo (Opsional)</label>
            <input type="url" value={formData.demo_link} placeholder="https://..." onChange={e => setFormData({...formData, demo_link: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white outline-none focus:ring-2 focus:ring-techblue" />
          </div>
          <div>
            <label className="block text-sm mb-2 font-bold dark:text-zinc-300">Link GitHub (Opsional)</label>
            <input type="url" value={formData.github_link} placeholder="https://github.com/..." onChange={e => setFormData({...formData, github_link: e.target.value})} className="w-full p-3 rounded-xl border dark:border-white/10 bg-zinc-50 dark:bg-abyss dark:text-white outline-none focus:ring-2 focus:ring-techblue" />
          </div>

          {/* SPLIT VIEW UNTUK DESKRIPSI PROJECT */}
          <div className="col-span-2 mt-4 border-t dark:border-white/10 pt-6">
            <label className="block text-lg font-bold mb-4 dark:text-white">Deskripsi & Studi Kasus (Markdown)</label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-zinc-50 dark:bg-black/20 p-3 rounded-2xl border border-zinc-200 dark:border-white/5">
              
              <div className="flex flex-col h-[500px]">
                <div className="bg-zinc-200 dark:bg-zinc-800 text-xs font-bold px-4 py-2.5 rounded-t-xl text-zinc-700 dark:text-zinc-300">
                  Input Markdown
                </div>
                <textarea 
                  required
                  value={formData.problem_statement}
                  onChange={e => setFormData({...formData, problem_statement: e.target.value})} 
                  className="w-full flex-1 p-5 border border-t-0 border-zinc-200 dark:border-white/10 rounded-b-xl bg-white dark:bg-abyss dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-techblue resize-none" 
                  placeholder="Tulis Latar Belakang dan Studi Kasus di sini..."
                ></textarea>
              </div>

              <div className="flex flex-col h-[500px]">
                <div className="bg-zinc-200 dark:bg-zinc-800 text-xs font-bold px-4 py-2.5 rounded-t-xl text-zinc-700 dark:text-zinc-300 border-l border-zinc-200 dark:border-white/5">
                  Live Preview
                </div>
                <div className="w-full flex-1 p-6 border border-t-0 border-l border-zinc-200 dark:border-white/10 rounded-b-xl bg-white dark:bg-[#0a0a0a] overflow-y-auto">
                  <article className="prose prose-zinc dark:prose-invert prose-sm max-w-none prose-a:text-techblue">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {formData.problem_statement || '*Pratinjau deskripsi akan muncul di sini...*'}
                    </ReactMarkdown>
                  </article>
                </div>
              </div>

            </div>
          </div>
          
          <div className="col-span-2 flex items-center gap-4 p-5 bg-techblue/5 border border-techblue/20 rounded-xl mt-4">
            <input 
              type="checkbox" 
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
              className="w-5 h-5 accent-techblue cursor-pointer rounded"
            />
            <label htmlFor="is_featured" className="cursor-pointer">
              <div className="font-bold text-zinc-900 dark:text-white">Jadikan Proyek Unggulan (Featured)</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Proyek ini akan ditampilkan di halaman utama (Beranda) portofolio.
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 border border-zinc-200 dark:border-white/10 rounded-2xl bg-zinc-50 dark:bg-black/20">
            <label className="block font-bold mb-3 dark:text-zinc-300">Tech Stack</label>
            {techStack.map((tech, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input type="text" value={tech} placeholder="React Native / Laravel" onChange={(e) => handleArrayChange(index, e.target.value, 'tech')} className="flex-1 p-3 rounded-xl border dark:border-white/10 bg-white dark:bg-abyss dark:text-white outline-none focus:ring-2 focus:ring-techblue" />
                <button type="button" onClick={() => removeArrayItem(index, 'tech')} className="px-4 bg-red-500/10 text-red-500 rounded-xl"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('tech')} className="flex items-center gap-2 text-sm text-techblue font-bold mt-2 hover:underline"><Plus className="w-4 h-4"/> Tambah Teknologi</button>
          </div>

          <div className="p-5 border border-zinc-200 dark:border-white/10 rounded-2xl bg-zinc-50 dark:bg-black/20">
            <label className="block font-bold mb-3 dark:text-zinc-300">Fitur Utama</label>
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input type="text" value={feature} placeholder="Multi-verifier login..." onChange={(e) => handleArrayChange(index, e.target.value, 'features')} className="flex-1 p-3 rounded-xl border dark:border-white/10 bg-white dark:bg-abyss dark:text-white outline-none focus:ring-2 focus:ring-techblue" />
                <button type="button" onClick={() => removeArrayItem(index, 'features')} className="px-4 bg-red-500/10 text-red-500 rounded-xl"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('features')} className="flex items-center gap-2 text-sm text-techblue font-bold mt-2 hover:underline"><Plus className="w-4 h-4"/> Tambah Fitur</button>
          </div>
        </div>

        <button type="submit" disabled={updateMutation.isPending} className="w-full py-4 bg-techblue hover:bg-techblue-hover text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
          {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Simpan Perubahan</>}
        </button>
      </form>
    </div>
  );
}