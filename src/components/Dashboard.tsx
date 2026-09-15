import { useState, useEffect } from "react";
import { LayoutDashboard, BookOpen, Clock, Zap, ArrowRight, Brain, Trophy } from "lucide-react";
import ImageCapture from "./ImageCapture";
import { ScannedItem } from "../types";
import AdSenseBanner from "./AdSenseBanner";

interface DashboardProps {
  historyList: ScannedItem[];
  onNewScan: (item: ScannedItem) => void;
  onViewItem: (item: ScannedItem) => void;
  onNavigateToTab: (tab: 'dashboard' | 'history' | 'learn' | 'quizzes') => void;
}

export default function Dashboard({ historyList, onNewScan, onViewItem, onNavigateToTab }: DashboardProps) {
  const [quizzesCount, setQuizzesCount] = useState(0);
  const [quizzesAvg, setQuizzesAvg] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("studypal_quiz_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        setQuizzesCount(parsed.length);
        if (parsed.length > 0) {
          const avg = Math.round(
            parsed.reduce((sum: number, item: any) => sum + item.percentage, 0) / parsed.length
          );
          setQuizzesAvg(avg);
        }
      }
    } catch (e) {
      console.error("Error loading quiz history on dashboard:", e);
    }
  }, []);

  // Get recent 3 items
  const recentItems = [...historyList].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 3);

  // Group by subjects for a small stats section
  const subjectsCount = historyList.reduce((acc, item) => {
    acc[item.subject] = (acc[item.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueSubjects = Object.keys(subjectsCount).length;

  return (
    <div className="flex flex-col h-full space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Welcome back to StudyPal. Here's your learning overview.</p>
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/60 rounded-full text-blue-600 dark:text-yellow-400">
          <LayoutDashboard className="w-6 h-6" />
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/70 rounded-lg text-blue-600 dark:text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Scans</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{historyList.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/60 rounded-lg text-yellow-600 dark:text-yellow-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Subjects Studied</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueSubjects}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-lg text-amber-600 dark:text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Daily Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{historyList.length > 0 ? "3 days" : "0 days"}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main image capture scanner (takes 2 columns if desk, full on mobile) */}
        <div className="lg:col-span-2">
          <ImageCapture onNewScan={onNewScan} />
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          {/* Recent Scans Widget */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Recent Scans</h3>
              {historyList.length > 3 && (
                <button 
                  onClick={() => onNavigateToTab('history')}
                  className="text-xs font-medium text-blue-600 dark:text-yellow-400 hover:underline flex items-center cursor-pointer"
                >
                  View All <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>
              )}
            </div>

            {recentItems.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center text-gray-400 dark:text-slate-500 border border-dashed border-gray-100 dark:border-slate-800 rounded-lg">
                <Clock className="w-8 h-8 mb-2 text-gray-300 dark:text-slate-600" />
                <p className="text-sm font-medium">No recent scans</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Scanned problems will show up here.</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[220px]">
                {recentItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onViewItem(item)}
                    className="w-full text-left p-3 rounded-lg border border-gray-50 dark:border-slate-800/80 hover:border-blue-100 dark:hover:border-slate-700 hover:bg-blue-50/20 dark:hover:bg-slate-800/50 transition-all flex items-start space-x-3 cursor-pointer"
                  >
                    {item.imageBase64 && (
                      <img 
                        src={item.imageBase64} 
                        alt="" 
                        className="w-10 h-10 object-cover rounded border border-gray-100 dark:border-slate-700 flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 rounded uppercase">
                          {item.subject}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500">
                          {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quiz Challenge Widget */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col space-y-4">
            <div className="flex items-center space-x-2 text-blue-900 dark:text-yellow-400">
              <Brain className="w-5 h-5 text-blue-600 dark:text-yellow-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Mastery Quizzes</h3>
            </div>
            
            {quizzesCount === 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  Put your knowledge to the test! Try our interactive, multi-subject quizzes to challenge yourself and lock in what you've learned.
                </p>
                <button
                  onClick={() => onNavigateToTab('quizzes')}
                  className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-extrabold text-xs rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Take First Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3.5 text-center">
                  <div className="bg-yellow-50/50 dark:bg-yellow-950/40 border border-yellow-100 dark:border-yellow-900/40 p-2.5 rounded-lg">
                    <span className="text-lg font-black text-yellow-600 dark:text-yellow-400 block leading-tight">{quizzesCount}</span>
                    <span className="text-[9px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Attempted</span>
                  </div>
                  <div className="bg-blue-50/40 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 p-2.5 rounded-lg">
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400 block leading-tight">{quizzesAvg}%</span>
                    <span className="text-[9px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Avg Accuracy</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateToTab('quizzes')}
                  className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-950 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Practice & Improve</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar AdSense Banner */}
          <AdSenseBanner client="ca-pub-8350207430692592" slot="1234567890" format="auto" responsive={true} />
        </div>
      </div>

      {/* Bottom AdSense Banner */}
      <div className="w-full pt-4">
        <AdSenseBanner client="ca-pub-8350207430692592" slot="1234567890" format="horizontal" responsive={true} />
      </div>
    </div>
  );
}
