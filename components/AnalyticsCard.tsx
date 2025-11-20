
import React from 'react';

interface AnalyticsCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    changeType?: 'positive' | 'negative';
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, change, icon: Icon, changeType = 'positive' }) => {
    const changeColor = changeType === 'positive' ? 'text-green-500' : 'text-red-500';

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
                <p className={`text-xs font-medium ${changeColor} mt-2`}>{change}</p>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
        </div>
    );
};

export default AnalyticsCard;
