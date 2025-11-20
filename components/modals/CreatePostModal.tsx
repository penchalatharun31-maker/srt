import React, { useState } from 'react';
import type { ScheduledPost } from '../../types';
import { XIcon } from '../icons/XIcon';

interface CreatePostModalProps {
    day: string;
    initialData?: Partial<ScheduledPost>;
    onSave: (post: Omit<ScheduledPost, 'id'>) => void;
    onClose: () => void;
    availablePlatforms: string[];
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ day, initialData, onSave, onClose, availablePlatforms }) => {
    const [isABTest, setIsABTest] = useState(initialData?.isABTest || false);
    const [platform, setPlatform] = useState<'LinkedIn' | 'Instagram' | 'Twitter'>(initialData?.platform as 'LinkedIn' | 'Instagram' | 'Twitter' || (availablePlatforms[0] as 'LinkedIn' | 'Instagram' | 'Twitter') || 'LinkedIn');
    const [scheduledTime, setScheduledTime] = useState(initialData?.scheduledTime || '10:00 AM');
    const [content, setContent] = useState(initialData?.content || '');
    const [variantA, setVariantA] = useState(initialData?.variantA?.content || '');
    const [variantB, setVariantB] = useState(initialData?.variantB?.content || '');

    const handleSave = () => {
        const post = {
            day,
            platform,
            scheduledTime,
            isABTest,
            ...(isABTest ? { variantA: { content: variantA }, variantB: { content: variantB } } : { content })
        };
        onSave(post);
    };
    
    const canSave = availablePlatforms.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold">Create Post for {day}</h2>
                    <button onClick={onClose}><XIcon /></button>
                </div>
                {canSave ? (
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Platform</label>
                            <select value={platform} onChange={e => setPlatform(e.target.value as 'LinkedIn' | 'Instagram' | 'Twitter')} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                {availablePlatforms.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                            <input type="text" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="ab-test" checked={isABTest} onChange={() => setIsABTest(!isABTest)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                        <label htmlFor="ab-test" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Enable A/B Test</label>
                    </div>
                    {isABTest ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Variant A</label>
                                <textarea value={variantA} onChange={e => setVariantA(e.target.value)} rows={5} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Variant B</label>
                                <textarea value={variantB} onChange={e => setVariantB(e.target.value)} rows={5} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                            <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    )}
                </div>
                ) : (
                    <div className="p-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">Please connect a social media account in Settings before scheduling a post.</p>
                    </div>
                )}
                 <div className="flex justify-end p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={handleSave} disabled={!canSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed">Save Post</button>
                </div>
            </div>
        </div>
    );
}

export default CreatePostModal;