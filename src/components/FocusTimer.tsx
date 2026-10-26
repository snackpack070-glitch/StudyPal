import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Timer, 
  CheckCircle2, 
  Coffee, 
  Flame, 
  Plus, 
  Minus,
  Sparkles,
  Bell,
  ArrowRight
} from 'lucide-react';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface TimerPreset {
  id: TimerMode;
  label: string;
  duration: number; // in seconds
  description: string;
  nextMode: TimerMode;
  nextLabel: string;
}

const PRESETS: Record<TimerMode, TimerPreset> = {
  focus: {
    id: 'focus',
    label: 'Focus',
    duration: 25 * 60,
    description: 'Deep study block with zero distractions',
    nextMode: 'shortBreak',
    nextLabel: 'Start Short Break (5m)'
  },
  shortBreak: {
    id: 'shortBreak',
    label: 'Short Break',
    duration: 5 * 60,
    description: 'Stretch, hydrate, and rest your eyes',
    nextMode: 'focus',
    nextLabel: 'Start Focus Session (25m)'
  },
  longBreak: {
    id: 'longBreak',
    label: 'Long Break',
    duration: 15 * 60,
    description: 'Step away and recharge your mental energy',
    nextMode: 'focus',
    nextLabel: 'Start Focus Session (25m)'
  }
};

