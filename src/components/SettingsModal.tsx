import { format } from 'date-fns';
import { CoupleData } from '../types';
import { Save, ShieldCheck, HeartPulse, X } from 'lucide-react';
import { motion } from 'motion/react';

export function SettingsModal({ data, setData, onClose }: { data: CoupleData, setData: React.Dispatch<React.SetStateAction<CoupleData>>, onClose: () => void }) {
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setData(prev => ({
      ...prev,
      myName: formData.get('myName') as string || prev.myName,
      partnerName: formData.get('partnerName') as string || prev.partnerName,
      startDate: formData.get('startDate') as string || prev.startDate
    }));
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-black/30 backdrop-blur-[2px] flex justify-center items-end sm:items-center"
    >
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-[#faf9f8] w-full max-w-md rounded-t-[2rem] sm:rounded-[2.5rem] p-6 shadow-2xl h-[85vh] sm:h-auto overflow-y-auto pb-[calc(2rem+env(safe-area-inset-bottom))]"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold font-serif text-gray-800">设置与资料</h2>
          <button onClick={onClose} className="p-2.5 bg-white rounded-full text-gray-400 hover:text-gray-800 shadow-sm border border-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mb-8">
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1.5 ml-1">我的昵称</label>
            <input name="myName" defaultValue={data.myName} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all font-bold text-gray-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]" />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1.5 ml-1">TA的昵称</label>
            <input name="partnerName" defaultValue={data.partnerName} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all font-bold text-gray-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]" />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1.5 ml-1">相恋日期</label>
            <input type="date" name="startDate" defaultValue={format(new Date(data.startDate), 'yyyy-MM-dd')} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all text-gray-800 font-medium shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] appearance-none" />
          </div>
          <button type="submit" className="w-full bg-gray-800 text-white rounded-full py-3.5 text-[13px] font-bold hover:bg-gray-700 transition-colors shadow-sm flex items-center justify-center gap-2 mt-4 active:scale-95">
            <Save className="w-4 h-4" /> 保存资料
          </button>
        </form>

        <div className="bg-white p-5 rounded-[20px] border border-gray-100 flex items-start gap-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
           <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
           <div>
             <p className="text-[13px] font-bold text-gray-800 mb-1">已建立恋爱空间</p>
             <p className="text-[11px] font-medium text-gray-400">当前绑定伴侣：{data.partnerName}</p>
             <button className="text-[11px] font-bold text-red-400 hover:text-red-500 transition-colors mt-3 px-3 py-1 bg-red-50 rounded-full border border-red-100">解除绑定</button>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
