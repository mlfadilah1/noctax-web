import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Project, Article, PaginatedResponse } from '../types';
import { 
  Terminal, Loader2, ArrowRight, Calendar, 
  Code2, Database, Wrench, Network, Cpu, Layout,
  Atom, Smartphone, Coffee, Server, GitBranch, Code, Send, MonitorSmartphone,
} from 'lucide-react';

export default function Home() {
  const { data: projects, isLoading: loadProjects } = useQuery({
    queryKey: ['public-projects'],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Project>>('/projects');
      return res.data.data.data.slice(0, 3);
    }
  });

  // Tambahan tipe data fleksibel untuk artikel agar bebas error ESLint
  type ArticleItem = Article & { published_at?: string; createdAt?: string; date?: string };

  const { data: articles, isLoading: loadArticles } = useQuery({
    queryKey: ['public-articles'],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<ArticleItem>>('/articles');
      return res.data.data.data.slice(0, 3);
    }
  });

  // Fungsi perbaikan tanggal tanpa memicu error linter
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
    <div className="flex flex-col gap-32 pb-24">
      
      {/* HERO SECTION */}
      <section className="relative pt-32 px-6 flex flex-col items-center justify-center min-h-[85vh]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-techblue/10 dark:bg-techblue/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-[#141B2D]/50 border border-zinc-200 dark:border-white/10 text-techblue text-sm font-medium mb-8 shadow-sm">
            <Terminal className="w-4 h-4" />
            <span>Robust Architecture & Clean Code</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-6">
            Welcome to <span className="text-techblue">Noctax Studio</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed mb-12">
            Saya adalah seorang Software Engineer yang berfokus pada pengembangan aplikasi <strong>Fullstack (Web & Mobile)</strong>. Berpengalaman dalam merancang arsitektur sistem yang andal, manajemen basis data yang efisien, serta menulis kode yang bersih untuk memecahkan kompleksitas logika bisnis.
          </p>

          {/* SKILL CATEGORIES WITH ICONS */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
            
            <div className="p-5 bg-white dark:bg-abyss-light border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Tech Stack & Development
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-techblue/10 text-techblue rounded-lg text-sm font-medium">
                  <Server className="w-3.5 h-3.5" /> PHP Laravel
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-techblue/10 text-techblue rounded-lg text-sm font-medium">
                  <Atom className="w-3.5 h-3.5" /> React (Web)
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-techblue/10 text-techblue rounded-lg text-sm font-medium">
                  <Smartphone className="w-3.5 h-3.5" /> Kotlin (Android API)
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5 rounded-lg text-sm font-medium">
                  <Coffee className="w-3.5 h-3.5" /> Java Desktop
                </span>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-abyss-light border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Database className="w-4 h-4" /> Database Management
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-techblue/10 text-techblue rounded-lg text-sm font-medium">
                  <Database className="w-3.5 h-3.5" /> MySQL
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-techblue/10 text-techblue rounded-lg text-sm font-medium">
                  <Database className="w-3.5 h-3.5" /> PostgreSQL
                </span>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-abyss-light border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Wrench className="w-4 h-4" /> Tools & Workspace
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/5 rounded-lg text-sm font-medium">
                  <GitBranch className="w-3.5 h-3.5" /> Git
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/5 rounded-lg text-sm font-medium">
                  <Code className="w-3.5 h-3.5" /> VS Code
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/5 rounded-lg text-sm font-medium">
                  <Send className="w-3.5 h-3.5" /> Postman
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/5 rounded-lg text-sm font-medium">
                  <MonitorSmartphone className="w-3.5 h-3.5" /> Android Studio
                </span>
                {/* <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/5 rounded-lg text-sm font-medium">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Ms. Office
                </span> */}
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-abyss-light border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Network className="w-4 h-4" /> System Concept & Logic
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5 rounded-lg text-sm font-medium">
                  <Network className="w-3.5 h-3.5" /> Computer Networking
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5 rounded-lg text-sm font-medium">
                  <Cpu className="w-3.5 h-3.5" /> IoT Architecture
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5 rounded-lg text-sm font-medium">
                  <Layout className="w-3.5 h-3.5" /> UI/UX Fundamentals
                </span>
              </div>
            </div>

          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link to="/contact" className="px-8 py-3.5 bg-techblue hover:bg-techblue-hover text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(36,150,237,0.3)] hover:shadow-[0_0_25px_rgba(36,150,237,0.5)]">
              Hire / Collaborate
            </Link>
            <Link to="/projects" className="px-8 py-3.5 bg-white dark:bg-abyss border border-zinc-200 dark:border-white/10 hover:border-techblue dark:hover:border-techblue text-zinc-900 dark:text-white rounded-xl font-bold transition-all">
              Lihat Portofolio
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: PROFESSIONAL EXPERIENCE (TRACK RECORD) */}
      <section className="max-w-4xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Professional Track Record</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Jejak pengalaman dan kontribusi dalam pengembangan perangkat lunak.</p>
        </div>

        <div className="relative border-l-2 border-zinc-200 dark:border-white/10 ml-3 md:ml-6 space-y-12">
          
          {/* EXPERIENCE 1 */}
          <div className="relative pl-8 md:pl-10">
            <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white dark:bg-abyss border-4 border-techblue shadow-[0_0_10px_rgba(36,150,237,0.5)]"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Freelance Software Developer</h3>
              <span className="inline-block px-3 py-1 bg-techblue/10 text-techblue text-xs font-bold rounded-full w-max">Present</span>
            </div>
            <h4 className="text-md font-medium text-zinc-600 dark:text-zinc-400 mb-3">Independent Professional</h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
              Aktif mengembangkan dan mengeksekusi sistem informasi independen pasca-kelulusan. Portofolio utama mencakup pembuatan aplikasi <em>custom</em> seperti sistem pelaporan <strong>Tim Tanggap Insiden Siber (TTIS)</strong> yang dilengkapi fitur integrasi notifikasi real-time via Email, hingga perancangan modul E-Office persuratan, serta penyediaan solusi algoritma untuk berbagai kebutuhan klien akademis maupun komersial.
            </p>
          </div>

          {/* EXPERIENCE 2 */}
          <div className="relative pl-8 md:pl-10">
            <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-zinc-200 dark:bg-white/20 border-4 border-white dark:border-abyss"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Web Developer Intern</h3>
              <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-xs font-medium border border-zinc-200 dark:border-white/5 rounded-full w-max">Magang</span>
            </div>
            <h4 className="text-md font-medium text-zinc-600 dark:text-zinc-400 mb-3">IDEATHINGS</h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
              Terlibat dalam perancangan dan pengembangan platform berbasis <em>E-Learning</em>. Berkontribusi dalam menyusun alur logika aplikasi (system flow) dan mengimplementasikan fitur-fitur inti sistem pembelajaran.
            </p>
          </div>

          {/* EXPERIENCE 3 */}
          <div className="relative pl-8 md:pl-10">
            <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-zinc-200 dark:bg-white/20 border-4 border-white dark:border-abyss"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Data Management & IT Intern</h3>
              <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-xs font-medium border border-zinc-200 dark:border-white/5 rounded-full w-max">Kerja Praktik</span>
            </div>
            <h4 className="text-md font-medium text-zinc-600 dark:text-zinc-400 mb-3">Bappeda</h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
              Berperan dalam proses digitalisasi dan manajemen rekapitulasi data instansi menggunakan <em>Microsoft Excel</em>. Sebagai implementasi teknis dan luaran Sidang Kerja Praktik, saya merancang dan mendevelop sistem informasi dengan judul <strong>"Rancang Bangun Aplikasi Edukasi dan Konsultasi Stunting Berbasis Web Framework Laravel"</strong>.
            </p>
          </div>

          {/* EXPERIENCE 4 */}
          <div className="relative pl-8 md:pl-10">
            <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-zinc-200 dark:bg-white/20 border-4 border-white dark:border-abyss"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Software Engineering / Academic Projects</h3>
              <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-xs font-medium border border-zinc-200 dark:border-white/5 rounded-full w-max">Akademis</span>
            </div>
            <h4 className="text-md font-medium text-zinc-600 dark:text-zinc-400 mb-3">Proyek Riset Mahasiswa & Tugas Akhir</h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
              Mengembangkan proyek pengembangan platform Stunting versi <em>Mobile Android</em> (Semester 5) serta menyelesaikan Tugas Akhir secara komprehensif dengan judul <strong>"Implementasi Metode Collaborative Filtering Pada Sistem Rekomendasi Aplikasi Reservasi"</strong>.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 1: FEATURED PROJECTS */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex items-end justify-between mb-10 border-b border-zinc-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Featured Projects</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Karya pengembangan sistem dari backend hingga frontend.</p>
          </div>
          <Link to="/projects" className="hidden md:flex items-center gap-2 text-techblue hover:text-techblue-hover font-medium transition-colors">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadProjects ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-techblue" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <Link to={`/projects/${project.slug}`} key={project.id} className="group block bg-white dark:bg-abyss-light border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-techblue dark:hover:border-techblue/50 transition-all hover:-translate-y-2 shadow-sm hover:shadow-lg">
                <div className="aspect-video w-full bg-zinc-200 dark:bg-zinc-900 relative">
                  {project.thumbnail_url ? (
                    <img src={project.thumbnail_url} alt={project.title} className="object-cover w-full h-full opacity-90 dark:opacity-70 group-hover:opacity-100 transition-all" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-techblue transition-colors line-clamp-1">{project.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-2">{project.tagline}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.slice(0, 3).map((tech: string) => (
                      <span key={tech} className="px-2 py-1 rounded bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 text-xs font-mono border border-zinc-200 dark:border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: LATEST ARTICLES (DEVLOG) */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex items-end justify-between mb-10 border-b border-zinc-200 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Catatan DevLog</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Eksplorasi teknologi dan pemecahan masalah.</p>
          </div>
          <Link to="/articles" className="hidden md:flex items-center gap-2 text-techblue hover:text-techblue-hover font-medium transition-colors">
            Baca Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadArticles ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-techblue" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles?.map((article: ArticleItem) => (
              <Link to={`/articles/${article.slug}`} key={article.id} className="block p-6 bg-white dark:bg-abyss-light border border-zinc-200 dark:border-white/10 rounded-2xl hover:border-techblue transition-all hover:-translate-y-1 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-techblue mb-3 font-mono">
                  <Calendar className="w-3 h-3" />
                  
                  {/* CEK GANDA: Memeriksa semua nama key tanggal dengan tipe data aman */}
                  {formatDate(article.published_at || article.created_at || article.createdAt || article.date)}
                  
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3 line-clamp-2">{article.title}</h3>
                <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-xs rounded-full border border-zinc-200 dark:border-white/5">
                  {article.category}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}