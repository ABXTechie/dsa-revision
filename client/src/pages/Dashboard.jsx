import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import AddQuestionModal from "../components/AddQuestionModal";
import RevisionModal from "../components/RevisionModal";

const RevisionCard = ({
  revision,
  overdue = false,
  onReview,
}) => {
  const question = revision.questionId;

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        border bg-zinc-900/70 p-5
        backdrop-blur-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:bg-zinc-900
        ${
          overdue
            ? "border-red-500/15 hover:border-red-500/30"
            : "border-zinc-800/80 hover:border-zinc-700"
        }
      `}
    >
      {/* subtle accent line */}
      <div
        className={`absolute left-0 top-0 h-full w-[2px] ${
          overdue ? "bg-red-500/60" : "bg-zinc-700/60"
        }`}
      />

      <div className="flex items-start justify-between gap-4 pl-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-zinc-100">
              {question?.title || "Question unavailable"}
            </h3>

            {overdue && (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
            )}
          </div>

          {question && (
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-md border border-zinc-800 bg-zinc-950/70 px-2 py-1 text-[10px] font-medium text-zinc-500">
                {question.topic}
              </span>

              <span
                className={`rounded-md border px-2 py-1 text-[10px] font-medium ${
                  question.difficulty === "Easy"
                    ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-500"
                    : question.difficulty === "Medium"
                    ? "border-yellow-500/10 bg-yellow-500/5 text-yellow-500"
                    : "border-red-500/10 bg-red-500/5 text-red-500"
                }`}
              >
                {question.difficulty}
              </span>
            </div>
          )}
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
            overdue
              ? "bg-red-500/10 text-red-400"
              : "bg-zinc-800 text-zinc-500"
          }`}
        >
          #{revision.revisionNumber}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between pl-1">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-zinc-600">
            Originally solved
          </p>

          <p className="mt-1 text-xs font-medium text-zinc-400">
            {revision.solvedDate}
          </p>
        </div>

        <button
          onClick={() => onReview(revision)}
          className="
            rounded-lg border border-zinc-700
            bg-zinc-800/60 px-3.5 py-2
            text-xs font-semibold text-zinc-300
            transition-all
            hover:border-zinc-600
            hover:bg-zinc-700/70
            hover:text-white
          "
        >
          Review
        </button>
      </div>
    </div>
  );
};

const SectionHeader = ({
  title,
  count,
  danger = false,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              danger ? "bg-red-500" : "bg-zinc-500"
            }`}
          />

          <h2
            className={`text-[11px] font-bold uppercase tracking-[0.2em] ${
              danger ? "text-red-400" : "text-zinc-400"
            }`}
          >
            {title}
          </h2>
        </div>

        {count > 0 && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              danger
                ? "bg-red-500/10 text-red-400"
                : "bg-zinc-800 text-zinc-500"
            }`}
          >
            {count}
          </span>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({
  children,
  success = false,
}) => {
  return (
    <div
      className={`
        rounded-2xl border border-dashed
        px-6 py-10 text-center
        ${
          success
            ? "border-emerald-500/10 bg-emerald-500/[0.015]"
            : "border-zinc-800 bg-zinc-900/20"
        }
      `}
    >
      <div
        className={`
          mx-auto mb-3 flex h-9 w-9 items-center
          justify-center rounded-full border
          ${
            success
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
              : "border-zinc-800 bg-zinc-900 text-zinc-600"
          }
        `}
      >
        {success ? "✓" : "—"}
      </div>

      <p className="text-sm font-medium text-zinc-500">
        {children}
      </p>
    </div>
  );
};