export function FocusTimer() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(PRESETS.focus.duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('studypal_timer_sound_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isPlayingTestSound, setIsPlayingTestSound] = useState<boolean>(false);
  
  // Daily session tracking
  const [todaySessions, setTodaySessions] = useState<number>(() => {
    try {
      const savedDate = localStorage.getItem('studypal_focus_date');
      const today = new Date().toISOString().slice(0, 10);
      if (savedDate === today) {
        return parseInt(localStorage.getItem('studypal_focus_count') || '0', 10);
      }
      return 0;
    } catch {
      return 0;
    }
  });

  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(() => {
    try {
      const savedDate = localStorage.getItem('studypal_focus_date');
      const today = new Date().toISOString().slice(0, 10);
      if (savedDate === today) {
        return parseInt(localStorage.getItem('studypal_focus_minutes') || '0', 10);
      }
      return 0;
    } catch {
      return 0;
    }
  });

  const totalDuration = PRESETS[mode].duration;
  const timerIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize or resume AudioContext
  const getAudioContext = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch (e) {
      console.warn('AudioContext initialization error:', e);
      return null;
    }
  }, []);

  // Request browser notification permission if available
  const requestNotificationPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }
  };

  // Play rich resonant completion notification chime
  const playNotificationSound = useCallback((force = false) => {
    if (!soundEnabled && !force) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Primary Chime sequence: High harmonic bell chime (E5 -> G#5 -> B5 -> E6)
      const primaryNotes = [
        { freq: 659.25, delay: 0.0, duration: 0.9, gain: 0.35 },   // E5
        { freq: 830.61, delay: 0.16, duration: 0.9, gain: 0.38 },  // G#5
        { freq: 987.77, delay: 0.32, duration: 1.0, gain: 0.42 },  // B5
        { freq: 1318.51, delay: 0.48, duration: 1.6, gain: 0.48 }, // E6
      ];

      primaryNotes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.delay);

        // Warm harmonic overtone (octave)
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(n.freq * 2, now + n.delay);
        overtoneGain.gain.setValueAtTime(n.gain * 0.15, now + n.delay);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + n.delay + n.duration * 0.6);

        gain.gain.setValueAtTime(0.001, now + n.delay);
        gain.gain.linearRampToValueAtTime(n.gain, now + n.delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.delay + n.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        overtone.connect(overtoneGain);
        overtoneGain.connect(ctx.destination);

        osc.start(now + n.delay);
        osc.stop(now + n.delay + n.duration);
        overtone.start(now + n.delay);
        overtone.stop(now + n.delay + n.duration * 0.6);
      });

      // Follow-up accent chime 1.1s later to guarantee the user hears it even away from desk
      setTimeout(() => {
        if ((!soundEnabled && !force) || !audioCtxRef.current) return;
        try {
          const c2 = audioCtxRef.current;
          const t2 = c2.currentTime;
          const secondNotes = [
            { freq: 987.77, delay: 0.0, duration: 0.9, gain: 0.35 },
            { freq: 1318.51, delay: 0.18, duration: 1.5, gain: 0.42 }
          ];
          secondNotes.forEach((n) => {
            const osc = c2.createOscillator();
            const gain = c2.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(n.freq, t2 + n.delay);
            gain.gain.setValueAtTime(0.001, t2 + n.delay);
            gain.gain.linearRampToValueAtTime(n.gain, t2 + n.delay + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, t2 + n.delay + n.duration);
            osc.connect(gain);
            gain.connect(c2.destination);
            osc.start(t2 + n.delay);
            osc.stop(t2 + n.delay + n.duration);
          });
        } catch (e) {
          console.warn('Follow-up audio chime failed:', e);
        }
      }, 1100);

    } catch (e) {
      console.warn('Audio notification could not be played:', e);
    }
  }, [soundEnabled, getAudioContext]);

  // Toggle mute / unmute preference with persistence
  const handleToggleSound = () => {
    getAudioContext();
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('studypal_timer_sound_enabled', String(next));
      } catch (err) {
        console.error('Error saving sound preference:', err);
      }
      return next;
    });
  };

  // Preview sound on demand (works even if muted so user can test volume)
  const handleTestSound = () => {
    getAudioContext();
    setIsPlayingTestSound(true);
    playNotificationSound(true);
    setTimeout(() => {
      setIsPlayingTestSound(false);
    }, 1800);
  };

  // Dispatch browser notification
  const sendBrowserNotification = useCallback((title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body,
            icon: '/study-icon.png'
          });
        } catch (e) {
          console.warn('Browser notification error:', e);
        }
      }
    }
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer hit ZERO: Play sound and complete session
            playNotificationSound();
            setIsRunning(false);
            setIsCompleted(true);

            const sessionTitle = mode === 'focus' ? 'Focus Session Completed! 🎯' : 'Break Finished! ⚡';
            const sessionMsg = mode === 'focus' 
              ? 'Great job! Time to take a restful break.' 
              : 'Break time is over! Ready to jump back in?';
            
            sendBrowserNotification(sessionTitle, sessionMsg);

            if (mode === 'focus') {
              const newCount = todaySessions + 1;
              const newMins = totalFocusMinutes + Math.round(PRESETS.focus.duration / 60);
              setTodaySessions(newCount);
              setTotalFocusMinutes(newMins);

              try {
                const today = new Date().toISOString().slice(0, 10);
                localStorage.setItem('studypal_focus_date', today);
                localStorage.setItem('studypal_focus_count', newCount.toString());
                localStorage.setItem('studypal_focus_minutes', newMins.toString());
              } catch (err) {
                console.error(err);
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, mode, todaySessions, totalFocusMinutes, playNotificationSound, sendBrowserNotification]);

  // Handle switching modes
  const handleModeChange = (newMode: TimerMode) => {
    getAudioContext();
    setIsRunning(false);
    setIsCompleted(false);
    setMode(newMode);
    setTimeLeft(PRESETS[newMode].duration);
  };

  // Toggle start / pause
  const handleTogglePlay = () => {
    getAudioContext();
    requestNotificationPermission();
    if (timeLeft === 0 || isCompleted) {
      setTimeLeft(PRESETS[mode].duration);
      setIsCompleted(false);
    }
    setIsRunning(!isRunning);
  };

  // Reset current timer
  const handleReset = () => {
    getAudioContext();
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(PRESETS[mode].duration);
  };

  // Adjust time by delta seconds (+/- 1 minute)
  const adjustTime = (deltaSeconds: number) => {
    setTimeLeft((prev) => {
      const next = prev + deltaSeconds;
      if (next < 60) return 60; // min 1 minute
      if (next > 120 * 60) return 120 * 60; // max 120 minutes
      return next;
    });
    setIsCompleted(false);
  };

  // Move to next suggested mode
  const handleNextMode = () => {
    handleModeChange(PRESETS[mode].nextMode);
    setIsRunning(true);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage (0 to 100)
  const progressPercent = Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100));

  // Circular progress math
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 md:p-6 shadow-sm flex flex-col justify-between transition-all duration-200 h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400 rounded-xl">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-1.5">
              Focus Timer
              {isRunning && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {PRESETS[mode].description}
            </p>
          </div>
        </div>

        {/* Audio Controls: Mute/Unmute Toggle & Test Sound */}
        <div className="flex items-center space-x-1.5">
          {/* Mute/Unmute Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={soundEnabled ? 'Click to Mute alert sound' : 'Click to Unmute alert sound'}
            aria-label={soundEnabled ? 'Mute notification sound' : 'Unmute notification sound'}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 flex items-center space-x-1.5 cursor-pointer shadow-2xs ${
              soundEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/50'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                <span>Muted</span>
              </>
            )}
          </button>

          {/* Test Sound Button */}
          <button
            type="button"
            onClick={handleTestSound}
            title="Preview completion notification chime"
            className={`px-2 py-1.5 text-xs font-bold rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition flex items-center space-x-1 cursor-pointer ${
              isPlayingTestSound
                ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-300'
                : 'text-gray-600 dark:text-slate-300'
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${isPlayingTestSound ? 'animate-bounce text-amber-500' : ''}`} />
            <span>Test</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 dark:bg-slate-800/80 rounded-xl mb-5">
        {(Object.keys(PRESETS) as TimerMode[]).map((presetKey) => {
          const preset = PRESETS[presetKey];
          const isActive = mode === presetKey;
          return (
            <button
              key={presetKey}
              onClick={() => handleModeChange(presetKey)}
              className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all duration-150 flex items-center justify-center space-x-1 cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-yellow-400 shadow-xs'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
              }`}
            >
              {presetKey === 'focus' ? (
                <Flame className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500' : ''}`} />
              ) : (
                <Coffee className={`w-3.5 h-3.5 ${isActive ? 'text-blue-500 dark:text-yellow-400' : ''}`} />
              )}
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {mode === 'focus' ? 'Focus block finished! Well done!' : 'Break over! Ready to focus?'}
            </p>
          </div>
          <button
            onClick={handleNextMode}
            className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-0.5 cursor-pointer ml-2 shrink-0"
          >
            <span>{mode === 'focus' ? 'Break' : 'Focus'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Circular Display & Time */}
      <div className="relative flex flex-col items-center justify-center py-2 my-auto">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-100 dark:text-slate-800"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-500 ${
                isCompleted 
                  ? 'text-emerald-500' 
                  : mode === 'focus'
                  ? 'text-yellow-400 dark:text-yellow-400'
                  : 'text-blue-500 dark:text-indigo-400'
              }`}
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black tracking-tight text-gray-900 dark:text-white font-mono">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[11px] font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider mt-0.5">
              {isRunning ? 'In Progress' : isCompleted ? 'Finished 🎉' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Quick adjustment buttons (+1m / -1m) */}
        {!isRunning && (
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={() => adjustTime(-60)}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer text-xs flex items-center gap-1"
              title="Minus 1 minute"
            >
              <Minus className="w-3 h-3" />
              <span className="text-[10px] font-bold">1m</span>
            </button>
            <button
              onClick={() => adjustTime(60)}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer text-xs flex items-center gap-1"
              title="Plus 1 minute"
            >
              <Plus className="w-3 h-3" />
              <span className="text-[10px] font-bold">1m</span>
            </button>
          </div>
        )}
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          onClick={handleReset}
          title="Reset Timer"
          className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleTogglePlay}
          className={`flex-1 py-3 px-6 rounded-xl font-black text-sm flex items-center justify-center space-x-2 shadow-sm transition-all duration-200 cursor-pointer ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : isCompleted
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-black'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{isCompleted ? 'Start Again' : timeLeft === 0 ? 'Restart' : 'Start Focus'}</span>
            </>
          )}
        </button>
      </div>

      {/* Alert Preference Quick Status */}
      <div className="flex items-center justify-center mt-2.5">
        <button
          type="button"
          onClick={handleToggleSound}
          className="group flex items-center space-x-1.5 text-[11px] font-medium text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition cursor-pointer"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Chime alerts enabled at 0:00</span>
              <span className="text-[10px] text-gray-400 group-hover:underline">(Mute)</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-rose-600 dark:text-rose-400 font-semibold">Alerts muted (silent mode)</span>
              <span className="text-[10px] text-gray-400 group-hover:underline">(Unmute)</span>
            </>
          )}
        </button>
      </div>

      {/* Daily Progress & Streak Footnote */}
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-gray-500 dark:text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Sessions Today:</span>
          <span className="font-extrabold text-gray-900 dark:text-white">{todaySessions}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500 dark:text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          <span>{totalFocusMinutes} mins focused</span>
        </div>
      </div>
    </div>
  );
}

export default FocusTimer;
