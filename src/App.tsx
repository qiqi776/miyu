/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Home, BookOpen, Sparkles, CalendarHeart } from 'lucide-react';
import { HomeTab } from './tabs/HomeTab';
import { RecordTab } from './tabs/RecordTab';
import { InteractTab } from './tabs/InteractTab';
import { MemoryTab } from './tabs/MemoryTab';
import { CoupleData, ActiveUser } from './types';
import { AnimatePresence, motion } from 'motion/react';

const defaultData: CoupleData = {
  startDate: new Date('2023-02-14').toISOString(),
  myName: '我',
  partnerName: '宝宝',
  myAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=fecdd3',
  partnerAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=fce7f3',
  myMood: 'none',
  partnerMood: 'loved',
  timeline: [
    { id: '1', type: 'milestone', content: '我们相遇啦！', author: 'system', createdAt: new Date('2023-02-14').getTime(), tag: '纪念日' },
    { id: '2', type: 'mood', content: 'loved', author: 'partner', createdAt: Date.now() - 3600000 },
    { id: '3', type: 'note', content: '今天的天气好好呀，想你！', author: 'me', createdAt: Date.now() - 1000000, tag: '日常', visibility: 'both' },
  ],
  dailyQuestions: [
    {
      id: 'q1',
      date: new Date().toISOString().split('T')[0],
      question: '今天最开心的小事是？',
      partnerAnswer: '晚上吃到了好吃的蛋糕！'
    }
  ],
  dailyTasks: [
    { id: 't1', title: '晚上谁洗碗', assignee: 'undecided', completed: false },
    { id: 't2', title: '拿下快递', assignee: 'me', completed: false },
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'record' | 'interact' | 'memory'>('home');
  const [initRecordEditor, setInitRecordEditor] = useState(false);
  const [data, setData] = useState<CoupleData>(defaultData);
  const [currentUser, setCurrentUser] = useState<ActiveUser>('me');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('lovespace_v2');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved data');
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('lovespace_v2', JSON.stringify(data));
  }, [data]);

  return (
    <div className="flex flex-col h-[100dvh] bg-stone-100 text-gray-800 font-sans selection:bg-rose-200 items-center justify-center">
      {/* Top Banner specific to offline demo */}
      <div className="w-full bg-rose-100 text-rose-800 text-[10px] text-center py-1.5 flex justify-center items-center gap-2 absolute top-0 z-50">
        <span>当前体验身份:</span>
        <button 
          onClick={() => setCurrentUser('me')} 
          className={`px-2.5 py-0.5 rounded-full font-bold transition-colors ${currentUser === 'me' ? 'bg-rose-500 text-white' : 'bg-white/50 text-rose-600 hover:bg-white'}`}
        >
          {data.myName}
        </button>
        <button 
          onClick={() => setCurrentUser('partner')} 
          className={`px-2.5 py-0.5 rounded-full font-bold transition-colors ${currentUser === 'partner' ? 'bg-rose-500 text-white' : 'bg-white/50 text-rose-600 hover:bg-white'}`}
        >
          {data.partnerName}
        </button>
      </div>
      
      <main className="flex-1 overflow-hidden w-full max-w-md mx-auto bg-[#faf9f8] shadow-2xl relative md:max-h-[850px] md:h-full md:rounded-[2.5rem] md:border-8 md:border-white w-full flex flex-col mt-7 md:mt-10">
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
                <HomeTab data={data} setData={setData} currentUser={currentUser} setActiveTab={setActiveTab} setInitRecordEditor={setInitRecordEditor} />
              </motion.div>
            )}
            {activeTab === 'record' && (
              <motion.div key="record" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
                <RecordTab data={data} setData={setData} currentUser={currentUser} initRecordEditor={initRecordEditor} setInitRecordEditor={setInitRecordEditor} />
              </motion.div>
            )}
            {activeTab === 'interact' && (
              <motion.div key="interact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
                <InteractTab data={data} setData={setData} currentUser={currentUser} setActiveTab={setActiveTab} />
              </motion.div>
            )}
            {activeTab === 'memory' && (
              <motion.div key="memory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
                <MemoryTab data={data} setData={setData} currentUser={currentUser} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <nav className="w-full bg-white/50 backdrop-blur-3xl border-t border-gray-100 flex justify-around items-center h-[calc(4rem+env(safe-area-inset-bottom))] px-4 shrink-0 pb-[env(safe-area-inset-bottom)] z-50 md:rounded-b-[2rem] shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${activeTab === 'home' ? 'text-gray-900 bg-gray-50 drop-shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Home className="w-[22px] h-[22px]" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            {activeTab === 'home' && <span className="text-[9px] mt-0.5 font-bold tracking-widest">首页</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('record')}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${activeTab === 'record' ? 'text-gray-900 bg-gray-50 drop-shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BookOpen className="w-[22px] h-[22px]" strokeWidth={activeTab === 'record' ? 2.5 : 2} />
            {activeTab === 'record' && <span className="text-[9px] mt-0.5 font-bold tracking-widest">记录</span>}
          </button>

          <button
            onClick={() => setActiveTab('interact')}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${activeTab === 'interact' ? 'text-gray-900 bg-gray-50 drop-shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Sparkles className="w-[22px] h-[22px]" strokeWidth={activeTab === 'interact' ? 2.5 : 2} />
            {activeTab === 'interact' && <span className="text-[9px] mt-0.5 font-bold tracking-widest">互动</span>}
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${activeTab === 'memory' ? 'text-gray-900 bg-gray-50 drop-shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <CalendarHeart className="w-[22px] h-[22px]" strokeWidth={activeTab === 'memory' ? 2.5 : 2} />
            {activeTab === 'memory' && <span className="text-[9px] mt-0.5 font-bold tracking-widest">回忆</span>}
          </button>
        </nav>
      </main>
    </div>
  );
}
