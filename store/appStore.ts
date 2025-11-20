

import { create } from 'zustand';
import type { View, BrandProfile, ScheduledPost, Notification, PostPerformance } from '../types';

// --- Default/Initial Data ---
const defaultBrandProfile: BrandProfile = {
    companyDescription: '',
    targetAudience: '',
    brandVoice: [],
    knowledgeBase: '',
    linkedInConnected: false,
    instagramConnected: false,
    twitterConnected: false,
};

const initialPostsForStore: ScheduledPost[] = [
    {
        id: 1, platform: 'LinkedIn', content: 'Excited to share our Q3 growth report! We\'ve seen a 25% increase in user engagement...',
        scheduledTime: '9:00 AM', day: 'Monday', isABTest: false
    },
    {
        id: 4,
        platform: 'Instagram',
        scheduledTime: '2:00 PM',
        day: 'Tuesday',
        isABTest: true,
        variantA: {
            content: 'Our new A/B testing feature is a game-changer! See how it works.',
            performance: { likes: 120, comments: 15, shares: 8 }
        },
        variantB: {
            content: 'Boost your engagement with our powerful new A/B testing feature. Check it out.',
            performance: { likes: 180, comments: 25, shares: 12 }
        },
        winner: 'B',
    },
    { id: 2, platform: 'Instagram', content: 'Behind the scenes at NexusGrowth!', scheduledTime: '12:00 PM', day: 'Wednesday', isABTest: false },
    {
        id: 3,
        platform: 'LinkedIn',
        scheduledTime: '11:00 AM',
        day: 'Friday',
        isABTest: true,
        variantA: { content: 'Top 5 tips for leveraging AI in your content strategy. Tip #1: Personalize at scale.' },
        variantB: { content: 'Unlock the power of AI in your content strategy with these 5 essential tips.' },
        winner: 'Pending',
    },
];

const initialFollowerDataForStore = [
  { name: 'Mon', LinkedIn: 4000, Instagram: 2400 },
  { name: 'Tue', LinkedIn: 3000, Instagram: 1398 },
  { name: 'Wed', LinkedIn: 2000, Instagram: 9800 },
  { name: 'Thu', LinkedIn: 2780, Instagram: 3908 },
  { name: 'Fri', LinkedIn: 1890, Instagram: 4800 },
  { name: 'Sat', LinkedIn: 2390, Instagram: 3800 },
  { name: 'Sun', LinkedIn: 3490, Instagram: 4300 },
];

const initialEngagementDataForStore = [
  { name: 'Week 1', rate: 2.1 },
  { name: 'Week 2', rate: 3.5 },
  { name: 'Week 3', rate: 2.9 },
  { name: 'Week 4', rate: 4.2 },
];
// ---------------------------------

// --- Strict Validators ---
type FollowerData = { name: string; LinkedIn: number; Instagram: number; }[];
type EngagementData = { name: string; rate: number; }[];

const isValidPost = (item: any): item is ScheduledPost => {
    if (typeof item !== 'object' || item === null) return false;

    const hasBaseFields = typeof item.id === 'number' &&
                          typeof item.platform === 'string' &&
                          typeof item.day === 'string' &&
                          typeof item.scheduledTime === 'string' &&
                          typeof item.isABTest === 'boolean';
    
    if (!hasBaseFields) return false;

    if (item.isABTest) {
        const hasVariants = typeof item.variantA === 'object' && item.variantA !== null && typeof item.variantA.content === 'string' &&
                            typeof item.variantB === 'object' && item.variantB !== null && typeof item.variantB.content === 'string';

        if (!hasVariants) return false;

        const hasWinner = typeof item.winner === 'string' || item.winner === null;
        if (!hasWinner) return false;

        // If winner is decided (and not null), performance data must exist to prevent crashes.
        if (item.winner !== 'Pending' && item.winner !== null) {
            const hasPerfA = typeof item.variantA.performance === 'object' && item.variantA.performance !== null &&
                             typeof item.variantA.performance.likes === 'number' &&
                             typeof item.variantA.performance.comments === 'number' &&
                             typeof item.variantA.performance.shares === 'number';
            
            const hasPerfB = typeof item.variantB.performance === 'object' && item.variantB.performance !== null &&
                             typeof item.variantB.performance.likes === 'number' &&
                             typeof item.variantB.performance.comments === 'number' &&
                             typeof item.variantB.performance.shares === 'number';

            if (!hasPerfA || !hasPerfB) return false;
        }
    } else {
        if (typeof item.content !== 'string') return false;
    }

    return true;
};


