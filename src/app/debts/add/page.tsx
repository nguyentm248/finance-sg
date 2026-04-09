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
        router.refresh(); 
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, thử lại sau nhé!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative overflow-x-hidden">
      
      {/* --- HIỆU ỨNG ÁNH SÁNG NỀN --- */}
      <div className={`absolute top-[-5%] left-[-5%] w-[60%] h-[25%] blur-[100px] rounded-full transition-all duration-1000 ${type === 'lend' ? 'bg-indigo-100' : 'bg-rose-100'} opacity-70`}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-blue-50 blur-[120px] rounded-full opacity-60"></div>

      <div className="flex-1 max-w-md mx-auto w-full relative z-10 px-6 pt-6 pb-32 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-3.5 bg-white rounded-[1.5rem] text-slate-400 shadow-sm border border-slate-100 active:scale-95 transition-all">
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <div className="text-right">
            <h1 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Ghi chú giao dịch</h1>
            <p className="text-xl font-black italic tracking-tighter text-slate-800 uppercase leading-none">Chốt Sổ Nợ</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Switch Chọn Loại Nợ */}
          <div className="flex bg-slate-200/50 backdrop-blur-md p-1 rounded-[2rem] border border-white/50 shadow-inner">
            <button 
              type="button"
              onClick={() => setType('lend')}
              className={`flex-1 py-3.5 rounded-[1.8rem] text-[9px] font-black transition-all duration-500 flex items-center justify-center gap-2 tracking-widest ${type === 'lend' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}
            >
              <HandCoins size={15}/> CHO MƯỢN
            </button>
            <button 
              type="button"
              onClick={() => setType('borrow')}
              className={`flex-1 py-3.5 rounded-[1.8rem] text-[9px] font-black transition-all duration-500 flex items-center justify-center gap-2 tracking-widest ${type === 'borrow' ? 'bg-white text-rose-600 shadow-md' : 'text-slate-400'}`}
            >
              <Landmark size={15}/> NỢ NGƯỜI TA
            </button>
          </div>

          {/* Form Card - Đã tối ưu padding cho mobile */}
          <div className="space-y-5 bg-white/80 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white shadow-[0_15px_40px_-12px_rgba(0,0,0,0.05)]">
            
            {/* Tên đối tượng */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                <User size={13} className={type === 'lend' ? 'text-indigo-500' : 'text-rose-500'} /> Tên đối tác
              </label>
              <input 
                type="text" placeholder="Nhập tên..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.3rem] p-4 outline-none focus:bg-white text-sm font-bold transition-all placeholder:text-slate-300 shadow-inner"
                value={personName} onChange={(e) => setPersonName(e.target.value)}
              />
            </div>

            {/* Số tiền */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                <DollarSign size={13} className="text-emerald-500" /> Số tiền giao ước
              </label>
              <div className="relative">
                <input 
                  type="number" placeholder="0" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.3rem] p-4 pr-12 outline-none focus:bg-white text-lg font-black text-slate-800 transition-all placeholder:text-slate-200 shadow-inner"
                  value={amount} onChange={(e) => setAmount(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300">VND</span>
              </div>
            </div>

            {/* Group Ngày & Ghi chú */}
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                  <Calendar size={13} className="text-orange-500" /> Hạn thanh khoản
                </label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.3rem] p-4 outline-none focus:bg-white text-sm font-bold text-slate-600 shadow-inner"
                  value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                  <MessageSquare size={13} className="text-blue-500" /> Lời nhắn nhủ
                </label>
                <textarea 
                  placeholder="Ghi chú tại đây..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.3rem] p-4 outline-none focus:bg-white text-sm font-medium min-h-[80px] shadow-inner resize-none"
                  value={note} onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-300 text-[8px] font-black uppercase tracking-[0.4em]">
          Mắt Kính Sài Gòn • Finance Management
        </p>
      </div>

      {/* NÚT LƯU CỐ ĐỊNH (STICKY BUTTON) - Giải quyết triệt để trên Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc] to-transparent z-50">
        <div className="max-w-md mx-auto space-y-3">
          <button 
            onClick={handleSave} disabled={loading}
            className="w-full h-[65px] bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_15px_30px_-5px_rgba(15,23,42,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Sparkles size={16} className="relative z-10 text-yellow-300 fill-yellow-300" />
                <span className="relative z-10">Lưu vào sổ nợ</span>
              </>
            )}
          </button>
          
          <div className="flex items-center justify-center gap-2 opacity-40">
            <Info size={10} className="text-slate-400" />
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest text-center">Tự động đồng bộ hóa với hệ thống SalesHub</p>
          </div>
        </div>
      </div>
    </main>
  );
}