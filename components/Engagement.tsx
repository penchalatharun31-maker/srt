import React, { useState, useEffect } from 'react';
import { generateCommentReply } from '../services/geminiService';
import type { Comment } from '../types';
import { useAppStore } from '../store/appStore';
import { SparklesIcon } from './icons/SparklesIcon';

const mockCommentsByPlatform: { [key: string]: Comment[] } = {
    LinkedIn: [
        { id: 1, user: 'Ben Carter', avatar: 'https://picsum.photos/id/1011/100', text: 'This is a great analysis. How do you see this evolving with the rise of AI tools?' },
        { id: 2, user: 'Priya Singh', avatar: 'https://picsum.photos/id/1012/100', text: 'Excellent points on data-driven strategy. We implemented a similar approach and saw a 30% uplift in conversions.' },
    ],
    Instagram: [
        { id: 3, user: 'Olivia Chen', avatar: 'https://picsum.photos/id/1027/100', text: 'Thanks for sharing! Really insightful post. ❤️' },
        { id: 4, user: 'Casey Lee', avatar: 'https://picsum.photos/id/1025/100', text: 'Love the aesthetic in this shot! What camera did you use?' },
    ],
    Twitter: [
        { id: 5, user: 'Marcus Reid', avatar: 'https://picsum.photos/id/1005/100', text: 'I have a different perspective. I think the human element will become even more critical in the age of AI. #FutureOfWork' },
        { id: 6, user: 'Zoe Kim', avatar: 'https://picsum.photos/id/1013/100', text: 'Quick question - does this apply to B2C as well or is it more of a B2B strategy?' },
    ]
};


const Engagement: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
    const [replies, setReplies] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { brandProfile, showNotification } = useAppStore();
    const [activePlatform, setActivePlatform] = useState<string>('');
    
    const connectedPlatforms = [
        ...(brandProfile?.linkedInConnected ? ['LinkedIn'] : []),
        ...(brandProfile?.instagramConnected ? ['Instagram'] : []),
        ...(brandProfile?.twitterConnected ? ['Twitter'] : []),
    ];

    useEffect(() => {
        // Set a default platform only if the current one is invalid or not set
        if (connectedPlatforms.length > 0 && !connectedPlatforms.includes(activePlatform)) {
            setActivePlatform(connectedPlatforms[0]);
        } else if (connectedPlatforms.length === 0) {
            setActivePlatform('');
        }
    }, [brandProfile, activePlatform]);

    useEffect(() => {
        if (activePlatform) {
            setComments(mockCommentsByPlatform[activePlatform] || []);
            setActiveCommentId(null); // Reset replies when platform changes
            setReplies([]);
        } else {
            setComments([]);
        }
    }, [activePlatform]);


    const mockPost = `Your latest ${activePlatform} Post: The Importance of Data-Driven Content Strategy in 2024.`;

    const handleGenerateReplies = async (comment: Comment) => {
        setActiveCommentId(comment.id);
        setIsLoading(true);
        setReplies([]);
        console.log(`--- SIMULATING API CALL: Fetching comments for post on ${activePlatform} ---`);
        try {
            const responseText = await generateCommentReply(mockPost, comment.text, brandProfile);
            const parsedResponse = JSON.parse(responseText);
            setReplies(parsedResponse.replies || []);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
            showNotification({ message, type: 'error' });
            setReplies(['Could not generate replies.']);
            console.error(e);
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Engagement Assistant</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Reply to comments intelligently and save time with on-brand suggestions.</p>

            {connectedPlatforms.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-4 px-6" aria-label="Tabs">
                            {connectedPlatforms.map((platform) => (
                                <button
                                    key={platform}
                                    onClick={() => setActivePlatform(platform)}
                                    className={`${
                                    platform === activePlatform
                                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    {platform}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        <h3 className="font-semibold text-lg mb-4">Comments on: <span className="text-indigo-600 dark:text-indigo-400">"{mockPost}"</span></h3>
                        <div className="space-y-6">
                            {comments.map(comment => (
                                <div key={comment.id}>
                                    <div className="flex items-start space-x-4">
                                        <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{comment.user}</p>
                                            <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                                            <button
                                                onClick={() => handleGenerateReplies(comment)}
                                                disabled={isLoading && activeCommentId === comment.id}
                                                className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium flex items-center disabled:opacity-50"
                                            >
                                                <SparklesIcon className="w-4 h-4 mr-1" />
                                                Generate Reply
                                            </button>
                                        </div>
                                    </div>
                                    {activeCommentId === comment.id && (
                                        <div className="mt-4 ml-14 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                                            {isLoading ? (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Generating...</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-semibold">Suggested Replies:</h4>
                                                    {replies.map((reply, index) => (
                                                        <p key={index} className="text-sm p-3 bg-gray-100 dark:bg-gray-700 rounded-md">{reply}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-2">Connect an Account to See Comments</h2>
                    <p className="text-gray-600 dark:text-gray-400">Go to Settings to connect an account to start using the Engagement Assistant.</p>
                </div>
            )}
        </div>
    );
};

export default Engagement;