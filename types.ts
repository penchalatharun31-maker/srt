export type View = 'Dashboard' | 'Content Studio' | 'Scheduler' | 'Engagement' | 'Referrals' | 'Strategic Planner' | 'Multiplier' | 'Settings';

export interface PostIdea {
  title: string;
  content: string;
  hashtags: string;
}

export interface PostPerformance {
    likes: number;
    comments: number;
    shares: number;
}

export interface PostVariant {
    content: string;
    performance?: PostPerformance;
}

export interface ScheduledPost {
    id: number;
    platform: 'LinkedIn' | 'Instagram' | 'Twitter';
    scheduledTime: string;
    day: string;
    isABTest: boolean;
    content?: string; // For single posts
    variantA?: PostVariant; // For A/B tests
    variantB?: PostVariant; // For A/B tests
    winner?: 'A' | 'B' | 'Tie' | 'Pending' | null; // To show results
}


export interface Comment {
    id: number;
    user: string;
    avatar: string;
    text: string;
}

export interface BrandProfile {
    companyDescription: string;
    targetAudience: string;
    brandVoice: string[];
    knowledgeBase: string;
    linkedInConnected: boolean;
    instagramConnected: boolean;
    twitterConnected: boolean;
}

export interface StrategicPlanItem {
    day: string;
    time: string;
    platform: 'LinkedIn' | 'Instagram' | 'Twitter';
    topic: string;
    format: string;
    reasoning: string;
}

export interface MultipliedContent {
    linkedInArticle: string;
    twitterThread: { tweet: string }[];
    instagramCarousel: { slide: number; content: string }[];
}

export interface Notification {
    message: string;
    type: 'success' | 'error';
}