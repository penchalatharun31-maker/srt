import React, { useState, useEffect } from 'react';
import { generateStrategicPlan } from '../services/geminiService';
import type { StrategicPlanItem } from '../types';
import { useAppStore } from '../store/appStore';
import { SparklesIcon } from './icons/SparklesIcon';

const mockPerformanceData = {
    topTopics: ["AI in marketing", "Content strategy", "A/B testing features"],
    bestPerformingFormat: "Image with Caption on Instagram",
    highestEngagementDay: "Tuesday",
};

const StrategicPlanner: React.FC = () => {
    const [plan, setPlan] = useState<StrategicPlanItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { brandProfile, schedulePost, showNotification } = useAppStore();

    useEffect(() => {
        if (!brandProfile || !brandProfile.companyDescription) {
             setError('Please set up your Brand Profile in Settings first to generate a strategic plan.');
        } else {
            setError('');
        }
    }, [brandProfile]);

    const handleGenerate = async () => {
        if (!brandProfile) {
            setError('Brand Profile is required. Please go to Settings.');
            return;
        }
        setError('');
        setIsLoading(true);
        setPlan([]);
        try {
            const responseText = await generateStrategicPlan(brandProfile, mockPerformanceData);
            const parsedResponse = JSON.parse(responseText);
            setPlan(parsedResponse.plan || []);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to generate plan. Please try again.';
            setError(message);
            showNotification({ message, type: 'error' });
            console.error(e);
        }
        setIsLoading(false);
    };

    const handleCreatePost = (item: StrategicPlanItem) => {
        schedulePost({
            day: item.day,
            platform: item.platform,
            scheduledTime: item.time,
            content: `Topic: ${item.topic}\nFormat: ${item.format}\n\n[Start writing your post here...]\n\n#SocialMediaStrategy #ContentMarketing`
        });
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">NexusAI Strategic Planner</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Let our AI act as your personal social media strategist. Generate a data-driven content plan for the week ahead.</p>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading || !brandProfile || !brandProfile.companyDescription}
                    className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Your Plan...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Generate Weekly Content Plan
                        </>
                    )}
                </button>
                 {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            </div>

            <div className="space-y-4">
                {plan.map((item, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                        <div className="p-5">
                             <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{item.day} at {item.time} on {item.platform}</p>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-1">{item.topic}</h3>
                                </div>
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">{item.format}</span>
                             </div>
                             <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 border-l-4 border-gray-200 dark:border-gray-600 pl-4 italic">
                                <strong>Reasoning:</strong> {item.reasoning}
                            </p>
                        </div>
                         <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
                             <button onClick={() => handleCreatePost(item)} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800">Create Post from this Idea →</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StrategicPlanner;