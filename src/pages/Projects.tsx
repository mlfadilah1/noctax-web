import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Project } from '../types';
import { Loader2, ArrowRight } from 'lucide-react';

export default function Projects() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['all-projects'],
    queryFn: async () => {
      // FIX EXPRESS: Cukup res.data.data
      const res = await api.get('/projects');
      return res.data.data;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-12 border-b border-zinc-200 dark:border-white/10 pb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
          Portofolio <span className="text-techblue">Proyek</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Kumpulan arsitektur sistem, aplikasi web, dan mobile yang pernah saya bangun menggunakan ekosistem Laravel dan React.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-techblue" /></div>
      )}

      {isError && (
        <div className="text-center py-20 text-red-500 bg-red-50 dark:bg-red-400/10 rounded-xl">
          Gagal mengambil data proyek.
        </div>
      )}

      {!isLoading && !isError && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((project: Project) => (
            <Link to={`/projects/${project.slug}`} key={project.id} className="group flex flex-col bg-white dark:bg-abyss-light border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-techblue dark:hover:border-techblue/50 transition-all hover:-translate-y-2 shadow-sm hover:shadow-lg">
              <div className="aspect-video w-full bg-zinc-200 dark:bg-zinc-900 relative overflow-hidden">
                <img src={project.thumbnail_url} alt={project.title} className="object-cover w-full h-full opacity-90 dark:opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                {project.is_featured && (
                  <span className="absolute top-3 right-3 bg-techblue text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Featured</span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-techblue transition-colors line-clamp-1">{project.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-2 flex-grow">{project.tagline}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack?.slice(0, 3).map((tech: string) => (
                    <span key={tech} className="px-2 py-1 rounded bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 text-xs font-mono border border-zinc-200 dark:border-white/5">
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack?.length > 3 && (
                    <span className="px-2 py-1 rounded bg-zinc-100 dark:bg-white/5 text-zinc-500 text-xs font-mono">+{project.tech_stack.length - 3}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-techblue text-sm font-medium mt-auto group-hover:translate-x-1 transition-transform">
                  Baca Detail <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}