import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Article } from '../types';
import ReactMarkdown from 'react-markdown';
import { Loader2, ArrowLeft, Calendar, Eye, Hash } from 'lucide-react';

export default function ArticleDetail() {
  const { slug } = useParams();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const res = await api.get<{success: boolean, data: Article}>(`/articles/${slug}`);
      return res.data.data;
    }
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-techblue" /></div>;
  if (isError || !article) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Artikel tidak ditemukan.</div>;

  const rawDate = article.published_at || article.created_at;
  const displayDate = rawDate 
    ? new Date(rawDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Tanggal tidak tersedia';

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      
      <Link to="/articles" className="inline-flex items-center gap-2 text-zinc-500 hover:text-techblue transition-colors mb-8 font-medium">
        <ArrowLeft className="w-5 h-5" /> Kembali ke DevLog
      </Link>

      <div className="mb-12">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="flex items-center gap-1 px-3 py-1 bg-techblue/10 text-techblue rounded-full text-xs font-bold border border-techblue/20">
            <Hash className="w-3 h-3" /> {article.category}
          </span>
          <span className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
            <Calendar className="w-4 h-4" /> {displayDate}
          </span>
          <span className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
            <Eye className="w-4 h-4" /> {article.views_count || 0}x dibaca
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-8 leading-tight">
          {article.title}
        </h1>
      </div>

      {/* REACT MARKDOWN DITERAPKAN DI SINI */}
      <article className="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:text-zinc-900 dark:prose-headings:text-white prose-a:text-techblue hover:prose-a:text-techblue-hover">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </article>

    </div>
  );
}