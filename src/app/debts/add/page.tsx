'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, User, DollarSign, Calendar, 
  MessageSquare, HandCoins, Landmark, Sparkles, Loader2, Info
} from 'lucide-react';

export default function AddDebtPage() {
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<'lend' | 'borrow'>('lend');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!personName || !amount) return alert("Nhập tên với số tiền vô mày ơi!");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { error } = await supabase.from('debts').insert([{
        user_id: user.id,
        person_name: personName,
        amount: Number(amount),
        note: note,
        type: type,
        due_date: dueDate || null,
        status: 'pending'
      }]);

      if (error) {
        alert("Lỗi rồi: " + error.message);
      } else {
        router.push('/');
        router.refresh(); // Ép refresh để cập nhật data mới
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, thử lại sau nhé!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 p-6 relative overflow-hidden">
      
      {/* --- HIỆU ỨNG ÁNH SÁNG NỀN (Light Mode) --- */}
      <div className={`absolute top-[-5%] left-[-5%] w-[60%] h-[30%] blur-[100px] rounded-full transition-all duration-1000 ${type === 'lend' ? 'bg-indigo-100' : 'bg-rose-100'} opacity-70`}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-blue-50 blur-[120px] rounded-full opacity-60"></div>

      <div className="max-w-md mx-auto relative z-10 space-y-8">
        
        {/* Header - Modern Minimalist */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-4 bg-white rounded-3xl text-slate-400 shadow-sm border border-slate-100 hover:text-indigo-600 hover:scale-110 active:scale-95 transition-all">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="text-right">
            <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Ghi chú giao dịch</h1>
            <p className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase leading-none">Chốt Sổ Nợ</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Switch Chọn Loại Nợ - Soft Glass Style */}
          <div className="flex bg-slate-200/50 backdrop-blur-md p-1.5 rounded-[2.5rem] border border-white/50 shadow-inner">
            <button 
              type="button"
              onClick={() => setType('lend')}
              className={`flex-1 py-4 rounded-[2.2rem] text-[10px] font-black transition-all duration-500 flex items-center justify-center gap-2 tracking-widest ${type === 'lend' ? 'bg-white text-indigo-600 shadow-xl scale-[1.02]' : 'text-slate-400'}`}
            >
              <HandCoins size={16}/> CHO MƯỢN
            </button>
            <button 
              type="button"
              onClick={() => setType('borrow')}
              className={`flex-1 py-4 rounded-[2.2rem] text-[10px] font-black transition-all duration-500 flex items-center justify-center gap-2 tracking-widest ${type === 'borrow' ? 'bg-white text-rose-600 shadow-xl scale-[1.02]' : 'text-slate-400'}`}
            >
              <Landmark size={16}/> NỢ NGƯỜI TA
            </button>
          </div>

          {/* Form Card - Snow White Design */}
          <div className="space-y-6 bg-white/80 backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
            
            {/* Tên đối tượng */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                <User size={14} className={type === 'lend' ? 'text-indigo-500' : 'text-rose-500'} /> Tên đối tác
              </label>
              <input 
                type="text" placeholder="Nhập tên..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] p-5 pl-6 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-200 text-slate-700 font-bold transition-all placeholder:text-slate-300 shadow-inner"
                value={personName} onChange={(e) => setPersonName(e.target.value)}
              />
            </div>

            {/* Số tiền */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                <DollarSign size={14} className="text-emerald-500" /> Số tiền giao ước
              </label>
              <div className="relative">
                <input 
                  type="number" placeholder="0" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] p-5 pl-6 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50/50 focus:border-emerald-100 text-2xl font-black text-slate-800 transition-all placeholder:text-slate-200 shadow-inner"
                  value={amount} onChange={(e) => setAmount(e.target.value)}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">VND</span>
              </div>
            </div>

            {/* Group Ngày & Ghi chú */}
            <div className="grid grid-cols-1 gap-6 pt-2">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                  <Calendar size={14} className="text-orange-500" /> Hẹn ngày thanh khoản
                </label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 outline-none focus:bg-white text-slate-600 font-bold transition-all shadow-inner scrollbar-hide"
                  value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                  <MessageSquare size={14} className="text-blue-500" /> Lời nhắn nhủ
                </label>
                <textarea 
                  placeholder="Ghi chú tại đây..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 outline-none focus:bg-white text-slate-600 font-medium min-h-[100px] transition-all placeholder:text-slate-300 shadow-inner resize-none"
                  value={note} onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Button - Floating Indigo */}
          <div className="space-y-4">
            <button 
              onClick={handleSave} disabled={loading}
              className="w-full h-[75px] bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Sparkles size={18} className="relative z-10 text-yellow-300 fill-yellow-300" />
                  <span className="relative z-10">Lưu vào sổ nợ</span>
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 opacity-50">
              <Info size={12} className="text-slate-400" />
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Dữ liệu sẽ được mã hóa an toàn</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-300 text-[8px] font-black uppercase tracking-[0.4em] pt-4">
          Mắt Kính Sài Gòn • Finance Management
        </p>
      </div>
    </main>
  );
}