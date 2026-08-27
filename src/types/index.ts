// ==========================================
// 1. FORMAT RESPONSE API (Default Laravel)
// ==========================================
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    current_page: number;
    data: T[];
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ==========================================
// 2. MODEL DATABASE NOCTAX
// ==========================================

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'petugas';
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  tagline: string;
  season: number;
  problem_statement: string;
  features: string[]; // Disimpan sebagai JSON array di Laravel
  tech_stack: string[]; // Disimpan sebagai JSON array di Laravel
  status: 'planning' | 'in_progress' | 'deployed';
  thumbnail_url: string;
  is_featured: boolean;
  views_count: number;
  created_at: string;

  demo_link?: string;
  github_link?: string;
  youtube_link?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string; // Teks Markdown
  category: string;
  status: 'draft' | 'published';
  published_at?: string;
  views_count: number;
  created_at: string;
}

export interface YouTubeVideo {
  id: number;
  title: string;
  video_id: string; // ID unik video YouTube (misal: dQw4w9WgXcQ)
  season_number?: number;
  episode_number?: number;
  description?: string;
  created_at: string;
}

export interface Service {
  id: number;
  title: string;
  category: string;
  description: string;
  starting_price?: number;
  is_active: boolean;
  created_at: string;
}

export interface ServiceRequest {
  id: number;
  service_id?: number;
  service?: Service; // Relasi tabel
  client_name: string;
  client_contact: string;
  project_title: string;
  description: string;
  budget_range?: string;
  deadline?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
}

export interface Message {
  id: number;
  sender_name: string;
  sender_contact: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}