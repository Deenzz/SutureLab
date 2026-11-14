import React, { useEffect, useState } from 'react';
import {
  Activity,
  Bell,
  Bookmark,
  Moon,
  Search,
  Sun,
  X
} from 'lucide-react';
import { AtlasAndCasesView } from './components/AtlasAndCasesView';
import { DifferentialTriageView } from './components/DifferentialTriageView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { OsceAndQuizView } from './components/OsceAndQuizView';
import { ProtocolsAndToiletView } from './components/ProtocolsAndToiletView';
import { StudyHubView } from './components/StudyHubView';
import { CLINICAL_CASES } from './data/clinicalCases';
import {
  BookmarkItem,
  SearchResultItem,
  StudyProgress,
  StudyReminder,
  Wound3DMode
} from './types/clinical';

type AppTab = 'atlas' | 'protocols' | 'triage' | 'osce' | 'hub';

const STORAGE_KEYS = {
  theme: 'suturelab_theme_v1',
  bookmarks: 'suturelab_bookmarks_v1',
  progress: 'suturelab_progress_v1',
  reminders: 'suturelab_reminders_v1'
};

const DEFAULT_PROGRESS: StudyProgress = {
  inspectedAnatomyIds: ['epidermis', 'tendon'],
  reviewedCaseIds: ['deep_wrist_glass_tendon_nerve'],
  completedOsceIds: [],
  quizScores: {}
};

