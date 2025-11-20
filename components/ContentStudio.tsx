import React, { useState } from 'react';
import { generateContentIdeas } from '../services/geminiService';
import type { PostIdea } from '../types';
import { useAppStore } from '../store/appStore';
import { SparklesIcon } from './icons/SparklesIcon';

const ContentStudio: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<'LinkedIn' | 'Instagram' | 'Twitter'>('LinkedIn');
  const [tone, setTone] = useState('Professional');
  const [ideas, setIdeas] = useState<PostIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { brandProfile, schedulePost, showNotification } = useAppStore();

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setError('');
    setIsLoading(true);
    setIdeas([]);
    try {
      const responseText = await generateContentIdeas(topic, platform, tone, brandProfile);
      const parsedResponse = JSON.parse(responseText);
      setIdeas(parsedResponse.ideas || []);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to parse response from AI. Please try again.';
      setError(message);
      showNotification({ message, type: 'error' });
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Content Studio</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Generate brilliant content ideas with the power of AI, perfectly aligned with your brand voice.</p>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Topic or Keyword</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 'The future of remote work'"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Platform</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as 'LinkedIn' | 'Instagram' | 'Twitter')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>LinkedIn</option>
              <option>Instagram</option>
              <option>Twitter</option>
            </select>
          </div>
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tone of Voice</label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>Professional</option>
              <option>Casual</option>
              <option>Witty</option>
              <option>Inspirational</option>
              <option>Formal</option>
            </select>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
            </>
          ) : (
             <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Generate Ideas
             </>
          )}
        </button>
      </div>

      <div className="mt-8 space-y-6">
        {ideas.map((idea, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md transition hover:shadow-lg">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{idea.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">{idea.content}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{idea.hashtags}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3">
                <button onClick={() => schedulePost({ platform: platform as 'LinkedIn' | 'Instagram', content: `${idea.title}\n\n${idea.content}\n\n${idea.hashtags}` })} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800">
                    Schedule Idea →
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentStudio;