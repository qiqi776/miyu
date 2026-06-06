import { useState } from 'react';
import { CoupleData, ActiveUser } from '../types';
import { Settings, Save, ShieldCheck, HeartPulse, Medal } from 'lucide-react';
import { format } from 'date-fns';

const ACHIEVEMENTS = [
  { id: 1, name: '初遇', desc: '建立恋爱空间', icon: '🌱', unlocked: true },
  { id: 2, name: '心有灵犀', desc: '连续7天回答每日一问', icon: '✨', unlocked: false },
  { id: 3, name: '勤勉家政', desc: '家务转盘选中自己10次', icon: '🧹', unlocked: false },
  { id: 4, name: '记录狂魔', desc: '发布100条甜蜜动态', icon: '📸', unlocked: false },
];

export function ProfileTab({ data, setData, currentUser }: { data: CoupleData, setData: React.Dispatch<React.SetStateAction<CoupleData>>, currentUser: ActiveUser }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setData(prev => ({
      ...prev,
      myName: formData.get('myName') as string || prev.myName,
      partnerName: formData.get('partnerName') as string || prev.partnerName,
      startDate: formData.get('startDate') as string || prev.startDate
    }));
    setIsEditing(false);
  };

  return (
    <div className="p-6 pb-24 h-full overflow-y-auto bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-serif text-gray-800">关于我们</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="p-2 text-gray-400 hover:text-gray-600 bg-white shadow-sm rounded-full transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-8 space-y-4">
          <div className="flex items-center gap-2 mb-2 text-rose-500 font-medium">
             <Save className="w-4 h-4" /> 资料设置
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">我的昵称</label>
            <input name="myName" defaultValue={data.myName} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">宝宝的昵称</label>
            <input name="partnerName" defaultValue={data.partnerName} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">相恋日期</label>
            <input type="date" name="startDate" defaultValue={format(new Date(data.startDate), 'yyyy-MM-dd')} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all" />
          </div>
          <button type="submit" className="w-full bg-gray-800 text-white rounded-xl py-3 font-medium mt-2 hover:bg-gray-700 transition-colors shadow-sm">保存修改</button>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 p-1 border border-rose-100 shadow-sm relative">
                  <img src={data.myAvatar} alt="me" className="w-full h-full rounded-full bg-white object-cover" />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-50">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{data.myName}</h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                     <HeartPulse className="w-3 h-3 text-rose-400" /> 伴侣: {data.partnerName}
                  </p>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Achievements Section */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Medal className="w-4 h-4 text-amber-500" />
          恋爱成就
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map(ach => (
            <div key={ach.id} className={`p-4 rounded-2xl border transition-all ${ach.unlocked ? 'bg-amber-50/50 border-amber-100/50' : 'bg-white border-gray-100 grayscale opacity-60'}`}>
              <div className="text-2xl mb-2">{ach.icon}</div>
              <div className="text-sm font-bold text-gray-800 mb-1">{ach.name}</div>
              <div className="text-[10px] text-gray-500 leading-snug">{ach.desc}</div>
              {!ach.unlocked && <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mt-2">未解锁</div>}
            </div>
          ))}
        </div>
      </div>
      
      {/* Settings List Placeholder */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden text-sm">
        <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center text-gray-700 hover:bg-gray-50 cursor-pointer">
          <span>通知设置</span>
          <span className="text-gray-300">›</span>
        </div>
        <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center text-gray-700 hover:bg-gray-50 cursor-pointer">
          <span>隐私与可见性</span>
          <span className="text-gray-300">›</span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center text-rose-500 font-medium hover:bg-rose-50 cursor-pointer">
          <span>解除绑定关系</span>
        </div>
      </div>

    </div>
  );
}
