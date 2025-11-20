import React from 'react';
import type { View } from '../types';
import { useAppStore } from '../store/appStore';
import { DashboardIcon } from './icons/DashboardIcon';
import { ContentStudioIcon } from './icons/ContentStudioIcon';
import { SchedulerIcon } from './icons/SchedulerIcon';
import { EngagementIcon } from './icons/EngagementIcon';
import { ReferralsIcon } from './icons/ReferralsIcon';
import { XIcon } from './icons/XIcon';
import { LogoIcon } from './icons/LogoIcon';
import { PlannerIcon } from './icons/PlannerIcon';
import { MultiplierIcon } from './icons/MultiplierIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const navItems: { name: View; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { name: 'Dashboard', icon: DashboardIcon },
  { name: 'Strategic Planner', icon: PlannerIcon },
  { name: 'Content Studio', icon: ContentStudioIcon },
  { name: 'Multiplier', icon: MultiplierIcon },
  { name: 'Scheduler', icon: SchedulerIcon },
  { name: 'Engagement', icon: EngagementIcon },
  { name: 'Referrals', icon: ReferralsIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const { currentView, setCurrentView } = useAppStore();

  const handleNavigation = (view: View) => {
    setCurrentView(view);
    if (window.innerWidth < 768) { // md breakpoint
        setSidebarOpen(false);
    }
  };
    
  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`absolute md:relative flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out h-full z-40`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
             <LogoIcon />
             <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">NexusGrowth</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-gray-500 rounded-md">
            <XIcon />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.name);
              }}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                currentView === item.name
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </a>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
             <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('Settings');
              }}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'Settings'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              <SettingsIcon className="w-5 h-5 mr-3" />
              Settings
            </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;