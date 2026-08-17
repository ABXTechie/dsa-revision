import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/70 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <h1 className="text-xl font-bold tracking-[0.12em] text-zinc-100 mb-2">
          DSA REVISION
        </h1>
        <p className="text-sm text-zinc-600 mb-8">
          Keep your DSA revisions on track.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2.5 text-zinc-100 outline-none focus:border-zinc-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2.5 text-zinc-100 outline-none focus:border-zinc-600"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-100 text-zinc-950 rounded-md py-2.5 font-medium hover:bg-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-zinc-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-zinc-300 hover:text-white"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;