import React, { useState, useEffect } from 'react';
import type { ScheduledPost, PostPerformance } from '../types';
import { useAppStore } from '../store/appStore';
import CreatePostModal from './modals/CreatePostModal';
import ABTestResultModal from './modals/ABTestResultModal';
import { BeakerIcon } from './icons/BeakerIcon';
import { PlusIcon } from './icons/PlusIcon';
import PlatformIcon from './icons/PlatformIcon';

/**
 * Generates realistic-looking performance data for an A/B test.
 * Randomly decides a winner and gives it better metrics.
 */
const generatePerformanceForABTest = (platform: 'LinkedIn' | 'Instagram' | 'Twitter'): { variantA: { performance: PostPerformance }, variantB: { performance: PostPerformance }, winner: 'A' | 'B' | 'Tie' } => {
    const winner = Math.random() < 0.45 ? 'A' : (Math.random() < 0.9 ? 'B' : 'Tie');

    const baseLikes = platform === 'Instagram' ? 150 : 50;
    const baseComments = platform === 'Instagram' ? 20 : 15;
    const baseShares = platform === 'Instagram' ? 10 : 25;

    const createVariantPerformance = (isWinner: boolean): PostPerformance => {
        const multiplier = isWinner ? 1.5 : 1;
        return {
            likes: Math.floor((baseLikes + Math.random() * 50) * multiplier),
            comments: Math.floor((baseComments + Math.random() * 10) * multiplier),
            shares: Math.floor((baseShares + Math.random() * 5) * multiplier),
        };
    };

    const performanceA = createVariantPerformance(winner === 'A');
    const performanceB = createVariantPerformance(winner === 'B');

    return {
        variantA: { performance: performanceA },
        variantB: { performance: performanceB },
        winner,
    };
};


const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Scheduler: React.FC = () => {
    const { posts, addPost, updatePost, brandProfile, postToSchedule, clearPostToSchedule, showNotification } = useAppStore();
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isResultModalOpen, setResultModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

    const availablePlatforms = [
        ...(brandProfile?.linkedInConnected ? ['LinkedIn'] : []),
        ...(brandProfile?.instagramConnected ? ['Instagram'] : []),
        ...(brandProfile?.twitterConnected ? ['Twitter'] : []),
    ];

    useEffect(() => {
        if (postToSchedule) {
            handleOpenCreateModal(postToSchedule.day || daysOfWeek[new Date().getDay()]);
        }
    }, [postToSchedule]);

    const handleOpenCreateModal = (day: string) => {
        setSelectedDay(day);
        setCreateModalOpen(true);
    };
    
    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        clearPostToSchedule();
    }

    const handleSavePost = (post: Omit<ScheduledPost, 'id'>) => {
        let newPost: ScheduledPost = { ...post, id: Date.now() };

        if (newPost.isABTest) {
            // Don't generate performance data immediately. Set as pending.
            newPost.winner = 'Pending';
        }

        console.log('--- SIMULATING API CALL: Scheduling post ---', {
            platform: newPost.platform,
            time: newPost.scheduledTime,
            content: newPost.isABTest ? { a: newPost.variantA?.content, b: newPost.variantB?.content } : newPost.content,
        });

        addPost(newPost);
        handleCloseCreateModal();
    };
    
    const handleOpenResultModal = (post: ScheduledPost) => {
        if (post.isABTest) {
            if (post.winner === 'Pending') {
                // Simulate fetching the results now
                console.log(`--- SIMULATING API CALL: Fetching results for A/B test ID ${post.id} ---`);
                const results = generatePerformanceForABTest(post.platform);
                const updatedPost = {
                    ...post,
                    variantA: { ...post.variantA!, performance: results.variantA.performance },
                    variantB: { ...post.variantB!, performance: results.variantB.performance },
                    winner: results.winner,
                };
                // Update the post in the main posts array
                updatePost(updatedPost);
                // Set the *updated* post to be shown in the modal
                setSelectedPost(updatedPost);
                 showNotification({ message: 'A/B test results are in!', type: 'success' });
            } else {
                setSelectedPost(post);
            }
            setResultModalOpen(true);
        }
    };

    return (
        <div>
            {isCreateModalOpen && <CreatePostModal day={selectedDay} initialData={postToSchedule || undefined} onSave={handleSavePost} onClose={handleCloseCreateModal} availablePlatforms={availablePlatforms} />}
            {isResultModalOpen && selectedPost && <ABTestResultModal post={selectedPost} onClose={() => setResultModalOpen(false)} />}
            
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Content Scheduler</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Plan and visualize your content calendar. Now with A/B testing!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                {daysOfWeek.map(day => (
                    <div key={day} className="bg-gray-100 dark:bg-gray-900 rounded-md min-h-[200px]">
                        <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700">
                             <h3 className="text-center font-semibold">{day}</h3>
                             <button onClick={() => handleOpenCreateModal(day)} className="p-1 text-gray-400 hover:text-indigo-500">
                                 <PlusIcon className="w-5 h-5" />
                             </button>
                        </div>
                        <div className="p-2 space-y-2">
                            {posts.filter(p => p.day === day).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)).map(post => (
                                <div key={post.id} onClick={() => handleOpenResultModal(post)} className={`bg-white dark:bg-gray-800 p-2.5 rounded-lg shadow-sm ${post.isABTest ? 'cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-indigo-500' : ''}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center space-x-2">
                                            <PlatformIcon platform={post.platform} />
                                            {post.isABTest && <BeakerIcon className={`w-4 h-4 ${post.winner && post.winner !== 'Pending' ? 'text-purple-500' : 'text-gray-400'}`} title="A/B Test" />}
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{post.scheduledTime}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                      {post.isABTest ? `A: ${post.variantA?.content}` : post.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Scheduler;