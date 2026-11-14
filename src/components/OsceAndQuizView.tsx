import React, { useMemo, useState } from 'react';
import { Award, CheckCircle2, ClipboardCheck, HelpCircle, RotateCcw, ShieldAlert, XCircle } from 'lucide-react';
import { GLASGOW_OSCE_CHECKLIST, QUIZ_QUESTIONS } from '../data/protocolsData';
import { gradeQuizAttempt } from '../utils/clinicalEngine';

interface OsceAndQuizViewProps {
  completedOsceIds: number[];
  onToggleOsceItem: (id: number) => void;
  onResetOsce: () => void;
  quizScores: Record<string, { correct: boolean; answeredAt: string }>;
  onRecordQuizAnswer: (questionId: string, correct: boolean) => void;
}

export const OsceAndQuizView: React.FC<OsceAndQuizViewProps> = ({
  completedOsceIds,
  onToggleOsceItem,
  onResetOsce,
  quizScores,
  onRecordQuizAnswer
}) => {
  const [mode, setMode] = useState<'quiz' | 'osce'>('quiz');
  const [topicFilter, setTopicFilter] = useState<string>('ALL');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  const topics = useMemo(
    () => ['ALL', ...Array.from(new Set(QUIZ_QUESTIONS.map((q) => q.topic)))],
    []
  );

  const filteredQuestions = useMemo(
    () => (topicFilter === 'ALL' ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter((q) => q.topic === topicFilter)),
    [topicFilter]
  );

  const phases = useMemo(
    () => Array.from(new Set(GLASGOW_OSCE_CHECKLIST.map((c) => c.phase))),
    []
  );

  const handleSelectOption = (questionId: string, optionIdx: number, correctIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    onRecordQuizAnswer(questionId, optionIdx === correctIndex);
  };

  const quizSummary = useMemo(
    () => gradeQuizAttempt(selectedAnswers, filteredQuestions),
    [selectedAnswers, filteredQuestions]
  );

  const savedQuizCorrect = Object.values(quizScores).filter((q) => q.correct).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            data-testid="osce-subtab-quiz"
            onClick={() => setMode('quiz')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-2 ${
              mode === 'quiz'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Interactive Clinical Quizzes ({QUIZ_QUESTIONS.length})
          </button>
          <button
            type="button"
            data-testid="osce-subtab-checklist"
            onClick={() => setMode('osce')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-2 ${
              mode === 'osce'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            Glasgow 36-Point OSCE Exam ({completedOsceIds.length}/36)
          </button>
        </div>

        <div className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
          Saved Quiz Mastery: {savedQuizCorrect}/{QUIZ_QUESTIONS.length} · OSCE: {Math.round((completedOsceIds.length / 36) * 100)}%
        </div>
      </div>

      {mode === 'quiz' ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopicFilter(t)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer border ${
                    topicFilter === t
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {t === 'ALL' ? 'All Topics' : t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="submit-quiz-btn"
                onClick={() => setSubmittedQuiz(true)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
              >
                Grade Attempt
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedAnswers({});
                  setSubmittedQuiz(false);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {submittedQuiz && (
            <div
              data-testid="quiz-score-banner"
              className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-sky-600" />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Exam Score: {quizSummary.correct} / {quizSummary.total} ({quizSummary.percentage}%)
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Review rationales and source PDF citations below.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const picked = selectedAnswers[q.id];
              const hasPicked = picked !== undefined;
              return (
                <div
                  key={q.id}
                  data-testid={`quiz-card-${q.id}`}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-mono">
                    <span>
                      Q{idx + 1} · {q.topic}
                    </span>
                    <span>{q.pdfCitation}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{q.question}</h4>

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = picked === oIdx;
                      const isCorrect = oIdx === q.correctIndex;
                      let btnStyle =
                        'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 hover:border-sky-400';

                      if (hasPicked || submittedQuiz) {
                        if (isCorrect) {
                          btnStyle =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium';
                        } else if (isChosen && !isCorrect) {
                          btnStyle =
                            'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          data-testid={`quiz-${q.id}-opt-${oIdx}`}
                          onClick={() => handleSelectOption(q.id, oIdx, q.correctIndex)}
                          className={`text-left p-3 rounded-lg border text-xs cursor-pointer flex items-center justify-between gap-3 transition-colors ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {(hasPicked || submittedQuiz) && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {(hasPicked || submittedQuiz) && isChosen && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {(hasPicked || submittedQuiz) && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-sky-700 dark:text-sky-400">Clinical Rationale: </span>
                      {q.rationale}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                University of Glasgow 36-Point Suturing OSCE Examination Checklist (Appendix A)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Items marked ▲ CRITICAL SAFETY represent mandatory patient & sharps safety passes.
              </p>
            </div>
            <button
              type="button"
              onClick={onResetOsce}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Checklist
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {phases.map((phase) => {
              const items = GLASGOW_OSCE_CHECKLIST.filter((c) => c.phase === phase);
              const doneCount = items.filter((c) => completedOsceIds.includes(c.id)).length;
              return (
                <div
                  key={phase}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{phase}</h4>
                    <span className="font-mono text-xs text-sky-600 font-semibold">
                      {doneCount}/{items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const checked = completedOsceIds.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            checked
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-slate-700 dark:text-slate-300'
                              : 'bg-slate-50/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => onToggleOsceItem(item.id)}
                            className="mt-0.5 rounded accent-emerald-600 w-4 h-4 shrink-0"
                          />
                          <div className="flex-1">
                            <span className="font-mono text-[11px] text-slate-400 mr-1.5">
                              #{String(item.id).padStart(2, '0')}
                            </span>
                            {item.isCriticalSafetyStep && (
                              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 mr-1.5">
                                <ShieldAlert className="w-3 h-3" />
                                CRITICAL:
                              </span>
                            )}
                            <span>{item.step}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
