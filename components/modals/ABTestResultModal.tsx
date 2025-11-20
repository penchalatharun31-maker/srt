import React from 'react';
import type { ScheduledPost } from '../../types';
import { XIcon } from '../icons/XIcon';

interface ABTestResultModalProps {
    post: ScheduledPost;
    onClose: () => void;
}

const ABTestResultModal: React.FC<ABTestResultModalProps> = ({ post, onClose }) => {
    const { variantA, variantB, winner } = post;
    
    if (winner === 'Pending' || !variantA?.performance || !variantB?.performance) {
        return (
             <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold">A/B Test Results</h2>
                        <button onClick={onClose}><XIcon /></button>
                    </div>
                    <div className="p-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">A/B test is scheduled. Performance data will be available after the post goes live.</p>
                    </div>
                </div>
            </div>
        )
    }

    const totalA = variantA.performance.likes + variantA.performance.comments + variantA.performance.shares;
    const totalB = variantB.performance.likes + variantB.performance.comments + variantB.performance.shares;
    
    const MetricRow: React.FC<{ label: string; valueA: number; valueB: number }> = ({ label, valueA, valueB }) => (
        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
            <span className={`font-semibold text-lg w-1/3 text-center ${valueA >= valueB ? 'text-green-500' : 'text-gray-600 dark:text-gray-300'}`}>{valueA}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 w-1/3 text-center">{label}</span>
            <span className={`font-semibold text-lg w-1/3 text-center ${valueB >= valueA ? 'text-green-500' : 'text-gray-600 dark:text-gray-300'}`}>{valueB}</span>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold">A/B Test Results</h2>
                    <button onClick={onClose}><XIcon /></button>
                </div>
                <div className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Winning Version</p>
                        <p className={`text-4xl font-bold ${winner === 'A' ? 'text-blue-500' : winner === 'B' ? 'text-purple-500' : 'text-gray-500'}`}>
                            {winner ? `Variant ${winner}` : 'Tie'}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-blue-500 mb-2">Variant A</h3>
                            <p className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded-md min-h-[100px]">{variantA?.content}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-purple-500 mb-2">Variant B</h3>
                            <p className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded-md min-h-[100px]">{variantB?.content}</p>
                        </div>
                    </div>

                    <div>
                        <MetricRow label="Likes" valueA={variantA.performance.likes} valueB={variantB.performance.likes} />
                        <MetricRow label="Comments" valueA={variantA.performance.comments} valueB={variantB.performance.comments} />
                        <MetricRow label="Shares" valueA={variantA.performance.shares} valueB={variantB.performance.shares} />
                        <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 dark:border-gray-600 mt-2">
                            <span className={`font-bold text-xl w-1/3 text-center ${totalA >= totalB ? 'text-green-500' : 'text-gray-800 dark:text-white'}`}>{totalA}</span>
                            <span className="text-sm font-bold w-1/3 text-center">Total Engagement</span>
                            <span className={`font-bold text-xl w-1/3 text-center ${totalB >= totalA ? 'text-green-500' : 'text-gray-800 dark:text-white'}`}>{totalB}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ABTestResultModal;