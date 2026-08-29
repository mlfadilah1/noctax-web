import { useState } from 'react';
import api from '../api/axios';
import { Terminal, Send, Loader2 } from 'lucide-react';

export default function Contact() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        sender_name: '',
        sender_contact: '', 
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // PERUBAHAN ADA DI BARIS INI: Menggunakan '/contact' bukan '/messages'
            await api.post('/contact', form);
            
            setSuccess(true);
            setForm({ sender_name: '', sender_contact: '', subject: '', message: '' });
        } catch (error) {
            console.error(error);
            alert('Gagal mengirim pesan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Hubungi Saya</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Ada tawaran pekerjaan atau pertanyaan? Kirim pesan langsung ke sistem kami.</p>
            </div>

            <div className="bg-white dark:bg-abyss-light p-8 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-lg">
                {success ? (
                    <div className="text-center py-10">
                        <Terminal className="w-12 h-12 text-techblue mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Pesan Terkirim!</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Terima kasih. Pesan Anda sudah masuk ke Inbox sistem kami.</p>
                        <button onClick={() => setSuccess(false)} className="mt-6 text-techblue hover:underline">Kirim pesan lain</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nama Lengkap</label>
                                <input required type="text" value={form.sender_name} onChange={e => setForm({ ...form, sender_name: e.target.value })} className="w-full px-4 py-3 bg-zinc-50 dark:bg-abyss border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-techblue text-zinc-900 dark:text-white" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email / No. WhatsApp</label>
                                <input required type="text" value={form.sender_contact} onChange={e => setForm({ ...form, sender_contact: e.target.value })}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-abyss border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-techblue text-zinc-900 dark:text-white transition-colors"
                                    placeholder="john@example.com / 081234567890"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Subjek Pesan</label>
                            <input required type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 bg-zinc-50 dark:bg-abyss border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-techblue text-zinc-900 dark:text-white" placeholder="Tawaran Pekerjaan..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Isi Pesan</label>
                            <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 bg-zinc-50 dark:bg-abyss border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-techblue text-zinc-900 dark:text-white" placeholder="Tulis pesan Anda di sini..."></textarea>
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-techblue hover:bg-techblue-hover text-white font-medium transition-all shadow-[0_0_15px_rgba(36,150,237,0.3)] disabled:opacity-50">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Kirim Pesan</>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}