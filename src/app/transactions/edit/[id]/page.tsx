'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, DollarSign, MessageSquare, Tag, Loader2, Sparkles, Zap } from 'lucide-react';

export default function EditTransactionPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchTransaction = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('id', id)
          .single();

        if (data) {
          setAmount(data.amount.toString());
          setNote(data.note || '');
          setType(data.type);
        }
      } catch (err) {
        console.error("Lỗi fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransaction();
  }, [id]);

  const handleUpdate = async () => {
    if (!amount) return alert("Quên nhập tiền kìa mày!");
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: Number(amount),
          note: note,
          type: type
        })
        .eq('id', id);

      if (error) {
        alert("Lỗi rồi: " + error.message);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      alert("Sự cố mạng rồi mày ơi!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <div className="font-black italic text-slate-400 text-xs tracking-widest uppercase">Đang đồng bộ dữ liệu...</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 p-6 relative overflow-hidden">
      
      {/* Hiệu ứng nền - Tone trắng Premium */}
      <div className={`absolute top-[-5%] right-[-5%] w-[60%] h-[30%] blur-[100px] rounded-full transition-all duration-1000 ${type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'} opacity-60`}></div>

      <div className="max-w-md mx-auto relative z-10 space-y-8">
        {/* Header - Minimalist */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-4 bg-white rounded-3xl text-slate-400 shadow-sm border border-slate-100 hover:text-indigo-600 hover:scale-110 active:scale-95 transition-all">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="text-right">
            <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Cập nhật hồ sơ</h1>
            <p className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase leading-none">Sửa Giao Dịch</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Switch Chọn Loại */}
          <div className="flex bg-slate-200/50 backdrop-blur-md p-1.5 rounded-[2.5rem] border border-white/50 shadow-inner">
            <button 
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-4 rounded-[2.2rem] text-[10px] font-black transition-all duration-500 flex items-center justify-center gap-2 tracking-widest ${type === 'income' ? 'bg-white text-emerald-600 shadow-xl scale-[1.02]' : 'text-slate-400'}`}
            >
              THU VÀO
            </button>
            <button 
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-4 rounded-[2.2rem] text-[10px] font-black transition-all duration-500 flex items-center justify-center gap-2 tracking-widest ${type === 'expense' ? 'bg-white text-rose-600 shadow-xl scale-[1.02]' : 'text-slate-400'}`}
            >
              CHI RA
            </button>
          </div>

          {/* Form Card - Snow White Design */}
          <div className="space-y-6 bg-white/80 backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
            
            {/* Input Số tiền */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                <Zap size={14} className="text-yellow-500" /> Giá trị hiệu chỉnh (VNĐ)
              </label>
              <div className="relative group">
                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-500" size={20} />
                <input 
                  type="number" placeholder="0" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] p-5 pl-14 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-200 text-2xl font-black text-slate-800 transition-all shadow-inner"
                  value={amount} onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Input Ghi chú */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                <MessageSquare size={14} className="text-indigo-500" /> Nội dung thay đổi
              </label>
              <textarea 
                placeholder="Ghi chú lại cho chuẩn..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] p-6 outline-none focus:bg-white text-slate-700 font-bold min-h-[150px] transition-all shadow-inner resize-none"
                value={note} onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Nút Cập Nhật */}
          <button 
            onClick={handleUpdate} disabled={saving}
            className="w-full h-[75px] bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Save size={18} className="relative z-10" />
                <span className="relative z-10">Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>

        {/* Brand Footer */}
        <p className="text-center text-slate-300 text-[8px] font-black uppercase tracking-[0.4em] pt-4">
          Mắt Kính Sài Gòn • Finance Management
        </p>
      </div>
    </main>
  );
}