import React from 'react';
import { LinkedInIcon } from '../icons/LinkedInIcon';
import { LogoIcon } from '../icons/LogoIcon';
import { InstagramIcon } from '../icons/InstagramIcon';
import { TwitterIcon } from '../icons/TwitterIcon';

const MockOAuthModal: React.FC<{ platform: 'LinkedIn' | 'Instagram' | 'Twitter', onAllow: () => void, onDeny: () => void }> = ({ platform, onAllow, onDeny }) => {
    const PlatformDetails = {
        LinkedIn: { Icon: LinkedInIcon, className: 'w-8 h-8 text-blue-600' },
        Instagram: { Icon: InstagramIcon, className: 'w-8 h-8 text-pink-500' },
        Twitter: { Icon: TwitterIcon, className: 'w-8 h-8 text-sky-500' },
    };
    const { Icon, className } = PlatformDetails[platform];
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
                <div className="flex justify-center items-center space-x-2 mb-4">
                    <LogoIcon className="w-8 h-8 text-indigo-500" />
                    <span className="text-2xl font-bold">×</span>
                    <Icon className={className} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">NexusGrowth wants to access your {platform} account</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">This will allow NexusGrowth to:
                    <ul className="text-left list-disc list-inside mt-2 space-y-1">
                        <li>Publish posts on your behalf</li>
                        <li>View your post analytics</li>
                        <li>Read and reply to comments</li>
                    </ul>
                </p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onDeny} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Deny</button>
                    <button onClick={onAllow} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Allow</button>
                </div>
            </div>
        </div>
    );
};

export default MockOAuthModal;