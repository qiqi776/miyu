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
      className="absolute inset-0 z-[100] bg-black/40 backdrop-blur-sm flex justify-center items-end sm:items-center"
    >
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl h-[85vh] sm:h-auto overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-serif text-gray-800">设置与资料</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">我的昵称</label>
            <input name="myName" defaultValue={data.myName} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all font-medium text-gray-800" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">TA的昵称</label>
            <input name="partnerName" defaultValue={data.partnerName} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all font-medium text-gray-800" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">相恋日期</label>
            <input type="date" name="startDate" defaultValue={format(new Date(data.startDate), 'yyyy-MM-dd')} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all text-gray-800" />
          </div>
          <button type="submit" className="w-full bg-gray-800 text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> 保存资料
          </button>
        </form>

        <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 flex items-start gap-3 mb-6">
           <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
           <div>
             <p className="text-sm font-medium text-gray-800">已建立情侣关系</p>
             <p className="text-[11px] text-gray-500 mt-1">当前绑定伴侣：{data.partnerName}</p>
             <button className="text-[11px] text-rose-500 font-medium hover:underline mt-2">解除绑定</button>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
