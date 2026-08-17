const RevisionModal = ({
  revision,
  onClose,
  onRemember,
  onForgot,
  loading,
}) => {
  if (!revision) return null;

  const question = revision.questionId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
        <div className="border-b border-zinc-800 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-zinc-100">
                {question?.title ||
                  "Question unavailable"}
              </h2>

              {question && (
                <div className="mt-2 flex gap-2">
                  <span className="rounded-md bg-zinc-800 px-2 py-1 text-[11px] text-zinc-400">
                    {question.topic}
                  </span>

                  <span className="rounded-md bg-zinc-800 px-2 py-1 text-[11px] text-zinc-400">
                    {question.difficulty}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                  Revision
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-200">
                  #{revision.revisionNumber}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                  Originally solved
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-300">
                  {revision.solvedDate}
                </p>
              </div>
            </div>
          </div>

          <a
            href={question?.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/40 py-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
          >
            Open Question ↗
          </a>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={onForgot}
              disabled={loading}
              className="rounded-lg border border-zinc-700 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
            >
              I Forgot
            </button>

            <button
              onClick={onRemember}
              disabled={loading}
              className="rounded-lg bg-zinc-100 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:opacity-50"
            >
              I Remember
            </button>
          </div>

          <p className="mt-4 text-center text-[11px] text-zinc-700">
            Remember advances the revision · Forgot
            moves it to tomorrow
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevisionModal;