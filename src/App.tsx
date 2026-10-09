/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  History, 
  BookOpen, 
  HelpCircle, 
  LogOut, 
  LogIn, 
  Cloud, 
  CloudOff, 
  Home, 
  Sparkles,
  User as UserIcon
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import HistoryView from './components/History';
import Learn from './components/Learn';
import Quizzes from './components/Quizzes';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import LegalModal, { LegalTab } from './components/LegalModal';
import ThemeToggle from './components/ThemeToggle';
import SocialShare from './components/SocialShare';
import StudyPalLogo from './components/StudyPalLogo';
import { ScannedItem } from './types';
import { 
  auth, 
  onAuthStateChanged, 
  signOut, 
  User, 
  loadUserHistoryFromFirestore, 
  syncUserHistoryToFirestore,
  saveSingleHistoryItemToFirestore,
  deleteFirestoreHistoryItem
} from './lib/firebase';

type Tab = 'dashboard' | 'history' | 'learn' | 'quizzes';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // View states: 'landing' vs 'app'
  const [view, setView] = useState<'landing' | 'app'>('landing');
  
  // App navigation
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [historyList, setHistoryList] = useState<ScannedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ScannedItem | null>(null);

  // Auth modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Legal modal states
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('terms');

  const handleOpenLegal = (tab: LegalTab = 'terms') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  // Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        // Load cloud history for logged in user
        try {
          const cloudItems = await loadUserHistoryFromFirestore(currentUser.uid);
          
          // Check local items
          const localStored = localStorage.getItem('studypal_history');
          const localItems: ScannedItem[] = localStored ? JSON.parse(localStored) : [];
          
          // Merge local and cloud items without duplicates
          const combinedMap = new Map<string, ScannedItem>();
          cloudItems.forEach(item => combinedMap.set(item.id, item));
          localItems.forEach(item => combinedMap.set(item.id, item));

          const merged = Array.from(combinedMap.values()).sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          setHistoryList(merged);
          localStorage.setItem('studypal_history', JSON.stringify(merged));
          
          // Sync merged back to cloud
          if (merged.length > 0) {
            await syncUserHistoryToFirestore(currentUser.uid, merged);
          }
        } catch (err) {
          console.error("Error loading user cloud history:", err);
        }
      } else {
        // Load local history for guest mode
        try {
          const stored = localStorage.getItem('studypal_history');
          if (stored) {
            setHistoryList(JSON.parse(stored));
          }
        } catch (err) {
          console.error("Error loading history from localStorage:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save history state helper
  const saveHistory = async (newList: ScannedItem[]) => {
    setHistoryList(newList);
    try {
      localStorage.setItem('studypal_history', JSON.stringify(newList));
    } catch (err) {
      console.error("Error saving history to localStorage:", err);
    }
  };

  const handleNewScan = async (item: ScannedItem) => {
    const updated = [item, ...historyList];
    await saveHistory(updated);
    setSelectedItem(item);
    
    // If logged in, save to Firestore
    if (user) {
      await saveSingleHistoryItemToFirestore(user.uid, item);
    }

    setActiveTab('history');
  };

  const handleDeleteItem = async (id: string) => {
    const updated = historyList.filter(item => item.id !== id);
    await saveHistory(updated);

    if (user) {
      await deleteFirestoreHistoryItem(user.uid, id);
    }
  };

  const handleClearAll = async () => {
    saveHistory([]);
    setSelectedItem(null);
  };

  const handleViewItemFromDashboard = (item: ScannedItem) => {
    setSelectedItem(item);
    setActiveTab('history');
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
  ] as const;

  // Render Landing Page view if user clicked Landing or has set view to 'landing'
  if (view === 'landing') {
    return (
      <>
        <LandingPage
          user={user}
          onOpenAuth={handleOpenAuth}
          onEnterApp={() => setView('app')}
          onSignOut={handleSignOut}
          onOpenLegal={handleOpenLegal}
        />
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => setView('app')}
          onOpenLegal={handleOpenLegal}
        />
        <LegalModal
          isOpen={legalModalOpen}
          initialTab={legalModalTab}
          onClose={() => setLegalModalOpen(false)}
        />
      </>
    );
  }

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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex-col md:flex-row transition-colors duration-200">
      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setView('app')}
        onOpenLegal={handleOpenLegal}
      />

      {/* Legal Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        initialTab={legalModalTab}
        onClose={() => setLegalModalOpen(false)}
      />

      {/* Mobile Header */}
      <div className="md:hidden bg-blue-950 dark:bg-slate-900 border-b border-blue-900 dark:border-slate-800 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setView('landing')}
            className="text-xs font-bold text-blue-200 hover:text-white flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-blue-900/60 dark:bg-slate-800 border border-blue-800 dark:border-slate-700 cursor-pointer"
            title="Go to Home"
          >
            <Home className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-yellow-300 font-extrabold text-[11px]">Home</span>
          </button>
          <div onClick={() => setView('landing')} className="cursor-pointer">
            <StudyPalLogo size="sm" showText={true} />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <SocialShare variant="dropdown" />
          <ThemeToggle variant="button" />
          
          <button
            onClick={() => handleOpenLegal('terms')}
            title="Terms & Privacy"
            className="text-xs text-blue-300 hover:text-yellow-400 font-medium px-2 py-1 rounded hover:bg-blue-900/50 cursor-pointer"
          >
            Legal
          </button>
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenAuth('signin')}
              className="text-xs font-bold bg-yellow-400 text-blue-950 px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-64 bg-blue-950 dark:bg-slate-900 border-r border-blue-900 dark:border-slate-800 flex-col z-10 transition-colors duration-200">
        <div className="p-6 pb-4 flex items-center justify-between">
          <div onClick={() => setView('landing')} className="cursor-pointer" title="Go to Home">
            <StudyPalLogo size="md" showText={true} />
          </div>
          <button
            onClick={() => setView('landing')}
            title="Landing Page & Guide"
            className="p-1.5 text-blue-300 hover:text-yellow-400 hover:bg-blue-900/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* User Auth Card Badge */}
        <div className="px-4 mb-3">
          {user ? (
            <div className="bg-blue-900/60 dark:bg-slate-800/80 border border-blue-800 dark:border-slate-700/80 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-yellow-400 flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-blue-950 font-black flex items-center justify-center text-xs flex-shrink-0">
                    {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{user.displayName || 'Student'}</p>
                  <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-medium">
                    <Cloud className="w-3 h-3" />
                    <span>Cloud Synced</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1.5 text-blue-300 hover:text-yellow-400 hover:bg-blue-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-blue-900/40 dark:bg-slate-800/60 border border-blue-800/80 dark:border-slate-700/80 rounded-xl p-3 space-y-2">
              <div className="flex items-center space-x-2 text-[11px] text-blue-200 dark:text-slate-300">
                <CloudOff className="w-3.5 h-3.5 text-yellow-400" />
                <span>Guest Mode (Local Only)</span>
              </div>
              <button
                onClick={() => handleOpenAuth('signin')}
                className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-extrabold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Sync</span>
              </button>
            </div>
          )}
        </div>

        {/* Sleek Theme Toggle in Sidebar */}
        <div className="px-4 mb-3">
          <ThemeToggle variant="sidebar" />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 space-y-1.5">
          {/* Home button in sidebar navigation list */}
          <button
            onClick={() => setView('landing')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors cursor-pointer text-blue-200 dark:text-slate-300 hover:bg-blue-900/60 dark:hover:bg-slate-800 hover:text-white group"
          >
            <Home className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Home</span>
          </button>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                activeTab === item.id
                  ? 'bg-yellow-400 text-blue-950 font-bold shadow-md'
                  : 'text-blue-200 dark:text-slate-300 hover:bg-blue-900/60 dark:hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-950' : 'text-blue-300 dark:text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer info & legal links */}
        <div className="p-4 border-t border-blue-900/60 dark:border-slate-800 text-center space-y-2.5">
          {/* Quick Social Share Bar in Desktop Sidebar */}
          <div className="bg-blue-900/40 dark:bg-slate-800/60 p-2.5 rounded-xl border border-blue-800/60 dark:border-slate-700/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 mb-1.5 flex items-center justify-center space-x-1">
              <span>Share StudyPal</span>
            </p>
            <div className="flex items-center justify-center">
              <SocialShare variant="dropdown" />
            </div>
          </div>

          <button
            onClick={() => setView('landing')}
            className="text-xs text-blue-300 dark:text-slate-300 hover:text-yellow-400 flex items-center justify-center space-x-1.5 w-full py-1.5 hover:bg-blue-900/40 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Landing Page & Info</span>
          </button>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-blue-300/80 dark:text-slate-400 pt-1 border-t border-blue-900/40 dark:border-slate-800">
            <button
              onClick={() => handleOpenLegal('terms')}
              className="hover:text-yellow-400 transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <span className="text-blue-700 dark:text-slate-600">•</span>
            <button
              onClick={() => handleOpenLegal('privacy')}
              className="hover:text-yellow-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-blue-950 dark:bg-slate-900 border-t border-blue-900 dark:border-slate-800 flex justify-around p-2 pb-safe z-10">
        {/* Mobile Home button */}
        <button
          onClick={() => setView('landing')}
          className="flex flex-col items-center justify-center p-2 min-w-[56px] rounded-lg transition-colors cursor-pointer text-blue-300 dark:text-slate-400 hover:bg-blue-900/40 dark:hover:bg-slate-800"
        >
          <Home className="w-6 h-6 mb-1 text-yellow-400" />
          <span className="text-[10px] font-bold text-yellow-400">Home</span>
        </button>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-2 min-w-[56px] rounded-lg transition-colors cursor-pointer ${
              activeTab === item.id ? 'text-yellow-400' : 'text-blue-300 dark:text-slate-400 hover:bg-blue-900/40 dark:hover:bg-slate-800'
            }`}
          >
            <item.icon className={`w-6 h-6 mb-1 ${activeTab === item.id ? 'text-yellow-400' : 'text-blue-400 dark:text-slate-500'}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

