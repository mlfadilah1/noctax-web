import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Moon, Sun, Mail } from 'lucide-react';

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function PublicLayout({ isDark, toggleTheme }: Props) {
  const location = useLocation();

  useEffect(() => {
    // Menyelaraskan nama website publik menjadi Noctax Studio
    if (location.pathname === '/') document.title = 'Beranda | Noctax Studio';
    else if (location.pathname.startsWith('/projects')) document.title = 'Portofolio | Noctax Studio';
    else if (location.pathname.startsWith('/articles')) document.title = 'DevLog | Noctax Studio';
    else if (location.pathname === '/services') document.title = 'Konsultasi IT | Noctax Studio';
    else if (location.pathname === '/contact') document.title = 'Kontak | Noctax Studio';
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-zinc-50 dark:bg-abyss">
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-abyss/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2 group py-2">
            <img 
              src="/noctax.svg" 
              alt="Noctax Studio Logo" 
              className="h-14 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300 dark:invert dark:hue-rotate-180 dark:brightness-110" 
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/projects" className="text-zinc-600 dark:text-zinc-400 hover:text-techblue dark:hover:text-techblue transition-colors">Portofolio</Link>
            <Link to="/articles" className="text-zinc-600 dark:text-zinc-400 hover:text-techblue dark:hover:text-techblue transition-colors">DevLog</Link>
            {/* Mengubah 'Layanan' menjadi 'Konsultasi IT' agar lebih elegan */}
            <Link to="/services" className="text-zinc-600 dark:text-zinc-400 hover:text-techblue dark:hover:text-techblue transition-colors">Konsultasi IT</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {/* Mengubah 'Hire Me' menjadi CTA yang lebih profesional */}
            <Link 
              to="/contact" 
              className="px-6 py-2.5 rounded-xl bg-techblue hover:bg-techblue-hover text-white font-bold text-sm transition-all shadow-[0_0_15px_rgba(36,150,237,0.3)] hover:shadow-[0_0_25px_rgba(36,150,237,0.5)]"
            >
              Mulai Kolaborasi
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-200 dark:border-white/10 py-12 mt-16 bg-zinc-100 dark:bg-abyss-dark transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-left">
            <p className="font-bold text-zinc-900 dark:text-white text-base mb-1">Noctax Studio</p>
            <p className="text-zinc-500 text-sm">&copy; {new Date().getFullYear()} All rights reserved. Built with Laravel & React.</p>
          </div>

          {/* IKON SOSIAL MEDIA (SVG BRAND ASLI) */}
          <div className="flex items-center gap-3">
            
            {/* YouTube */}
            <a 
              href="https://youtube.com/@noctaxstudio?si=FnXuEf6bCNSIhdlWm" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="YouTube"
              className="p-3 rounded-xl bg-zinc-200/60 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-red-500 hover:text-white transition-all shadow-sm group"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/noctaxstudio/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="p-3 rounded-xl bg-zinc-200/60 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-pink-600 hover:text-white transition-all shadow-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a 
              href="https://www.facebook.com/share/1EhVXbygUp/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook"
              className="p-3 rounded-xl bg-zinc-200/60 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.587 9 4.75V8z"/>
              </svg>
            </a>

            {/* Email */}
            <a 
              href="mailto:email@anda.com" 
              aria-label="Email"
              className="p-3 rounded-xl bg-zinc-200/60 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-techblue hover:text-white transition-all shadow-sm"
            >
              <Mail className="w-5 h-5" />
            </a>

          </div>

        </div>
      </footer>
    </div>
  );
}