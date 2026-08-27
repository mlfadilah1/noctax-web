import { useEffect, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, FileText, PlaySquare, 
  Briefcase, MessageSquare, Mail, LogOut, Users, Sun, Moon
} from 'lucide-react';

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function AdminLayout({ isDark, toggleTheme }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const userRole = localStorage.getItem('user_role');
  const userName = localStorage.getItem('user_name') || 'Tim Kreatif'; 

  // Membungkus menuItems dengan useMemo agar React tidak komplain soal dependensi di useEffect
  // Copywriting disesuaikan dengan tema Content Creator & IT Consultant
  const menuItems = useMemo(() => [
    { name: 'Command Center', path: '/admin', icon: LayoutDashboard },
    ...(userRole === 'admin' ? [{ name: 'Akses & Tim', path: '/admin/users', icon: Users }] : []),
    { name: 'Portofolio IT', path: '/admin/projects', icon: FolderKanban },
    { name: 'DevLog & Skrip', path: '/admin/articles', icon: FileText },
    { name: 'YouTube Studio', path: '/admin/youtube-videos', icon: PlaySquare },
    { name: 'Katalog Layanan', path: '/admin/services', icon: Briefcase },
    { name: 'Request Proyek', path: '/admin/service-requests', icon: MessageSquare },
    { name: 'Feedback Audiens', path: '/admin/messages', icon: Mail },
  ], [userRole]);

  useEffect(() => {
    const currentMenu = menuItems.find(m => location.pathname.startsWith(m.path) && m.path !== '/admin');
    
    // Tambahan penanganan title untuk halaman profile
    if (location.pathname === '/admin/profile') document.title = 'Profil Saya | Noctax Studio';
    else if (location.pathname === '/admin') document.title = 'Command Center | Noctax Studio';
    else if (currentMenu) document.title = `${currentMenu.name} | Noctax Studio`;
    else document.title = 'Admin Panel | Noctax Studio';
  }, [location.pathname, menuItems]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name'); 
    navigate('/akses-brewok');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-zinc-50 dark:bg-abyss text-zinc-900 dark:text-zinc-300 font-sans transition-colors duration-300">
      
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-abyss-light border-r border-zinc-200 dark:border-white/5 flex flex-col h-full z-20">
        
        <div className="h-24 flex-shrink-0 flex items-center justify-center border-b border-zinc-200 dark:border-white/5 px-4 py-4">
          <img 
            src="/noctax.svg" 
            alt="Noctax Studio Logo" 
            className="h-16 w-auto object-contain transition-all dark:invert dark:hue-rotate-180 dark:brightness-110" 
          />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link key={item.name} to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-techblue/10 text-techblue font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-techblue' : 'text-zinc-500'}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-white/5 flex-shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm">Logout / Keluar</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
        <header className="sticky top-0 z-10 h-24 flex-shrink-0 border-b border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-abyss/80 backdrop-blur-md flex items-center justify-between px-8 transition-colors">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            {location.pathname === 'profile' 
              ? 'Profil Saya' 
              : (menuItems.find(m => m.path === location.pathname)?.name || 'Command Center')}
          </h1>
          
          <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className="p-2.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* LINK KE HALAMAN PROFIL */}
            <Link to="/admin/profile" className="flex items-center gap-3 group cursor-pointer p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
              <div className="text-right">
                <p className="text-sm font-bold text-zinc-900 dark:text-white capitalize group-hover:text-techblue transition-colors">{userName}</p>
                <p className="text-xs text-zinc-500 font-medium">{userRole === 'admin' ? 'Administrator' : 'Content Team'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-techblue text-white flex items-center justify-center font-bold shadow-lg shadow-techblue/30 uppercase group-hover:ring-2 group-hover:ring-techblue/50 transition-all">
                {userName.substring(0, 2)}
              </div>
            </Link>

          </div>
        </header>
        
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
}