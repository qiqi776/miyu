import { useState } from 'react';
import { CoupleData, ActiveUser } from '../types';
import { Gamepad2, Gift, Dice5, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DECISION_CATEGORIES = [
  { id: 'chores', name: '谁做家务', options: ['我做啦', '宝宝做', '一起做！', '石头剪刀布'], icon: '🧹' },
  { id: 'food', name: '吃什么', options: ['火锅', '烧烤', '日料', '轻食', '随便', '你定'], icon: '🍔' },
  { id: 'weekend', name: '去哪玩', options: ['逛街', '看电影', '周边游', '宅家打游戏', '去公园'], icon: '🎡' },
];

export function InteractTab({ data, setData, currentUser, setActiveTab }: { data: CoupleData, setData: React.Dispatch<React.SetStateAction<CoupleData>>, currentUser: ActiveUser, setActiveTab: (t: 'home'|'record'|'interact'|'memory')=>void }) {
  const [selectedCategory, setSelectedCategory] = useState(DECISION_CATEGORIES[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    const spins = 5; // Spin 5 full times minimum
    const randomAngle = Math.floor(Math.random() * 360);
    const targetRotation = rotation + (spins * 360) + randomAngle;

    setRotation(targetRotation);

    setTimeout(() => {
      // Calculate which slice it landed on
      const sliceAngle = 360 / selectedCategory.options.length;
      const normalizedAngle = (360 - (targetRotation % 360)) % 360;
      const winnerIndex = Math.floor(normalizedAngle / sliceAngle);
      
      const winningOption = selectedCategory.options[winnerIndex];
      setResult(winningOption);
      setIsSpinning(false);
    }, 3000); // UI transition duration is 3s
  };

  const generateTask = () => {
    if (!result || selectedCategory.id !== 'chores') return;
    let assignee: 'me' | 'partner' | 'undecided' = 'undecided';
    if (result.includes('我')) assignee = currentUser;
    if (result.includes('宝')) assignee = currentUser === 'me' ? 'partner' : 'me';
    
    const title = `家务任务: 轮到${result}`;
    setData(prev => ({
      ...prev,
      dailyTasks: [
        ...prev.dailyTasks,
        { id: 't_' + Date.now(), title, assignee, completed: false, repeat: 'none' }
      ]
    }));
    setActiveTab('home');
  };

  const todayQuestion = data.dailyQuestions[0];
  const myAnswerField = currentUser === 'me' ? 'myAnswer' : 'partnerAnswer';
  const theirAnswerField = currentUser === 'me' ? 'partnerAnswer' : 'myAnswer';
  const myAnswer = todayQuestion?.[myAnswerField];
  const theirAnswer = todayQuestion?.[theirAnswerField];

  const handleAnswerQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const answer = (fd.get('answer') as string).trim();
    if (!answer || !todayQuestion) return;

    setData(prev => ({
      ...prev,
      dailyQuestions: prev.dailyQuestions.map(q => 
        q.id === todayQuestion.id ? { ...q, [myAnswerField]: answer } : q
      ),
      timeline: [
        {
          id: Date.now().toString(),
          type: 'note',
          content: `回答了每日一问：“${answer}”`,
          author: currentUser,
          createdAt: Date.now(),
          tag: '日常'
        },
        ...prev.timeline
      ]
    }));
  };

  return (
    <div className="px-6 pt-6 pb-[calc(4rem+env(safe-area-inset-bottom)+2rem)] h-full overflow-y-auto bg-[#faf9f8]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold font-serif text-gray-800">默契互动</h2>
      </div>

      {/* Daily Question */}
      {todayQuestion && (
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">每日问答</span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{todayQuestion.date}</span>
          </div>
          
          <h3 className="text-lg font-bold mb-6 leading-snug text-gray-800">{todayQuestion.question}</h3>
          
          <div className="space-y-4">
            {myAnswer ? (
              <div className="space-y-4">
                <div className="bg-[#faf9f8] rounded-2xl p-4 border border-gray-100">
                  <div className="text-[11px] text-gray-500 mb-1 flex justify-between font-bold">
                    <span>我的回答</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-[14px] leading-relaxed text-gray-800">{myAnswer}</p>
                </div>
                
                <div className="bg-[#faf9f8] rounded-2xl p-4 border border-gray-100">
                  <div className="text-[11px] text-gray-500 mb-1 flex justify-between font-bold">
                    <span>{currentUser === 'me' ? data.partnerName : data.myName}的回答</span>
                    {theirAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  {theirAnswer ? (
                    <p className="text-[14px] leading-relaxed text-gray-800">{theirAnswer}</p>
                  ) : (
                    <div className="flex items-center gap-2 opacity-50 pt-1">
                      <span className="text-xl">🤫</span>
                      <p className="text-[13px] font-medium text-gray-500">对方还未回答，催TA一下~</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#faf9f8] rounded-2xl p-4 border border-gray-100">
                {theirAnswer && (
                  <div className="mb-4 flex items-center gap-2 bg-white p-2.5 rounded-[12px] border border-gray-100 shadow-sm">
                    <span className="text-lg">👀</span>
                    <span className="text-[13px] font-bold text-gray-700">对方已回答，完成回答即可解锁！</span>
                  </div>
                )}
                <form onSubmit={handleAnswerQuestion} className="flex gap-2">
                  <input 
                    name="answer"
                    type="text" 
                    placeholder="写下你的答案..." 
                    className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-3 text-[14px] text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-800 transition-colors focus:ring-2 focus:ring-gray-100"
                  />
                  <button type="submit" className="bg-gray-800 text-white px-5 py-3 rounded-full text-[13px] font-bold hover:bg-gray-700 active:scale-95 transition-transform">
                    发布
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decision Wheel */}
      <h3 className="text-[13px] font-bold text-gray-800 mb-3 ml-1 tracking-wider uppercase">决定转盘</h3>
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col items-center mb-8">
        
        {/* Category Selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto w-full pb-1 hide-scrollbar">
          {DECISION_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                if(isSpinning) return;
                setSelectedCategory(cat);
                setResult(null);
                setRotation(0);
              }}
              className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                selectedCategory.id === cat.id 
                  ? 'bg-gray-800 text-white border-gray-800' 
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* The Wheel */}
        <div className="relative w-64 h-64 mb-8">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -ml-3 -mt-3 w-6 h-8 z-20 drop-shadow-md" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}>
            <div className="w-full h-full bg-gray-800"></div>
          </div>
          
          {/* Wheel Circle */}
          <div 
            className="w-full h-full rounded-full border-[6px] border-[#faf9f8] relative overflow-hidden shadow-inner transition-transform ease-out bg-white"
            style={{ 
              transform: `rotate(${rotation}deg)`,
               transitionDuration: isSpinning ? '3s' : '0s'
            }}
          >
            {selectedCategory.options.map((option, index) => {
              const numOptions = selectedCategory.options.length;
              const angle = 360 / numOptions;
              const skew = 90 - angle;
              const rotate = angle * index;
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={index}
                  className={`absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left ${isEven ? 'bg-gray-50' : 'bg-white border-l border-b border-gray-50'}`}
                  style={{
                    transform: `rotate(${rotate}deg) skewY(-${skew}deg)`,
                  }}
                >
                  <div 
                     className="absolute w-full h-full pt-4 flex justify-center text-[10px] font-bold text-gray-500 uppercase tracking-wide"
                     style={{
                        transform: `skewY(${skew}deg) rotate(${angle / 2}deg)`,
                        transformOrigin: 'bottom left'
                     }}
                  >
                    <span className="origin-bottom -translate-y-6 absolute w-16 text-center leading-tight">
                      {option}
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="absolute inset-0 rounded-full border-[12px] border-black/5 pointer-events-none"></div>
          </div>

          {/* Center Button */}
          <button 
            onClick={spinWheel}
            disabled={isSpinning}
            className="absolute top-1/2 left-1/2 -ml-8 -mt-8 w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.1)] border-4 border-[#faf9f8] active:scale-95 transition-transform disabled:opacity-80 z-10 group"
          >
            <RefreshCcw className={`w-5 h-5 text-gray-800 mb-0.5 group-hover:rotate-180 transition-transform ${isSpinning ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-bold text-gray-800 tracking-widest leading-none">GO</span>
          </button>
        </div>

        {/* Result Area */}
        <div className="min-h-16 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#faf9f8] px-6 py-4 rounded-3xl border border-gray-100 w-full text-center flex flex-col items-center"
              >
                <div className="text-[11px] font-bold text-gray-400 mb-1 tracking-widest uppercase">结果是</div>
                <div className="text-xl font-bold text-gray-800">{result}</div>
                {selectedCategory.id === 'chores' && (
                  <button onClick={generateTask} className="mt-4 bg-gray-800 text-white border border-gray-800 px-5 py-2 rounded-full text-[11px] font-bold hover:bg-gray-700 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95">
                    <span>➕ 生成家务任务</span>
                  </button>
                )}
              </motion.div>
            ) : (
               <div className="text-[11px] text-gray-300 font-bold tracking-[0.2em] uppercase">
                 ... 等待抽取 ...
               </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mini Games Placeholder */}
      <h3 className="text-[13px] font-bold text-gray-800 mb-3 ml-1 mt-8 tracking-wider uppercase">更多互动</h3>
      <div className="grid grid-cols-2 gap-3 pb-8">
         <div className="bg-white p-4 rounded-[16px] shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-gray-200 transition-colors cursor-pointer group active:scale-95">
           <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors">
             <Dice5 className="w-5 h-5 text-gray-700" />
           </div>
           <span className="text-[11px] font-bold text-gray-600 tracking-wide">摇色子</span>
         </div>
         <div className="bg-white p-4 rounded-[16px] shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-gray-200 transition-colors cursor-pointer opacity-70 group relative">
           <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
             <Gamepad2 className="w-5 h-5 text-gray-700" />
           </div>
           <span className="text-[11px] font-bold text-gray-600 tracking-wide">即将推出</span>
           <span className="text-[9px] bg-gray-100 text-gray-400 font-bold px-2 py-0.5 rounded-full absolute top-2 right-2 tracking-widest uppercase">Soon</span>
         </div>
      </div>
    </div>
  );
}
