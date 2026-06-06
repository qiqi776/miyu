import { differenceInDays, format } from 'date-fns';
import { CoupleData, ActiveUser, Mood } from '../types';
import { Heart, Smile, Settings, Edit3, Gamepad2, Gift, CheckCircle2, ChevronRight, PenSquare, Sparkles, MessageCircleHeart } from 'lucide-react';
import { useRef, useState } from 'react';
import { SettingsModal } from '../components/SettingsModal';
import { motion, AnimatePresence } from 'motion/react';

const MOODS: { type: Mood; emoji: string; label: string } = [
  { type: 'happy', emoji: '🥰', label: '开心' },
  { type: 'loved', emoji: '❤️', label: '想贴贴' },
  { type: 'tired', emoji: '😮‍💨', label: '心累' },
  { type: 'sad', emoji: '🥺', label: '难过' },
  { type: 'angry', emoji: '😤', label: '生气' },
  { type: 'normal', emoji: '🙂', label: '平静' },
];

export function HomeTab({ data, setData, currentUser, setActiveTab, setInitRecordEditor }: { data: CoupleData, setData: React.Dispatch<React.SetStateAction<CoupleData>>, currentUser: ActiveUser, setActiveTab: (t: 'home'|'record'|'interact'|'memory')=>void, setInitRecordEditor: (v: boolean)=>void }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showPoke, setShowPoke] = useState(false);

  const startDate = new Date(data.startDate);
  const daysTogether = differenceInDays(new Date(), startDate);

  const myMood = currentUser === 'me' ? data.myMood : data.partnerMood;
  const theirMood = currentUser === 'me' ? data.partnerMood : data.myMood;

  const currentUserName = currentUser === 'me' ? data.myName : data.partnerName;
  const theirName = currentUser === 'me' ? data.partnerName : data.myName;
  const myAvatar = currentUser === 'me' ? data.myAvatar : data.partnerAvatar;
  const theirAvatar = currentUser === 'me' ? data.partnerAvatar : data.myAvatar;

  const latestMemory = data.timeline.filter(t => t.type === 'note')[0];

  const setMood = (mood: Mood) => {
    setData(prev => {
      const field = currentUser === 'me' ? 'myMood' : 'partnerMood';
      const newTimeline = [...prev.timeline];
      
      // If mood changed, add to timeline
      if (prev[field] !== mood && mood !== 'none') {
        newTimeline.unshift({
          id: Date.now().toString(),
          type: 'mood',
          content: mood,
          author: currentUser,
          createdAt: Date.now()
        });
      }
      
      return {
        ...prev,
        [field]: mood,
        timeline: newTimeline
      };
    });
  };

  const handlePoke = () => {
    setShowPoke(true);
    setTimeout(() => setShowPoke(false), 2000);
  };

  const toggleTask = (taskId: string) => {
    setData(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  return (
    <>
      <div className="px-6 pt-6 pb-[calc(4rem+env(safe-area-inset-bottom)+2rem)] h-full overflow-y-auto bg-[#faf9f8] hide-scrollbar">
        {/* Top Header: Avatars & Settings */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
             <div className="flex -space-x-3">
               <img src={myAvatar} alt={currentUserName} className="w-11 h-11 rounded-full border-[3px] border-[#faf9f8] object-cover shadow-sm z-10" />
               <img src={theirAvatar} alt={theirName} className="w-11 h-11 rounded-full border-[3px] border-[#faf9f8] object-cover shadow-sm" />
             </div>
             <div>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">相恋的第</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-serif text-gray-800">{daysTogether}</span>
                  <span className="text-sm text-gray-500 font-medium">天</span>
                </div>
             </div>
          </div>
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 bg-white rounded-full text-gray-400 hover:text-gray-800 shadow-sm border border-gray-100 flex items-center justify-center transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Core Dashboard Area (Moods) */}
        <div className="mb-10">
          <div className="flex items-center justify-between px-2 mb-4">
             {/* My Mood */}
             <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative group cursor-pointer border border-gray-50 transition-transform active:scale-95">
                   {myMood !== 'none' ? MOODS.find(m => m.type === myMood)?.emoji : '😶'}
                </div>
                <div className="text-[11px] font-bold text-gray-400 tracking-wider">我</div>
             </div>

             <div className="flex-shrink-0 px-2 opacity-80">
                <Heart className={`w-6 h-6 stroke-[1.5px] ${myMood !== 'none' && theirMood !== 'none' ? 'text-rose-400 fill-rose-200 animate-pulse' : 'text-gray-300'}`} />
             </div>

             {/* Their Mood */}
             <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative border border-gray-50">
                   {theirMood !== 'none' ? MOODS.find(m => m.type === theirMood)?.emoji : '😶'}
                </div>
                <div className="text-[11px] font-bold text-gray-400 tracking-wider">{theirName}</div>
             </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-gray-100 max-w-fit mx-auto">
            {MOODS.map(mood => (
              <button
                key={mood.type}
                onClick={() => setMood(mood.type)}
                className={`w-9 h-9 rounded-full text-lg flex items-center justify-center transition-all ${myMood === mood.type ? 'bg-rose-100 scale-110 shadow-sm' : 'hover:bg-white grayscale hover:grayscale-0'}`}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid - gentle buttons */}
        <div className="grid grid-cols-4 gap-3 mb-10">
           <button 
             onClick={() => { setActiveTab('record'); setInitRecordEditor(true); }}
             className="flex flex-col items-center gap-2 group"
           >
             <div className="w-14 h-14 bg-white rounded-[16px] text-gray-700 flex items-center justify-center shadow-sm border border-gray-100 group-active:scale-95 transition-all group-hover:bg-gray-50">
               <PenSquare className="w-5 h-5 opacity-70" />
             </div>
             <span className="text-[11px] font-bold text-gray-500">记录</span>
           </button>
           <button 
             onClick={() => setActiveTab('interact')}
             className="flex flex-col items-center gap-2 group"
           >
             <div className="w-14 h-14 bg-white rounded-[16px] text-gray-700 flex items-center justify-center shadow-sm border border-gray-100 group-active:scale-95 transition-all group-hover:bg-gray-50">
               <Sparkles className="w-5 h-5 opacity-70" />
             </div>
             <span className="text-[11px] font-bold text-gray-500">做决定</span>
           </button>
           <button 
             onClick={() => setActiveTab('interact')}
             className="flex flex-col items-center gap-2 group"
           >
             <div className="w-14 h-14 bg-white rounded-[16px] text-gray-700 flex items-center justify-center shadow-sm border border-gray-100 group-active:scale-95 transition-all group-hover:bg-gray-50">
               <Gamepad2 className="w-5 h-5 opacity-70" />
             </div>
             <span className="text-[11px] font-bold text-gray-500">游戏</span>
           </button>
           <button 
             onClick={handlePoke} 
             className="flex flex-col items-center gap-2 group relative"
           >
             <div className="w-14 h-14 bg-white rounded-[16px] text-gray-700 flex items-center justify-center shadow-sm border border-gray-100 group-active:scale-95 transition-all group-hover:bg-gray-50">
               <MessageCircleHeart className="w-5 h-5 opacity-70" />
             </div>
             <span className="text-[11px] font-bold text-gray-500">贴贴</span>
             {showPoke && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -25, scale: 1.5 }} exit={{ opacity: 0 }} className="absolute -top-2 text-2xl z-50 pointer-events-none">
                  🫶
                </motion.div>
             )}
           </button>
        </div>

        {/* Lists Section (Tasks & Memories) without heavy card backgrounds */}
        <div className="space-y-8">
          {/* Today's Tasks */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-[13px] font-bold text-gray-800 tracking-wider">今日任务</h3>
              <button className="text-[11px] text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-full">+ 添加</button>
            </div>
            <div className="space-y-1">
               {data.dailyTasks.length === 0 ? (
                 <div className="py-4 text-center text-[13px] text-gray-400 bg-white/50 rounded-[16px] border border-gray-100 border-dashed">今天没有安排哦</div>
               ) : (
                 data.dailyTasks.map((task, idx) => (
                   <motion.div 
                     key={task.id} 
                     layout
                     initial={false}
                     animate={{ opacity: task.completed ? 0.6 : 1 }}
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                     className="flex items-center justify-between p-3.5 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]"
                   >
                     <div className="flex items-center gap-3">
                       <motion.button 
                         whileTap={{ scale: 0.8 }}
                         onClick={() => toggleTask(task.id)}
                       >
                         <motion.div
                           animate={{ scale: task.completed ? [1, 1.25, 1] : 1 }}
                           transition={{ type: "spring", stiffness: 400, damping: 10 }}
                         >
                           <CheckCircle2 className={`w-[22px] h-[22px] transition-colors ${task.completed ? 'text-emerald-400 fill-emerald-50' : 'text-gray-200'}`} strokeWidth={1.5} />
                         </motion.div>
                       </motion.button>
                       <span className={`text-[14px] font-medium transition-all duration-300 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.title}</span>
                     </div>
                     {task.assignee !== 'undecided' && (
                       <div className="bg-gray-50 pl-1 pr-2 py-1 rounded-full flex items-center gap-1.5 border border-gray-100">
                         <img src={task.assignee === currentUser ? myAvatar : theirAvatar} className="w-4 h-4 rounded-full border border-white" />
                         <span className="text-[10px] font-bold text-gray-500">{task.assignee === currentUser ? '我' : 'TA'}做</span>
                       </div>
                     )}
                     {task.assignee === 'undecided' && (
                       <span className="text-[10px] text-rose-500 bg-rose-50 px-2 py-1 rounded-full font-bold tracking-wider">待分配</span>
                     )}
                   </motion.div>
                 ))
               )}
            </div>
          </div>

          {/* Recent Memory */}
          {latestMemory && (
            <div>
              <h3 className="text-[13px] font-bold text-gray-800 tracking-wider mb-3">最新记录</h3>
              <div className="group relative">
                <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-center mb-2">
                     <div className="flex items-center gap-1.5 opacity-60">
                        <PenSquare className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">{format(latestMemory.createdAt, 'MM/dd')}</span>
                     </div>
                     <button onClick={()=>setActiveTab('record')} className="text-[11px] text-rose-400 font-bold rounded-full px-2 py-0.5 bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity">查看</button>
                  </div>
                  <p className="text-[14px] text-gray-700 line-clamp-2 leading-relaxed ml-1">"{latestMemory.content}"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showSettings && <SettingsModal data={data} setData={setData} onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </>
  );
}

