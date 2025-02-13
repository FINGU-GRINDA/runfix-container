import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import * as Icons from 'react-icons/fi';
import { fitAndTranslate } from 'runfix-container';

const DashboardPage: React.FC = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFitAndTranslate = async () => {
    try {
      setIsTranslating(true);
      await fitAndTranslate({
        targetLanguage: 'ko',
        sourceLanguage: 'en',
      });
    } catch (error) {
      console.error('Error during fit and translate:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const stats = [
    { label: 'Total Users', value: '12,345', icon: Icons.FiUsers },
    { label: 'Active Sessions', value: '2,456', icon: Icons.FiActivity },
    { label: 'Response Time', value: '45ms', icon: Icons.FiClock },
    { label: 'Success Rate', value: '99.9%', icon: Icons.FiCheckCircle },
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Translated document', time: '5 mins ago' },
    { user: 'Jane Smith', action: 'Updated settings', time: '15 mins ago' },
    { user: 'Mike Johnson', action: 'Added new content', time: '1 hour ago' },
    { user: 'Sarah Wilson', action: 'Modified layout', time: '2 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Translate Button */}
      <button
        onClick={handleFitAndTranslate}
        disabled={isTranslating}
        className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-md shadow-lg hover:bg-indigo-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icons.FiGlobe
          className="animate-spin"
          style={{ animationPlayState: isTranslating ? 'running' : 'paused' }}
        />
        {isTranslating ? 'Translating...' : 'Translate'}
      </button>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-700">
                  RunFix
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`${
                    activeTab === 'overview'
                      ? 'border-indigo-700 text-slate-900'
                      : 'border-transparent text-slate-700 hover:text-slate-900'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`${
                    activeTab === 'analytics'
                      ? 'border-indigo-700 text-slate-900'
                      : 'border-transparent text-slate-700 hover:text-slate-900'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Analytics
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 text-slate-700 hover:text-slate-900">
                <Icons.FiBell className="h-6 w-6" />
              </button>
              <button className="ml-3 p-2 text-slate-700 hover:text-slate-900">
                <Icons.FiSettings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Icons.FiDownload className="inline-block w-4 h-4 mr-2" />
              Export
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Icons.FiPlus className="inline-block w-4 h-4 mr-2" />
              New Report
            </button>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {loading ? '-' : stat.value}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium text-green-600">+4.5%</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-slate-200 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="px-6 py-4 hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {activity.user}
                    </p>
                    <p className="text-sm text-slate-600">{activity.action}</p>
                  </div>
                  <p className="text-sm text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default dynamic(() => Promise.resolve(DashboardPage), {
  ssr: false,
});
