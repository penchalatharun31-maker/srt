
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { ContentStudioIcon } from './icons/ContentStudioIcon';
import { SchedulerIcon } from './icons/SchedulerIcon';
import { EngagementIcon } from './icons/EngagementIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';


interface LandingPageProps {
    onLaunchApp: () => void;
}

const FeatureCard: React.FC<{ icon: React.FC<any>, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 mb-4">
            <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{children}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string, name: string, title: string, avatar: string }> = ({ quote, name, title, avatar }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
        <p className="text-gray-700 dark:text-gray-300 italic">"{quote}"</p>
        <div className="flex items-center justify-center mt-6">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full mr-4" />
            <div>
                <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
                <p className="text-sm text-indigo-500 dark:text-indigo-400">{title}</p>
            </div>
        </div>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <LogoIcon className="text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xl font-bold text-gray-800 dark:text-white">NexusGrowth</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                         <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Features</a>
                         <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Testimonials</a>
                    </div>
                    <button onClick={onLaunchApp} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-colors">
                        Launch App
                    </button>
                </nav>
            </header>

            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 text-center bg-white dark:bg-gray-800/30">
                    <div className="container mx-auto px-6">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                            Automate Your Social Media <br /> with the Power of AI
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                            NexusGrowth is your AI-powered assistant for content ideation, scheduling, and engagement. Spend less time managing, more time growing.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={onLaunchApp} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75">
                                Get Started for Free
                            </button>
                             <a href="#features" className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600">
                                Learn More
                            </a>
                        </div>
                         <div className="mt-16">
                            <img src="https://picsum.photos/seed/nexus-dash/1200/600" alt="Dashboard preview" className="rounded-xl shadow-2xl mx-auto ring-1 ring-gray-200 dark:ring-gray-700" />
                        </div>
                    </div>
                </section>
                
                {/* Features Section */}
                <section id="features" className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Everything You Need to Succeed</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-xl mx-auto">Powerful features designed to streamline your workflow and boost your social media presence.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard icon={ContentStudioIcon} title="AI Content Studio">
                                Generate endless, high-quality post ideas, captions, and scripts tailored to your brand voice and audience.
                            </FeatureCard>
                             <FeatureCard icon={SchedulerIcon} title="Smart Scheduler & A/B Testing">
                                Plan your content calendar visually, get AI-optimized posting times, and run A/B tests to maximize engagement.
                            </FeatureCard>
                             <FeatureCard icon={EngagementIcon} title="Engagement Assistant">
                                Receive AI-generated reply suggestions for comments, enabling you to engage with your audience faster and more effectively.
                            </FeatureCard>
                             <FeatureCard icon={DashboardIcon} title="Insightful Analytics">
                                Track your growth with an easy-to-understand dashboard. Get actionable insights to refine your strategy.
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 bg-gray-100 dark:bg-gray-800/50">
                     <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Loved by Creators and Businesses</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           <TestimonialCard 
                                quote="NexusGrowth has been a game-changer for my content strategy. I'm saving at least 10 hours a week!"
                                name="Sarah Johnson"
                                title="Solo Content Creator"
                                avatar="https://picsum.photos/id/1027/100"
                           />
                           <TestimonialCard 
                                quote="The AI-generated ideas are incredibly creative and on-point. Our engagement has skyrocketed since we started using it."
                                name="Mark Chen"
                                title="Small Business Owner"
                                avatar="https://picsum.photos/id/1005/100"
                           />
                            <TestimonialCard 
                                quote="Managing multiple client accounts has never been easier. The scheduler and analytics are top-notch."
                                name="Jessica Rodriguez"
                                title="Agency Manager"
                                avatar="https://picsum.photos/id/1011/100"
                           />
                        </div>
                     </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Ready to Grow Your Audience?</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
                           Join hundreds of creators and businesses who are automating their growth. Get started with NexusGrowth today.
                        </p>
                        <button onClick={onLaunchApp} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75">
                            Sign Up for Free
                        </button>
                    </div>
                </section>
            </main>
            
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <LogoIcon className="text-gray-500" />
                        <span className="text-gray-500 dark:text-gray-400">&copy; 2024 NexusGrowth. All rights reserved.</span>
                    </div>
                    <div className="flex space-x-6">
                       <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"><TwitterIcon /></a>
                       <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"><LinkedInIcon /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
