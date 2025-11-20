import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import type { BrandProfile } from '../types';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import MockOAuthModal from './modals/MockOAuthModal';

const voiceOptions = ["Professional", "Casual", "Witty", "Inspirational", "Formal", "Authoritative", "Friendly"];

const Settings: React.FC = () => {
    const { brandProfile, saveBrandProfile, updateConnectionStatus } = useAppStore();
    const [showOAuthModal, setShowOAuthModal] = useState<'LinkedIn' | 'Instagram' | 'Twitter' | null>(null);

    // Local copy for editing form fields. Initialized once from global state.
    const [localProfile, setLocalProfile] = useState<BrandProfile>(brandProfile);

    const connectionKeys: Record<'LinkedIn' | 'Instagram' | 'Twitter', keyof BrandProfile> = {
        LinkedIn: 'linkedInConnected',
        Instagram: 'instagramConnected',
        Twitter: 'twitterConnected',
    };

    const handleSave = () => {
        saveBrandProfile(localProfile);
    };
    
    const handleVoiceToggle = (voice: string) => {
        const newVoice = localProfile.brandVoice.includes(voice)
            ? localProfile.brandVoice.filter(v => v !== voice)
            : [...localProfile.brandVoice, voice];
        setLocalProfile(prev => ({ ...prev, brandVoice: newVoice }));
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleConnect = (platform: 'LinkedIn' | 'Instagram' | 'Twitter') => {
        setShowOAuthModal(platform);
    };

    const handleDisconnect = (platform: 'LinkedIn' | 'Instagram' | 'Twitter') => {
        // Update the persistent global state atomically
        updateConnectionStatus(platform, false);
        // Update local state to reflect UI change, preserving other edits
        setLocalProfile(prev => ({...prev, [connectionKeys[platform]]: false}));
    };
    
    const handleOAuthAllow = () => {
        if (showOAuthModal) {
             // Update the persistent global state atomically
            updateConnectionStatus(showOAuthModal, true);
            // Update local state to reflect UI change, preserving other edits
            setLocalProfile(prev => ({...prev, [connectionKeys[showOAuthModal]]: true}));
        }
        setShowOAuthModal(null);
    };
    
    // Determine connection status for UI from the local state, which is always in sync for connections
    const { linkedInConnected, instagramConnected, twitterConnected } = localProfile;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {showOAuthModal && <MockOAuthModal platform={showOAuthModal} onAllow={handleOAuthAllow} onDeny={() => setShowOAuthModal(null)} />}

            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your brand identity and connect your social accounts.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Connected Accounts</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <LinkedInIcon className="w-6 h-6 text-blue-600" />
                            <span className="font-medium">LinkedIn</span>
                        </div>
                        {linkedInConnected ? (
                            <button onClick={() => handleDisconnect('LinkedIn')} className="px-4 py-1.5 text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400 rounded-md hover:bg-red-200">Disconnect</button>
                        ) : (
                            <button onClick={() => handleConnect('LinkedIn')} className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Connect</button>
                        )}
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <InstagramIcon className="w-6 h-6 text-pink-500" />
                            <span className="font-medium">Instagram</span>
                        </div>
                        {instagramConnected ? (
                             <button onClick={() => handleDisconnect('Instagram')} className="px-4 py-1.5 text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400 rounded-md hover:bg-red-200">Disconnect</button>
                        ) : (
                            <button onClick={() => handleConnect('Instagram')} className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-md hover:opacity-90">Connect</button>
                        )}
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <TwitterIcon className="w-6 h-6 text-sky-500" />
                            <span className="font-medium">Twitter</span>
                        </div>
                        {twitterConnected ? (
                            <button onClick={() => handleDisconnect('Twitter')} className="px-4 py-1.5 text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400 rounded-md hover:bg-red-200">Disconnect</button>
                        ) : (
                            <button onClick={() => handleConnect('Twitter')} className="px-4 py-1.5 text-sm font-semibold text-white bg-black dark:bg-sky-500 rounded-md hover:opacity-90">Connect</button>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Brand Voice & Knowledge Hub</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Teach the AI about your brand to get perfectly tailored content. This information will be used across all features.</p>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6">
                    <div>
                        <label htmlFor="companyDescription" className="block text-lg font-semibold text-gray-800 dark:text-white">Company Description</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Briefly describe your company or personal brand. What do you do?</p>
                        <textarea
                            id="companyDescription"
                            name="companyDescription"
                            rows={3}
                            value={localProfile.companyDescription}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="targetAudience" className="block text-lg font-semibold text-gray-800 dark:text-white">Target Audience</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Who are you trying to reach? Be as specific as possible.</p>
                        <textarea
                            id="targetAudience"
                            name="targetAudience"
                            rows={3}
                            value={localProfile.targetAudience}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-gray-800 dark:text-white">Brand Voice</label>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select the attributes that best describe your desired tone.</p>
                        <div className="flex flex-wrap gap-2">
                            {voiceOptions.map(voice => (
                                <button
                                    key={voice}
                                    onClick={() => handleVoiceToggle(voice)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-full border ${localProfile.brandVoice.includes(voice) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                                >
                                    {voice}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="knowledgeBase" className="block text-lg font-semibold text-gray-800 dark:text-white">Knowledge Base</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Paste any key information, product details, or FAQs the AI should know. This helps generate more accurate and relevant content.</p>
                        <textarea
                            id="knowledgeBase"
                            name="knowledgeBase"
                            rows={6}
                            value={localProfile.knowledgeBase}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                     <div className="flex justify-end items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;