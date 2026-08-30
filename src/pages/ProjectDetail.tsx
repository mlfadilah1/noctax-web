import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Project } from '../types';
import ReactMarkdown from 'react-markdown';
import { Loader2, ArrowLeft, Code, Globe, Eye, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      
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
        <p className="text-xl text-zinc-600 dark:text-zinc-400">{project.tagline}</p>
      </div>

      <div className="aspect-video w-full rounded-2xl overflow-hidden mb-12 border border-zinc-200 dark:border-white/10 shadow-lg">
        <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Description</h2>
            {/* REACT MARKDOWN DITERAPKAN DI SINI */}
            <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:text-zinc-900 dark:prose-headings:text-white text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <ReactMarkdown>{project.problem_statement}</ReactMarkdown>
            </article>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Fitur Utama</h2>
            <ul className="space-y-3">
              {project.features?.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="w-5 h-5 text-techblue flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-50 dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Teknologi Terpakai</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack?.map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-lg bg-white dark:bg-abyss text-zinc-700 dark:text-zinc-300 text-sm font-mono border border-zinc-200 dark:border-white/5">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {project.demo_link && (
              <a href={project.demo_link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-techblue hover:bg-techblue-hover text-white font-medium transition-all shadow-[0_0_15px_rgba(36,150,237,0.3)]">
                <Globe className="w-5 h-5" /> Live Demo
              </a>
            )}
            {project.github_link && (
              <a href={project.github_link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-900 dark:bg-white/10 dark:hover:bg-white/20 text-white font-medium transition-all">
                <Code className="w-5 h-5" /> Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}