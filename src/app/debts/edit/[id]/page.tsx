'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, User, DollarSign, Calendar, HandCoins, Landmark, Loader2, Zap, Sparkles } from 'lucide-react';

export default function EditDebtPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'lend' | 'borrow'>('lend');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDebt = async () => {
      try {
        const { data, error } = await supabase
          .from('debts')
          .select('*')
          .eq('id', id)
          .single();

        if (data) {
          setPersonName(data.person_name);
          setAmount(data.amount.toString());
          setType(data.type);
          // Cắt chuỗi để iOS nhận diện đúng định dạng YYYY-MM-DD
          setDueDate(data.due_date ? data.due_date.substring(0, 10) : '');
        }
      } catch (err) {
        console.error("Lỗi fetch nợ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDebt();
  }, [id]);

  const handleUpdate = async () => {
    if (!personName || !amount) return alert("Điền đủ thông tin mày ơi!");
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('debts')
        .update({
          person_name: personName,
          amount: Number(amount),
          type: type,
          due_date: dueDate || null
        })
        .eq('id', id);

      if (error) {
        alert("Lỗi: " + error.message);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      alert("Lỗi kết nối mạng rồi!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <div className="font-black italic text-slate-400 tracking-[0.3em] uppercase text-[10px]">Đang truy xuất sổ nợ...</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 relative overflow-hidden text-slate-900">
      
      {/* Hiệu ứng nền mờ ảo */}
      <div className={`absolute top-[-5%] left-[-5%] w-[60%] h-[30%] blur-[100px] rounded-full transition-all duration-1000 ${type === 'lend' ? 'bg-indigo-100' : 'bg-rose-100'} opacity-60`}></div>

      <div className="max-w-md mx-auto relative z-10 space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-4 bg-white rounded-[1.8rem] text-slate-400 shadow-sm border border-slate-100 hover:text-indigo-600 hover:scale-110 active:scale-95 transition-all">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="text-right">
            <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Hồ sơ đối soát</h1>
            <p className="text-xl font-black text-slate-800 italic uppercase leading-none tracking-tighter">Sửa Thông Tin Nợ</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Switcher - Chuyên nghiệp */}
          <div className="flex bg-slate-200/40 backdrop-blur-md p-1.5 rounded-[2.5rem] border border-white/50 shadow-inner">
            <button 
              type="button"
              onClick={() => setType('lend')} 
              className={`flex-1 py-4 rounded-[2.2rem] text-[10px] font-black transition-all duration-500 flex items-center justify-center gap-2 tracking-widest ${type === 'lend' ? 'bg-white text-indigo-600 shadow-xl scale-[1.02]' : 'text-slate-400 opacity-60'}`}
            >
              <HandCoins size={14}/> CHO MƯỢN
            </button>
            <button 
              type="button"
              onClick={() => setType('borrow')} 
              className={`flex-1 py-4 rounded-[2.2rem] text-[10px] font-black transition-all duration-500 flex items-center justify-center gap-2 tracking-widest ${type === 'borrow' ? 'bg-white text-rose-600 shadow-xl scale-[1.02]' : 'text-slate-400 opacity-60'}`}
            >
              <Landmark size={14}/> NỢ NGƯỜI TA
            </button>
          </div>

          {/* Form Card - Snow White Design */}
          <div className="space-y-6 bg-white/80 backdrop-blur-3xl p-8 rounded-[3.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-white">
            
            {/* Đối tượng */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                <User size={14} className={type === 'lend' ? 'text-indigo-500' : 'text-rose-500'} /> Tên đối tác
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] p-5 pl-6 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 font-bold text-slate-700 transition-all shadow-inner placeholder:text-slate-200" 
                value={personName} onChange={(e) => setPersonName(e.target.value)}
                placeholder="Họ tên đối tác..."
              />
            </div>

            {/* Số tiền */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                <DollarSign size={14} className="text-emerald-500" /> Số tiền giao kèo
              </label>
              <div className="relative group">
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] p-5 pl-6 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50/50 font-black text-2xl text-slate-800 transition-all shadow-inner" 
                  value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">VND</span>
              </div>
            </div>

            {/* Ngày hẹn */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                <Calendar size={14} className="text-orange-500" /> Ngày hẹn thanh khoản
              </label>
              <input 
                type="date" 
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 pl-6 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 font-bold text-slate-600 transition-all shadow-inner scrollbar-hide" 
                value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleUpdate} disabled={saving} 
            className="w-full h-[75px] bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Sparkles size={18} className="relative z-10 text-yellow-300 fill-yellow-300" />
                <span className="relative z-10">Cập nhật sổ nợ</span>
              </>
            )}
          </button>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-300 text-[8px] font-black uppercase tracking-[0.4em] pt-4">
          Mắt Kính Sài Gòn • Finance Management
        </p>
      </div>
    </main>
  );
}