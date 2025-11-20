import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import AnalyticsCard from './AnalyticsCard';
import { useAppStore } from '../store/appStore';
import { FollowerIcon } from './icons/FollowerIcon';
import { EngagementRateIcon } from './icons/EngagementRateIcon';
import { ReachIcon } from './icons/ReachIcon';
import { ReferralIcon } from './icons/ReferralIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { generatePerformanceInsights } from '../services/geminiService';

const Dashboard: React.FC = () => {
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { brandProfile, followerData, engagementData, updateAnalyticsData, showNotification } = useAppStore();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const hasConnectedAccounts = brandProfile?.linkedInConnected || brandProfile?.instagramConnected;

    const mockAnalyticsData = {
        followerData,
        engagementData,
        topPerformingPost: {
            platform: 'Instagram',
            content: 'Behind the scenes at NexusGrowth!',
            engagementRate: 5.8,
        },
        lowPerformingPost: {
            platform: 'LinkedIn',
            content: 'Excited to share our Q3 growth report!',
            engagementRate: 1.2,
        }
    };

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setInsights('');
        try {
            const response = await generatePerformanceInsights(mockAnalyticsData, brandProfile);
            setInsights(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred.";
            showNotification({ message, type: 'error' });
            setInsights(message); // Display error in the insights panel
        }
        setIsLoading(false);
    };

    const handleRefreshData = () => {
        console.log('--- SIMULATING API CALL: Fetching latest analytics data ---');
        setIsRefreshing(true);
        // Simulate a fetch with a timeout
        setTimeout(() => {
            const newFollowerData = followerData.map(d => ({
                ...d,
                LinkedIn: d.LinkedIn + Math.floor(Math.random() * 200 - 100),
                Instagram: d.Instagram + Math.floor(Math.random() * 200 - 100),
            }));
             const newEngagementData = engagementData.map(d => ({
                ...d,
                rate: Math.max(0.5, d.rate + Math.random() * 1 - 0.5),
            }));
            updateAnalyticsData({ followerData: newFollowerData, engagementData: newEngagementData });
            setIsRefreshing(false);
            showNotification({ message: 'Analytics data has been refreshed!', type: 'success' });
        }, 1000);
    };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        {hasConnectedAccounts && (
            <button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400"
            >
                 {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
        )}
      </div>
      
      {!hasConnectedAccounts ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold mb-2">Connect Your Accounts</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Go to Settings to connect your LinkedIn and Instagram accounts to see your analytics.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnalyticsCard title="Total Followers" value="12,458" change="+12.5%" icon={FollowerIcon} />
            <AnalyticsCard title="Engagement Rate" value="3.8%" change="-1.2%" icon={EngagementRateIcon} changeType="negative" />
            <AnalyticsCard title="Total Reach" value="89,123" change="+8.1%" icon={ReachIcon} />
            <AnalyticsCard title="Referral Signups" value="78" change="+5" icon={ReferralIcon} />
          </div>

           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">AI Performance Insights</h2>
                    <button
                        onClick={handleGenerateInsights}
                        disabled={isLoading}
                        className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {isLoading ? 'Analyzing...' : 'Generate Insights'}
                    </button>
                </div>
                 {isLoading && <p className="text-gray-600 dark:text-gray-400">AI is analyzing your data...</p>}
                {insights && <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{insights}</div>}
           </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Follower Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={followerData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200, 200, 200, 0.2)" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.8)',
                      borderColor: '#4b5563',
                      color: '#ffffff',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  {brandProfile?.linkedInConnected && <Bar dataKey="LinkedIn" fill="#60a5fa" name="LinkedIn" radius={[4, 4, 0, 0]} />}
                  {brandProfile?.instagramConnected && <Bar dataKey="Instagram" fill="#c084fc" name="Instagram" radius={[4, 4, 0, 0]} />}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Weekly Engagement Rate</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.2)" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af' }}/>
                  <YAxis unit="%" tick={{ fill: '#9ca3af' }}/>
                   <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.8)',
                      borderColor: '#4b5563',
                      color: '#ffffff',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="rate" stroke="#84cc16" strokeWidth={2} name="Engagement Rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;