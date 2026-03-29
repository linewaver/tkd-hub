import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF5]">
      {/* Header */}
      <header className="flex items-center justify-between border-b-2 border-black px-8 py-4">
        <h1 className="font-[var(--font-heading)] text-2xl font-black uppercase italic tracking-tighter">
          TKD-Hub
        </h1>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="border-2 border-black bg-white px-5 py-2 text-sm font-bold uppercase tracking-wider neo-shadow-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="border-2 border-black bg-[#CD2E3A] px-5 py-2 text-sm font-bold uppercase tracking-wider text-white neo-shadow-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 items-center justify-center px-8">
        <div className="max-w-3xl text-center">
          <h2 className="font-[var(--font-heading)] text-6xl font-black uppercase italic leading-tight tracking-tight">
            Manage Your
            <br />
            <span className="text-[#CD2E3A]">Taekwondo</span> Studio
            <br />
            With Confidence
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm font-medium uppercase tracking-wider text-black/60">
            All-in-one platform for student management, attendance tracking,
            payments, and studio-to-studio networking.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/register"
              className="border-2 border-black bg-[#CD2E3A] px-8 py-4 text-lg font-black uppercase tracking-wider text-white neo-shadow transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Start Free
            </Link>
            <Link
              href="/studio/dashboard"
              className="border-2 border-black bg-white px-8 py-4 text-lg font-black uppercase tracking-wider neo-shadow transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              View Demo
            </Link>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="border-t-2 border-black px-8 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <div className="border-2 border-black bg-white p-8 neo-shadow">
            <div className="mb-4 inline-block border-2 border-black bg-[#0047A0] p-3 text-2xl text-white">
              👥
            </div>
            <h3 className="font-[var(--font-heading)] text-lg font-black uppercase">
              Studio Management
            </h3>
            <p className="mt-2 text-sm text-black/60">
              Track students, attendance, belt promotions, and payments in one
              place.
            </p>
          </div>
          <div className="border-2 border-black bg-white p-8 neo-shadow">
            <div className="mb-4 inline-block border-2 border-black bg-[#CD2E3A] p-3 text-2xl text-white">
              🤝
            </div>
            <h3 className="font-[var(--font-heading)] text-lg font-black uppercase">
              B2B Network
            </h3>
            <p className="mt-2 text-sm text-black/60">
              Connect with other studios, share teaching methods, coordinate
              events.
            </p>
          </div>
          <div className="border-2 border-black bg-white p-8 neo-shadow">
            <div className="mb-4 inline-block border-2 border-black bg-[#F4A261] p-3 text-2xl">
              🎧
            </div>
            <h3 className="font-[var(--font-heading)] text-lg font-black uppercase">
              Integrated CS
            </h3>
            <p className="mt-2 text-sm text-black/60">
              Parent portal, ticketing system, and AI-powered chatbot support.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-black px-8 py-6 text-center text-xs font-bold uppercase tracking-widest text-white/60">
        &copy; 2026 TKD-Hub. All rights reserved.
      </footer>
    </div>
  );
}
