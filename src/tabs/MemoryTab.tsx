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
  
  const timelineNotes = data.timeline.filter(t => t.type === 'note' || t.type === 'mood');
  const photos = data.timeline.filter(t => t.imageUrl);

  const ACHIEVEMENTS = [
    { id: 1, name: '初遇', desc: '建立恋爱空间', icon: '🌱', unlocked: true },
    { id: 2, name: '心有灵犀', desc: '完成1次默契问答', icon: '✨', unlocked: data.dailyQuestions.some(q => q.myAnswer && q.partnerAnswer) },
    { id: 3, name: '勤勉家政', desc: '完成1次家务任务', icon: '🧹', unlocked: data.dailyTasks.filter(t => t.completed).length > 0 },
    { id: 4, name: '记录狂魔', desc: `发布10条甜蜜记录 (${Math.min(timelineNotes.length, 10)}/10)`, icon: '📸', unlocked: timelineNotes.length >= 10 },
  ];
  
  let nextAnniversary = addYears(startDate, now.getFullYear() - startDate.getFullYear());
  if (nextAnniversary < now) {
    nextAnniversary = addYears(nextAnniversary, 1);
  }
  const daysToAnniversary = differenceInDays(nextAnniversary, now);

  const milestones = data.timeline.filter(t => t.type === 'milestone');

  return (
    <div className="px-6 pt-6 pb-[calc(4rem+env(safe-area-inset-bottom)+2rem)] h-full overflow-y-auto bg-[#faf9f8]">
      <div className="mb-8 flex justify-between items-end">
        <h2 className="text-xl font-bold font-serif text-gray-800">专属回忆</h2>
      </div>

      {/* Anniversaries */}
      <div className="mb-10">
        <h3 className="text-[13px] font-bold text-gray-800 mb-3 ml-1 flex items-center gap-1.5 tracking-wider uppercase">
           <CalendarHeart className="w-4 h-4 text-gray-400" />
           我们的日子
        </h3>
        <div className="bg-gray-800 p-6 rounded-[24px] text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
           <div className="flex justify-between items-center mb-6 relative z-10">
             <div>
               <p className="text-[11px] text-gray-400 mb-1 font-bold tracking-widest uppercase">距离下一次周年纪念</p>
               <h4 className="text-2xl font-bold">还有 {daysToAnniversary} 天</h4>
             </div>
             <Sparkles className="w-8 h-8 text-rose-400 opacity-80" />
           </div>
           
           <div className="space-y-2 mt-4 pt-4 border-t border-white/10 relative z-10">
             {milestones.map((m) => (
                <div key={m.id} className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-2xl backdrop-blur-sm border border-white/5">
                  <span className="text-[13px] font-medium text-gray-100">{m.content}</span>
                  <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">{format(m.createdAt, 'yyyy.MM.dd')}</span>
                </div>
             ))}
           </div>
        </div>
      </div>

      {/* Albums */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-3 ml-1">
          <h3 className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5 tracking-wider uppercase">
             <ImageIcon className="w-4 h-4 text-gray-400" />
             相册 
             <span className="text-gray-400 ml-1">({photos.length})</span>
          </h3>
          <button className="text-[11px] font-bold text-gray-400 hover:text-gray-800 transition-colors uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">全部照片</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
           {photos.slice(0,6).map((item, i) => (
             <div key={i} className="aspect-square bg-gray-100 rounded-[16px] overflow-hidden cursor-pointer shadow-sm border border-gray-50 group">
               <img src={item.imageUrl} alt="Memory" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
             </div>
           ))}
           {photos.length === 0 && [1, 2, 3].map(i => (
             <div key={i} className="aspect-square bg-white rounded-[16px] border border-gray-100 border-dashed flex flex-col items-center justify-center text-gray-300">
               <ImageIcon className="w-5 h-5 mb-1.5 opacity-50" />
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">空空如也</span>
             </div>
           ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <h3 className="text-[13px] font-bold text-gray-800 mb-3 ml-1 flex items-center gap-1.5 tracking-wider uppercase">
          <Medal className="w-4 h-4 text-gray-400" />
          共同成就
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map(ach => (
            <div key={ach.id} className={`p-5 rounded-[20px] transition-all border ${ach.unlocked ? 'bg-white border-gray-100 shadow-sm' : 'bg-[#faf9f8] border-dashed border-gray-200 grayscale opacity-50'}`}>
              <div className="text-2xl mb-3 drop-shadow-sm">{ach.icon}</div>
              <div className="text-[13px] font-bold text-gray-800 mb-1">{ach.name}</div>
              <div className="text-[10px] font-medium text-gray-500 leading-relaxed">{ach.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
