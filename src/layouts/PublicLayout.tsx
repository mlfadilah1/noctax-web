import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Moon, Sun, Mail, Menu, X, ChevronRight } from 'lucide-react';

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function PublicLayout({ isDark, toggleTheme }: Props) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') document.title = 'Beranda | Noctax Studio';
    else if (location.pathname.startsWith('/projects')) document.title = 'Portofolio | Noctax Studio';
    else if (location.pathname.startsWith('/articles')) document.title = 'DevLog | Noctax Studio';
    else if (location.pathname === '/services') document.title = 'Konsultasi IT | Noctax Studio';
    else if (location.pathname === '/contact') document.title = 'Kontak | Noctax Studio';
    
    // 🔥 Peringatan ESLint selesai: setIsMobileMenuOpen(false) di sini SUDAH DIHAPUS.
    // Menu mobile sudah otomatis tertutup berkat onClick di setiap komponen <Link> di bawah.
  }, [location.pathname]);

  // Kunci scroll body saat menu mobile terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-zinc-50 dark:bg-abyss relative">
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-abyss/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-24 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2 group py-2" onClick={() => setIsMobileMenuOpen(false)}>
            <img 
              src="/noctax.svg" 
              alt="Noctax Studio Logo" 
              className="h-9 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300 dark:invert dark:hue-rotate-180 dark:brightness-110" 
            />
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold">
            <Link to="/projects" className={`${location.pathname.startsWith('/projects') ? 'text-techblue' : 'text-zinc-600 dark:text-zinc-400 hover:text-techblue dark:hover:text-techblue'} transition-colors`}>Portofolio</Link>
            <Link to="/articles" className={`${location.pathname.startsWith('/articles') ? 'text-techblue' : 'text-zinc-600 dark:text-zinc-400 hover:text-techblue dark:hover:text-techblue'} transition-colors`}>DevLog</Link>
            <Link to="/services" className={`${location.pathname === '/services' ? 'text-techblue' : 'text-zinc-600 dark:text-zinc-400 hover:text-techblue dark:hover:text-techblue'} transition-colors`}>Konsultasi IT</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link 
              to="/contact" 
              className="px-6 py-2.5 rounded-xl bg-techblue hover:bg-techblue-hover text-white font-bold text-sm transition-all shadow-[0_0_15px_rgba(36,150,237,0.3)] hover:shadow-[0_0_25px_rgba(36,150,237,0.5)] flex items-center gap-2"
            >
              Mulai Kolaborasi <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* TOMBOL TOGGLE MOBILE */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full text-zinc-600 dark:text-zinc-400 active:bg-zinc-200 dark:active:bg-white/10 transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 rounded-xl text-zinc-900 dark:text-white active:bg-zinc-200 dark:active:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MENU MOBILE (FULLSCREEN DROPDOWN) */}
        <div 
          className={`md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-abyss/95 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 shadow-2xl transition-all duration-300 ease-in-out origin-top ${
            isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col p-6 space-y-6">
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/projects" className="flex items-center justify-between font-bold text-xl text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-white/5">
              Portofolio Sistem <ChevronRight className="w-5 h-5 text-zinc-400" />
            </Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/articles" className="flex items-center justify-between font-bold text-xl text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-white/5">
              DevLog & Riset <ChevronRight className="w-5 h-5 text-zinc-400" />
            </Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/services" className="flex items-center justify-between font-bold text-xl text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-white/5">
              Konsultasi IT <ChevronRight className="w-5 h-5 text-zinc-400" />
            </Link>
            
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/contact" className="mt-4 px-6 py-4 rounded-xl bg-techblue flex justify-center items-center gap-2 text-white font-bold text-lg shadow-lg shadow-techblue/30 active:scale-95 transition-transform">
              Hubungi Sekarang <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-200 dark:border-white/10 py-12 md:py-16 mt-16 bg-white dark:bg-abyss-dark transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-10">
          
          <div className="text-center md:text-left max-w-sm">
            <p className="font-extrabold text-zinc-900 dark:text-white text-xl mb-3 flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-techblue animate-pulse shadow-[0_0_8px_rgba(36,150,237,0.8)]"></span>
              Noctax Studio
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 md:mb-4">
              Membangun ekosistem digital yang tangguh melalui rekayasa perangkat lunak tingkat tinggi dan solusi kreatif berbasis arsitektur modern.
            </p>
            <p className="text-zinc-400 dark:text-zinc-600 text-xs font-medium hidden md:block">
              &copy; {new Date().getFullYear()} Muhammad Lutfi Fadilah. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-5 w-full md:w-auto">
            <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Mari Terhubung</p>
            <div className="flex items-center justify-center md:justify-end gap-4 w-full">
              <a href="https://youtube.com/@noctaxstudio" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-3.5 md:p-3 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-red-500 hover:text-white active:scale-95 transition-all shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.instagram.com/noctaxstudio/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-3.5 md:p-3 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-pink-600 hover:text-white active:scale-95 transition-all shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.facebook.com/share/1EhVXbygUp/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-3.5 md:p-3 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white active:scale-95 transition-all shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.587 9 4.75V8z"/></svg>
              </a>
              <a href="mailto:brewok@noctaxstudio.com" aria-label="Email" className="p-3.5 md:p-3 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-techblue hover:text-white active:scale-95 transition-all shadow-sm">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            
            <p className="text-zinc-400 dark:text-zinc-600 text-xs font-medium md:hidden mt-4 text-center">
              &copy; {new Date().getFullYear()} Muhammad Lutfi Fadilah.<br/>All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}