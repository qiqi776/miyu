export type Mood = 'happy' | 'loved' | 'tired' | 'sad' | 'angry' | 'normal' | 'none';

export type RecordTag = '日常' | '吃饭' | '旅行' | '吵架' | '纪念日';

export interface TimelineItem {
  id: string;
  type: 'note' | 'mood' | 'milestone';
  content: string;
  author: 'me' | 'partner' | 'system';
  createdAt: number;
  tag?: RecordTag;
  visibility?: 'both' | 'me';
  imageUrl?: string;
}

export interface DailyTask {
  id: string;
  title: string;
  assignee: 'me' | 'partner' | 'undecided';
  completed: boolean;
  repeat?: 'none' | 'daily' | 'weekly';
}

export interface DailyQuestion {
  id: string;
  date: string; // YYYY-MM-DD
  question: string;
  myAnswer?: string;
  partnerAnswer?: string;
}

export interface CoupleData {
  startDate: string; // ISO string
  myName: string;
  partnerName: string;
  myAvatar: string;
  partnerAvatar: string;
  myMood: Mood;
  partnerMood: Mood;
  timeline: TimelineItem[];
  dailyQuestions: DailyQuestion[];
  dailyTasks: DailyTask[];
}

export type ActiveUser = 'me' | 'partner';

