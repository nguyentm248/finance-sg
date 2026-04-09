'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Plus, Wallet, LogOut, ArrowUpCircle, ArrowDownCircle, 
  HandCoins, Landmark, Sparkles, Bell
} from 'lucide-react';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [filter, setFilter] = useState('month');
  const [userName, setUserName] = useState('Người dùng');
  const [mounted, setMounted] = useState(false); 
  const router = useRouter();

  const [activeView, setActiveView] = useState<'finance' | 'debt'>('finance');
  const [debts, setDebts] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<{data: any, type: 'finance' | 'debt'} | null>(null);
  
  // State cho cái chuông
  const [showNoti, setShowNoti] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');
    
    if (user.email) setUserName(user.email.split('@')[0]);

    const [transRes, debtRes] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', user.id),
      supabase.from('debts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    const getYMD = (d: Date) => d.toISOString().split('T')[0];
    const todayStr = getYMD(new Date());

    if (debtRes.data) {
      setDebts(debtRes.data);
      debtRes.data.forEach(d => {
        if (d.due_date === todayStr && d.status === 'pending' && 'Notification' in window) {
          new Notification("📢 NHẮC HẸN!", {
            body: `Hôm nay bạn có hẹn với ${d.person_name} số tiền ${Number(d.amount).toLocaleString()}đ`,
          });
        }
      });
    }

    if (transRes.data) {
      const allData = transRes.data;
      const totalInc = allData.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const totalExp = allData.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
      
      const getTDate = (item: any) => item.created_at || item.date || item.inserted_at;
      const now = new Date();

      const filtered = allData.filter(t => {
        const tDate = new Date(getTDate(t));
        if (filter === 'day') return getYMD(tDate) === todayStr;
        if (filter === 'month') return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        if (filter === 'year') return tDate.getFullYear() === now.getFullYear();
        return true;
      });

      const currInc = filtered.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const currExp = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

      setStats({ 
        income: currInc, 
        expense: currExp, 
        balance: totalInc - totalExp 
      });

      setTransactions(filtered.sort((a, b) => new Date(getTDate(b)).getTime() - new Date(getTDate(a)).getTime()));

      const groups: any = {};
      filtered.slice(0, 15).forEach(t => {
        const lbl = new Date(getTDate(t)).toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit'});
        if (!groups[lbl]) groups[lbl] = { name: lbl, income: 0, expense: 0 };
        if (t.type === 'income') groups[lbl].income += Number(t.amount);
        else groups[lbl].expense += Number(t.amount);
      });
      setChartData(Object.values(groups));
    }
  };

  useEffect(() => {
    if (mounted) fetchData();
  }, [mounted, filter]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    const table = selectedItem.type === 'finance' ? 'transactions' : 'debts';
    const { error } = await supabase.from(table).delete().eq('id', selectedItem.data.id);
    if (!error) {
      setSelectedItem(null);
      fetchData();
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedItem || selectedItem.type !== 'debt') return;
    const newStatus = selectedItem.data.status === 'paid' ? 'pending' : 'paid';
    const { error } = await supabase.from('debts').update({ status: newStatus }).eq('id', selectedItem.data.id);
    if (!error) {
      setSelectedItem(null);
      fetchData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!mounted) return <div className="min-h-screen bg-[#fcfcfd]" />;

  return (
    <main className="pb-32 relative min-h-screen bg-[#fcfcfd] text-slate-900 font-sans scrollbar-hide">
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes blink-red-green {
          0%, 100% { background-color: #ef4444; box-shadow: 0 0 10px #ef4444; }
          50% { background-color: #22c55e; box-shadow: 0 0 10px #22c55e; }
        }
        .animate-blink { animation: blink-red-green 1s infinite; }
      `}</style>

      <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-50 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2.5 rounded-xl text-white shadow-lg">
            <Wallet size={20}/>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">XIN CHÀO,</p>
            <p className="text-sm font-black text-indigo-600 uppercase">{userName}</p>
          </div>
        </div>
        
        <div className="flex gap-2 relative">
          {/* NÚT CHUÔNG THÔNG BÁO */}
          <button 
            onClick={() => setShowNoti(!showNoti)}
            className={`p-2.5 transition-colors rounded-xl relative ${showNoti ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}
          >
            <Bell size={20}/>
            {debts.some(d => d.status === 'pending') && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* DROPDOWN THÔNG BÁO */}
          {showNoti && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNoti(false)}></div>
              <div className="absolute right-0 mt-12 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-20 p-5 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông báo nhanh</h4>
                  <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">MỚI NHẤT</span>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
                  {/* Nợ chưa thanh toán */}
                  {debts.filter(d => d.status === 'pending').slice(0, 2).map(d => (
                    <div key={d.id} className="flex gap-3 p-3 bg-rose-50 rounded-2xl border border-rose-100/50">
                      <div className="bg-white p-2 rounded-xl text-rose-500 shadow-sm">
                        <HandCoins size={14}/>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-bold text-slate-700 uppercase truncate">Nợ: {d.person_name}</p>
                        <p className="text-[10px] text-rose-600 font-black">{Number(d.amount).toLocaleString()}đ</p>
                      </div>
                    </div>
                  ))}

                  {/* Giao dịch gần đây */}
                  {transactions.slice(0, 3).map(t => (
                    <div key={t.id} className="flex gap-3 p-3 bg-slate-50 rounded-2xl">
                      <div className={`p-2 rounded-xl shadow-sm ${t.type === 'income' ? 'bg-white text-emerald-500' : 'bg-white text-slate-400'}`}>
                        {t.type === 'income' ? <ArrowUpCircle size={14}/> : <ArrowDownCircle size={14}/>}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-bold text-slate-700 uppercase truncate">{t.note || 'Giao dịch mới'}</p>
                        <p className={`text-[10px] font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {t.type === 'income' ? '+' : '-'}{Number(t.amount).toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  ))}

                  {transactions.length === 0 && debts.length === 0 && (
                    <p className="text-center py-6 text-slate-300 text-[10px] font-black uppercase italic">Không có dữ liệu</p>
                  )}
                </div>
                <button 
                  onClick={() => setShowNoti(false)}
                  className="w-full mt-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-t border-slate-50 hover:text-indigo-600 transition-colors"
                >
                  Đóng thông báo
                </button>
              </div>
            </>
          )}

          <button 
            onClick={handleLogout}
            className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 rounded-xl"
          >
            <LogOut size={20}/>
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between bg-slate-900/5 px-4 py-2 rounded-full border border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-blink"></div>
            <p className="text-[12px] font-mono text-slate-400 uppercase tracking-tighter">Dữ Liệu mã Hóa Theo Thời Gian Thực</p>
          </div>
          <span className="text-[12px] font-black text-indigo-500">SECURE</span>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveView('finance')} 
            className={`flex-1 py-3 rounded-xl text-[15px] font-black transition-all ${activeView === 'finance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            DÒNG TIỀN
          </button>
          <button 
            onClick={() => setActiveView('debt')} 
            className={`flex-1 py-3 rounded-xl text-[15px] font-black transition-all ${activeView === 'debt' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            SỔ NỢ
          </button>
        </div>

        {activeView === 'finance' ? (
          <>
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
               <Sparkles className="absolute top-[-20%] right-[-10%] opacity-10 w-40 h-40 text-white" />
               <p className="text-[14px] opacity-50 uppercase font-black tracking-widest mb-1">Số dư hiện tại</p>
               <p className="text-4xl font-black tracking-tighter mb-8">{stats.balance.toLocaleString()}đ</p>
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <p className="text-[15px] text-emerald-400 font-black mb-1">TỔNG THU</p>
                    <p className="text-sm font-bold">+{stats.income.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <p className="text-[15px] text-rose-400 font-black mb-1">TỔNG CHI</p>
                    <p className="text-sm font-bold">-{stats.expense.toLocaleString()}</p>
                  </div>
               </div>
            </div>

            <div className="p-2">
               <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
                  {['day', 'month', 'year'].map(i => (
                    <button 
                      key={i} 
                      onClick={() => setFilter(i)} 
                      className={`flex-1 py-2 rounded-lg text-[12px] font-black tracking-widest transition-all ${filter === i ? 'bg-indigo-600 text-white' : 'bg-transparent text-slate-400'}`}
                    >
                      {i === 'day' ? 'NGÀY' : i === 'month' ? 'THÁNG' : 'NĂM'}
                    </button>
                  ))}
               </div>
               <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" hide />
                      <Bar dataKey="income" fill="#6366f1" radius={[4,4,4,4]} barSize={8} />
                      <Bar dataKey="expense" fill="#cbd5e1" radius={[4,4,4,4]} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="space-y-3">
               <h3 className="text-sm font-black uppercase italic tracking-widest px-2 text-slate-400">Giao dịch {filter === 'day' ? 'Hôm nay' : 'gần đây'}</h3>
               {transactions.length > 0 ? transactions.map(t => (
                 <div 
                   key={t.id} 
                   onClick={() => setSelectedItem({data: t, type: 'finance'})} 
                   className="flex justify-between items-center p-5 bg-white rounded-3xl active:scale-95 transition-all cursor-pointer"
                 >
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-2xl ${t.type === 'income' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                          {t.type === 'income' ? <ArrowUpCircle size={18}/> : <ArrowDownCircle size={18}/>}
                       </div>
                       <div className="max-w-[150px]">
                          <p className="text-xs font-bold text-slate-800 truncate uppercase">{t.note || 'Không có ghi chú'}</p>
                          <p className="text-[12px] text-slate-400 font-black">{new Date(t.created_at || t.date).toLocaleDateString('vi-VN')}</p>
                       </div>
                    </div>
                    <p className={`font-black text-sm ${t.type === 'income' ? 'text-indigo-600' : 'text-slate-900'}`}>
                      {t.type === 'income' ? '+' : '-'}{Number(t.amount).toLocaleString()}
                    </p>
                 </div>
               )) : (
                 <p className="text-center py-10 text-slate-300 text-[10px] font-black uppercase tracking-widest">Chưa có dữ liệu</p>
               )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex justify-between items-center shadow-xl relative overflow-hidden">
               <div className="z-10">
                 <p className="text-[8px] font-black opacity-60 mb-1 tracking-widest">HỌ NỢ MÌNH</p>
                 <p className="text-xl font-black">{debts.filter(d => d.type === 'lend' && d.status === 'pending').reduce((s, d) => s + Number(d.amount), 0).toLocaleString()}đ</p>
               </div>
               <div className="text-right z-10">
                 <p className="text-[8px] font-black opacity-60 mb-1 tracking-widest">MÌNH NỢ HỌ</p>
                 <p className="text-xl font-black text-indigo-200">{debts.filter(d => d.type === 'borrow' && d.status === 'pending').reduce((s, d) => s + Number(d.amount), 0).toLocaleString()}đ</p>
               </div>
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            </div>
            
            <div className="space-y-3">
               {debts.length > 0 ? debts.map(d => (
                 <div 
                   key={d.id} 
                   onClick={() => setSelectedItem({data: d, type: 'debt'})} 
                   className={`flex justify-between items-center p-5 bg-white rounded-3xl active:scale-95 transition-all cursor-pointer ${d.status === 'paid' ? 'opacity-40 grayscale' : ''}`}
                 >
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-2xl ${d.type === 'lend' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {d.type === 'lend' ? <HandCoins size={18}/> : <Landmark size={18}/>}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-800 uppercase">{d.person_name}</p>
                          <p className="text-[8px] font-black text-slate-400 tracking-widest uppercase">
                            {d.due_date ? `Hạn: ${new Date(d.due_date).toLocaleDateString('vi-VN')}` : 'Không thời hạn'}
                          </p>
                       </div>
                    </div>
                    <p className={`font-black text-sm ${d.type === 'lend' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {Number(d.amount).toLocaleString()}
                    </p>
                 </div>
               )) : (
                 <p className="text-center py-10 text-slate-300 text-[10px] font-black uppercase tracking-widest">Danh sách nợ trống</p>
               )}
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <h2 className="text-xl font-black mb-1 uppercase italic text-slate-800">Chi tiết</h2>
            <div className="bg-slate-50 rounded-3xl p-6 mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">{selectedItem.type === 'finance' ? 'Ghi chú' : 'Đối tượng'}</p>
              <p className="text-sm font-bold text-slate-700 mb-2">{selectedItem.data.note || selectedItem.data.person_name}</p>
              <p className="text-2xl font-black text-indigo-600">{Number(selectedItem.data.amount).toLocaleString()}đ</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {selectedItem.type === 'debt' && (
                <button 
                  onClick={handleToggleStatus} 
                  className="col-span-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                >
                  {selectedItem.data.status === 'paid' ? 'Đánh dấu CHƯA XONG' : 'Đã HOÀN TẤT'}
                </button>
              )}
              <button 
                onClick={() => router.push(selectedItem.type === 'finance' ? `/transactions/edit/${selectedItem.data.id}` : `/debts/edit/${selectedItem.data.id}`)} 
                className="py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                Sửa
              </button>
              <button 
                onClick={handleDelete} 
                className="py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                Xóa
              </button>
              <button 
                onClick={() => setSelectedItem(null)} 
                className="col-span-2 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-6">
        <button 
          onClick={() => router.push(activeView === 'finance' ? '/transactions' : '/debts/add')} 
          className="w-full bg-slate-900 text-white py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-indigo-600"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Thêm mới giao dịch</span>
        </button>
      </div>
    </main>
  );
}