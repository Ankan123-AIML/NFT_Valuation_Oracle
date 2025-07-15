import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ValuationForm } from './components/ValuationForm';
import { ValuationDisplay } from './components/ValuationDisplay';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'submit':
        return <ValuationForm />;
      case 'search':
        return <ValuationDisplay />;
      case 'activity':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Feed</h3>
            <p className="text-gray-600">Track all valuation activities and market trends</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 NFT Valuation Oracle. Built with advanced AI and blockchain technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;