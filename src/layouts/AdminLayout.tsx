import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, FileText, PlaySquare, 
  Briefcase, MessageSquare, Mail, LogOut, Users, Sun, Moon,
  Menu, X, ShieldCheck
} from 'lucide-react';
import api from '../api/axios';

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function AdminLayout({ isDark, toggleTheme }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const userRole = localStorage.getItem('user_role');
  const userName = localStorage.getItem('user_name') || 'Muhammad Lutfi Fadilah'; 

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
    
    if (location.pathname === '/admin/profile') document.title = 'Profil Saya | Noctax Studio';
    else if (location.pathname === '/admin') document.title = 'Command Center | Noctax Studio';
    else if (currentMenu) document.title = `${currentMenu.name} | Noctax Studio`;
    else document.title = 'Admin Panel | Noctax Studio';
  }, [location.pathname, menuItems]);

  const handleLogout = async () => {
    try {
      await api.post('/logout'); 
    } catch (error) {
      console.error("Gagal membersihkan cookie di server", error);
    } finally {
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name'); 
      localStorage.removeItem('auth_token'); 
      navigate('/akses-brewok');
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-zinc-50 dark:bg-abyss text-zinc-900 dark:text-zinc-300 font-sans transition-colors duration-300">
      
      {/* OVERLAY MOBILE dengan Animasi Transisi Halus */}
      <div 
        className={`fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* SIDEBAR - Responsif dan Max-Width untuk layar HP kecil */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-72 max-w-[85vw] flex-shrink-0 bg-white dark:bg-abyss-light border-r border-zinc-200 dark:border-white/5 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        <div className="h-20 lg:h-24 flex-shrink-0 flex items-center justify-between lg:justify-center border-b border-zinc-200 dark:border-white/5 px-6">
          <img 
            src="/noctax.svg" 
            alt="Noctax Studio Logo" 
            className="h-10 lg:h-14 w-auto object-contain transition-all dark:invert dark:hue-rotate-180 dark:brightness-110" 
          />
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 -mr-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-xl active:bg-zinc-100 dark:active:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-3">
            <p className="text-[10px] lg:text-xs font-extrabold text-zinc-400 uppercase tracking-wider">Menu Navigasi</p>
          </div>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-xl transition-all ${
                  isActive ? 'bg-techblue/10 text-techblue font-bold shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-techblue' : 'text-zinc-500'}`} />
                <span className="text-sm truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-white/5 flex-shrink-0 bg-zinc-50/80 dark:bg-white/[0.02] backdrop-blur-sm">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 px-2 text-xs font-medium text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="hidden lg:inline">Sistem Terenkripsi & Aman</span>
            <span className="lg:hidden">Koneksi Aman</span>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 lg:gap-3 px-4 py-3 lg:py-3.5 w-full rounded-xl text-white bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-md shadow-red-500/20 transition-all">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative w-full">
        <header className="sticky top-0 z-10 h-20 lg:h-24 flex-shrink-0 border-b border-zinc-200 dark:border-white/5 bg-white/90 dark:bg-abyss/90 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 transition-colors">
          
          <div className="flex items-center gap-3 lg:gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 rounded-xl text-zinc-600 dark:text-zinc-400 active:bg-zinc-100 dark:active:bg-white/10 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-base sm:text-lg lg:text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {location.pathname === '/admin/profile' 
                ? 'Profil Saya' 
                : (menuItems.find(m => m.path === location.pathname)?.name || 'Command Center')}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-6">
            <button onClick={toggleTheme} className="p-2.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 active:bg-zinc-200 dark:active:bg-white/20 transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="w-px h-8 bg-zinc-200 dark:bg-white/10 hidden lg:block"></div>

            <Link to="/admin/profile" className="flex items-center gap-3 group cursor-pointer p-1 lg:p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-techblue transition-colors line-clamp-1 max-w-[150px]">{userName}</p>
                <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">{userRole === 'admin' ? 'System Administrator' : 'Content Team'}</p>
              </div>
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-tr from-techblue to-blue-400 text-white flex items-center justify-center font-bold text-xs lg:text-sm shadow-lg shadow-techblue/30 uppercase group-hover:ring-2 group-hover:ring-techblue/50 group-hover:scale-105 transition-all flex-shrink-0">
                {userName.substring(0, 2)}
              </div>
            </Link>
          </div>
        </header>
        
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
}