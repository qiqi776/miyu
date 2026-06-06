import { useState } from 'react';
import { CoupleData, ActiveUser, TimelineItem, Mood, RecordTag } from '../types';
import { Send, Image as ImageIcon, Heart, Lock, Globe2, Tag as TagIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

const MOODS: Record<string, { emoji: string; label: string }> = {
  happy: { emoji: '🥰', label: '开心' },
  loved: { emoji: '❤️', label: '想贴贴' },
  tired: { emoji: '😮‍💨', label: '心累' },
  sad: { emoji: '🥺', label: '难过' },
  angry: { emoji: '😤', label: '生气' },
  normal: { emoji: '🙂', label: '平静' },
};

const AVAILABLE_TAGS: RecordTag[] = ['日常', '吃饭', '旅行', '吵架', '纪念日'];

export function RecordTab({ data, setData, currentUser }: { data: CoupleData, setData: React.Dispatch<React.SetStateAction<CoupleData>>, currentUser: ActiveUser }) {
  const [newNote, setNewNote] = useState('');
  const [selectedTag, setSelectedTag] = useState<RecordTag>('日常');
  const [visibility, setVisibility] = useState<'both' | 'me'>('both');
  const [showEditor, setShowEditor] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const item: TimelineItem = {
      id: Date.now().toString(),
      type: 'note',
      content: newNote.trim(),
      author: currentUser,
      createdAt: Date.now(),
      tag: selectedTag,
      visibility: visibility
    };

    setData(prev => ({
      ...prev,
      timeline: [item, ...prev.timeline]
    }));
    setNewNote('');
    setShowEditor(false);
  };

  const currentUserName = currentUser === 'me' ? data.myName : data.partnerName;
  const myAvatar = currentUser === 'me' ? data.myAvatar : data.partnerAvatar;

  // Filter visible items
  const visibleTimeline = data.timeline.filter(item => {
    if (item.visibility === 'me' && item.author !== currentUser) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#faf9f8]">
      <div className="p-5 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <h2 className="text-xl font-bold font-serif text-gray-800">我们的日常</h2>
        <span className="text-xs text-rose-500 bg-rose-50 px-2 py-1 rounded-full font-medium">{visibleTimeline.filter(t => t.type === 'note').length} 条记录</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-28">
        {visibleTimeline.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <Heart className="w-12 h-12 mx-auto text-rose-200 mb-3" />
            <p className="text-sm">时间轴空空如也，记录一下今天吧~</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-rose-100">
            {visibleTimeline.map((item) => {
              const isMe = item.author === currentUser;
              const isSystem = item.author === 'system';

              if (isSystem || item.type === 'milestone') {
                return (
                  <div key={item.id} className="relative flex items-center justify-center py-4">
                     <span className="bg-rose-100 text-rose-600 text-xs px-4 py-1.5 rounded-full font-bold z-10 shadow-sm border border-rose-200 flex items-center gap-1.5">
                       ✨ {format(item.createdAt, 'yyyy/MM/dd')} · {item.content}
                     </span>
                  </div>
                );
              }

              const authorAvatar = item.author === 'me' ? data.myAvatar : data.partnerAvatar;
              const authorName = item.author === 'me' ? data.myName : data.partnerName;

              return (
                <div key={item.id} className="relative flex items-start gap-4 group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#faf9f8] bg-white shadow-sm z-10 shrink-0">
                    <img src={authorAvatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-sm font-bold text-gray-800">{authorName}</span>
                      <span className="text-[11px] text-gray-400 font-medium tracking-wide">{format(item.createdAt, 'HH:mm')}</span>
                      {item.visibility === 'me' && <Lock className="w-3 h-3 text-gray-400 ml-auto" />}
                    </div>

                    {item.type === 'note' && (
                      <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 mb-1">
                        <p className="text-[14px] leading-relaxed text-gray-700 whitespace-pre-wrap">{item.content}</p>
                        {item.tag && (
                          <div className="mt-3 inline-flex items-center gap-1 bg-gray-50 text-gray-500 px-2 py-1 rounded-md text-[10px] font-medium border border-gray-100">
                            <TagIcon className="w-3 h-3" />
                            {item.tag}
                          </div>
                        )}
                      </div>
                    )}

                    {item.type === 'mood' && (
                      <div className="inline-flex items-center gap-2 p-3 rounded-2xl rounded-tl-sm bg-rose-50/50 border border-rose-100 shadow-sm">
                        <span className="text-2xl">{MOODS[item.content]?.emoji || '❓'}</span>
                        <span className="text-sm font-bold text-rose-800">今天感觉 {MOODS[item.content]?.label}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {!showEditor && (
          <motion.button 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setShowEditor(true)}
            className="absolute bottom-20 right-5 w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-200 active:scale-95 transition-transform z-20 hover:bg-rose-600"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Editor Bottom Sheet */}
      <AnimatePresence>
        {showEditor && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30"
               onClick={() => setShowEditor(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40 p-5 flex flex-col"
            >
              <form onSubmit={handleSend} className="space-y-4">
                 <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <button type="button" onClick={() => setShowEditor(false)} className="text-sm text-gray-500 font-medium">取消</button>
                    <span className="text-sm font-bold text-gray-800">记录此刻</span>
                    <button type="submit" disabled={!newNote.trim()} className="text-sm text-rose-500 font-bold disabled:opacity-50">发布</button>
                 </div>
                 
                 <textarea
                   value={newNote}
                   onChange={e => setNewNote(e.target.value)}
                   placeholder={`想对 ${currentUser === 'me' ? data.partnerName : data.myName} 说点什么... 或记录一下心情`}
                   className="w-full bg-transparent resize-none text-[15px] outline-none min-h-[100px] placeholder:text-gray-300"
                   autoFocus
                 />

                 <div>
                   <p className="text-[10px] text-gray-400 font-medium mb-2 uppercase tracking-widest">选择标签</p>
                   <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                     {AVAILABLE_TAGS.map(tag => (
                       <button
                         key={tag}
                         type="button"
                         onClick={() => setSelectedTag(tag)}
                         className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${selectedTag === tag ? 'bg-rose-500 text-white' : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'}`}
                       >
                         {tag}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="flex justify-between items-center pt-2">
                   <button type="button" className="p-2 text-gray-400 hover:text-rose-500 bg-gray-50 rounded-full transition-colors border border-gray-100">
                     <ImageIcon className="w-4 h-4" />
                   </button>
                   
                   <button
                     type="button"
                     onClick={() => setVisibility(v => v === 'both' ? 'me' : 'both')}
                     className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-600 border border-gray-100"
                   >
                     {visibility === 'both' ? <Globe2 className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-gray-400" />}
                     {visibility === 'both' ? '双方可见' : '仅自己可见'}
                   </button>
                 </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
