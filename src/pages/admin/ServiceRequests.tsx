import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { ServiceRequest, PaginatedResponse } from '../../types';
import { Loader2, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ServiceRequests() {
  const queryClient = useQueryClient();
  const [toastMsg, setToastMsg] = useState('');
  const [deleteModal, setDeleteModal] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-service-requests'],
    queryFn: async () => (await api.get<PaginatedResponse<ServiceRequest>>('/admin/service-requests')).data.data.data
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => await api.patch(`/admin/service-requests/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-requests'] });
      showToast('Status request berhasil diperbarui!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/admin/service-requests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-requests'] });
      setDeleteModal(null);
      showToast('Request berhasil dihapus!');
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

      <div className="bg-white dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Proposal & Request Kolaborasi</h2>
          <p className="text-sm text-zinc-500">Daftar klien yang mengajukan proyek IT atau kolaborasi konten.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-abyss-light rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-techblue" /></div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-white/5">
            {data?.map((req) => (
              <div key={req.id} className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start hover:bg-zinc-50 dark:hover:bg-white/[0.02]">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-zinc-900 dark:text-white">{req.project_title}</span>
                    <span className="text-xs px-2.5 py-1 bg-techblue/10 text-techblue rounded-full border border-techblue/20 font-bold">
                      {req.budget_range || 'Budget N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{req.description}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 pt-2 font-mono">
                    <span>Pengaju: <strong>{req.client_name}</strong></span>
                    <span>Kontak: <strong>{req.client_contact}</strong></span>
                    <span>Masuk: {new Date(req.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    value={req.status} 
                    onChange={(e) => updateStatusMutation.mutate({ id: req.id, status: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-abyss border border-zinc-200 dark:border-white/10 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-techblue"
                  >
                    <option value="pending">Tahap: Menunggu (Pending)</option>
                    <option value="reviewed">Tahap: Direview</option>
                    <option value="accepted">Tahap: Disetujui / Deal</option>
                    <option value="completed">Tahap: Selesai</option>
                    <option value="rejected">Tahap: Ditolak</option>
                  </select>
                  
                  {/* TOMBOL HAPUS */}
                  <button onClick={() => setDeleteModal(req.id)} className="p-2 ml-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {data?.length === 0 && (
              <div className="p-12 text-center text-zinc-500 font-medium">Belum ada request kolaborasi masuk.</div>
            )}
          </div>
        )}
      </div>

      {/* MODAL HAPUS REQUEST */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-abyss-light w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl border border-zinc-200 dark:border-white/10">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle className="w-8 h-8" /></div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Hapus Request/Proposal?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Data kontak dan proposal klien akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-white font-bold rounded-xl transition-colors">Batal</button>
              <button onClick={() => deleteMutation.mutate(deleteModal)} className="flex-1 py-2.5 flex justify-center bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
                {deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Hapus Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}