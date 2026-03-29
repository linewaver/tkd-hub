"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF5]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-[var(--font-heading)] text-4xl font-black uppercase italic tracking-tighter">
            TKD-Hub
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-black/50">
            Sign in to manage your studio
          </p>
        </div>

        <div className="border-2 border-black bg-white p-8 neo-shadow">
          <h2 className="font-[var(--font-heading)] text-2xl font-black uppercase">
            Welcome Back
          </h2>
          <p className="mt-1 text-xs text-black/50">
            Enter your credentials to access the dojang dashboard
          </p>

          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/60">
                Email Address
              </label>
              <input
                type="email"
                className="mt-1 block w-full border-2 border-black bg-white px-4 py-3 text-sm font-medium placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#0047A0]"
                placeholder="master@tkdhub.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/60">
                  Password
                </label>
                <a href="#" className="text-[10px] font-bold uppercase text-[#0047A0] hover:underline">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                className="mt-1 block w-full border-2 border-black bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0047A0]"
              />
            </div>

            <button
              type="submit"
              className="w-full border-2 border-black bg-[#CD2E3A] py-3 text-sm font-black uppercase tracking-wider text-white neo-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-bold text-black/50">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-black text-[#CD2E3A] uppercase hover:underline"
          >
            Register your studio
          </Link>
        </p>
      </div>
    </div>
  );
}
