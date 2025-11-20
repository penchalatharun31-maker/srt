
import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';

interface OnboardingModalProps {
  onClose: () => void;
}

const steps = [
    { 
        title: "Welcome to NexusGrowth AI!", 
        description: "Your new social media superpower. Let's quickly walk you through the key features to get you started." 
    },
    { 
        title: "The Content Studio", 
        description: "Never run out of ideas again. Describe a topic, and our AI will generate engaging post ideas tailored for your chosen platform and tone." 
    },
    { 
        title: "AI Engagement Assistant", 
        description: "Save hours replying to comments. Our AI analyzes comments on your posts and suggests smart, on-brand replies in seconds." 
    },
    { 
        title: "Analytics & Growth", 
        description: "Track your performance with a simple, self-serve dashboard. Get actionable insights to refine your content strategy and grow your audience." 
    },
];


const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center flex flex-col items-center">
                <LogoIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{steps[currentStep].title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">{steps[currentStep].description}</p>
                
                <div className="flex justify-center space-x-2 mb-8">
                    {steps.map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="w-full px-4 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {currentStep < steps.length - 1 ? 'Next' : "Let's Go!"}
                </button>
            </div>
        </div>
    );
};

export default OnboardingModal;
