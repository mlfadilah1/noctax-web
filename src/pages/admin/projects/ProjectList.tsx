import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axios';
import type { Project, PaginatedResponse } from '../../../types';
import { Loader2, Plus, Edit, Trash2, CheckCircle2, AlertTriangle, Star } from 'lucide-react';

export default function ProjectList() {
  const queryClient = useQueryClient();
  const [toastMsg, setToastMsg] = useState('');
  const [deleteModal, setDeleteModal] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Project>>('/admin/projects');
      return res.data.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/admin/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setDeleteModal(null);
      showToast('Proyek berhasil dihapus!');
    }
  });

  return (
    <div className="space-y-6 relative">
      
      {/* TOAST NOTIFIKASI */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">{toastMsg}</span>
        </div>
      )}

      <div className="flex justify-between items-center bg-white dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Portofolio Proyek</h2>
          <p className="text-sm text-zinc-500">Kelola hasil karyamu.</p>
        </div>
        <Link to="/admin/projects/create" className="flex items-center gap-2 bg-techblue text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-techblue-hover transition-all">
          <Plus className="w-5 h-5" /> Tambah Proyek
        </Link>
      </div>

      <div className="bg-white dark:bg-abyss-light rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-techblue" /></div>
        ) : (
          <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
            <thead className="bg-zinc-50 dark:bg-white/5 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4 w-12 text-center">No</th>
                <th className="px-6 py-4">Judul Proyek</th>
                <th className="px-6 py-4">Season</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {data
                // FIX: Pengurutan Ganda (Double Sort) agar Featured benar-benar naik ke posisi 1
                ?.sort((a, b) => Number(b.is_featured || 0) - Number(a.is_featured || 0))
                .map((project, index) => (
                <tr key={project.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-mono text-center text-zinc-400">{index + 1}</td>
                  
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      {project.title}
                      {/* LABEL VISUAL UNTUK FEATURED */}
                      {(Number(project.is_featured) === 1 || project.is_featured === true) && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 text-[10px] uppercase font-extrabold rounded-md">
                          <Star className="w-3 h-3 fill-current" /> Featured
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">Season {project.season}</td>
                  
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-zinc-100 dark:bg-white/5 rounded-md border border-zinc-200 dark:border-white/10 text-xs font-bold">
                      {project.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <Link to={`/admin/projects/edit/${project.id}`} className="p-2 text-zinc-500 hover:text-techblue hover:bg-techblue/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></Link>
                    <button onClick={() => setDeleteModal(project.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL HAPUS */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-abyss-light w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl border border-zinc-200 dark:border-white/10">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle className="w-8 h-8" /></div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Hapus Proyek?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Proyek ini akan dihapus permanen dari portofolio dan website publik.</p>
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