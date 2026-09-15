import { useState, useEffect } from "react";
import { BookOpen, Search, Clock, ArrowLeft, CheckCircle, BookOpenCheck, Award } from "lucide-react";
import { STUDY_MODULES, StudyModule } from "../data/learnData";
import Markdown from "react-markdown";

export default function Learn() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [activeModule, setActiveModule] = useState<StudyModule | null>(null);
  
  // Track completed module IDs in localStorage
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("studypal_completed_modules");
      if (stored) {
        setCompletedModules(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error loading completed modules:", err);
    }
  }, []);

  const toggleComplete = (moduleId: string) => {
    let updated: string[];
    if (completedModules.includes(moduleId)) {
      updated = completedModules.filter(id => id !== moduleId);
    } else {
      updated = [...completedModules, moduleId];
    }
    setCompletedModules(updated);
    try {
      localStorage.setItem("studypal_completed_modules", JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving completed modules:", err);
    }
  };

  // Extract unique subjects
  const subjects = ["All", ...Array.from(new Set(STUDY_MODULES.map(m => m.subject)))];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  // Filter modules
  const filteredModules = STUDY_MODULES.filter(m => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.contentMarkdown.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSubject = selectedSubject === "All" || m.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "All" || m.difficulty === selectedDifficulty;

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Beginner": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Intermediate": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Advanced": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getSubjectIconColor = (subject: string) => {
    switch (subject) {
      case "Mathematics": return "text-blue-600 bg-blue-50";
      case "Science": return "text-emerald-600 bg-emerald-50";
      case "Computer Science": return "text-purple-600 bg-purple-50";
      case "History": return "text-amber-600 bg-amber-50";
      case "Literature": return "text-rose-600 bg-rose-50";
      case "Economics": return "text-teal-600 bg-teal-50";
      case "Psychology": return "text-pink-600 bg-pink-50";
      case "Philosophy": return "text-fuchsia-600 bg-fuchsia-50";
      case "Art History": return "text-orange-600 bg-orange-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 pb-12">
      {/* Detail View / Reading Mode */}
      {activeModule ? (
        <div className="space-y-6">
          <button 
            onClick={() => setActiveModule(null)}
            className="flex items-center space-x-2 text-sm font-semibold text-blue-900 dark:text-yellow-400 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm self-start cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-yellow-500" />
            <span>Back to Library</span>
          </button>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Header banner */}
            <div className="bg-blue-950 dark:bg-slate-950 p-6 sm:p-8 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BookOpen className="w-40 h-40" />
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-1 bg-yellow-400 text-blue-950 rounded uppercase">
                  {activeModule.subject}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded border ${getDifficultyColor(activeModule.difficulty)}`}>
                  {activeModule.difficulty}
                </span>
                <span className="text-xs text-blue-200 dark:text-slate-400 flex items-center ml-2">
                  <Clock className="w-3.5 h-3.5 mr-1 text-yellow-400" />
                  {activeModule.readTime}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-yellow-400">{activeModule.title}</h1>
              <p className="text-blue-200 dark:text-slate-300 mt-2 text-sm sm:text-base max-w-3xl">{activeModule.description}</p>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Learning Objectives & Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-yellow-50/40 dark:bg-yellow-950/20 p-5 rounded-xl border border-yellow-100/70 dark:border-yellow-900/40">
                  <h3 className="font-bold text-blue-950 dark:text-yellow-400 text-sm uppercase tracking-wider mb-3">Learning Objectives</h3>
                  <ul className="space-y-2.5">
                    {activeModule.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-slate-200">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 mr-2.5 flex-shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50/30 dark:bg-slate-800/40 p-5 rounded-xl border border-blue-100/50 dark:border-slate-700/60 flex flex-col justify-center items-center text-center">
                  <Award className={`w-10 h-10 mb-2 ${completedModules.includes(activeModule.id) ? 'text-yellow-500' : 'text-gray-300 dark:text-slate-600'}`} />
                  <p className="text-sm font-semibold text-blue-950 dark:text-white">Study Progress</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 mb-4">Mark as completed to track your study goals.</p>
                  <button
                    onClick={() => toggleComplete(activeModule.id)}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      completedModules.includes(activeModule.id)
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-yellow-400 text-blue-950 hover:bg-yellow-500"
                    }`}
                  >
                    {completedModules.includes(activeModule.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed!</span>
                      </>
                    ) : (
                      <span>Mark Complete</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Study Content */}
              <div className="prose prose-blue dark:prose-invert max-w-none md:prose-base markdown-body border-t border-gray-100 dark:border-slate-800 pt-8 text-slate-800 dark:text-slate-200">
                <Markdown>{activeModule.contentMarkdown}</Markdown>
              </div>

              {/* Key Terms Glossary */}
              <div className="border-t border-gray-100 dark:border-slate-800 pt-8 space-y-4">
                <h3 className="font-bold text-blue-950 dark:text-yellow-400 text-sm uppercase tracking-wider">Key Terms Glossary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activeModule.keyTerms.map((kt, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all">
                      <p className="font-bold text-sm text-blue-900 dark:text-yellow-400">{kt.term}</p>
                      <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">{kt.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Library Directory */
        <>
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Study Library</h1>
              <p className="text-gray-500 dark:text-slate-400 mt-1">Access structured, high-quality reference guides curated for quick learning.</p>
            </div>
            <div className="p-3 bg-yellow-400 text-blue-950 rounded-full shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
          </header>

          {/* Library Stats Indicator */}
          {completedModules.length > 0 && (
            <div className="bg-blue-950 dark:bg-slate-900 text-white p-4 rounded-xl border border-blue-900 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <BookOpenCheck className="w-5 h-5 text-yellow-400" />
                <div>
                  <span className="font-semibold text-sm">Library Progress: </span>
                  <span className="text-xs text-blue-200 dark:text-slate-400">
                    You have finished {completedModules.length} of {STUDY_MODULES.length} study guides!
                  </span>
                </div>
              </div>
              <div className="text-xs font-bold text-yellow-400 bg-blue-900 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                {Math.round((completedModules.length / STUDY_MODULES.length) * 100)}% Done
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search tutorials, definitions, and concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
              />
            </div>

            {/* Subject Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-slate-100 font-medium"
              >
                <option value="All">All Subjects</option>
                {subjects.filter(s => s !== "All").map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-slate-100 font-medium"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Library Grid */}
          {filteredModules.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm p-12 text-center text-gray-400 dark:text-slate-500 border-dashed">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-slate-600" />
              <p className="text-lg font-semibold text-gray-600 dark:text-slate-300">No guides matched your criteria</p>
              <p className="text-sm text-gray-400 dark:text-slate-400 mt-1">Try resetting your subject or difficulty filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredModules.map((module) => {
                const isFinished = completedModules.includes(module.id);
                return (
                  <div 
                    key={module.id} 
                    className={`bg-white dark:bg-slate-900 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between ${
                      isFinished 
                        ? 'border-emerald-200 dark:border-emerald-900/60 shadow-sm bg-emerald-50/10 dark:bg-emerald-950/20' 
                        : 'border-gray-100 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="p-6 space-y-4">
                      {/* Badge Row */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getSubjectIconColor(module.subject)}`}>
                          {module.subject}
                        </span>
                        
                        <div className="flex items-center space-x-1.5">
                          {isFinished && (
                            <span className="flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                              <CheckCircle className="w-3 h-3 mr-0.5 text-emerald-600 dark:text-emerald-400" />
                              Done
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getDifficultyColor(module.difficulty)}`}>
                            {module.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-yellow-400 text-lg leading-snug">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 line-clamp-2">
                          {module.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="px-6 py-4 border-t border-gray-50 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                      <span className="text-xs text-gray-400 dark:text-slate-400 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-gray-400 dark:text-slate-400" />
                        {module.readTime}
                      </span>
                      
                      <button
                        onClick={() => setActiveModule(module)}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer ${
                          isFinished 
                            ? "bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700"
                            : "bg-blue-900 dark:bg-indigo-600 text-white hover:bg-blue-850 dark:hover:bg-indigo-500"
                        }`}
                      >
                        {isFinished ? "Review Guide" : "Start Learning"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
