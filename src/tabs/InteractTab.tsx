import { useState } from 'react';
import { CoupleData, ActiveUser } from '../types';
import { Gamepad2, Gift, Dice5, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DECISION_CATEGORIES = [
  { id: 'chores', name: '谁做家务', options: ['我做啦', '宝宝做', '一起做！', '石头剪刀布'], icon: '🧹' },
  { id: 'food', name: '吃什么', options: ['火锅', '烧烤', '日料', '轻食', '随便', '你定'], icon: '🍔' },
  { id: 'weekend', name: '去哪玩', options: ['逛街', '看电影', '周边游', '宅家打游戏', '去公园'], icon: '🎡' },
];

export function InteractTab({ data, currentUser }: { data: CoupleData, setData: React.Dispatch<React.SetStateAction<CoupleData>>, currentUser: ActiveUser }) {
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
      // Wheel spins clockwise, so we need to reverse the angle logic
      const sliceAngle = 360 / selectedCategory.options.length;
      const normalizedAngle = (360 - (targetRotation % 360)) % 360;
      const winnerIndex = Math.floor(normalizedAngle / sliceAngle);
      
      setResult(selectedCategory.options[winnerIndex]);
      setIsSpinning(false);
    }, 3000); // UI transition duration is 3s
  };

  return (
    <div className="p-6 pb-24 h-full overflow-y-auto bg-gradient-to-b from-rose-50 to-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-serif text-gray-800">趣味互动</h2>
        <p className="text-sm text-gray-500 mt-1">今天不想做决定？交给运气吧！</p>
      </div>

      {/* Decision Wheel */}
      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-rose-100/50 border border-rose-100 flex flex-col items-center">
        
        {/* Category Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto w-full pb-2 hide-scrollbar">
          {DECISION_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                if(isSpinning) return;
                setSelectedCategory(cat);
                setResult(null);
                setRotation(0);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory.id === cat.id 
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200' 
                  : 'bg-rose-50 text-gray-600 hover:bg-rose-100'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* The Wheel */}
        <div className="relative w-64 h-64 mb-6">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -ml-3 -mt-2 w-6 h-8 z-20" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}>
            <div className="w-full h-full bg-rose-600 shadow-md"></div>
          </div>
          
          {/* Wheel Circle */}
          <div 
            className="w-full h-full rounded-full border-4 border-rose-100 relative overflow-hidden shadow-inner transition-transform ease-out"
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
              
              // CSS for pie slices
              return (
                <div 
                  key={index}
                  className={`absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left ${isEven ? 'bg-rose-200' : 'bg-rose-100'}`}
                  style={{
                    transform: `rotate(${rotate}deg) skewY(-${skew}deg)`,
                  }}
                >
                  <div 
                     className="absolute w-full h-full pt-4 flex justify-center text-xs font-bold text-gray-700"
                     style={{
                        transform: `skewY(${skew}deg) rotate(${angle / 2}deg)`,
                        transformOrigin: 'bottom left'
                     }}
                  >
                    <span className="origin-bottom -translate-y-8 absolute w-16 text-center leading-tight">
                      {option}
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="absolute inset-0 rounded-full border-[10px] border-white/20"></div>
          </div>

          {/* Center Button */}
          <button 
            onClick={spinWheel}
            disabled={isSpinning}
            className="absolute top-1/2 left-1/2 -ml-8 -mt-8 w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-rose-100 active:scale-95 transition-transform disabled:opacity-80 z-10"
          >
            <RefreshCcw className={`w-5 h-5 text-rose-500 mb-1 ${isSpinning ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-bold text-rose-500">GO</span>
          </button>
        </div>

        {/* Result Area */}
        <div className="h-14 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-rose-50 px-6 py-3 rounded-2xl border border-rose-100 w-full text-center"
              >
                <div className="text-xs text-rose-400 mb-1">结果是：</div>
                <div className="text-xl font-bold text-gray-800">{result}</div>
              </motion.div>
            ) : (
               <div className="text-sm text-gray-400 font-medium tracking-widest uppercase">
                 ... 等待抽取 ...
               </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mini Games Placeholder */}
      <h3 className="text-lg font-bold font-serif text-gray-800 mt-8 mb-4">更多小互动</h3>
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-emerald-200 transition-colors cursor-pointer">
           <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
             <Dice5 className="w-6 h-6 text-emerald-500" />
           </div>
           <span className="text-sm font-medium text-gray-700">摇色子</span>
         </div>
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-purple-200 transition-colors cursor-pointer opacity-70">
           <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
             <Gamepad2 className="w-6 h-6 text-purple-500" />
           </div>
           <span className="text-sm font-medium text-gray-700">默契问答 (开发中)</span>
           <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full absolute top-2 right-2">Soon</span>
         </div>
      </div>
    </div>
  );
}
