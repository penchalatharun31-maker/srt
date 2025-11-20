import React, { useState } from 'react';

const Referrals: React.FC = () => {
    const referralLink = "https://nexusgrowth.ai/join?ref=alexg24";
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Refer & Earn</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Invite your friends to NexusGrowth and earn rewards!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Friends Joined</h3>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">12</p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Rewards Earned</h3>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">$60</p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending Rewards</h3>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">$15</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
                <h2 className="text-xl font-semibold mb-2">Your Unique Referral Link</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Share this link to start earning. You get $5 credit for every friend who signs up!</p>
                <div className="flex justify-center">
                    <div className="flex w-full max-w-md items-center space-x-2">
                        <input
                            type="text"
                            readOnly
                            value={referralLink}
                            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                        />
                        <button
                            onClick={handleCopy}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Referrals;