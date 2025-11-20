import React, { useState, useEffect } from 'react';
import { multiplyContent } from '../services/geminiService';
import type { MultipliedContent } from '../types';
import { useAppStore } from '../store/appStore';
import { SparklesIcon } from './icons/SparklesIcon';
import { CopyIcon } from './icons/CopyIcon';
import { SchedulerIcon } from './icons/SchedulerIcon';

const ContentMultiplier: React.FC = () => {
    const [longFormContent, setLongFormContent] = useState('');
    const [multipliedContent, setMultipliedContent] = useState<MultipliedContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { brandProfile, schedulePost, showNotification } = useAppStore();
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        if (!brandProfile || !brandProfile.companyDescription) {
            setError('Please set up your Brand Profile in Settings first to use the Multiplier.');
        } else {
            setError('');
        }
    }, [brandProfile]);
    
    const handleCopy = (textToCopy: string, id: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleGenerate = async () => {
        if (!longFormContent) {
            setError('Please paste your long-form content first.');
            return;
        }
        if (!brandProfile) {
            setError('Brand Profile is required. Please go to Settings.');
            return;
        }
        setError('');
        setIsLoading(true);
        setMultipliedContent(null);
        try {
            const responseText = await multiplyContent(longFormContent, brandProfile);
            const parsedResponse = JSON.parse(responseText);
            setMultipliedContent(parsedResponse);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to multiply content. Please try again.';
            setError(message);
            showNotification({ message, type: 'error' });
            console.error(e);
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Content Multiplier Engine</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Turn one piece of content into a multi-platform campaign. Paste a blog post, article, or script below.</p>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
                <div>
                    <label htmlFor="long-form" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Long-Form Content</label>
                    <textarea
                        id="long-form"
                        rows={10}
                        value={longFormContent}
                        onChange={(e) => setLongFormContent(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Paste your content here..."
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !brandProfile || !brandProfile.companyDescription}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Multiplying...' : <><SparklesIcon className="w-5 h-5 mr-2" />Multiply Content</>}
                </button>
            </div>

            {multipliedContent && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* LinkedIn */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col">
                        <div className="p-6 flex-1">
                             <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold text-blue-600">LinkedIn Article</h3>
                                <button onClick={() => handleCopy(multipliedContent.linkedInArticle, 'linkedin')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Copy Content">
                                    {copied === 'linkedin' ? 'Copied!' : <CopyIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{multipliedContent.linkedInArticle}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3">
                             <button onClick={() => schedulePost({platform: 'LinkedIn', content: multipliedContent.linkedInArticle})} className="w-full flex items-center justify-center space-x-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800">
                                 <SchedulerIcon className="w-4 h-4" />
                                 <span>Schedule on LinkedIn</span>
                             </button>
                        </div>
                    </div>
                     {/* Twitter */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col">
                        <div className="p-6 flex-1">
                             <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold text-sky-500">Twitter Thread</h3>
                                 <button onClick={() => handleCopy(multipliedContent.twitterThread.map((t, i) => `${i+1}/${multipliedContent.twitterThread.length}\n${t.tweet}`).join('\n\n'), 'twitter')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Copy Thread">
                                    {copied === 'twitter' ? 'Copied!' : <CopyIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="space-y-4">
                                {multipliedContent.twitterThread.map((tweet, index) => (
                                    <p key={index} className="text-sm text-gray-700 dark:text-gray-300 border-l-2 border-sky-200 dark:border-sky-800 pl-3">{index + 1}. {tweet.tweet}</p>
                                ))}
                            </div>
                        </div>
                         <div className="bg-gray-50 dark:bg-gray-800/50 p-3">
                             <button onClick={() => schedulePost({platform: 'Twitter', content: multipliedContent.twitterThread[0].tweet})} className="w-full flex items-center justify-center space-x-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800">
                                 <SchedulerIcon className="w-4 h-4" />
                                 <span>Schedule 1st Tweet</span>
                             </button>
                        </div>
                    </div>
                     {/* Instagram */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col">
                        <div className="p-6 flex-1">
                             <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold text-pink-500">Instagram Carousel</h3>
                                 <button onClick={() => handleCopy(multipliedContent.instagramCarousel.map(s => `Slide ${s.slide}:\n${s.content}`).join('\n\n'), 'instagram')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Copy Script">
                                    {copied === 'instagram' ? 'Copied!' : <CopyIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="space-y-4">
                                {multipliedContent.instagramCarousel.map((slide) => (
                                    <div key={slide.slide}>
                                        <p className="font-bold text-sm">Slide {slide.slide}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{slide.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="bg-gray-50 dark:bg-gray-800/50 p-3">
                             <button onClick={() => schedulePost({platform: 'Instagram', content: multipliedContent.instagramCarousel.map(s => `Slide ${s.slide}: ${s.content}`).join('\n\n')})} className="w-full flex items-center justify-center space-x-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800">
                                 <SchedulerIcon className="w-4 h-4" />
                                 <span>Schedule Carousel</span>
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentMultiplier;