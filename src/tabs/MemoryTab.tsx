import { CoupleData, ActiveUser } from '../types';
import { CalendarHeart, Medal, Image as ImageIcon, Sparkles } from 'lucide-react';
import { differenceInDays, format, addYears } from 'date-fns';

const ACHIEVEMENTS = [
  { id: 1, name: '初遇', desc: '建立恋爱空间', icon: '🌱', unlocked: true },
  { id: 2, name: '心有灵犀', desc: '连续7天回答每日一问', icon: '✨', unlocked: false },
  { id: 3, name: '勤勉家政', desc: '家务转盘选中自己10次', icon: '🧹', unlocked: false },
  { id: 4, name: '记录狂魔', desc: '发布100条甜蜜记录', icon: '📸', unlocked: false },
];

export function MemoryTab({ data }: { data: CoupleData, setData: React.Dispatch<React.SetStateAction<CoupleData>>, currentUser: ActiveUser }) {
  const startDate = new Date(data.startDate);
  const now = new Date();
  
  let nextAnniversary = addYears(startDate, now.getFullYear() - startDate.getFullYear());
  if (nextAnniversary < now) {
    nextAnniversary = addYears(nextAnniversary, 1);
  }
  const daysToAnniversary = differenceInDays(nextAnniversary, now);

  const milestones = data.timeline.filter(t => t.type === 'milestone');

  return (
    <div className="p-5 pb-24 h-full overflow-y-auto bg-[#faf9f8]">
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-bold font-serif text-gray-800">专属回忆</h2>
      </div>

      {/* Anniversaries */}
      <div className="mb-8">
        <h3 className="text-[13px] font-bold text-gray-800 mb-3 ml-1 flex items-center gap-1.5">
           <CalendarHeart className="w-4 h-4 text-rose-500" />
           纪念日
        </h3>
        <div className="bg-gradient-to-r from-rose-500 to-rose-400 p-5 rounded-2xl text-white shadow-md shadow-rose-200">
           <div className="flex justify-between items-center mb-4">
             <div>
               <p className="text-xs text-rose-100 mb-0.5">距离下一次恋爱纪念日</p>
               <h4 className="text-xl font-bold">还有 {daysToAnniversary} 天</h4>
             </div>
             <Sparkles className="w-8 h-8 opacity-50" />
           </div>
           
           <div className="space-y-2 mt-4 pt-4 border-t border-white/20">
             {milestones.map((m) => (
                <div key={m.id} className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium">{m.content}</span>
                  <span className="text-xs text-rose-100">{format(m.createdAt, 'yyyy/MM/dd')}</span>
                </div>
             ))}
           </div>
        </div>
      </div>

      {/* Albums Placeholder */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-3 ml-1">
          <h3 className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5">
             <ImageIcon className="w-4 h-4 text-sky-500" />
             照片墙
          </h3>
          <button className="text-xs text-gray-400 hover:text-gray-600">查看全部</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
           {[1, 2, 3].map(i => (
             <div key={i} className="aspect-square bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center relative overflow-hidden group cursor-pointer">
               <ImageIcon className="w-6 h-6 text-gray-300 group-hover:scale-110 transition-transform" />
               <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
             </div>
           ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-6">
        <h3 className="text-[13px] font-bold text-gray-800 mb-3 ml-1 flex items-center gap-1.5">
          <Medal className="w-4 h-4 text-amber-500" />
          共同成就
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
    </div>
  );
}
