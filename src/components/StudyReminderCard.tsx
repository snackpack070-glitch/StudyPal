import { useState, useEffect } from "react";
import { 
  Bell, 
  BellRing, 
  BellOff, 
  Clock, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Send,
  ExternalLink
} from "lucide-react";

export interface ReminderSettings {
  enabled: boolean;
  time: string;
  goal: string;
  frequency: 'daily' | 'weekdays';
  lastNotifiedDate?: string;
}

const STORAGE_KEY = "studypal_reminder_settings";

const GOAL_PRESETS = [
  "Solve & scan 2 practice questions",
  "Complete 1 mastery quiz",
  "15-minute concept review",
  "30-minute deep focus study session",
  "Read 1 study library module"
];

export default function StudyReminderCard() {
  const isSupported = typeof window !== "undefined" && "Notification" in window;
  
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    isSupported ? Notification.permission : "unsupported"
  );

  const [settings, setSettings] = useState<ReminderSettings>(() => {
    const defaultSettings: ReminderSettings = {
      enabled: false,
      time: "18:00", // 6:00 PM default
      goal: "Solve & scan 2 practice questions",
      frequency: "daily"
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Error reading reminder settings:", e);
    }
    return defaultSettings;
  });

  const [isCustomGoal, setIsCustomGoal] = useState(false);
  const [customGoalText, setCustomGoalText] = useState("");
  const [testSent, setTestSent] = useState(false);
  const [inAppToast, setInAppToast] = useState<{ title: string; body: string } | null>(null);

  // Sync settings to localStorage
  const updateSettings = (partial: Partial<ReminderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Error saving reminder settings:", err);
      }
      return updated;
    });
  };

  // Check current permission on mount and when tab regains focus
  useEffect(() => {
    if (!isSupported) return;
    setPermission(Notification.permission);

    const handleFocus = () => {
      setPermission(Notification.permission);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isSupported]);

  // Handle Toggle Switch
  const handleToggle = async () => {
    const nextState = !settings.enabled;

    if (nextState) {
      // User is enabling reminders
      if (isSupported && Notification.permission !== "granted") {
        try {
          const res = await Notification.requestPermission();
          setPermission(res);
          if (res === "granted") {
            updateSettings({ enabled: true });
            // Send welcome confirmation
            sendNotification(
              "🔔 StudyPal Reminders Activated!",
              `We'll remind you ${settings.frequency === "weekdays" ? "every weekday" : "daily"} at ${formatTimeDisplay(settings.time)} for: "${settings.goal}".`
            );
          } else {
            // Permission not granted
            updateSettings({ enabled: false });
          }
        } catch (err) {
          console.error("Error requesting permission:", err);
          updateSettings({ enabled: false });
        }
      } else {
        updateSettings({ enabled: true });
      }
    } else {
      // User is disabling
      updateSettings({ enabled: false });
    }
  };

  // Helper to send a notification (both Browser Notification and fallback In-App Toast)
  const sendNotification = (title: string, body: string) => {
    let nativeTriggered = false;

    if (isSupported && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
        });
        nativeTriggered = true;
      } catch (e) {
        console.warn("Could not create browser notification (sandbox restriction):", e);
      }
    }

    // Always show in-app toast preview for instant feedback and iframe compatibility
    setInAppToast({ title, body });
    setTimeout(() => {
      setInAppToast(null);
    }, 6000);

    return nativeTriggered;
  };

  // Send a test reminder
  const handleSendTest = async () => {
    if (isSupported && Notification.permission === "default") {
      try {
        const res = await Notification.requestPermission();
        setPermission(res);
        if (res !== "granted") return;
      } catch (e) {
        console.warn(e);
      }
    }

    sendNotification(
      "📚 StudyPal Goal Reminder (Test)",
      `Reminder: "${settings.goal}". Keep your daily streak going!`
    );

    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  // Daily timer checker
  useEffect(() => {
    if (!settings.enabled) return;

    const checkReminder = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, "0");
      const currentMinutes = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayStr = now.toISOString().split("T")[0];
      const isWeekend = now.getDay() === 0 || now.getDay() === 6;

      if (settings.frequency === "weekdays" && isWeekend) {
        return;
      }

      if (currentTimeStr === settings.time && settings.lastNotifiedDate !== todayStr) {
        sendNotification(
          "📚 Daily Study Goal Reminder",
          `It's ${formatTimeDisplay(settings.time)}! Time to work on your goal: "${settings.goal}".`
        );
        updateSettings({ lastNotifiedDate: todayStr });
      }
    };

    // Run once and poll every 30s
    checkReminder();
    const interval = setInterval(checkReminder, 30000);
    return () => clearInterval(interval);
  }, [settings.enabled, settings.time, settings.goal, settings.frequency, settings.lastNotifiedDate]);

  // Format 24h to 12h readable string
  const formatTimeDisplay = (time24: string) => {
    if (!time24) return "Scheduled time";
    const [h, m] = time24.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return time24;
    const period = h >= 12 ? "PM" : "AM";
    const hours12 = h % 12 === 0 ? 12 : h % 12;
    const mins = String(m).padStart(2, "0");
    return `${hours12}:${mins} ${period}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col space-y-4 relative">
      {/* In-App Toast Simulation (useful in iframes where browser alerts can be throttled) */}
      {inAppToast && (
        <div className="absolute -top-3 left-4 right-4 bg-blue-950 text-white p-3.5 rounded-xl shadow-xl border border-yellow-400/40 z-30 animate-in fade-in slide-in-from-top-2 duration-300 flex items-start space-x-3">
          <div className="p-1.5 bg-yellow-400 text-blue-950 rounded-lg flex-shrink-0 mt-0.5">
            <BellRing className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-yellow-400">{inAppToast.title}</p>
            <p className="text-xs text-blue-100 mt-0.5 leading-snug">{inAppToast.body}</p>
          </div>
          <button 
            onClick={() => setInAppToast(null)}
            className="text-blue-300 hover:text-white text-xs font-semibold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header and Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2.5 rounded-xl ${settings.enabled ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-500"}`}>
            {settings.enabled ? <BellRing className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 leading-tight">Daily Study Reminders</h3>
            <p className="text-xs text-gray-500 mt-0.5">Browser notifications for your study goals</p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={settings.enabled}
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
            settings.enabled ? "bg-emerald-500" : "bg-gray-200"
          }`}
        >
          <span className="sr-only">Toggle daily study reminders</span>
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              settings.enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Body: when enabled vs disabled */}
      {settings.enabled ? (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          {/* Permission Status Indicator */}
          {permission === "denied" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Notifications Blocked:</span> Please enable notifications in your browser address bar settings to receive system alerts.
              </div>
            </div>
          )}

          {permission === "granted" && (
            <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-100">
              <span className="flex items-center font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Reminders Active
              </span>
              <span className="text-emerald-700">Scheduled {formatTimeDisplay(settings.time)}</span>
            </div>
          )}

          {/* Time Picker & Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Reminder Time
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="time"
                  value={settings.time}
                  onChange={(e) => updateSettings({ time: e.target.value })}
                  className="w-full pl-8 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Frequency
              </label>
              <select
                value={settings.frequency}
                onChange={(e) => updateSettings({ frequency: e.target.value as 'daily' | 'weekdays' })}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Every Day</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
              </select>
            </div>
          </div>

          {/* Study Goal Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center">
                <Target className="w-3 h-3 mr-1 text-yellow-600" />
                Daily Target Goal
              </label>
              <button
                type="button"
                onClick={() => setIsCustomGoal(!isCustomGoal)}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                {isCustomGoal ? "Use Preset" : "Custom Goal"}
              </button>
            </div>

            {isCustomGoal ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. 20 mins physics revision"
                  value={customGoalText}
                  onChange={(e) => setCustomGoalText(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGoalText.trim()) {
                      updateSettings({ goal: customGoalText.trim() });
                      setIsCustomGoal(false);
                    }
                  }}
                  disabled={!customGoalText.trim()}
                  className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <select
                value={settings.goal}
                onChange={(e) => updateSettings({ goal: e.target.value })}
                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {GOAL_PRESETS.map((preset, idx) => (
                  <option key={idx} value={preset}>
                    {preset}
                  </option>
                ))}
                {!GOAL_PRESETS.includes(settings.goal) && (
                  <option value={settings.goal}>{settings.goal}</option>
                )}
              </select>
            )}
          </div>

          {/* Test Action Button */}
          <div className="pt-1 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              Triggered locally at {formatTimeDisplay(settings.time)}
            </span>
            <button
              type="button"
              onClick={handleSendTest}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-900 hover:text-blue-950 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3 h-3 text-yellow-600" />
              <span>{testSent ? "Notification Sent!" : "Send Test Reminder"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-2">
          <p className="leading-relaxed">
            Turn on daily reminders to build a consistent study habit, protect your learning streak, and get prompt nudges on your target goals.
          </p>
          <div className="flex items-center space-x-2 text-[11px] text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>Runs locally directly in your browser</span>
          </div>
        </div>
      )}
    </div>
  );
}
