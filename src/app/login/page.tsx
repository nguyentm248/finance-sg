'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, Mail, Lock, Wallet, ShieldCheck, Sparkles, Fingerprint, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (type: 'login' | 'signup') => {
    if (!email || !password) return alert("Nhập đủ thông tin đi bạn ơi!");
    
    setLoading(true);
    try {
      const { error } = type === 'login' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) {
        alert("Lỗi: " + error.message);
      } else if (type === 'signup') {
        alert("Đăng ký thành công! Check mail kích hoạt nha!");
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      alert("Hệ thống đang bảo trì hoặc mất kết nối mạng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* --- LIQUID BACKGROUND ANIMATION --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[140px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[140px] rounded-full animate-pulse delay-1000"></div>

      <div className="w-full max-w-[400px] relative z-10">
        {/* --- MAIN GLASS CARD --- */}
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-white/10 p-8 md:p-10 relative overflow-hidden">
          
          {/* Glowing Line Top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Header Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5 rounded-[2rem] text-white shadow-2xl mb-4 border border-white/20">
                <Wallet size={36} strokeWidth={1.5} className="text-indigo-400" />
                <Fingerprint size={14} className="absolute -bottom-1 -right-1 text-purple-400" />
              </div>
            </div>
            
            {/* --- TIỀN ĐÂU ? (FIXED FONT & CUTTING) --- */}
            <h1 className="flex items-center justify-center w-full mb-2 relative group">
              <span className="text-4xl font-[1000] italic tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] drop-shadow-[0_0_12px_rgba(99,102,241,0.4)] px-2 -ml-10 overflow-visible">
                Tiền Đâu
              </span>
              <span className="-ml-1 text-5xl font-black text-indigo-500 animate-bounce drop-shadow-[0_0_10px_rgba(99,102,241,0.8)] not-italic">
                ?
              </span>
            </h1>
            
            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
              <Sparkles size={10} className="text-yellow-500" />
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Ví Quản Lý Điện Tử</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Input Email */}
            <div className="group relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-all">
                <Mail size={16} strokeWidth={2.5} />
              </div>
              <input 
                type="email" 
                placeholder="Tài khoản ..." 
                className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] p-4 pl-12 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold text-white placeholder:text-slate-600 shadow-inner"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Input Password */}
            <div className="group relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-all">
                <Lock size={16} strokeWidth={2.5} />
              </div>
              <input 
                type="password" 
                placeholder="Mật khẩu ..." 
                className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] p-4 pl-12 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold text-white placeholder:text-slate-600 shadow-inner"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => handleAuth('login')} disabled={loading}
                className="group relative w-full h-[60px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] transition-all active:scale-95 overflow-hidden"
              >
                <div className="flex items-center justify-center gap-3 relative z-10">
                   {loading ? (
                     <Loader2 className="w-5 h-5 animate-spin text-white/50" />
                   ) : (
                     <>
                        <LogIn size={18} strokeWidth={2.5} /> 
                        <span>Xác nhận danh tính</span>
                     </>
                   )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform"></div>
              </button>

              <button 
                onClick={() => handleAuth('signup')} disabled={loading}
                className="w-full bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10 hover:text-white h-[50px] rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <UserPlus size={14} /> Ghi danh mới
              </button>
            </div>
          </div>

          {/* Security Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-3 text-slate-600 text-[11px] font-black uppercase tracking-widest">
            <ShieldCheck size={20} className="text-indigo-500/50" />
            <span>Hệ Thống Được Bảo Vệ</span>
            <span className="w-2 h-2 rounded-full animate-[police_1s_infinite] shadow-[0_0_10px_rgba(255,255,255,0.2)]"></span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-slate-600 text-[12px] font-bold uppercase tracking-[0.2em] leading-loose opacity-60">
          <p>© 2026 Mắt Kính Sài Gòn</p>
          <p className="text-[14px] font-black text-indigo-500/50 italic underline decoration-indigo-500/20 underline-offset-4">Quản lý tiền không thâm hụt :))p</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { background-position: 200% center; }
        }
        @keyframes police {
          0%, 49% { background-color: #ef4444; box-shadow: 0 0 12px #ef4444; }
          50%, 100% { background-color: #10b981; box-shadow: 0 0 12px #10b981; }
        }
      `}</style>
    </div>
  );
}