const isValidFollowerDataItem = (item: any): boolean => {
    return typeof item === 'object' && item !== null &&
        typeof item.name === 'string' &&
        typeof item.LinkedIn === 'number' &&
        typeof item.Instagram === 'number';
};

const isValidEngagementDataItem = (item: any): boolean => {
    return typeof item === 'object' && item !== null &&
        typeof item.name === 'string' &&
        typeof item.rate === 'number';
};

const isValidPostsArray = (data: any): data is ScheduledPost[] => Array.isArray(data) && data.every(isValidPost);
const isValidFollowerData = (data: any): data is FollowerData => Array.isArray(data) && data.every(isValidFollowerDataItem);
const isValidEngagementData = (data: any): data is EngagementData => Array.isArray(data) && data.every(isValidEngagementDataItem);
// -------------------------

/**
 * A robust, generic function to safely load and parse data from localStorage.
 * @param key The localStorage key.
 * @param fallback The default value to return if loading or parsing fails.
 * @param validator A function to check if the parsed data has the correct structure.
 * @returns The parsed data or the fallback.
 */
const loadFromStorage = <T>(key: string, fallback: T, validator: (data: any) => boolean): T => {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
        return fallback;
    }
    
    try {
        const storedValue = localStorage.getItem(key);
        if (!storedValue) {
            return fallback;
        }
        const parsed = JSON.parse(storedValue);
        
        // Validate the entire data structure. If it's not perfect, discard it.
        if (validator(parsed)) {
            // Special handling for brand profile to merge with defaults and prevent missing keys
            if (key === 'brandProfile') {
                return { ...defaultBrandProfile, ...parsed } as T;
            }
            return parsed as T;
        }
        
        // If data is invalid, clear it and return fallback
        localStorage.removeItem(key);
        return fallback;
    } catch (error) {
        console.error(`Error interacting with localStorage for key "${key}"`, error);
        // Attempt to remove potentially corrupted item, but don't fail if this also errors.
        try {
            localStorage.removeItem(key);
        } catch (removeError) {
            console.error(`Failed to remove corrupted item for key "${key}"`, removeError);
        }
        return fallback;
    }
};

interface AppState {
  currentView: View;
  isAppLaunched: boolean;
  isSidebarOpen: boolean;
  showOnboarding: boolean;
  brandProfile: BrandProfile;
  posts: ScheduledPost[];
  followerData: FollowerData;
  engagementData: EngagementData;
  postToSchedule: Partial<ScheduledPost> | null;
  notification: Notification | null;

  setCurrentView: (view: View) => void;
  launchApp: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  startOnboarding: () => void;
  completeOnboarding: () => void;
  
  saveBrandProfile: (profileToSave: BrandProfile) => void;
  updateConnectionStatus: (platform: 'LinkedIn' | 'Instagram' | 'Twitter', isConnected: boolean) => void;
  
  addPost: (post: ScheduledPost) => void;
  updatePost: (post: ScheduledPost) => void;

  updateAnalyticsData: (newData: { followerData: FollowerData, engagementData: EngagementData }) => void;

  schedulePost: (postData: Partial<ScheduledPost>) => void;
  clearPostToSchedule: () => void;
  
