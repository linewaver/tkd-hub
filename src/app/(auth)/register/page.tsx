"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register your Taekwondo studio on TKD-Hub
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="studioName"
              className="block text-sm font-medium text-foreground"
            >
              Studio Name
            </label>
            <input
              id="studioName"
              type="text"
              className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm"
              placeholder="Elite Taekwondo Academy"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
