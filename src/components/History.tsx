import { useState } from "react";
import { History as HistoryIcon, Search, Trash2, Calendar, FileText, ChevronRight, X } from "lucide-react";
import { ScannedItem } from "../types";
import Markdown from "react-markdown";
import AdSenseBanner from "./AdSenseBanner";

interface HistoryProps {
  historyList: ScannedItem[];
  selectedItem: ScannedItem | null;
  onSelectItem: (item: ScannedItem | null) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export default function History({ historyList, selectedItem, onSelectItem, onDeleteItem, onClearAll }: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("All");

  // Get all unique subjects present in history
  const availableSubjects = ["All", ...Array.from(new Set(historyList.map(item => item.subject)))];

  // Filter history list based on search term and subject filter
  const filteredList = historyList.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.solution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubjectFilter === "All" || item.subject === selectedSubjectFilter;

    return matchesSearch && matchesSubject;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-col h-full space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Study History</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Review, search, and filter your past study scans and tutor solutions.</p>
        </div>
        <div className="flex items-center space-x-3">
          {historyList.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your entire history? This cannot be undone.")) {
                  onClearAll();
                }
              }}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 bg-red-50 dark:bg-red-950/40 hover:bg-red-100/80 px-3 py-2 rounded-lg transition-colors border border-red-100 dark:border-red-900/40 cursor-pointer"
            >
              Clear All
            </button>
          )}
          <div className="p-3 bg-blue-100 dark:bg-blue-900/60 rounded-full text-blue-600 dark:text-yellow-400">
            <HistoryIcon className="w-6 h-6" />
          </div>
        </div>
      </header>

      {historyList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 border-dashed p-12 text-center">
          <HistoryIcon className="w-16 h-16 mb-4 text-gray-300 dark:text-slate-600" />
          <p className="text-xl font-semibold text-gray-600 dark:text-slate-300">Your History is Empty</p>
          <p className="text-sm text-gray-400 dark:text-slate-400 mt-2 max-w-sm">
            Upload or take photos of questions on the **Dashboard** and they will automatically appear here with full answers and explanations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
          {/* List and Filters Column (takes 1 column if item selected, full width otherwise) */}
          <div className={`space-y-4 lg:col-span-1 h-full flex flex-col`}>
            {/* Search and Filters box */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search scans, subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Subject Tag Filters */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {availableSubjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubjectFilter(subject)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                      selectedSubjectFilter === subject
                        ? "bg-blue-600 dark:bg-indigo-600 text-white font-bold"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Scanned Items Scrollable list */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex-1 max-h-[60vh] lg:max-h-[65vh] overflow-y-auto">
              {filteredList.length === 0 ? (
                <div className="p-8 text-center text-gray-400 dark:text-slate-500">
                  <p className="font-medium text-sm">No match found</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Try another keyword or category filter.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {filteredList.map((item) => (
                    <div
                      key={item.id}
                      className={`group p-4 flex items-center justify-between hover:bg-blue-50/10 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        selectedItem?.id === item.id ? "bg-blue-50/30 dark:bg-slate-850 border-l-4 border-blue-600 dark:border-yellow-400 pl-3" : ""
                      }`}
                      onClick={() => onSelectItem(item)}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        {item.imageBase64 && (
                          <img
                            src={item.imageBase64}
                            alt=""
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100 dark:border-slate-700 flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-yellow-400 transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 rounded uppercase">
                              {item.subject}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-0.5" />
                              {new Date(item.timestamp).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 pl-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Are you sure you want to delete this session?")) {
                              onDeleteItem(item.id);
                              if (selectedItem?.id === item.id) {
                                onSelectItem(null);
                              }
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Solution Detail Panel Column */}
          <div className="lg:col-span-2 h-full flex flex-col">
            {selectedItem ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full max-h-[85vh]">
                {/* Detail Header */}
                <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/40">
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 rounded uppercase">
                        {selectedItem.subject}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        {new Date(selectedItem.timestamp).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-950 dark:text-white mt-1 truncate">{selectedItem.title}</h2>
                  </div>
                  <button
                    onClick={() => onSelectItem(null)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Detail Content */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                  {selectedItem.imageBase64 && (
                    <div className="flex justify-center bg-gray-50 dark:bg-slate-950 p-4 rounded-xl border border-gray-200 dark:border-slate-800">
                      <img
                        src={selectedItem.imageBase64}
                        alt="Scanned original"
                        className="max-h-[300px] object-contain rounded-lg shadow-sm bg-white dark:bg-slate-900"
                      />
                    </div>
                  )}

                  <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
                    <h3 className="text-sm font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-3">Tutor Explanation</h3>
                    <div className="prose prose-blue dark:prose-invert max-w-none prose-sm sm:prose-base markdown-body bg-gray-50/30 dark:bg-slate-800/40 p-5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-inner text-slate-800 dark:text-slate-200">
                      <Markdown>{selectedItem.solution}</Markdown>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 border-dashed p-12 text-center h-[400px] lg:h-full">
                <FileText className="w-12 h-12 mb-3 text-gray-300 dark:text-slate-600" />
                <p className="font-semibold text-gray-600 dark:text-slate-300">Select a scan item</p>
                <p className="text-sm text-gray-400 dark:text-slate-400 mt-1">Select an item from the history list to view solutions, detailed math steps, and learning explanations.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AdSense Unit */}
      <div className="w-full pt-4">
        <AdSenseBanner client="ca-pub-8350207430692592" format="horizontal" responsive={true} />
      </div>
    </div>
  );
}
