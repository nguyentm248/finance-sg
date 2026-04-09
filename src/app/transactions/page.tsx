'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Tag, Banknote, FileText, Sparkles, Zap, Loader2 } from 'lucide-react';

export default function Transactions() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!amount) return alert("Nhập số tiền vô mày!");
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { error } = await supabase.from('transactions').insert([
        { user_id: user.id, amount: Number(amount), type, note }
      ]);

      if (error) {
        alert("Lỗi lưu rùi: " + error.message);
      } else {
        router.push('/');
        router.refresh(); // Ép refresh để trang chủ cập nhật số dư mới ngay
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối rồi mày ơi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 relative overflow-hidden">
      
      {/* --- HIỆU ỨNG NỀN BIẾN ĐỔI THEO LOẠI GIAO DỊCH --- */}
      <div className={`absolute top-[-10%] right-[-10%] w-[70%] h-[40%] blur-[120px] rounded-full transition-all duration-1000 ${type === 'income' ? 'bg-emerald-100 opacity-60' : 'bg-rose-100 opacity-60'}`}></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[50%] h-[30%] bg-indigo-100 blur-[100px] rounded-full opacity-40"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Header - iOS Style */}
        <div className="flex items-center justify-between px-2">
          <button onClick={() => router.back()} className="p-4 bg-white rounded-[1.5rem] text-slate-600 shadow-sm border border-white hover:scale-110 active:scale-95 transition-all">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="text-right">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Giao dịch mới</h2>
            <p className="text-xl font-black text-slate-800 italic uppercase leading-none">Tạo lệnh</p>
          </div>
        </div>

        {/* --- MAIN FORM CARD --- */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden p-8 md:p-10">
          
          <div className="space-y-10">
            {/* Amount Input - To và Rõ */}
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-full text-white mb-2 shadow-lg shadow-slate-200">
                <Zap size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[9px] font-black uppercase tracking-widest">Nhập số tiền VNĐ</span>
              </div>
              <div className="relative group">
                <input 
                  type="number" 
                  required 
                  autoFocus 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full text-center text-6xl font-black outline-none bg-transparent transition-colors duration-500 placeholder:text-slate-100 scrollbar-hide ${type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Switch Type - Custom iOS Switch */}
            <div className="flex bg-slate-200/40 backdrop-blur-md p-1.5 rounded-[2rem] border border-slate-200/50">
              <button 
                type="button"
                onClick={() => setType('income')} 
                className={`flex-1 py-4 rounded-[1.6rem] font-black text-[10px] tracking-widest transition-all z-10 flex items-center justify-center gap-2 ${type === 'income' ? 'bg-white text-emerald-600 shadow-xl scale-[1.02]' : 'text-slate-400 opacity-60'}`}
              >
                <Sparkles size={14} /> THU NHẬP
              </button>
              <button 
                type="button"
                onClick={() => setType('expense')} 
                className={`flex-1 py-4 rounded-[1.6rem] font-black text-[10px] tracking-widest transition-all z-10 flex items-center justify-center gap-2 ${type === 'expense' ? 'bg-white text-rose-600 shadow-xl scale-[1.02]' : 'text-slate-400 opacity-60'}`}
              >
                <Banknote size={14} /> CHI TIÊU
              </button>
            </div>

            {/* Note Input */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                <FileText size={14} className="text-indigo-500" /> Ghi chú nhanh
              </label>
              <textarea 
                rows={3} 
                value={note} 
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-white/50 border border-slate-100 p-6 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold text-slate-700 shadow-inner placeholder:text-slate-200 resize-none"
                placeholder="Mày tiêu cái gì thế?"
              />
            </div>

            {/* Confirm Button */}
            <button 
              onClick={handleSave} 
              disabled={loading}
              className={`w-full h-[75px] rounded-[2.5rem] font-black text-sm uppercase tracking-widest flex justify-center items-center gap-3 transition-all active:scale-95 shadow-2xl relative overflow-hidden group ${type === 'income' ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-slate-900 text-white shadow-slate-200'}`}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Check size={22} strokeWidth={4} /> 
                  <span>Lưu giao dịch</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-300 text-[8px] font-black uppercase tracking-[0.4em] opacity-60">
          Hệ thống quản lý tài chính • Mắt Kính Sài Gòn
        </p>
      </div>
    </div>
  );
}