const DEFAULT_REMINDERS: StudyReminder[] = [
  {
    id: 'rem-default-1',
    title: 'Evening Deep-Structure Triage & OSCE Drill',
    topic: 'Tendon/Nerve exposure rules + 36-point checklist',
    timeHHMM: '20:00',
    days: ['Mon', 'Wed', 'Fri'],
    enabled: true
  }
];

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('atlas');
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.theme) === 'dark';
    } catch {
      return false;
    }
  });

  const [selectedCaseId, setSelectedCaseId] = useState<string>('deep_wrist_glass_tendon_nerve');
  const [selectedAnatomyId, setSelectedAnatomyId] = useState<string>('tendon');
  const [woundMode, setWoundMode] = useState<Wound3DMode>('deep_tendon_nerve_vessel');
  const [protocolSubTab, setProtocolSubTab] = useState<'toilet' | 'sutures' | 'stitches' | 'anesthesia'>('toilet');
  const [protocolStitchId, setProtocolStitchId] = useState<string>('simple_interrupted');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() =>
    loadJson<BookmarkItem[]>(STORAGE_KEYS.bookmarks, [])
  );
  const [progress, setProgress] = useState<StudyProgress>(() =>
    loadJson<StudyProgress>(STORAGE_KEYS.progress, DEFAULT_PROGRESS)
  );
  const [reminders, setReminders] = useState<StudyReminder[]>(() =>
    loadJson<StudyReminder[]>(STORAGE_KEYS.reminders, DEFAULT_REMINDERS)
  );
  const [activeReminderBanner, setActiveReminderBanner] = useState<StudyReminder | null>(null);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [isDark]);

  // Persist bookmarks, progress, reminders
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders));
    } catch {
      // ignore
    }
  }, [reminders]);

  // Keyboard shortcut Cmd/Ctrl+K for instant search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Study reminder checker (every 30s)
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const todayDay = dayNames[now.getDay()];
      const todayDate = now.toISOString().slice(0, 10);
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const match = reminders.find(
        (r) => r.enabled && r.days.includes(todayDay) && r.timeHHMM === hhmm && r.lastTriggeredDate !== todayDate
      );
      if (match) {
        setActiveReminderBanner(match);
        setReminders((prev) =>
          prev.map((r) => (r.id === match.id ? { ...r, lastTriggeredDate: todayDate } : r))
        );
      }
    };
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [reminders]);

  const handleToggleBookmark = (item: Omit<BookmarkItem, 'savedAt'>) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      if (exists) return prev.filter((b) => b.id !== item.id);
      return [{ ...item, savedAt: new Date().toISOString() }, ...prev];
    });
  };

  const handleMarkAnatomyInspected = (id: string) => {
    setProgress((prev) =>
      prev.inspectedAnatomyIds.includes(id)
        ? prev
        : { ...prev, inspectedAnatomyIds: [...prev.inspectedAnatomyIds, id] }
    );
  };

  const handleMarkCaseReviewed = (id: string) => {
    setProgress((prev) =>
      prev.reviewedCaseIds.includes(id)
        ? prev
        : { ...prev, reviewedCaseIds: [...prev.reviewedCaseIds, id] }
    );
  };

  const handleToggleOsceItem = (id: number) => {
    setProgress((prev) => ({
      ...prev,
      completedOsceIds: prev.completedOsceIds.includes(id)
        ? prev.completedOsceIds.filter((x) => x !== id)
        : [...prev.completedOsceIds, id]
    }));
  };

  const handleRecordQuizAnswer = (questionId: string, correct: boolean) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [questionId]: { correct, answeredAt: new Date().toISOString() }
      }
    }));
  };

  const handleNavigateTarget = (targetTab: AppTab, targetId: string) => {
    if (targetTab === 'atlas') {
      if (targetId.startsWith('case:')) {
        const cid = targetId.replace('case:', '');
        const found = CLINICAL_CASES.find((c) => c.id === cid);
        if (found) {
          setSelectedCaseId(found.id);
          setWoundMode(found.wound3DMode);
          handleMarkCaseReviewed(found.id);
        }
      } else {
        setSelectedAnatomyId(targetId);
        handleMarkAnatomyInspected(targetId);
      }
      setActiveTab('atlas');
    } else if (targetTab === 'protocols') {
      if (targetId === 'sutures') {
        setProtocolSubTab('sutures');
      } else if (targetId.startsWith('stitch:')) {
        setProtocolSubTab('stitches');
        setProtocolStitchId(targetId.replace('stitch:', ''));
      }
      setActiveTab('protocols');
    } else {
      setActiveTab(targetTab);
    }
  };

  const handleSearchSelect = (item: SearchResultItem) => {
    handleNavigateTarget(item.targetTab, item.targetId);
  };

  const navItems: Array<{ id: AppTab; label: string }> = [
    { id: 'atlas', label: '3D Atlas & Cases' },
    { id: 'protocols', label: 'Toilet & Suturing' },
    { id: 'triage', label: 'Differential Triage' },
    { id: 'osce', label: 'OSCE & Quizzes' },
    { id: 'hub', label: 'Study Hub' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Strict 3-Zone Top Bar: Wordmark — 5 Nav Links — 1 Primary CTA */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('atlas')}
            className="flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </span>
            <span className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white">
              SutureLab 3D
            </span>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary sections">
            {navItems.map((nav) => (
              <button
                key={nav.id}
                type="button"
                data-testid={`nav-${nav.id}`}
                onClick={() => setActiveTab(nav.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  activeTab === nav.id
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Search CTA */}
          <button
            type="button"
            data-testid="open-search-btn"
            onClick={() => setSearchOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-sky-600 text-white text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-95 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Topics</span>
            <span className="hidden sm:inline font-mono text-[10px] opacity-75">⌘K</span>
          </button>
        </div>

        {/* Mobile Nav Row (< md) */}
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
          {navItems.map((nav) => (
            <button
              key={nav.id}
              type="button"
              data-testid={`mobile-nav-${nav.id}`}
              onClick={() => setActiveTab(nav.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === nav.id
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>
      </header>

      {/* Secondary Utility Ribbon (Theme, Bookmarks shortcut, Reminder status) */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="hidden sm:block text-slate-600 dark:text-slate-400">
            Emergency & General Practice Wound Toilet · Suturing · Deep Structure Exposure Triage
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('hub')}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 cursor-pointer hover:border-sky-400"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Bookmarks ({bookmarks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hub')}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 cursor-pointer hover:border-sky-400"
            >
              <Bell className="w-3.5 h-3.5 text-sky-600" />
              <span>Reminders ({reminders.filter((r) => r.enabled).length})</span>
            </button>

            <button
              type="button"
              data-testid="theme-toggle-btn"
              onClick={() => setIsDark((d) => !d)}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 cursor-pointer hover:border-sky-400"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Reminder Notification Banner */}
      {activeReminderBanner && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-4">
          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-700 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-sky-900 dark:text-sky-100">
              <Bell className="w-4 h-4 text-sky-600" />
              <span>
                <strong>Study Reminder:</strong> {activeReminderBanner.title} — {activeReminderBanner.topic}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveReminderBanner(null)}
              className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'atlas' && (
          <AtlasAndCasesView
            selectedAnatomyId={selectedAnatomyId}
            onSelectAnatomy={setSelectedAnatomyId}
            selectedCaseId={selectedCaseId}
            onSelectCase={setSelectedCaseId}
            woundMode={woundMode}
            onChangeWoundMode={setWoundMode}
            isDark={isDark}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onMarkAnatomyInspected={handleMarkAnatomyInspected}
            onMarkCaseReviewed={handleMarkCaseReviewed}
            reviewedCaseIds={progress.reviewedCaseIds}
          />
        )}

        {activeTab === 'protocols' && (
          <ProtocolsAndToiletView
            key={`${protocolSubTab}-${protocolStitchId}`}
            initialSubTab={protocolSubTab}
            initialStitchId={protocolStitchId}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'triage' && <DifferentialTriageView />}

        {activeTab === 'osce' && (
          <OsceAndQuizView
            completedOsceIds={progress.completedOsceIds}
            onToggleOsceItem={handleToggleOsceItem}
            onResetOsce={() => setProgress((p) => ({ ...p, completedOsceIds: [] }))}
            quizScores={progress.quizScores}
            onRecordQuizAnswer={handleRecordQuizAnswer}
          />
        )}

        {activeTab === 'hub' && (
          <StudyHubView
            progress={progress}
            bookmarks={bookmarks}
            onRemoveBookmark={(id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))}
            onNavigateBookmark={(b) => handleNavigateTarget(b.targetTab, b.targetId)}
            reminders={reminders}
            onAddReminder={(r) =>
              setReminders((prev) => [{ ...r, id: `rem-${Date.now()}` }, ...prev])
            }
            onToggleReminder={(id) =>
              setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))
            }
            onDeleteReminder={(id) => setReminders((prev) => prev.filter((r) => r.id !== id))}
          />
        )}
      </main>

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectResult={handleSearchSelect}
      />
    </div>
  );
}
