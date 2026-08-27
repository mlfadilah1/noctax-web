import { useQuery } from '@tanstack/react-query';
import { 
  Terminal, FolderKanban, FileText, TrendingUp, 
  Briefcase, MessageSquare, Loader2, AlertCircle, Eye, Star, PlaySquare 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import api from '../../api/axios';
import type { PaginatedResponse, Project, Article, ServiceRequest, Message, YouTubeVideo } from '../../types';

export default function Dashboard() {
  const userName = localStorage.getItem('user_name') || 'Admin';

  const { data: projects, isLoading: loadProjects, isError: errProjects } = useQuery({
    queryKey: ['admin-projects-stats'],
    queryFn: async () => (await api.get<PaginatedResponse<Project>>('/admin/projects')).data.data.data
  });

  const { data: articles, isLoading: loadArticles, isError: errArticles } = useQuery({
    queryKey: ['admin-articles-stats'],
    queryFn: async () => (await api.get<PaginatedResponse<Article>>('/admin/articles')).data.data.data
  });

  const { data: requests, isLoading: loadRequests, isError: errRequests } = useQuery({
    queryKey: ['admin-requests-stats'],
    queryFn: async () => (await api.get<PaginatedResponse<ServiceRequest>>('/admin/service-requests')).data.data.data
  });

  const { data: messages, isLoading: loadMessages, isError: errMessages } = useQuery({
    queryKey: ['admin-messages-stats'],
    queryFn: async () => (await api.get<PaginatedResponse<Message>>('/admin/messages')).data.data.data
  });

  const { data: videos, isLoading: loadVideos, isError: errVideos } = useQuery({
    queryKey: ['admin-videos-stats'],
    queryFn: async () => (await api.get<PaginatedResponse<YouTubeVideo>>('/admin/youtube-videos')).data.data.data
  });

  const isLoading = loadProjects || loadArticles || loadRequests || loadMessages || loadVideos;
  const isError = errProjects || errArticles || errRequests || errMessages || errVideos;

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-techblue" /></div>;
  if (isError) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-red-500 gap-2">
      <AlertCircle className="w-10 h-10" />
      <p className="font-bold">Gagal sinkronisasi data server Noctax Studio.</p>
    </div>
  );

  // KARTU STATISTIK (DITAMBAH YOUTUBE)
  const statsConfig = [
    { label: 'Video YouTube', value: videos?.length || 0, icon: PlaySquare, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Portofolio IT', value: projects?.length || 0, icon: FolderKanban, color: 'text-techblue', bg: 'bg-techblue/10' },
    { label: 'Artikel DevLog', value: articles?.length || 0, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Req. Kolaborasi', value: requests?.length || 0, icon: Briefcase, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Feedback Masuk', value: messages?.length || 0, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  const activityTrend = [];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthIndex = d.getMonth();
    const year = d.getFullYear();

    const pesananBulanIni = requests?.filter(req => {
      if (!req.created_at) return false;
      const reqDate = new Date(req.created_at);
      return reqDate.getMonth() === monthIndex && reqDate.getFullYear() === year;
    }).length || 0;

    activityTrend.push({ name: monthNames[monthIndex], pesanan: pesananBulanIni });
  }

  const statusCounts = requests?.reduce((acc: Record<string, number>, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {});

  const requestStatusData = [
    { name: 'Review', total: statusCounts?.pending || 0 },
    { name: 'Diskusi', total: statusCounts?.reviewed || 0 },
    { name: 'Deal', total: statusCounts?.accepted || 0 },
    { name: 'Selesai', total: statusCounts?.completed || 0 },
  ];

  const topArticles = articles ? [...articles].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 4) : [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="relative overflow-hidden bg-white dark:bg-abyss-light p-8 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-lg flex items-center justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-techblue/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 tracking-tight">
            Welcome to command center, <span className="text-techblue capitalize">{userName}</span>.
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Pusat manajemen konten Noctax Studio, analitik IT, dan manajemen proyek klien.
          </p>
        </div>
        <Terminal className="w-16 h-16 text-techblue opacity-20 hidden md:block relative z-10" />
      </div>

      {/* GRID DIUBAH AGAR 5 KARTU TAMPIL RAPI (Responsive) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statsConfig.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-abyss-light p-5 rounded-2xl border border-zinc-200 dark:border-white/10 flex items-center gap-4 hover:-translate-y-1 transition-transform shadow-sm">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-techblue" /> Tren Kolaborasi & Proyek (6 Bulan)
          </h3>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPesanan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2496ED" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2496ED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.15} vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#141B2D', borderColor: '#2496ED', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="pesanan" name="Total Masuk" stroke="#2496ED" strokeWidth={3} fillOpacity={1} fill="url(#colorPesanan)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-green-500" /> Pipeline Proyek Aktif
          </h3>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.2} vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#141B2D', borderColor: '#22c55e', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="total" name="Jumlah" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-abyss-light p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> DevLog Paling Populer
          </h3>
          <div className="flex-1">
            {topArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topArticles.map((article, index) => (
                  <div key={article.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-abyss/50 hover:border-techblue/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 
                        index === 1 ? 'bg-zinc-300/30 text-zinc-500 dark:text-zinc-400' : 
                        index === 2 ? 'bg-orange-600/20 text-orange-600 dark:text-orange-400' : 
                        'bg-zinc-100 dark:bg-white/5 text-zinc-400'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white line-clamp-1 text-sm">{article.title}</h4>
                        <span className="text-xs text-zinc-500">{article.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-techblue font-bold text-sm bg-techblue/10 px-3 py-1.5 rounded-lg">
                      <Eye className="w-4 h-4" /> {article.views_count || 0}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-zinc-500 py-10">
                <Eye className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Belum ada artikel yang dipublikasikan.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}