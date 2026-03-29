import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-xl font-bold">TKD-Hub</h1>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h2 className="text-5xl font-bold tracking-tight">
            Manage Your
            <br />
            <span className="text-accent">Taekwondo Studio</span>
            <br />
            With Confidence
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
            All-in-one platform for student management, attendance tracking,
            payments, and studio-to-studio networking.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Start Free</Button>
            </Link>
            <Link href="/studio/dashboard">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
