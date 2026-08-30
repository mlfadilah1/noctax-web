import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Project } from '../types';
import { Loader2, ArrowLeft, Code, Globe, Eye, CheckCircle2 } from 'lucide-react';

// Import Markdown & Math Plugins
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function ProjectDetail() {
  const { slug } = useParams(); 

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const res = await api.get<{success: boolean, data: Project}>(`/projects/${slug}`);
      return res.data.data;
    }
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-techblue" /></div>;
  if (isError || !project) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Proyek tidak ditemukan.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      
      <Link to="/projects" className="inline-flex items-center gap-2 text-zinc-500 hover:text-techblue transition-colors mb-8 font-medium">
        <ArrowLeft className="w-5 h-5" /> Kembali ke Portofolio
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-techblue/10 text-techblue rounded-full text-xs font-bold border border-techblue/20">
            Season {project.season}
          </span>
          <span className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
            <Eye className="w-4 h-4" /> {project.views_count}x dilihat
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">{project.title}</h1>
        {project.tagline && (
          <p className="text-xl text-zinc-600 dark:text-zinc-400">{project.tagline}</p>
        )}
      </div>

      <div className="aspect-video w-full rounded-2xl overflow-hidden mb-12 border border-zinc-200 dark:border-white/10 shadow-lg">
        <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 border-b border-zinc-200 dark:border-white/10 pb-3">Studi Kasus & Tantangan</h2>
            <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:text-zinc-900 dark:prose-headings:text-white text-zinc-600 dark:text-zinc-300 leading-relaxed prose-a:text-techblue hover:prose-a:text-techblue-hover">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {project.problem_statement}
              </ReactMarkdown>
            </article>
          </section>

          {project.features && project.features.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 border-b border-zinc-200 dark:border-white/10 pb-3">Fitur Utama</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-zinc-50 dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/5 text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-techblue flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="space-y-8 lg:sticky lg:top-24 h-fit">
          <div className="bg-zinc-50 dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Teknologi Terpakai</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack?.map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-lg bg-white dark:bg-abyss text-zinc-700 dark:text-zinc-300 text-sm font-mono font-semibold border border-zinc-200 dark:border-white/5 shadow-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {project.demo_link && (
              <a href={project.demo_link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-techblue hover:bg-techblue-hover text-white font-bold transition-all shadow-[0_0_20px_rgba(36,150,237,0.2)] hover:shadow-[0_0_25px_rgba(36,150,237,0.4)]">
                <Globe className="w-5 h-5" /> Live Demo
              </a>
            )}
            {project.github_link && (
              <a href={project.github_link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-zinc-800 hover:bg-zinc-900 dark:bg-white/10 dark:hover:bg-white/20 text-white font-bold transition-all border border-transparent dark:border-white/5">
                <Code className="w-5 h-5" /> Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}