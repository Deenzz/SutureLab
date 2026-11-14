import React, { useState } from 'react';
import {
  Bell,
  Bookmark,
  BookOpen,
  ExternalLink,
  Plus,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { ANATOMICAL_STRUCTURES, PDF_SOURCES } from '../data/anatomyData';
import { CLINICAL_CASES } from '../data/clinicalCases';
import { QUIZ_QUESTIONS } from '../data/protocolsData';
import { BookmarkItem, StudyProgress, StudyReminder } from '../types/clinical';
import { computeStudyMastery } from '../utils/clinicalEngine';

interface StudyHubViewProps {
  progress: StudyProgress;
  bookmarks: BookmarkItem[];
  onRemoveBookmark: (id: string) => void;
  onNavigateBookmark: (b: BookmarkItem) => void;
  reminders: StudyReminder[];
  onAddReminder: (r: Omit<StudyReminder, 'id'>) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const StudyHubView: React.FC<StudyHubViewProps> = ({
  progress,
  bookmarks,
  onRemoveBookmark,
  onNavigateBookmark,
  reminders,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder
}) => {
  const [title, setTitle] = useState('OSCE Suturing & Deep Exposure Review');
  const [topic, setTopic] = useState('Tendon / Nerve Triage & Simple Interrupted');
  const [timeHHMM, setTimeHHMM] = useState('20:00');
  const [days, setDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);

  const mastery = computeStudyMastery(
    progress,
    ANATOMICAL_STRUCTURES.length,
    CLINICAL_CASES.length,
    36,
    QUIZ_QUESTIONS.length
  );

  const toggleDay = (d: string) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddReminder({
      title: title.trim(),
      topic: topic.trim() || 'Wound Toilet & Sutures',
      timeHHMM,
      days: days.length > 0 ? days : ['Mon', 'Thu'],
      enabled: true
    });
    setTitle('');
    setTopic('');
  };

  return (
    <div className="space-y-6">
      {/* Progress Tracking Overview */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-600" />
            Clinical Study Progress & Mastery
          </h2>
          <span data-testid="study-overall-mastery" className="font-mono text-lg font-bold text-sky-600">
            {mastery.overallPercent}% Overall
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: '3D Anatomical Layers Inspected',
              value: `${progress.inspectedAnatomyIds.length}/${ANATOMICAL_STRUCTURES.length}`,
              pct: mastery.anatomyPercent
            },
            {
              label: 'ER / GP Clinical Cases Reviewed',
              value: `${progress.reviewedCaseIds.length}/${CLINICAL_CASES.length}`,
              pct: mastery.casesPercent
            },
            {
              label: 'Glasgow OSCE Steps Mastered',
              value: `${progress.completedOsceIds.length}/36`,
              pct: mastery.oscePercent
            },
            {
              label: 'Clinical Quiz Questions Correct',
              value: `${mastery.quizCorrectCount}/${QUIZ_QUESTIONS.length}`,
              pct: Math.round((mastery.quizCorrectCount / QUIZ_QUESTIONS.length) * 100)
            }
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
              <div className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-sky-600 rounded-full transition-all" style={{ width: `${stat.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Bookmarks */}
        <section className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500" />
              Saved Study Bookmarks ({bookmarks.length})
            </h3>
          </div>

          {bookmarks.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No bookmarks saved yet. Click the bookmark icon on any anatomical structure, clinical case, or suture protocol to save it here.
            </p>
          ) : (
            <div className="space-y-2">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  data-testid={`bookmark-item-${b.id}`}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between gap-3"
                >
                  <button
                    type="button"
                    onClick={() => onNavigateBookmark(b)}
                    className="text-left flex-1 cursor-pointer"
                  >
                    <div className="text-[11px] font-mono uppercase text-sky-600 dark:text-sky-400">{b.type}</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{b.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{b.subtitle}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveBookmark(b.id)}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                    aria-label="Delete bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Customizable Study Reminders */}
        <section className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-sky-600" />
            Customizable Study Reminders
          </h3>

          <form onSubmit={handleCreateReminder} className="space-y-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                placeholder="Reminder title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="reminder-title-input"
                className="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
              <input
                type="time"
                value={timeHHMM}
                onChange={(e) => setTimeHHMM(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
              />
            </div>
            <input
              type="text"
              placeholder="Focus clinical topic (e.g., Lidocaine limits, Bite triage)..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1">
                {WEEKDAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer border ${
                      days.includes(d)
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                data-testid="add-reminder-btn"
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Reminder
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                data-testid={`reminder-item-${rem.id}`}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{rem.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {rem.timeHHMM} · {rem.days.join(', ')} · {rem.topic}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleReminder(rem.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer border ${
                      rem.enabled
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                    }`}
                  >
                    {rem.enabled ? 'Active' : 'Paused'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteReminder(rem.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    aria-label="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Integrated Source PDF Clinical Library */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Integrated Clinical Reference Manuals (7 Source PDFs)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PDF_SOURCES.map((pdf) => (
            <a
              key={pdf.id}
              href={pdf.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 hover:border-sky-400 transition-colors flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-sky-700 dark:text-sky-400">
                  <span>{pdf.shortLabel}</span>
                  <span>{pdf.pages}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">{pdf.title}</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{pdf.summary}</p>
              </div>
              <span className="text-[11px] font-semibold text-sky-600 flex items-center gap-1">
                Open Source PDF <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