const Dashboard = () => {
  const { logout } = useAuth();

  const [overdue, setOverdue] = useState([]);
  const [dueToday, setDueToday] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [selectedRevision, setSelectedRevision] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const fetchRevisions = async () => {
    try {
      setError("");

      const response = await api.get(
        "/revisions/today"
      );

      setOverdue(response.data.overdue || []);
      setDueToday(
        response.data.dueToday || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load revisions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  const handleRemember = async () => {
    if (!selectedRevision) return;

    setActionLoading(true);

    try {
      await api.post(
        `/revisions/${selectedRevision._id}/complete`
      );

      setSelectedRevision(null);
      await fetchRevisions();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to complete revision"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!selectedRevision) return;

    setActionLoading(true);

    try {
      await api.post(
        `/revisions/${selectedRevision._id}/forgot`
      );

      setSelectedRevision(null);
      await fetchRevisions();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to reschedule revision"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-280px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-zinc-800/10 blur-[120px]" />

        <div className="absolute bottom-[-300px] left-[-200px] h-[450px] w-[450px] rounded-full bg-red-950/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-900/80 bg-[#050505]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <span className="text-xs font-black text-zinc-300">
                /
              </span>
            </div>

            <div>
              <h1 className="text-[13px] font-bold tracking-[0.16em] text-zinc-100">
                DSA REVISION
              </h1>

              <p className="hidden text-[10px] tracking-wide text-zinc-600 sm:block">
                KEEP THE SOLVED ONES ALIVE
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="
              rounded-lg px-3 py-2
              text-xs font-medium text-zinc-600
              transition hover:bg-zinc-900
              hover:text-zinc-300
            "
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative mx-auto max-w-5xl px-5 pb-32 pt-10 sm:px-8 sm:pt-14">
        {/* Hero */}
        <section className="mb-12">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Today's queue
          </p>

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-zinc-100 sm:text-4xl">
                Time to revise.
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">
                Review what you've solved before
                it fades.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
                  Queue
                </p>

                <p className="mt-1 text-lg font-semibold text-zinc-200">
                  {overdue.length +
                    dueToday.length}
                </p>
              </div>

              <div className="rounded-xl border border-red-500/10 bg-red-500/[0.025] px-4 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-red-500/60">
                  Overdue
                </p>

                <p className="mt-1 text-lg font-semibold text-red-400">
                  {overdue.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center">
            <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-300" />

            <p className="mt-4 text-xs text-zinc-600">
              Loading your queue...
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Overdue */}
            <section>
              <SectionHeader
                title="Overdue"
                count={overdue.length}
                danger={overdue.length > 0}
              />

              {overdue.length === 0 ? (
                <EmptyState success>
                  Nothing overdue. You're caught up.
                </EmptyState>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {overdue.map((revision) => (
                    <RevisionCard
                      key={revision._id}
                      revision={revision}
                      overdue
                      onReview={
                        setSelectedRevision
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Due today */}
            <section>
              <SectionHeader
                title="Due Today"
                count={dueToday.length}
              />

              {dueToday.length === 0 ? (
                <EmptyState success>
                  Nothing due today. You're done.
                </EmptyState>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {dueToday.map((revision) => (
                    <RevisionCard
                      key={revision._id}
                      revision={revision}
                      onReview={
                        setSelectedRevision
                      }
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-900/80 bg-[#050505]/85 px-5 py-3 backdrop-blur-2xl sm:px-8">
        <div className="mx-auto flex max-w-5xl justify-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="
              group flex w-full max-w-md
              items-center justify-center gap-2
              rounded-xl bg-zinc-100
              px-5 py-3.5
              text-sm font-semibold
              text-zinc-950
              shadow-[0_0_30px_rgba(255,255,255,0.04)]
              transition-all
              hover:bg-white
              hover:shadow-[0_0_35px_rgba(255,255,255,0.08)]
              active:scale-[0.99]
            "
          >
            <span className="text-lg leading-none transition-transform group-hover:rotate-90">
              +
            </span>

            Add Solved Question
          </button>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddQuestionModal
          onClose={() =>
            setShowAddModal(false)
          }
          onAdded={fetchRevisions}
        />
      )}

      {selectedRevision && (
        <RevisionModal
          revision={selectedRevision}
          onClose={() =>
            setSelectedRevision(null)
          }
          onRemember={handleRemember}
          onForgot={handleForgot}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default Dashboard;