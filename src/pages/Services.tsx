import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Briefcase, Loader2, CheckCircle2, CheckSquare } from 'lucide-react';

// Mendefinisikan tipe data Service agar TypeScript tidak komplain
interface ServiceItem {
  id: number;
  title: string;
  description: string;
  starting_price: number;
}

export default function Services() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Referensi untuk auto-scroll ke area form
  const formRef = useRef<HTMLFormElement>(null);

  // Sesuai dengan tabel services_requests milikmu
  const [form, setForm] = useState({
    client_name: '',
    client_contact: '',
    project_title: '',
    description: '',
    budget_range: ''
  });

  // 1. Fetch Data Katalog Layanan dari Database
  const { data: services, isLoading: loadServices } = useQuery({
    queryKey: ['public-services'],
    queryFn: async () => {
      const res = await api.get('/services');
      return res.data.data.data || res.data.data; 
    }
  });

  // 2. Fungsi ketika tombol "Pilih Layanan" di katalog diklik
  const handleSelectService = (serviceTitle: string) => {
    // Isi otomatis judul proyek di form
    setForm({ ...form, project_title: `Konsultasi: ${serviceTitle}` });
    
    // Scroll otomatis ke arah form secara halus
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/service-requests', form);
      setSuccess(true);
      setForm({ client_name: '', client_contact: '', project_title: '', description: '', budget_range: '' });
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim request layanan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      
      {/* HEADER SECTION - Diperbarui agar lebih elegan & corporate-friendly */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight">
          Layanan & <span className="text-techblue">Konsultasi IT</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Solusi pengembangan perangkat lunak kustom untuk kebutuhan bisnis, institusi pemerintahan, hingga dukungan teknis untuk riset akademis.
        </p>
      </div>

      {/* KATALOG GRID SECTION */}
      {loadServices ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-techblue" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services?.map((service: ServiceItem) => (
            <div key={service.id} className="flex flex-col bg-white dark:bg-abyss-light border border-zinc-200 dark:border-white/10 rounded-3xl p-8 hover:border-techblue dark:hover:border-techblue transition-all hover:-translate-y-2 shadow-sm hover:shadow-xl group">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 group-hover:text-techblue transition-colors">{service.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 flex-grow">{service.description}</p>
              
              <div className="mb-8">
                <span className="text-sm text-zinc-500 block mb-1">Estimasi Biaya</span>
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                  Rp {new Intl.NumberFormat('id-ID').format(service.starting_price)}
                </span>
              </div>

              <button 
                onClick={() => handleSelectService(service.title)}
                className="w-full py-4 mt-auto rounded-xl font-bold text-techblue bg-techblue/10 hover:bg-techblue hover:text-white border border-techblue/20 transition-all"
              >
                Mulai Diskusi
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DIVIDER */}
      <div className="flex items-center justify-center gap-4 mb-16 opacity-50">
        <div className="h-px bg-zinc-300 dark:bg-white/20 w-32 md:w-64"></div>
        <Briefcase className="w-6 h-6 text-zinc-400" />
        <div className="h-px bg-zinc-300 dark:bg-white/20 w-32 md:w-64"></div>
      </div>

      {/* FORM SECTION - Copywriting disesuaikan agar cocok untuk Klien B2B maupun Mahasiswa */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Pengajuan Proyek Kustom</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Ceritakan masalah yang ingin Anda selesaikan atau arsitektur sistem yang ingin dibangun. Mari rancang solusinya bersama.</p>
        </div>

        <div className="bg-white dark:bg-abyss-light p-8 md:p-10 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-lg relative overflow-hidden">
          {success ? (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Proposal Diterima!</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Tim kami akan meninjau detail teknis proyek Anda dan segera menghubungi Anda untuk tahap konsultasi lanjutan.</p>
              <button onClick={() => setSuccess(false)} className="mt-8 px-6 py-2 text-sm font-medium text-techblue hover:underline">
                Ajukan proyek lainnya
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nama Anda / Instansi</label>
                  <input required type="text" value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-abyss border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-techblue text-zinc-900 dark:text-white transition-colors" placeholder="Cth: Instansi, Perusahaan, atau Personal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email / No WhatsApp Aktif</label>
                  <input required type="text" value={form.client_contact} onChange={e => setForm({...form, client_contact: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-abyss border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-techblue text-zinc-900 dark:text-white transition-colors" placeholder="0812... / email@anda.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Subjek / Judul Sistem</label>
                  <input required type="text" value={form.project_title} onChange={e => setForm({...form, project_title: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-abyss border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-techblue text-zinc-900 dark:text-white transition-colors" placeholder="Cth: Sistem E-Office, Analisis Data, Web App..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Rentang Anggaran (Budget)</label>
                  <select required value={form.budget_range} onChange={e => setForm({...form, budget_range: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-abyss border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-techblue text-zinc-900 dark:text-white transition-colors">
                    <option value="" disabled>Pilih Skala Anggaran</option>
                    <option value="< 5 Juta">Skala Kecil (Di bawah Rp 5.000.000)</option>
                    <option value="5 - 15 Juta">Skala Menengah (Rp 5 Juta - Rp 15 Juta)</option>
                    <option value="> 15 Juta">Skala Besar (Di atas Rp 15.000.000)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Deskripsi Kebutuhan & Ruang Lingkup</label>
                <textarea required rows={5} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-abyss border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-techblue text-zinc-900 dark:text-white transition-colors" placeholder="Jelaskan alur bisnis, fitur utama yang dibutuhkan, atau target luaran dari sistem ini..."></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-techblue hover:bg-techblue-hover text-white font-bold transition-all shadow-[0_0_15px_rgba(36,150,237,0.3)] disabled:opacity-50">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckSquare className="w-5 h-5" /> Kirim Proposal Proyek</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}