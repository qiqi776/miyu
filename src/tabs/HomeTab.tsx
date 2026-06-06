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

export function HomeTab({ data, setData, currentUser }: { data: CoupleData, setData: React.Dispatch<React.SetStateAction<CoupleData>>, currentUser: ActiveUser }) {
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
      <div className="p-5 pb-24 h-full overflow-y-auto bg-[#faf9f8]">
        {/* Top Header: Avatars & Days */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
               <img src={myAvatar} alt={currentUserName} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
               <img src={theirAvatar} alt={theirName} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
             </div>
             <div>
                <p className="text-[11px] text-gray-500 font-medium">我们在一起的第</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold font-serif text-rose-500">{daysTogether}</span>
                  <span className="text-[11px] text-gray-500 font-medium">天</span>
                </div>
             </div>
          </div>
          <button onClick={() => setShowSettings(true)} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-600 shadow-sm border border-gray-100">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Today's Mood Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-50 mb-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-500" />
                今日心情
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* My Mood */}
             <div className="flex-1 text-center">
                <div className="w-12 h-12 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-2xl mb-2 relative group cursor-pointer border border-gray-100">
                   {myMood !== 'none' ? MOODS.find(m => m.type === myMood)?.emoji : '❓'}
                   {/* Mood overlay on hover could go here, for MVP just show static and use buttons below */}
                   <img src={myAvatar} className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-white" />
                </div>
                <div className="text-[10px] text-gray-500 mb-2">我</div>
             </div>

             <div className="relative">
                <Heart className={`w-5 h-5 ${myMood !== 'none' && theirMood !== 'none' ? 'text-rose-400 fill-rose-200 animate-pulse' : 'text-gray-200'}`} />
             </div>

             {/* Their Mood */}
             <div className="flex-1 text-center">
                <div className="w-12 h-12 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-2xl mb-2 relative border border-gray-100">
                   {theirMood !== 'none' ? MOODS.find(m => m.type === theirMood)?.emoji : '❓'}
                   <img src={theirAvatar} className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-white" />
                </div>
                <div className="text-[10px] text-gray-500 mb-2">{theirName}</div>
             </div>
          </div>

          <div className="mt-2 pt-4 border-t border-gray-50">
             <div className="flex justify-between gap-1 overflow-x-auto hide-scrollbar pb-1">
               {MOODS.map(mood => (
                 <button
                   key={mood.type}
                   onClick={() => setMood(mood.type)}
                   className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-lg transition-all ${myMood === mood.type ? 'bg-rose-100 scale-110' : 'bg-gray-50 grayscale hover:grayscale-0'}`}
                 >
                   {mood.emoji}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
           <button className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform">
             <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
               <PenSquare className="w-5 h-5" />
             </div>
             <span className="text-[11px] font-medium text-gray-600">写日常</span>
           </button>
           <button className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform">
             <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
               <Sparkles className="w-5 h-5" />
             </div>
             <span className="text-[11px] font-medium text-gray-600">抽决定</span>
           </button>
           <button className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform">
             <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center">
               <Gamepad2 className="w-5 h-5" />
             </div>
             <span className="text-[11px] font-medium text-gray-600">玩游戏</span>
           </button>
           <button onClick={handlePoke} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform relative">
             <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
               <MessageCircleHeart className="w-5 h-5" />
             </div>
             <span className="text-[11px] font-medium text-gray-600">发贴贴</span>
             {showPoke && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -20, scale: 1.5 }} exit={{ opacity: 0 }} className="absolute -top-4 text-2xl z-50 pointer-events-none">
                  🫶
                </motion.div>
             )}
           </button>
        </div>

        {/* Today's Tasks */}
        <div className="mb-6">
           <h3 className="text-[13px] font-bold text-gray-800 mb-3 ml-1">今日任务</h3>
           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             {data.dailyTasks.length === 0 ? (
               <div className="p-4 text-center text-xs text-gray-400">今天没有安排哦</div>
             ) : (
               data.dailyTasks.map((task, idx) => (
                 <div key={task.id} className={`flex items-center justify-between p-3.5 ${idx !== data.dailyTasks.length - 1 ? 'border-b border-gray-50' : ''}`}>
                   <div className="flex items-center gap-3">
                     <button onClick={() => toggleTask(task.id)}>
                       <CheckCircle2 className={`w-5 h-5 ${task.completed ? 'text-emerald-400 fill-emerald-50' : 'text-gray-200'}`} />
                     </button>
                     <span className={`text-[13px] ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.title}</span>
                   </div>
                   {task.assignee !== 'undecided' && (
                     <div className="bg-gray-50 px-2 py-1 rounded-md flex items-center gap-1.5 border border-gray-100">
                       <img src={task.assignee === currentUser ? myAvatar : theirAvatar} className="w-4 h-4 rounded-full" />
                       <span className="text-[10px] text-gray-500">{task.assignee === currentUser ? '我' : theirName}做</span>
                     </div>
                   )}
                   {task.assignee === 'undecided' && (
                     <span className="text-[10px] text-rose-500 bg-rose-50 px-2 py-1 rounded-md font-medium">待分配</span>
                   )}
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Recent Memory */}
        {latestMemory && (
          <div className="bg-gradient-to-br from-rose-50 to-white rounded-2xl p-4 border border-rose-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 text-4xl opacity-5 group-hover:scale-110 transition-transform">💭</div>
            <div className="flex justify-between items-center mb-2 relative z-10">
               <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest">最新记录</span>
               <span className="text-[10px] text-gray-400">{format(latestMemory.createdAt, 'MM/dd')}</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed relative z-10">"{latestMemory.content}"</p>
          </div>
        )}

      </div>
      <AnimatePresence>
        {showSettings && <SettingsModal data={data} setData={setData} onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </>
  );
}

