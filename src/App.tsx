/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LayoutDashboard, History, BookOpen, HelpCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import HistoryView from './components/History';
import Learn from './components/Learn';
import Quizzes from './components/Quizzes';
import { ScannedItem } from './types';

type Tab = 'dashboard' | 'history' | 'learn' | 'quizzes';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [historyList, setHistoryList] = useState<ScannedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ScannedItem | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('studypal_history');
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error loading history from localStorage:", err);
    }
  }, []);

  // Save history to localStorage whenever it changes
  const saveHistory = (newList: ScannedItem[]) => {
    setHistoryList(newList);
    try {
      localStorage.setItem('studypal_history', JSON.stringify(newList));
    } catch (err) {
      console.error("Error saving history to localStorage:", err);
    }
  };

  const handleNewScan = (item: ScannedItem) => {
    const updated = [item, ...historyList];
    saveHistory(updated);
    setSelectedItem(item);
    // Automatically switch to history tab to view the detailed solution
    setActiveTab('history');
  };

  const handleDeleteItem = (id: string) => {
    const updated = historyList.filter(item => item.id !== id);
    saveHistory(updated);
  };

  const handleClearAll = () => {
    saveHistory([]);
    setSelectedItem(null);
  };

  const handleViewItemFromDashboard = (item: ScannedItem) => {
    setSelectedItem(item);
    setActiveTab('history');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return (
          <Dashboard 
            historyList={historyList} 
            onNewScan={handleNewScan} 
            onViewItem={handleViewItemFromDashboard}
            onNavigateToTab={setActiveTab}
          />
        );
      case 'history': 
        return (
          <HistoryView 
            historyList={historyList}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onDeleteItem={handleDeleteItem}
            onClearAll={handleClearAll}
          />
        );
      case 'learn': return <Learn />;
      case 'quizzes': return <Quizzes />;
      default: return (
        <Dashboard 
          historyList={historyList} 
          onNewScan={handleNewScan} 
          onViewItem={handleViewItemFromDashboard}
          onNavigateToTab={setActiveTab}
        />
      );
    }
  };

  return (
    <div className="flex h-screen bg-yellow-50/50 flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-900 border-b border-blue-800 p-4 text-center shadow-sm z-10">
        <h1 className="text-xl font-bold text-yellow-400 tracking-tight">StudyPal</h1>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-64 bg-blue-950 border-r border-blue-900 flex-col z-10">
        <div className="p-6 mb-4">
          <h1 className="text-2xl font-bold text-yellow-400 tracking-tight">StudyPal</h1>
        </div>
        <div className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === item.id
                  ? 'bg-yellow-400 text-blue-950 font-bold shadow-md'
                  : 'text-blue-200 hover:bg-blue-900/60 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-950' : 'text-blue-300'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-blue-950 border-t border-blue-900 flex justify-around p-2 pb-safe z-10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-2 min-w-[64px] rounded-lg transition-colors ${
              activeTab === item.id ? 'text-yellow-400' : 'text-blue-300 hover:bg-blue-900/40'
            }`}
          >
            <item.icon className={`w-6 h-6 mb-1 ${activeTab === item.id ? 'text-yellow-400' : 'text-blue-400'}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
