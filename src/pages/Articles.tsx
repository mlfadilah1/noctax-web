import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Article } from '../types';
import { Loader2, Calendar, Eye } from 'lucide-react';

// Ekstensi tipe sementara untuk memastikan TypeScript mengenali published_at 
// meskipun belum didaftarkan di file types.ts milikmu
type ArticleItem = Article & { published_at?: string };

export default function Articles() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['all-articles'],
    queryFn: async () => {
      // Beri tahu TypeScript bahwa struktur JSON Express adalah { success, data: Array }
      const res = await api.get<{ success: boolean; data: ArticleItem[] }>('/articles');
      
      // res.data = bawaan Axios
      // .data = isi array artikel kita
      return res.data.data; 
    }
  });

  // FUNGSI TANGGAL YANG AMAN: Mengganti 'any' dengan tipe data yang spesifik
  const formatDate = (dateValue: string | null | undefined) => {
    if (!dateValue) return 'Baru ditambahkan'; 
    try {
      const safeDateStr = String(dateValue).replace(' ', 'T');
      const d = new Date(safeDateStr);
      if (isNaN(d.getTime())) return String(dateValue).split(' ')[0]; 
      
      return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch { 
      return String(dateValue);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-12 border-b border-zinc-200 dark:border-white/10 pb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          Catatan <span className="text-techblue">DevLog</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Eksplorasi teknologi, penyelesaian bug, dan proses di balik layar pengembangan sistem Noctax Studio.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-techblue" /></div>
      )}
      
      {isError && (
        <div className="text-center py-20 text-red-500 bg-red-50 dark:bg-red-400/10 rounded-xl">
          Gagal mengambil data artikel.
        </div>
      )}

      {!isLoading && !isError && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* MENGGANTI 'any' DENGAN 'ArticleItem' */}
          {data.map((article: ArticleItem) => (
            <Link to={`/articles/${article.slug}`} key={article.id} className="flex flex-col p-6 bg-white dark:bg-abyss-light border border-zinc-200 dark:border-white/10 rounded-2xl hover:border-techblue dark:hover:border-techblue/50 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md group">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 bg-techblue/10 text-techblue text-xs font-bold rounded-full border border-techblue/20">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  <Eye className="w-3 h-3" /> {article.views_count}
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 line-clamp-2 group-hover:text-techblue transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-auto pt-4 border-t border-zinc-100 dark:border-white/5">
                <Calendar className="w-4 h-4" />
                {/* Membaca published_at (atau cadangannya created_at) dengan fungsi format yang aman */}
                {formatDate(article.published_at || article.created_at)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}