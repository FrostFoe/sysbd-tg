"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { UserPlus, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signup(email, password, username);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[400px] rounded-2xl bg-white p-10 shadow-xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 bg-[#3390ec]">
          <UserPlus className="w-16 h-16 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Create Account</h1>
        <p className="text-center mb-8 text-gray-500 text-[15px]">
          Join the real-time chat community.
        </p>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="relative group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 outline-none transition-colors focus:border-[#3390ec] bg-transparent text-gray-900"
              required
              disabled={isSubmitting}
            />
            <label
              htmlFor="username"
              className={`absolute left-4 top-3.5 text-gray-500 text-base transition-all duration-200 peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#3390ec] ${username ? 'text-xs top-1' : ''}`}
            >
              Username
            </label>
          </div>

          <div className="relative group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 outline-none transition-colors focus:border-[#3390ec] bg-transparent text-gray-900"
              required
              disabled={isSubmitting}
            />
            <label
              htmlFor="email"
              className={`absolute left-4 top-3.5 text-gray-500 text-base transition-all duration-200 peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#3390ec] ${email ? 'text-xs top-1' : ''}`}
            >
              Email
            </label>
          </div>

          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 pr-10 outline-none transition-colors focus:border-[#3390ec] bg-transparent text-gray-900"
              required
              disabled={isSubmitting}
            />
            <label
              htmlFor="password"
              className={`absolute left-4 top-3.5 text-gray-500 text-base transition-all duration-200 peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#3390ec] ${password ? 'text-xs top-1' : ''}`}
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-400 hover:text-gray-600 transition"
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all active:scale-95 flex justify-center items-center bg-[#3390ec] shadow-lg shadow-blue-200 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-[#3390ec] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}