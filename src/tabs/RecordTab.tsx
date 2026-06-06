import { useState } from 'react';
import { CoupleData, ActiveUser, TimelineItem, Mood, RecordTag } from '../types';
import { Send, Image as ImageIcon, Heart, Lock, Globe2, Tag as TagIcon, Plus, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef } from 'react';

const MOODS: Record<string, { emoji: string; label: string }> = {
  happy: { emoji: '🥰', label: '开心' },
  loved: { emoji: '❤️', label: '想贴贴' },
  tired: { emoji: '😮‍💨', label: '心累' },
  sad: { emoji: '🥺', label: '难过' },
  angry: { emoji: '😤', label: '生气' },
  normal: { emoji: '🙂', label: '平静' },
};

const AVAILABLE_TAGS: RecordTag[] = ['日常', '吃饭', '旅行', '吵架', '纪念日'];

export function RecordTab({ data, setData, currentUser, initRecordEditor, setInitRecordEditor }: { data: CoupleData, setData: React.Dispatch<React.SetStateAction<CoupleData>>, currentUser: ActiveUser, initRecordEditor?: boolean, setInitRecordEditor?: (b: boolean)=>void }) {
  const [newNote, setNewNote] = useState('');
  const [selectedTag, setSelectedTag] = useState<RecordTag>('日常');
  const [visibility, setVisibility] = useState<'both' | 'me'>('both');
  const [showEditor, setShowEditor] = useState(initRecordEditor || false);
  const [filterTag, setFilterTag] = useState<RecordTag | 'all'>('all');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear init prop when editor closes or unmounts
  useEffect(() => {
    if (initRecordEditor) {
      setShowEditor(true);
    }
  }, [initRecordEditor]);

  const handleCloseEditor = () => {
    setShowEditor(false);
    if (setInitRecordEditor) setInitRecordEditor(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() && !imageFile) return;

    const item: TimelineItem = {
      id: Date.now().toString(),
      type: 'note',
      content: newNote.trim(),
      author: currentUser,
      createdAt: Date.now(),
      tag: selectedTag,
      visibility: visibility,
      imageUrl: imageFile || undefined
    };

    setData(prev => ({
      ...prev,
      timeline: [item, ...prev.timeline]
    }));
    setNewNote('');
    setImageFile(null);
    setShowEditor(false);
  };

  const deleteItem = (id: string) => {
    setData(prev => ({
      ...prev,
      timeline: prev.timeline.filter(t => t.id !== id)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentUserName = currentUser === 'me' ? data.myName : data.partnerName;
  const myAvatar = currentUser === 'me' ? data.myAvatar : data.partnerAvatar;

  // Filter visible items
  const visibleTimeline = data.timeline.filter(item => {
    if (item.visibility === 'me' && item.author !== currentUser) return false;
    if (filterTag !== 'all' && item.tag !== filterTag) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#faf9f8] relative">
      <div className="py-4 px-6 bg-[#faf9f8]/90 backdrop-blur-xl sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-xl font-bold font-serif text-gray-800">我们的日常</h2>
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{visibleTimeline.filter(t => t.type === 'note').length} 条记录</span>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar px-6 pb-2">
        <button 
          onClick={() => setFilterTag('all')}
          className={`px-4 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-colors ${filterTag === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
        >
          全部
        </button>
        {AVAILABLE_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-colors ${filterTag === tag ? 'bg-rose-500 text-white shadow-sm shadow-rose-200' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))]">
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
                <div key={item.id} className="relative flex items-start gap-4 group mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#faf9f8] z-10 shrink-0">
                    <img src={authorAvatar} alt="Avatar" className="w-[34px] h-[34px] rounded-full object-cover shadow-sm border border-white" />
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-[13px] font-bold text-gray-800">{authorName}</span>
                      <span className="text-[10px] text-gray-400 font-bold tracking-wide uppercase">{format(item.createdAt, 'HH:mm')}</span>
                      {item.visibility === 'me' && <Lock className="w-3 h-3 text-gray-300 ml-auto" />}
                    </div>

                    {item.type === 'note' && (
                      <div className="bg-white p-4 rounded-[16px] rounded-tl-sm shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] border border-gray-100/50 mb-1 group/note relative">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt="attached" className="w-full h-auto rounded-xl mb-3 object-cover border border-gray-50" />
                        )}
                        <p className="text-[14px] leading-relaxed text-gray-700 whitespace-pre-wrap">{item.content}</p>
                        <div className="flex justify-between items-center mt-3">
                          {item.tag ? (
                            <div className="inline-flex items-center gap-1 bg-gray-50/80 text-gray-500 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide border border-gray-100">
                              <TagIcon className="w-2.5 h-2.5 opacity-70" />
                              {item.tag}
                            </div>
                          ) : <div />}
                          {isMe && (
                             <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover/note:opacity-100 focus:opacity-100 bg-gray-50 p-1 rounded-md">
                               <Trash2 className="w-3.5 h-3.5" />
                             </button>
                          )}
                        </div>
                      </div>
                    )}

                    {item.type === 'mood' && (
                      <div className="inline-flex items-center gap-2 p-2.5 rounded-[16px] rounded-tl-sm bg-white border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                        <span className="text-xl leading-none">{MOODS[item.content]?.emoji || '❓'}</span>
                        <span className="text-[13px] font-bold text-gray-600 pr-2">今天感觉 {MOODS[item.content]?.label}</span>
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
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEditor(true)}
            className="absolute bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-6 w-14 h-14 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.2)] z-20 hover:bg-gray-700"
          >
            <Plus className="w-6 h-6 stroke-[2.5px]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Editor Bottom Sheet */}
      <AnimatePresence>
        {showEditor && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-30"
               onClick={handleCloseEditor}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-2xl z-40 p-6 flex flex-col pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
            >
              <form onSubmit={handleSend} className="space-y-4">
                 <div className="flex justify-between items-center pb-3">
                    <button type="button" onClick={handleCloseEditor} className="text-[13px] text-gray-400 font-bold tracking-wide">取消</button>
                    <span className="text-[13px] font-bold text-gray-800 tracking-widest uppercase">记录此刻</span>
                    <button type="submit" disabled={!newNote.trim() && !imageFile} className="text-[13px] bg-gray-800 text-white px-4 py-1.5 rounded-full font-bold disabled:opacity-30 disabled:bg-gray-200 disabled:text-gray-400 transition-colors">发布</button>
                 </div>
                 
                 <div className="relative bg-[#faf9f8] rounded-2xl p-4 border border-gray-100 focus-within:bg-white focus-within:border-gray-300 transition-colors">
                   <textarea
                     value={newNote}
                     onChange={e => setNewNote(e.target.value)}
                     placeholder={`想对 ${currentUser === 'me' ? data.partnerName : data.myName} 说点什么... 或记录一下心情`}
                     className="w-full bg-transparent resize-none text-[15px] outline-none min-h-[100px] placeholder:text-gray-400 leading-relaxed"
                     autoFocus
                   />
                   {imageFile && (
                     <div className="relative mt-2 inline-block w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                       <img src={imageFile} className="w-full h-full object-cover" />
                       <button type="button" onClick={() => setImageFile(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 backdrop-blur-sm"><X className="w-3 h-3" /></button>
                     </div>
                   )}
                 </div>

                 <div className="pt-2">
                   <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                     {AVAILABLE_TAGS.map(tag => (
                       <button
                         key={tag}
                         type="button"
                         onClick={() => setSelectedTag(tag)}
                         className={`px-4 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-colors ${selectedTag === tag ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
                       >
                         {tag}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-50">
                   <div className="relative">
                     <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-500 hover:text-gray-800 bg-gray-50 rounded-full transition-colors border border-gray-100 hover:bg-gray-100">
                       <ImageIcon className="w-4 h-4" />
                     </button>
                     <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                   </div>
                   
                   <button
                     type="button"
                     onClick={() => setVisibility(v => v === 'both' ? 'me' : 'both')}
                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${visibility === 'both' ? 'text-gray-500 hover:bg-gray-50' : 'bg-gray-100 text-gray-700'}`}
                   >
                     {visibility === 'both' ? <Globe2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
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
