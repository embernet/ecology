'use client';

interface CurriculumFilterProps {
  /** Curriculum subjects to filter by (omit or empty to hide the subject row). */
  subjects?: string[];
  subject: string | null;
  onSubject: (s: string | null) => void;
  /** Year groups (Y1…Y6) to filter by. */
  yearGroups: string[];
  year: string | null;
  onYear: (y: string | null) => void;
  /** How many items currently match — shown alongside the filter. */
  count: number;
  total: number;
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors border ${
        active
          ? 'bg-green-700 text-white border-green-700'
          : 'bg-white text-green-800 border-green-200 hover:bg-green-50'
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export function CurriculumFilter({
  subjects,
  subject,
  onSubject,
  yearGroups,
  year,
  onYear,
  count,
  total,
}: CurriculumFilterProps) {
  const hasSubjects = subjects && subjects.length > 0;
  const active = subject !== null || year !== null;

  return (
    <div className="curriculum-filter rounded-xl border border-green-100 bg-green-50/60 p-4 mb-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-green-800">
          Find by curriculum
        </h2>
        <span className="text-sm text-slate-500">
          {active ? `Showing ${count} of ${total}` : `${total} examples`}
          {active && (
            <button
              type="button"
              onClick={() => {
                onSubject(null);
                onYear(null);
              }}
              className="ml-3 font-semibold text-green-700 hover:underline"
            >
              Clear
            </button>
          )}
        </span>
      </div>

      {hasSubjects && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-slate-500 mb-1.5">Subject</div>
          <div className="flex flex-wrap gap-2">
            <Pill active={subject === null} onClick={() => onSubject(null)}>
              All subjects
            </Pill>
            {subjects!.map((s) => (
              <Pill key={s} active={subject === s} onClick={() => onSubject(s)}>
                {s}
              </Pill>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-xs font-semibold text-slate-500 mb-1.5">Year group</div>
        <div className="flex flex-wrap gap-2">
          <Pill active={year === null} onClick={() => onYear(null)}>
            All years
          </Pill>
          {yearGroups.map((y) => (
            <Pill key={y} active={year === y} onClick={() => onYear(y)}>
              {y}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
}
