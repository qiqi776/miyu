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
    <div className="flex flex-col h-screen bg-rose-50 text-gray-800 font-sans selection:bg-rose-200">
      {/* Top Banner specific to offline demo */}
      <div className="w-full max-w-md mx-auto bg-rose-100 text-rose-800 text-[10px] text-center py-1 flex justify-center items-center gap-2">
        <span>当前体验身份:</span>
        <button 
          onClick={() => setCurrentUser('me')} 
          className={`px-2 py-0.5 rounded-full font-medium ${currentUser === 'me' ? 'bg-rose-500 text-white' : 'bg-white/50 text-rose-600'}`}
        >
          {data.myName}
        </button>
        <button 
          onClick={() => setCurrentUser('partner')} 
          className={`px-2 py-0.5 rounded-full font-medium ${currentUser === 'partner' ? 'bg-rose-500 text-white' : 'bg-white/50 text-rose-600'}`}
        >
          {data.partnerName}
        </button>
      </div>
      
      <main className="flex-1 overflow-hidden w-full max-w-md mx-auto bg-white shadow-xl relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
              <HomeTab data={data} setData={setData} currentUser={currentUser} />
            </motion.div>
          )}
          {activeTab === 'record' && (
            <motion.div key="record" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
              <RecordTab data={data} setData={setData} currentUser={currentUser} />
            </motion.div>
          )}
          {activeTab === 'interact' && (
            <motion.div key="interact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
              <InteractTab data={data} setData={setData} currentUser={currentUser} />
            </motion.div>
          )}
          {activeTab === 'memory' && (
            <motion.div key="memory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
              <MemoryTab data={data} setData={setData} currentUser={currentUser} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-rose-100 flex justify-around items-center h-16 px-2 shrink-0 pb-safe z-50">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center w-16 transition-colors ${activeTab === 'home' ? 'text-rose-500' : 'text-gray-400 hover:text-rose-300'}`}
          >
            <Home className={`w-6 h-6 ${activeTab === 'home' ? 'fill-rose-50' : ''}`} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">首页</span>
          </button>
          
          <button
            onClick={() => setActiveTab('record')}
            className={`flex flex-col items-center justify-center w-16 transition-colors ${activeTab === 'record' ? 'text-rose-500' : 'text-gray-400 hover:text-rose-300'}`}
          >
            <BookOpen className={`w-6 h-6 ${activeTab === 'record' ? 'fill-rose-50' : ''}`} strokeWidth={activeTab === 'record' ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">记录</span>
          </button>

          <button
            onClick={() => setActiveTab('interact')}
            className={`flex flex-col items-center justify-center w-16 transition-colors ${activeTab === 'interact' ? 'text-rose-500' : 'text-gray-400 hover:text-rose-300'}`}
          >
            <Sparkles className={`w-6 h-6 ${activeTab === 'interact' ? 'fill-rose-50' : ''}`} strokeWidth={activeTab === 'interact' ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">互动</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex flex-col items-center justify-center w-16 transition-colors ${activeTab === 'memory' ? 'text-rose-500' : 'text-gray-400 hover:text-rose-300'}`}
          >
            <CalendarHeart className={`w-6 h-6 ${activeTab === 'memory' ? 'fill-rose-50' : ''}`} strokeWidth={activeTab === 'memory' ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">回忆</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
