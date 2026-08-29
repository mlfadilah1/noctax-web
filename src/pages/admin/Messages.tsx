import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import type { Message, PaginatedResponse } from '../../types';
import { Loader2, Mail, Trash2, CheckCircle2 } from 'lucide-react';

export default function Messages() {
  const queryClient = useQueryClient();
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Message>>('/admin/messages');
      return res.data.data.data;
    }
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => await api.patch(`/admin/messages/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      showToast('Pesan ditandai sudah dibaca!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/admin/messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      showToast('Pesan berhasil dihapus!');
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

      <div className="bg-white dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Inbox Pesan Kontak</h2>
        <p className="text-sm text-zinc-500">Pesan langsung dari pengunjung web Noctax.</p>
      </div>

      <div className="bg-white dark:bg-abyss-light rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-techblue" /></div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-white/5">
            {data?.map((msg) => (
              <div key={msg.id} className={`p-6 flex flex-col md:flex-row justify-between gap-6 ${!msg.is_read ? 'bg-techblue/5' : ''}`}>
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-3">
                    <Mail className={`w-5 h-5 ${!msg.is_read ? 'text-techblue' : 'text-zinc-400'}`} />
                    <span className="font-bold text-lg text-zinc-900 dark:text-white">{msg.subject}</span>
                    {!msg.is_read && (
                      <span className="px-2 py-0.5 bg-techblue text-white rounded text-xs font-bold">Baru</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pl-8">{msg.message}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 pt-2 pl-8 font-mono">
                    <span>Pengirim: <strong>{msg.sender_name}</strong></span>
                    <span>Kontak: <strong>{msg.sender_contact}</strong></span>
                    <span>Dikirim: {new Date(msg.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  {!msg.is_read && (
                    <button onClick={() => markReadMutation.mutate(msg.id)} className="p-2 text-techblue hover:bg-techblue/10 rounded-lg text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Tandai Dibaca
                    </button>
                  )}
                  <button onClick={() => { if (confirm('Hapus pesan?')) deleteMutation.mutate(msg.id); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {data?.length === 0 && (
              <div className="p-12 text-center text-zinc-500">Inbox pesan kosong.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}