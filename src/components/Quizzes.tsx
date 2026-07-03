import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  RefreshCw,
  Sparkles,
  Trash2,
  Trophy,
  XCircle,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Check,
  Search,
  Filter,
  CheckCircle,
  ListRestart,
  PenTool,
  TrendingUp,
  Smile,
  Lightbulb,
  Palette,
  MessageSquare,
  Send,
  User,
  ArrowRight
} from "lucide-react";
import Markdown from "react-markdown";
import { QUIZZES, Quiz, QuizQuestion, QuizAttempt } from "../data/quizData";

export default function Quizzes() {
  // State for browser / search
  const [quizzes, setQuizzes] = useState<Quiz[]>(QUIZZES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  // State for quiz taking session
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [userAnswersHistory, setUserAnswersHistory] = useState<number[]>([]);

  // State for quiz results screen
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // State for Quiz History
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // State for confirm quit quiz dialog
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Sub-navigation for Quizzes section
  const [subTab, setSubTab] = useState<"quizzes" | "ask">("quizzes");

  // State for AI Tutor Ask Anything
  const [messages, setMessages] = useState<{
    id: string;
    role: "user" | "model";
    content: string;
    timestamp: Date;
    quizToStart?: Quiz;
  }[]>([]);
  const [questionInput, setQuestionInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  // Custom Quiz states
  const [customQuizzes, setCustomQuizzes] = useState<Quiz[]>([]);
  const [customQuizTopic, setCustomQuizTopic] = useState("");
  const [customQuizDifficulty, setCustomQuizDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizGenError, setQuizGenError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll messages to bottom
  useEffect(() => {
    if (subTab === "ask" && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, subTab]);

  const handleGenerateCustomQuiz = async (topicToQuiz?: string) => {
    const topic = (topicToQuiz || customQuizTopic).trim();
    if (!topic) return;

    setIsGeneratingQuiz(true);
    setQuizGenError(null);

    if (subTab === "ask") {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "user" as const,
          content: `Generate a custom quiz on the topic: "${topic}" (${customQuizDifficulty} level)`,
          timestamp: new Date()
        }
      ]);
    }

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty: customQuizDifficulty
        })
      });

      if (!response.ok) {
        throw new Error("Failed to reach quiz generator. Please try again.");
      }

      const generatedQuiz = await response.json();
      if (generatedQuiz.error) {
        throw new Error(generatedQuiz.error);
      }

      // Add to custom quizzes so it persists and is filterable
      setCustomQuizzes((prev) => [generatedQuiz, ...prev]);

      if (subTab === "ask") {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "model" as const,
            content: `### 🎓 Custom Quiz Ready!\n\nI have designed a custom **${generatedQuiz.title}** quiz for you covering the topic **"${topic}"**.\n\n- **Subject:** ${generatedQuiz.subject}\n- **Difficulty:** ${generatedQuiz.difficulty}\n- **Questions:** 5 dynamic multiple-choice questions\n- **Duration:** ${generatedQuiz.duration}\n\nClick the button below to take this quiz and check your score!`,
            timestamp: new Date(),
            quizToStart: generatedQuiz
          }
        ]);
      }

      if (subTab !== "ask") {
        startQuizSession(generatedQuiz);
      }
      setCustomQuizTopic("");
    } catch (err: any) {
      const errMsg = err.message || "Failed to generate custom quiz.";
      setQuizGenError(errMsg);
      if (subTab === "ask") {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "model" as const,
            content: `⚠️ **Quiz Generation Failed:** ${errMsg}`,
            timestamp: new Date()
          }
        ]);
      }
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleAskQuestion = async (textToAsk?: string) => {
    const question = (textToAsk || questionInput).trim();
    if (!question) return;

    if (!textToAsk) {
      setQuestionInput("");
    }

    setAskError(null);
    setIsAsking(true);

    const userMsg = {
      id: Math.random().toString(),
      role: "user" as const,
      content: question,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch("/api/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          history: messages.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error("AI Tutor is currently offline. Please try again.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "model" as const,
          content: data.answer || "I could not find an answer for that.",
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      setAskError(err.message || "An unexpected error occurred.");
    } finally {
      setIsAsking(false);
    }
  };

  // Load history and custom quizzes from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("studypal_quiz_history");
      if (storedHistory) {
        setQuizHistory(JSON.parse(storedHistory));
      }
    } catch (err) {
      console.error("Error loading quiz history:", err);
    }

    try {
      const storedCustom = localStorage.getItem("studypal_custom_quizzes");
      if (storedCustom) {
        setCustomQuizzes(JSON.parse(storedCustom));
      }
    } catch (err) {
      console.error("Error loading custom quizzes:", err);
    }
  }, []);

  // Save custom quizzes to localStorage when they change
  useEffect(() => {
    if (customQuizzes.length > 0) {
      try {
        localStorage.setItem("studypal_custom_quizzes", JSON.stringify(customQuizzes));
      } catch (err) {
        console.error("Error saving custom quizzes:", err);
      }
    }
  }, [customQuizzes]);

  // Filter quizzes based on search, subject, and difficulty
  useEffect(() => {
    let filtered = [...customQuizzes, ...QUIZZES];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.description.toLowerCase().includes(query)
      );
    }

    if (selectedSubject !== "All") {
      filtered = filtered.filter((q) => q.subject === selectedSubject);
    }

    if (selectedDifficulty !== "All") {
      filtered = filtered.filter((q) => q.difficulty === selectedDifficulty);
    }

    setQuizzes(filtered);
  }, [searchQuery, selectedSubject, selectedDifficulty, customQuizzes]);

  // Calculate history-based metrics
  const totalQuizzesTaken = quizHistory.length;
  
  const averageScore =
    totalQuizzesTaken > 0
      ? Math.round(
          quizHistory.reduce((sum, item) => sum + item.percentage, 0) /
            totalQuizzesTaken
        )
      : 0;

  const perfectQuizzesCount = quizHistory.filter(
    (item) => item.score === item.totalQuestions
  ).length;

  const totalPointsEarned = quizHistory.reduce(
    (sum, item) => sum + item.score * 100,
    0
  );

  // Handle active quiz answers
  const handleOptionSelect = (index: number) => {
    if (isAnswered) return; // Prevent double answering
    setSelectedOptionIndex(index);
    setIsAnswered(true);

    const isCorrect = index === activeQuiz?.questions[currentQuestionIndex].correctAnswerIndex;
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }

    setUserAnswersHistory((prev) => [...prev, index]);
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;

    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      // Last question completed - finalize results!
      const score = correctAnswersCount;
      const totalQuestions = activeQuiz.questions.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      const newAttempt: QuizAttempt = {
        id: Date.now().toString(),
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        subject: activeQuiz.subject,
        difficulty: activeQuiz.difficulty,
        score,
        totalQuestions,
        percentage,
        timestamp: new Date().toISOString()
      };

      const updatedHistory = [newAttempt, ...quizHistory];
      setQuizHistory(updatedHistory);
      try {
        localStorage.setItem("studypal_quiz_history", JSON.stringify(updatedHistory));
      } catch (err) {
        console.error("Error saving attempt:", err);
      }

      setShowResults(true);
    }
  };

  const startQuizSession = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setCorrectAnswersCount(0);
    setUserAnswersHistory([]);
    setShowResults(false);
    setShowReview(false);
    setShowQuitConfirm(false);
  };

  const resetQuizSession = () => {
    if (activeQuiz) {
      startQuizSession(activeQuiz);
    }
  };

  const exitQuizSession = () => {
    setActiveQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setCorrectAnswersCount(0);
    setUserAnswersHistory([]);
    setShowResults(false);
    setShowReview(false);
    setShowQuitConfirm(false);
  };

  const handleBackClick = () => {
    if (showResults) {
      exitQuizSession();
    } else if (isAnswered || currentQuestionIndex > 0 || selectedOptionIndex !== null) {
      setShowQuitConfirm(true);
    } else {
      exitQuizSession();
    }
  };

  const clearQuizHistory = () => {
    setQuizHistory([]);
    try {
      localStorage.removeItem("studypal_quiz_history");
    } catch (err) {
      console.error(err);
    }
    setShowConfirmClear(false);
  };

  // Helper styles for subjects
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Mathematics":
        return {
          bg: "bg-indigo-50",
          text: "text-indigo-700",
          border: "border-indigo-200",
          accent: "indigo",
          hoverBg: "hover:bg-indigo-50/80"
        };
      case "Science":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          accent: "emerald",
          hoverBg: "hover:bg-emerald-50/80"
        };
      case "Computer Science":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          accent: "purple",
          hoverBg: "hover:bg-purple-50/80"
        };
      case "History":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          accent: "amber",
          hoverBg: "hover:bg-amber-50/80"
        };
      case "Literature":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          accent: "rose",
          hoverBg: "hover:bg-rose-50/80"
        };
      case "Economics":
        return {
          bg: "bg-teal-50",
          text: "text-teal-700",
          border: "border-teal-200",
          accent: "teal",
          hoverBg: "hover:bg-teal-50/80"
        };
      case "Psychology":
        return {
          bg: "bg-pink-50",
          text: "text-pink-700",
          border: "border-pink-200",
          accent: "pink",
          hoverBg: "hover:bg-pink-50/80"
        };
      case "Philosophy":
        return {
          bg: "bg-fuchsia-50",
          text: "text-fuchsia-700",
          border: "border-fuchsia-200",
          accent: "fuchsia",
          hoverBg: "hover:bg-fuchsia-50/80"
        };
      case "Art History":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
          accent: "orange",
          hoverBg: "hover:bg-orange-50/80"
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          accent: "gray",
          hoverBg: "hover:bg-gray-50/80"
        };
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Beginner":
        return "bg-green-50 text-green-700 border-green-100";
      case "Intermediate":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Advanced":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "Mathematics":
        return <Brain className="w-4 h-4" />;
      case "Science":
        return <Sparkles className="w-4 h-4" />;
      case "Computer Science":
        return <BookOpen className="w-4 h-4" />;
      case "History":
        return <Award className="w-4 h-4" />;
      case "Literature":
        return <PenTool className="w-4 h-4" />;
      case "Economics":
        return <TrendingUp className="w-4 h-4" />;
      case "Psychology":
        return <Smile className="w-4 h-4" />;
      case "Philosophy":
        return <Lightbulb className="w-4 h-4" />;
      case "Art History":
        return <Palette className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  // Quick formatted date
  const formatTimeAgo = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Best score for a given quiz id
  const getBestScoreForQuiz = (quizId: string) => {
    const attempts = quizHistory.filter((a) => a.quizId === quizId);
    if (attempts.length === 0) return null;
    const best = Math.max(...attempts.map((a) => a.score));
    return `${best}/5`;
  };

  return (
    <div className="flex flex-col h-full space-y-6 pb-12">
      {/* -------------------- ACTIVE QUIZ SCREEN -------------------- */}
      {activeQuiz && (
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="active-quiz-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col space-y-6"
            >
              {/* Header with back button */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <button
                  onClick={handleBackClick}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-900 transition-colors font-medium bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quit Quiz</span>
                </button>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getDifficultyColor(
                      activeQuiz.difficulty
                    )}`}
                  >
                    {activeQuiz.difficulty}
                  </span>
                  <span className="text-sm font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-lg border border-gray-100">
                    {activeQuiz.subject}
                  </span>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">
                    Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Est. {activeQuiz.duration}
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((currentQuestionIndex + (isAnswered ? 1 : 0)) /
                          activeQuiz.questions.length) *
                        100
                      }%`
                    }}
                  />
                </div>
              </div>

              {/* Quiz body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Question and Options (2 cols) */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xs space-y-6">
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug">
                      {activeQuiz.questions[currentQuestionIndex].questionText}
                    </h2>

                    <div className="space-y-3">
                      {activeQuiz.questions[currentQuestionIndex].options.map(
                        (option, index) => {
                          const isSelected = selectedOptionIndex === index;
                          const isCorrectAns =
                            index ===
                            activeQuiz.questions[currentQuestionIndex].correctAnswerIndex;

                          let btnStyle =
                            "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 text-gray-800";
                          let iconElement = null;

                          if (isAnswered) {
                            if (isCorrectAns) {
                              btnStyle =
                                "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-xs shadow-emerald-100";
                              iconElement = (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                              );
                            } else if (isSelected) {
                              btnStyle =
                                "border-red-500 bg-red-50 text-red-900 font-semibold shadow-xs shadow-red-100";
                              iconElement = (
                                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                              );
                            } else {
                              btnStyle = "border-gray-100 bg-gray-50/50 text-gray-400 opacity-60";
                            }
                          } else if (isSelected) {
                            btnStyle = "border-blue-500 bg-blue-50 text-blue-900 font-semibold";
                          }

                          return (
                            <button
                              key={index}
                              disabled={isAnswered}
                              onClick={() => handleOptionSelect(index)}
                              className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 text-sm md:text-base cursor-pointer ${btnStyle}`}
                            >
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                    isAnswered
                                      ? isCorrectAns
                                        ? "bg-emerald-500 text-white"
                                        : isSelected
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-200 text-gray-400"
                                      : isSelected
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {String.fromCharCode(65 + index)}
                                </span>
                                <span>{option}</span>
                              </div>
                              {iconElement}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>

                {/* Explanation Card (1 col) */}
                <div className="md:col-span-1">
                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4 h-full flex flex-col"
                      >
                        <div className="flex items-center space-x-2.5 text-amber-800">
                          <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700">
                            <Brain className="w-4 h-4" />
                          </div>
                          <span className="font-extrabold text-sm uppercase tracking-wider">
                            Detailed Explanation
                          </span>
                        </div>
                        <p className="text-amber-900/90 text-sm leading-relaxed flex-1">
                          {activeQuiz.questions[currentQuestionIndex].explanation}
                        </p>
                        <div className="pt-2">
                          <button
                            onClick={handleNextQuestion}
                            className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-950 text-white font-extrabold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <span>
                              {currentQuestionIndex < activeQuiz.questions.length - 1
                                ? "Next Question"
                                : "See Results"}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Confirm Quit Dialog */}
              {showQuitConfirm && (
                <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-100 shadow-2xl space-y-6"
                  >
                    <div className="flex items-center space-x-3 text-red-600">
                      <AlertCircle className="w-6 h-6" />
                      <h3 className="text-lg font-extrabold text-gray-900">Abandon Quiz?</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Are you sure you want to quit? Your current score won't be saved in your study
                      history.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowQuitConfirm(false)}
                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Keep Playing
                      </button>
                      <button
                        onClick={exitQuizSession}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Yes, Abandon
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ) : (
            /* -------------------- QUIZ RESULTS SCREEN -------------------- */
            <motion.div
              key="quiz-results-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 md:p-10 border border-gray-100 shadow-sm max-w-3xl mx-auto flex flex-col items-center text-center space-y-8"
            >
              {/* Score badge celebration */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-blue-50 border-4 border-blue-100 flex flex-col items-center justify-center shadow-xs">
                  <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-500 mb-1" />
                  <span className="text-2xl md:text-3xl font-black text-gray-900">
                    {correctAnswersCount} / {activeQuiz.questions.length}
                  </span>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Correct
                  </span>
                </div>
                {correctAnswersCount === activeQuiz.questions.length && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-blue-950 p-2 rounded-full shadow-lg border border-white animate-bounce">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Feedback messages */}
              <div className="space-y-2 max-w-lg">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                  {correctAnswersCount === 5 && "Flawless Score! 🌟"}
                  {correctAnswersCount === 4 && "Fantastic Effort! 👍"}
                  {correctAnswersCount === 3 && "Good Achievement! 📚"}
                  {correctAnswersCount < 3 && "Keep Learning! 💪"}
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  {correctAnswersCount === 5 &&
                    "Incredible memory! You answered every question perfectly. You've earned 500 XP!"}
                  {correctAnswersCount === 4 &&
                    "Excellent job! You almost had it perfect. Review the explanations below to refine your knowledge."}
                  {correctAnswersCount === 3 &&
                    "Solid progress! You answered more than half correctly. Retake the quiz or read the notes to hit that 100%."}
                  {correctAnswersCount < 3 &&
                    "A great learning opportunity. Take some time to re-read the module in the Learn tab and try again!"}
                </p>
              </div>

              {/* Score Points Summary */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-2xl font-black text-yellow-600">
                    +{correctAnswersCount * 100} XP
                  </span>
                  <span className="text-xs text-gray-500 font-semibold mt-0.5">Points Awarded</span>
                </div>
                <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-2xl font-black text-blue-600">
                    {Math.round((correctAnswersCount / activeQuiz.questions.length) * 100)}%
                  </span>
                  <span className="text-xs text-gray-500 font-semibold mt-0.5">Accuracy</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <button
                  onClick={resetQuizSession}
                  className="flex-1 py-3.5 px-4 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-black rounded-xl shadow-md transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ListRestart className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => setShowReview(!showReview)}
                  className={`flex-1 py-3.5 px-4 font-extrabold rounded-xl border shadow-xs transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ${
                    showReview
                      ? "bg-gray-100 border-gray-300 text-gray-800"
                      : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>{showReview ? "Hide Review" : "Review Answers"}</span>
                </button>
              </div>

              {/* REVIEW ANSWERS BLOCK */}
              <AnimatePresence>
                {showReview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full border-t border-gray-100 pt-8 text-left space-y-6 overflow-hidden"
                  >
                    <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      Detailed Review
                    </h3>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                      {activeQuiz.questions.map((q, idx) => {
                        const userAns = userAnswersHistory[idx];
                        const correctAns = q.correctAnswerIndex;
                        const wasCorrect = userAns === correctAns;

                        return (
                          <div
                            key={idx}
                            className={`p-5 rounded-xl border ${
                              wasCorrect
                                ? "bg-emerald-50/40 border-emerald-100"
                                : "bg-red-50/40 border-red-100"
                            } space-y-3`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-sm font-bold text-gray-500">
                                Question {idx + 1}
                              </span>
                              <span
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                  wasCorrect
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {wasCorrect ? "Correct" : "Incorrect"}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-gray-900 text-base">
                              {q.questionText}
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm pt-2">
                              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                                <span className="text-xs text-gray-400 font-bold block mb-1">
                                  YOUR ANSWER:
                                </span>
                                <span
                                  className={wasCorrect ? "text-emerald-700" : "text-red-700"}
                                >
                                  {q.options[userAns] || "Unanswered"}
                                </span>
                              </div>
                              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                                <span className="text-xs text-gray-400 font-bold block mb-1">
                                  CORRECT ANSWER:
                                </span>
                                <span className="text-emerald-700 font-semibold">
                                  {q.options[correctAns]}
                                </span>
                              </div>
                            </div>

                            <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-lg mt-3">
                              <span className="text-xs text-amber-800 font-extrabold block mb-1 uppercase tracking-wider">
                                Explanation:
                              </span>
                              <p className="text-xs text-amber-900 leading-relaxed">
                                {q.explanation}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="border-t border-gray-100 pt-6 w-full flex justify-center">
                <button
                  onClick={exitQuizSession}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer text-sm"
                >
                  Back to Quizzes list
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* -------------------- QUIZ BROWSER & HISTORY SCREEN -------------------- */}
      {!activeQuiz && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col space-y-8"
        >
          {/* Section Title Header */}
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">Quizzes</h1>
              <p className="text-gray-500 mt-1.5 font-medium">
                Test your knowledge and track your improvement with module-matching assessments.
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 hidden sm:block border border-amber-200">
              <HelpCircle className="w-6 h-6" />
            </div>
          </header>

          {/* Sub-Navigation Tabs */}
          <div className="flex space-x-1.5 p-1 bg-gray-100/60 rounded-xl max-w-xs self-start">
            <button
              onClick={() => setSubTab("quizzes")}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                subTab === "quizzes"
                  ? "bg-white text-blue-900 shadow-xs border border-gray-100"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Practice Quizzes</span>
            </button>
            <button
              onClick={() => setSubTab("ask")}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                subTab === "ask"
                  ? "bg-white text-blue-900 shadow-xs border border-gray-100"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Anything</span>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
              </span>
            </button>
          </div>

          {subTab === "quizzes" ? (
            <>

          {/* ================= QUIZ HISTORY & METRICS WIDGET ================= */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-5 md:p-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between border-b border-blue-950">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-400 text-blue-950 rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">Your Quiz Analytics</h2>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Track your overall accuracy and study points
                  </p>
                </div>
              </div>
              {totalQuizzesTaken > 0 && (
                <div className="relative">
                  {showConfirmClear ? (
                    <div className="flex items-center bg-red-900/80 border border-red-700 rounded-lg p-1 space-x-1.5 text-xs animate-pulse">
                      <span className="px-1 text-red-100">Clear?</span>
                      <button
                        onClick={clearQuizHistory}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded font-bold cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowConfirmClear(false)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowConfirmClear(true)}
                      className="text-blue-300 hover:text-red-400 transition-colors p-2 hover:bg-blue-900/40 rounded-lg flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reset History</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white">
              {/* Stats Bento Block (Left Column) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                {/* Metric 1 */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center space-x-3 shadow-xs">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xl font-black text-gray-900 block leading-tight">
                      {totalQuizzesTaken}
                    </span>
                    <span className="text-[10px] md:text-xs text-gray-500 font-bold block">
                      Quizzes Taken
                    </span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center space-x-3 shadow-xs">
                  <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xl font-black text-gray-900 block leading-tight">
                      {averageScore}%
                    </span>
                    <span className="text-[10px] md:text-xs text-gray-500 font-bold block">
                      Average Score
                    </span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center space-x-3 shadow-xs">
                  <div className="p-2.5 bg-yellow-100 text-yellow-700 rounded-lg shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xl font-black text-gray-900 block leading-tight">
                      {totalPointsEarned}
                    </span>
                    <span className="text-[10px] md:text-xs text-gray-500 font-bold block">
                      Total XP Earned
                    </span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center space-x-3 shadow-xs">
                  <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xl font-black text-gray-900 block leading-tight">
                      {perfectQuizzesCount}
                    </span>
                    <span className="text-[10px] md:text-xs text-gray-500 font-bold block">
                      Perfect Quizzes
                    </span>
                  </div>
                </div>
              </div>

              {/* History List Widget (Right Column) */}
              <div className="lg:col-span-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-6 min-h-[140px]">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                  Recent Quiz History
                </h3>

                {quizHistory.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-sm font-semibold text-gray-500">No attempts logged yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Choose any challenge below to test your mastery!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-2 flex-1">
                    {quizHistory.slice(0, 4).map((attempt) => {
                      const colors = getSubjectColor(attempt.subject);
                      return (
                        <div
                          key={attempt.id}
                          className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl text-xs transition-colors"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span
                              className={`p-1.5 rounded-lg shrink-0 ${colors.bg} ${colors.text}`}
                            >
                              {getSubjectIcon(attempt.subject)}
                            </span>
                            <div className="truncate">
                              <p className="font-extrabold text-gray-800 truncate">
                                {attempt.quizTitle}
                              </p>
                              <span className="text-[10px] text-gray-400">
                                {formatTimeAgo(attempt.timestamp)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 shrink-0 ml-4">
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                attempt.score === attempt.totalQuestions
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : attempt.percentage >= 60
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              Score: {attempt.score}/{attempt.totalQuestions}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ================= AI CUSTOM QUIZ GENERATOR CARD ================= */}
          <section className="bg-linear-to-br from-indigo-900 via-indigo-950 to-blue-950 rounded-2xl p-5 md:p-6 text-white shadow-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-indigo-500/30 rounded-lg text-indigo-300">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="text-xs font-black tracking-wider uppercase text-indigo-300">Dynamic AI Quizzer</h3>
                </div>
                <h4 className="text-lg md:text-xl font-black text-blue-50 tracking-tight leading-tight">
                  Quiz Yourself on Any Topic!
                </h4>
                <p className="text-xs text-indigo-200/90 leading-relaxed max-w-lg">
                  Enter any specific subject (e.g., <i>Photosynthesis</i>, <i>Ancient Rome</i>, or <i>Supply & Demand</i>) and select a difficulty. StudyPal will instantly build a custom 5-question interactive quiz using AI.
                </p>
              </div>

              {/* Input & Config Section */}
              <div className="w-full md:w-80 bg-white/10 p-4 rounded-xl border border-white/10 space-y-3 shrink-0">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-indigo-200 block">
                    Enter Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cognitive Biases, Python code, etc."
                    value={customQuizTopic}
                    onChange={(e) => setCustomQuizTopic(e.target.value)}
                    disabled={isGeneratingQuiz}
                    className="w-full bg-white text-gray-800 placeholder-gray-400 text-xs font-semibold rounded-lg px-3 py-2.5 border-0 focus:ring-2 focus:ring-indigo-400 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customQuizTopic.trim() && !isGeneratingQuiz) {
                        e.preventDefault();
                        handleGenerateCustomQuiz();
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-indigo-200 block">
                      Difficulty
                    </label>
                    <select
                      value={customQuizDifficulty}
                      onChange={(e) => setCustomQuizDifficulty(e.target.value as any)}
                      disabled={isGeneratingQuiz}
                      className="w-full bg-indigo-900/60 border border-white/10 text-white rounded-lg px-2.5 py-2 text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="Beginner" className="bg-indigo-950 text-white font-bold">Beginner</option>
                      <option value="Intermediate" className="bg-indigo-950 text-white font-bold">Intermediate</option>
                      <option value="Advanced" className="bg-indigo-950 text-white font-bold">Advanced</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => handleGenerateCustomQuiz()}
                      disabled={isGeneratingQuiz || !customQuizTopic.trim()}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed text-white text-xs font-black py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      {isGeneratingQuiz ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Building...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-3.5 h-3.5" />
                          <span>Quiz Me!</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {quizGenError && (
                  <p className="text-[11px] text-red-300 font-bold leading-tight">{quizGenError}</p>
                )}
              </div>
            </div>
          </section>

          {/* ================= SEARCH & FILTERS ================= */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quizzes..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl outline-hidden text-sm transition-colors text-gray-800 font-medium"
              />
            </div>

            {/* Selector Dropdowns */}
            <div className="flex flex-wrap gap-2.5 w-full md:w-auto items-center">
              <div className="flex items-center space-x-1.5 text-xs text-gray-400 font-extrabold uppercase">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              {/* Subject Selector */}
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Computer Science">Computer Science</option>
                <option value="History">History</option>
                <option value="Literature">Literature</option>
                <option value="Economics">Economics</option>
                <option value="Psychology">Psychology</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Art History">Art History</option>
              </select>

              {/* Difficulty Selector */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* ================= QUIZZES SELECTION GRID ================= */}
          {quizzes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs flex-1 flex flex-col items-center justify-center text-gray-400 p-12 text-center border-dashed">
              <HelpCircle className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-bold text-gray-500">No quizzes match your filters</p>
              <p className="text-sm mt-1.5 text-gray-400">
                Try widening your search terms or resetting the active filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("All");
                  setSelectedDifficulty("All");
                }}
                className="mt-4 px-4 py-2 bg-blue-900 text-white font-extrabold rounded-xl text-sm hover:bg-blue-950 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => {
                const colors = getSubjectColor(quiz.subject);
                const bestScore = getBestScoreForQuiz(quiz.id);

                return (
                  <motion.div
                    key={quiz.id}
                    layoutId={`quiz-card-${quiz.id}`}
                    whileHover={{ y: -4, transition: { duration: 0.15 } }}
                    className="bg-white rounded-2xl border border-gray-100 hover:border-blue-100 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
                  >
                    {/* Top Accent Strip */}
                    <div className={`h-1.5 w-full bg-${colors.accent}-500`} />

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      {/* Tags & Best Score */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getDifficultyColor(
                              quiz.difficulty
                            )}`}
                          >
                            {quiz.difficulty}
                          </span>
                          {quiz.id.startsWith("quiz-custom-") && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] text-indigo-700 font-extrabold uppercase tracking-wide flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                              AI Generated
                            </span>
                          )}
                        </div>
                        {bestScore ? (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Best: {bestScore}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">
                            Not taken yet
                          </span>
                        )}
                      </div>

                      {/* Info block */}
                      <div className="space-y-2">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${colors.text}`}
                        >
                          {getSubjectIcon(quiz.subject)}
                          {quiz.subject}
                        </span>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight leading-snug">
                          {quiz.title}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                          {quiz.description}
                        </p>
                      </div>

                      {/* Footer block */}
                      <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1 shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          Est. {quiz.duration} • 5 Qs
                        </span>
                        <button
                          onClick={() => startQuizSession(quiz)}
                          className={`text-xs font-black py-1.5 px-3 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${colors.bg} ${colors.text} ${colors.border} ${colors.hoverBg}`}
                        >
                          <span>Start Quiz</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col h-[580px] overflow-hidden"
          >
            {/* AI Assistant Header */}
            <div className="p-4 md:p-5 bg-gradient-to-r from-blue-950 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold tracking-tight">StudyPal AI Tutor</h2>
                  <p className="text-[10px] text-indigo-200">Interactive academic Q&A powered by Gemini</p>
                </div>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="text-xs font-bold text-indigo-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg cursor-pointer"
                >
                  Clear Conversation
                </button>
              )}
            </div>

            {/* Message List Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center space-y-5 py-4">
                  <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-800">Ask Me Anything!</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
                      I can help you understand literature devices, supply and demand, cognitive biases, Renaissance masterpieces, or any other topic.
                    </p>
                  </div>

                  {/* Inline Custom Quiz Generator */}
                  <div className="w-full bg-linear-to-br from-indigo-50/60 to-blue-50/60 border border-indigo-100/60 rounded-2xl p-4 text-left space-y-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                      <h4 className="text-xs font-black text-indigo-950">Dynamic AI Quiz Generator</h4>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Enter any specific topic below to generate a custom 5-question multiple choice quiz immediately!
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Cognitive Biases, Photosynthesis, etc."
                        value={customQuizTopic}
                        onChange={(e) => setCustomQuizTopic(e.target.value)}
                        disabled={isGeneratingQuiz}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder-gray-400"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && customQuizTopic.trim() && !isGeneratingQuiz) {
                            e.preventDefault();
                            handleGenerateCustomQuiz();
                          }
                        }}
                      />
                      <button
                        onClick={() => handleGenerateCustomQuiz()}
                        disabled={isGeneratingQuiz || !customQuizTopic.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-xs font-extrabold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        {isGeneratingQuiz ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Award className="w-3.5 h-3.5" />
                        )}
                        <span>Quiz Me!</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-full text-left space-y-2">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-0.5">
                      Suggested Topics:
                    </span>
                    {[
                      "What is Descartes' radical doubt?",
                      "Explain the difference between a priori and a posteriori knowledge.",
                      "What is the tripartite theory of JTB knowledge?",
                      "How do markets self-correct when there is a shortage?",
                      "What is the precise rhetorical distinction of a soliloquy?"
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAskQuestion(prompt)}
                        className="w-full text-left p-2.5 bg-white hover:bg-indigo-50/40 border border-gray-100 hover:border-indigo-100 rounded-xl text-xs font-bold text-gray-700 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                      >
                        <span>{prompt}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                          msg.role === "user"
                            ? "bg-blue-100 border-blue-200 text-blue-700"
                            : "bg-indigo-50 border-indigo-100 text-indigo-700"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Brain className="w-4 h-4" />
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`p-4 rounded-2xl max-w-[85%] shadow-2xs ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        ) : (
                          <div className="prose prose-blue max-w-none text-sm leading-relaxed markdown-body">
                            <Markdown>{msg.content}</Markdown>
                          </div>
                        )}

                        {/* Interactive Custom Quiz buttons */}
                        {msg.role === "model" && msg.quizToStart && (
                          <div className="mt-3.5 pt-3 border-t border-gray-100/80 flex justify-end">
                            <button
                              onClick={() => startQuizSession(msg.quizToStart!)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                            >
                              <Award className="w-4 h-4" />
                              <span>Start Custom Quiz Now</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {msg.role === "model" && !msg.quizToStart && (
                          <div className="mt-3.5 pt-3 border-t border-gray-100/80 flex justify-end">
                            <button
                              onClick={() => {
                                // Find the user question that preceded this response
                                const msgIndex = messages.findIndex(m => m.id === msg.id);
                                const precedingUserMsg = msgIndex > 0 ? messages[msgIndex - 1] : null;
                                const topicQuery = precedingUserMsg ? precedingUserMsg.content : "this topic";
                                handleGenerateCustomQuiz(topicQuery);
                              }}
                              disabled={isGeneratingQuiz}
                              className="px-3 py-1.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/40 hover:border-indigo-100 text-indigo-700 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                              <Brain className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Quiz Me on This Topic!</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isAsking && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-50 border border-indigo-100 text-indigo-700">
                        <Brain className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-2xs flex items-center space-x-2">
                        <span className="text-xs text-gray-500 font-bold">AI Tutor is drafting response...</span>
                        <span className="flex space-x-1">
                          <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                        </span>
                      </div>
                    </div>
                  )}

                  {askError && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{askError}</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Chat Input Area */}
            <div className="p-3 md:p-4 border-t border-gray-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  disabled={isAsking}
                  placeholder="Ask any question about your classes or topics..."
                  className="flex-1 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-indigo-500 outline-none rounded-xl px-4 py-2.5 text-sm transition-all text-gray-800 font-medium disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isAsking || !questionInput.trim()}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 shrink-0 cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
        </motion.div>
      )}
    </div>
  );
}
