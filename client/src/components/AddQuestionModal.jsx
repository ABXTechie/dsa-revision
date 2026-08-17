import { useState } from "react";
import api from "../services/api";

const topics = [
  "Array",
  "String",
  "Linked List",
  "Stack",
  "Queue",
  "Binary Tree",
  "BST",
  "Heap",
  "Graph",
  "Greedy",
  "Backtracking",
  "Dynamic Programming",
  "Binary Search",
  "Sliding Window",
  "Two Pointers",
  "Trie",
  "Bit Manipulation",
  "Other",
];

const AddQuestionModal = ({
  onClose,
  onAdded,
}) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [topic, setTopic] = useState("Array");
  const [difficulty, setDifficulty] =
    useState("Easy");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/questions/solve", {
        title,
        link,
        topic,
        difficulty,
      });

      onAdded();
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add question"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-zinc-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">
              Add Solved Question
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              Your first revision will be tomorrow.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Question Name
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Two Sum"
              className={inputClass}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Question Link
            </label>

            <input
              type="url"
              value={link}
              onChange={(e) =>
                setLink(e.target.value)
              }
              placeholder="https://leetcode.com/..."
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-400">
                Topic
              </label>

              <select
                value={topic}
                onChange={(e) =>
                  setTopic(e.target.value)
                }
                className={inputClass}
              >
                {topics.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-400">
                Difficulty
              </label>

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value)
                }
                className={inputClass}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-100 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;