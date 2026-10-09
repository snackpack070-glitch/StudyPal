import { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, Calendar, CheckCircle2, Award, Zap, BarChart3, LineChart, Sparkles } from 'lucide-react';
import { ScannedItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface WeeklyProgressChartProps {
  historyList: ScannedItem[];
  onNavigateToTab?: (tab: 'dashboard' | 'history' | 'learn' | 'quizzes') => void;
}

interface DayData {
  dateKey: string;
  dayLabel: string;
  fullDate: string;
  scans: number;
  quizzes: number;
  total: number;
}

export default function WeeklyProgressChart({ historyList, onNavigateToTab }: WeeklyProgressChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');
  const [filterType, setFilterType] = useState<'all' | 'scans' | 'quizzes'>('all');
  const [useSampleData, setUseSampleData] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);

  // Load quiz history for multi-activity tracking
  useEffect(() => {
    try {
      const stored = localStorage.getItem('studypal_quiz_history');
      if (stored) {
        setQuizAttempts(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading quiz history for weekly chart:', e);
    }
  }, []);

  // Compute 7 days up to today
  const chartData = useMemo<DayData[]>(() => {
    const days: DayData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - i);
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const weekday = targetDate.toLocaleDateString(undefined, { weekday: 'short' });
      const fullDate = targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Yest' : weekday;

      if (useSampleData) {
        // High quality preview data simulating an active week
        const sampleScans = [3, 1, 4, 2, 5, 3, 4][6 - i];
        const sampleQuizzes = [1, 2, 0, 3, 2, 1, 3][6 - i];
        days.push({
          dateKey,
          dayLabel,
          fullDate,
          scans: sampleScans,
          quizzes: sampleQuizzes,
          total: sampleScans + sampleQuizzes
        });
      } else {
        // Real user activity
        const dayScans = historyList.filter(item => {
          if (!item.timestamp) return false;
          const itemDate = new Date(item.timestamp);
          const itemKey = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`;
          return itemKey === dateKey;
        }).length;

        const dayQuizzes = quizAttempts.filter(item => {
          if (!item.timestamp) return false;
          const itemDate = new Date(item.timestamp);
          const itemKey = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`;
          return itemKey === dateKey;
        }).length;

        days.push({
          dateKey,
          dayLabel,
          fullDate,
          scans: dayScans,
          quizzes: dayQuizzes,
          total: dayScans + dayQuizzes
        });
      }
    }

    return days;
  }, [historyList, quizAttempts, useSampleData]);

  // Aggregate stats
  const totalScans = useMemo(() => chartData.reduce((acc, d) => acc + d.scans, 0), [chartData]);
  const totalQuizzes = useMemo(() => chartData.reduce((acc, d) => acc + d.quizzes, 0), [chartData]);
  const totalCompleted = useMemo(() => chartData.reduce((acc, d) => acc + d.total, 0), [chartData]);
  const dailyAverage = (totalCompleted / 7).toFixed(1);

  // Peak day
  const bestDay = useMemo(() => {
    return chartData.reduce((max, d) => (d.total > max.total ? d : max), chartData[0]);
  }, [chartData]);

  // Active days count
  const activeDaysCount = useMemo(() => chartData.filter(d => d.total > 0).length, [chartData]);

  // Weekly Goal target (default 10 items)
  const weeklyGoal = 10;
  const goalProgress = Math.min(Math.round((totalCompleted / weeklyGoal) * 100), 100);

  // Colors adapted to theme
  const scanBarColor = isDark ? '#38bdf8' : '#2563eb'; // Sky blue / Blue
  const quizBarColor = isDark ? '#fbbf24' : '#d97706'; // Yellow / Amber
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DayData;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl p-3 text-xs min-w-[170px] z-50">
          <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
            <span>{data.fullDate}</span>
            <span className="text-[10px] text-yellow-500 font-semibold uppercase">{data.dayLabel}</span>
          </p>
          <div className="space-y-1.5">
            {(filterType === 'all' || filterType === 'scans') && (
              <div className="flex items-center justify-between">
                <span className="flex items-center text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm mr-1.5 inline-block" style={{ backgroundColor: scanBarColor }} />
                  Scans Solved:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{data.scans}</span>
              </div>
            )}
            {(filterType === 'all' || filterType === 'quizzes') && (
              <div className="flex items-center justify-between">
                <span className="flex items-center text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm mr-1.5 inline-block" style={{ backgroundColor: quizBarColor }} />
                  Quizzes Completed:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{data.quizzes}</span>
              </div>
            )}
            <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between font-extrabold">
              <span className="text-slate-800 dark:text-slate-200">Total Items:</span>
              <span className="text-blue-600 dark:text-yellow-400">
                {filterType === 'scans' ? data.scans : filterType === 'quizzes' ? data.quizzes : data.total}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-yellow-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Weekly Progress
                {useSampleData && (
                  <span className="text-[10px] uppercase font-extrabold tracking-wide px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-950/70 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50">
                    Preview Data
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Study items completed over the last 7 days
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="flex bg-gray-100 dark:bg-slate-800/90 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-blue-950 dark:text-white shadow-xs'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterType('scans')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === 'scans'
                  ? 'bg-white dark:bg-slate-700 text-blue-950 dark:text-white shadow-xs'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
              }`}
            >
              Scans
            </button>
            <button
              onClick={() => setFilterType('quizzes')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === 'quizzes'
                  ? 'bg-white dark:bg-slate-700 text-blue-950 dark:text-white shadow-xs'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
              }`}
            >
              Quizzes
            </button>
          </div>

          {/* Chart Style Toggle (Bar vs Area) */}
          <div className="flex bg-gray-100 dark:bg-slate-800/90 p-1 rounded-xl text-xs">
            <button
              onClick={() => setChartType('bar')}
              title="Bar Chart"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-yellow-400 shadow-xs'
                  : 'text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('area')}
              title="Area Trend"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === 'area'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-yellow-400 shadow-xs'
                  : 'text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preview Toggle for demonstration if 0 real items */}
          <button
            onClick={() => setUseSampleData(prev => !prev)}
            title="Toggle preview demo data for testing"
            className={`text-xs px-2.5 py-1.5 rounded-xl border flex items-center space-x-1 cursor-pointer transition-colors ${
              useSampleData
                ? 'bg-yellow-400/10 dark:bg-yellow-950/40 border-yellow-400/50 text-yellow-700 dark:text-yellow-300 font-semibold'
                : 'border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <span className="text-[11px]">{useSampleData ? 'Live Data' : 'Sample Data'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="p-3 bg-gray-50/80 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800/80">
          <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 block">Total Completed</span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-xl font-black text-gray-900 dark:text-white">{totalCompleted}</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500">items</span>
          </div>
        </div>

        <div className="p-3 bg-gray-50/80 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800/80">
          <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 block">Daily Average</span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-xl font-black text-blue-600 dark:text-yellow-400">{dailyAverage}</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500">/ day</span>
          </div>
        </div>

        <div className="p-3 bg-gray-50/80 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800/80">
          <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 block">Active Days</span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{activeDaysCount}</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500">of 7 days</span>
          </div>
        </div>

        <div className="p-3 bg-gray-50/80 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800/80">
          <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 block">Best Day</span>
          <div className="flex items-baseline space-x-1.5 mt-0.5 truncate">
            <span className="text-xl font-black text-amber-600 dark:text-amber-400">
              {bestDay.total > 0 ? bestDay.dayLabel : '—'}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500">
              {bestDay.total > 0 ? `(${bestDay.total})` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Chart Visualization */}
      <div className="w-full h-64 min-w-0 my-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.6} />
              <XAxis
                dataKey="dayLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11 }}
                domain={[0, (dataMax: number) => Math.max(dataMax + 1, 4)]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9', opacity: 0.5 }} />
              {filterType === 'all' && (
                <>
                  <Bar
                    dataKey="scans"
                    name="Scanned Items"
                    fill={scanBarColor}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="quizzes"
                    name="Quizzes Completed"
                    fill={quizBarColor}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </>
              )}
              {filterType === 'scans' && (
                <Bar
                  dataKey="scans"
                  name="Scanned Items"
                  fill={scanBarColor}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              )}
              {filterType === 'quizzes' && (
                <Bar
                  dataKey="quizzes"
                  name="Quizzes Completed"
                  fill={quizBarColor}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              )}
            </BarChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDark ? '#fbbf24' : '#2563eb'} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={isDark ? '#fbbf24' : '#2563eb'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.6} />
              <XAxis
                dataKey="dayLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11 }}
                domain={[0, (dataMax: number) => Math.max(dataMax + 1, 4)]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={filterType === 'scans' ? 'scans' : filterType === 'quizzes' ? 'quizzes' : 'total'}
                name="Completed Items"
                stroke={isDark ? '#fbbf24' : '#2563eb'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend & Weekly Goal Bottom Footer */}
      <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Legend */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: scanBarColor }} />
            <span className="text-gray-600 dark:text-slate-400 font-medium text-[11px]">
              Scans ({totalScans})
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: quizBarColor }} />
            <span className="text-gray-600 dark:text-slate-400 font-medium text-[11px]">
              Quizzes ({totalQuizzes})
            </span>
          </div>
        </div>

        {/* Goal Indicator */}
        <div className="flex items-center space-x-2 text-[11px] text-gray-500 dark:text-slate-400">
          <span>Weekly Target (10 items):</span>
          <div className="w-20 bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-yellow-400 dark:bg-yellow-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <span className="font-bold text-gray-800 dark:text-white">{goalProgress}%</span>
        </div>
      </div>

      {/* Motivational Empty State Message if zero items */}
      {totalCompleted === 0 && !useSampleData && (
        <div className="mt-4 p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-xs text-blue-900 dark:text-blue-200">
            <Calendar className="w-4 h-4 text-blue-500 dark:text-yellow-400 flex-shrink-0" />
            <span>
              Start your 7-day streak! Solve your first problem with the scanner above or take a practice quiz.
            </span>
          </div>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('quizzes')}
              className="text-xs font-bold text-blue-700 dark:text-yellow-400 hover:underline flex-shrink-0 ml-2 cursor-pointer"
            >
              Take Quiz →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
