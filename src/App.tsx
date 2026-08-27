import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages - Public
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Pages - Auth & Dashboard
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';

// Pages - Admin CRUD
import Users from './pages/admin/Users';
import Profile from './pages/admin/Profile';
import ProjectList from './pages/admin/projects/ProjectList';
import ProjectCreate from './pages/admin/projects/ProjectCreate';
import ProjectEdit from './pages/admin/projects/ProjectEdit';
import ArticleList from './pages/admin/articles/ArticleList';
import ArticleCreate from './pages/admin/articles/ArticleCreate';
import ArticleEdit from './pages/admin/articles/ArticleEdit';
import YoutubeVideos from './pages/admin/YoutubeVideos';
import AdminServices from './pages/admin/AdminServices';
import ServiceRequests from './pages/admin/ServiceRequests';
import Messages from './pages/admin/Messages';

// Proteksi Halaman Admin (Harus Login)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) return <Navigate to="/akses-brewok" replace />;
  return <>{children}</>;
};

// Proteksi URL Khusus Admin (Blokir Petugas)
const AdminOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const role = localStorage.getItem('user_role');
  if (role !== 'admin') return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

// Proteksi Halaman Login/Public (Jika sudah login, tendang ke Admin)
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('auth_token');
  if (token) return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <BrowserRouter>
      <Routes>
        
        {/* PUBLIC ROUTING */}
        <Route element={<GuestRoute><PublicLayout isDark={isDark} toggleTheme={toggleTheme} /></GuestRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} /> 
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* LOGIN PAGE RAHASIA */}
        <Route path="/akses-brewok" element={<GuestRoute><Login /></GuestRoute>} />

        {/* ADMIN ROUTING */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout isDark={isDark} toggleTheme={toggleTheme} /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          
          {/* RUTE PROFIL SAYA (Bisa diakses Admin & Petugas) */}
          <Route path="profile" element={<Profile />} />
          
          <Route path="users" element={<AdminOnlyRoute><Users /></AdminOnlyRoute>} />
          
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/create" element={<ProjectCreate />} />
          <Route path="projects/edit/:id" element={<ProjectEdit />} /> 
          
          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/create" element={<ArticleCreate />} />
          <Route path="articles/edit/:id" element={<ArticleEdit />} />

          <Route path="youtube-videos" element={<YoutubeVideos />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="service-requests" element={<ServiceRequests />} />
          <Route path="messages" element={<Messages />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}