  showNotification: (notification: Notification) => void;
  clearNotification: () => void;
}


export const useAppStore = create<AppState>((set, get) => ({
  // --- STATE IS NOW HYDRATED SYNCHRONOUSLY ON INIT WITH STRICT VALIDATORS ---
  brandProfile: loadFromStorage<BrandProfile>('brandProfile', defaultBrandProfile, (data) => typeof data === 'object' && data !== null),
  posts: loadFromStorage<ScheduledPost[]>('scheduledPosts', initialPostsForStore, isValidPostsArray),
  followerData: loadFromStorage<FollowerData>('followerData', initialFollowerDataForStore, isValidFollowerData),
  engagementData: loadFromStorage<EngagementData>('engagementData', initialEngagementDataForStore, isValidEngagementData),
  
  currentView: 'Dashboard',
  isAppLaunched: false,
  isSidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
  showOnboarding: false,
  postToSchedule: null,
  notification: null,

  // --- ACTIONS ---
  setCurrentView: (view) => set({ currentView: view }),
  launchApp: () => set({ isAppLaunched: true }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  startOnboarding: () => set({ showOnboarding: true }),
  completeOnboarding: () => {
    try {
        localStorage.setItem('hasCompletedOnboarding', 'true');
    } catch (e) {
        console.error("Could not save onboarding status to localStorage:", e);
    }
    set({ showOnboarding: false });
  },

  saveBrandProfile: (profileToSave) => {
    try {
        localStorage.setItem('brandProfile', JSON.stringify(profileToSave));
        set({ brandProfile: profileToSave });
        get().showNotification({ message: 'Brand profile saved!', type: 'success' });
    } catch (e) {
        console.error("Could not save brand profile to localStorage:", e);
        get().showNotification({ message: 'Failed to save settings.', type: 'error' });
    }
  },
  
  updateConnectionStatus: (platform, isConnected) => {
    const currentProfile = get().brandProfile;
    const connectionKeys = {
        LinkedIn: 'linkedInConnected',
        Instagram: 'instagramConnected',
        Twitter: 'twitterConnected',
    };
    const key = connectionKeys[platform];
    const updatedProfile = { ...currentProfile, [key]: isConnected };
    get().saveBrandProfile(updatedProfile);
  },

  addPost: (post) => {
    const updatedPosts = [...get().posts, post];
    try {
        localStorage.setItem('scheduledPosts', JSON.stringify(updatedPosts));
        set({ posts: updatedPosts });
        get().showNotification({ message: 'Post scheduled successfully!', type: 'success' });
    } catch (e) {
        console.error("Could not save posts to localStorage:", e);
        get().showNotification({ message: 'Failed to schedule post.', type: 'error' });
    }
  },
  
  updatePost: (updatedPost) => {
    const updatedPosts = get().posts.map(p => p.id === updatedPost.id ? updatedPost : p);
     try {
        localStorage.setItem('scheduledPosts', JSON.stringify(updatedPosts));
        set({ posts: updatedPosts });
    } catch (e) {
        console.error("Could not update posts in localStorage:", e);
        get().showNotification({ message: 'Failed to update post data.', type: 'error' });
    }
  },
  
  updateAnalyticsData: (newData) => {
      try {
          localStorage.setItem('followerData', JSON.stringify(newData.followerData));
          localStorage.setItem('engagementData', JSON.stringify(newData.engagementData));
          set({ followerData: newData.followerData, engagementData: newData.engagementData });
      } catch (e) {
          console.error("Could not save analytics data to localStorage:", e);
          get().showNotification({ message: 'Failed to refresh analytics.', type: 'error' });
      }
  },
  
  schedulePost: (postData) => {
    set({ postToSchedule: postData, currentView: 'Scheduler' });
  },
  
  clearPostToSchedule: () => set({ postToSchedule: null }),

  showNotification: (notification) => set({ notification }),
  clearNotification: () => set({ notification: null }),
}));