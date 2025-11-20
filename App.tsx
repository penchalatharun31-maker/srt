import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContentStudio from './components/ContentStudio';
import Scheduler from './components/Scheduler';
import Engagement from './components/Engagement';
import Referrals from './components/Referrals';
import OnboardingModal from './components/OnboardingModal';
import LandingPage from './components/LandingPage';
import StrategicPlanner from './components/StrategicPlanner';
import ContentMultiplier from './components/ContentMultiplier';
import Settings from './components/Settings';
import Notification from './components/Notification';
import { useAppStore } from './store/appStore';
import { MenuIcon } from './components/icons/MenuIcon';

const App: React.FC = () => {
  const {
    currentView,
    isAppLaunched,
    launchApp,
    showOnboarding,
    startOnboarding,
    completeOnboarding,
    isSidebarOpen,
    setSidebarOpen,
  } = useAppStore();

  // Check for onboarding status only when the app is launched.
  useEffect(() => {
    if (isAppLaunched) {
      try {
        const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
        if (!hasCompletedOnboarding) {
          startOnboarding();
        }
      } catch (error) {
        console.error("Could not access localStorage to check onboarding status:", error);
        // Fallback to showing onboarding if storage is inaccessible
        startOnboarding();
      }
    }
  }, [isAppLaunched, startOnboarding]);

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Content Studio':
        return <ContentStudio />;
      case 'Scheduler':
        return <Scheduler />;
      case 'Engagement':
        return <Engagement />;
      case 'Referrals':
        return <Referrals />;
      case 'Strategic Planner':
        return <StrategicPlanner />;
      case 'Multiplier':
        return <ContentMultiplier />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };
  
  if (!isAppLaunched) {
    return <LandingPage onLaunchApp={launchApp} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Notification />
      {showOnboarding && <OnboardingModal onClose={completeOnboarding} />}
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:justify-end">
           <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
             <MenuIcon />
           </button>
           <div className="flex items-center space-x-4">
             <span className="font-medium">Alex Greene</span>
             <img
                className="h-10 w-10 rounded-full object-cover"
                src="https://picsum.photos/100"
                alt="User avatar"
             />
           </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;