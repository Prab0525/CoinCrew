"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const USER_KEY = "cc_user";
const AGE_KEY = "cc_age";
const COINS_KEY = "cc_coins";

type User = {
  name: string;
  email: string;
};

function safeParseUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function safeParseCoins(raw: string | null): number {
  const n = Number(raw ?? "0");
  return Number.isFinite(n) ? n : 0;
}

export default function DashboardPage() {
  const router = useRouter();

  // ✅ Initialize from localStorage without using an effect
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    return safeParseUser(localStorage.getItem(USER_KEY));
  });

  const [coins, setCoins] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return safeParseCoins(localStorage.getItem(COINS_KEY));
  });

  // ✅ Effect only does "external sync" (navigation), not state hydration
  useEffect(() => {
    const rawUser = localStorage.getItem(USER_KEY);
    const age = localStorage.getItem(AGE_KEY);

    if (!rawUser) {
      router.replace("/login");
      return;
    }

    if (!age) {
      router.replace("/age");
      return;
    }

    // If localStorage got corrupted, force them back to login
    const parsed = safeParseUser(rawUser);
    if (!parsed) {
      router.replace("/login");
      return;
    }
  }, [router]);

  const greeting = useMemo(() => {
    if (!user?.name) return "Welcome to CoinCrew!";
    return `Welcome, ${user.name}!`;
  }, [user?.name]);

  const addDemoCoin = () => {
    const next = coins + 1;
    setCoins(next);
    localStorage.setItem(COINS_KEY, String(next));
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(AGE_KEY);
    router.push("/login");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#A3CCDA] via-white to-[#F8F7BA]">
      <div className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full bg-[#F5D2D2]/70 blur-2xl" />
      <div className="pointer-events-none absolute bottom-[-120px] right-10 h-80 w-80 rounded-full bg-[#BDE3C3]/70 blur-2xl" />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white shadow-sm">
              <Image
                src="/coincrew-logo.png"
                alt="CoinCrew logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>

            <div>
              <div className="text-sm font-extrabold text-black/80">CoinCrew</div>
              <div className="text-xs text-black/50">Your money skills squad</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-2xl border border-black/10 bg-white/75 px-4 py-2 shadow-sm">
              <div className="text-[11px] font-bold text-black/50">Current coins</div>
              <div className="text-lg font-extrabold text-black/75">🪙 {coins}</div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3 text-xs font-extrabold text-black/65 shadow-sm hover:bg-white"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="mt-8 rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-black/10 bg-[#F5D2D2]/45 p-4">
                <div className="text-xs font-bold text-black/55">Mascot</div>
                <div className="mt-3 grid place-items-center rounded-3xl bg-white/70 p-6">
                  <div className="text-5xl">🧍‍♀️</div>
                  <div className="mt-2 text-xs font-bold text-black/55">Market</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-9">
              <h1 className="text-3xl font-extrabold tracking-tight text-black/80">
                {greeting}
              </h1>

              <div className="mt-3 rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-black/65">
                <div className="font-bold text-black/70">What this does</div>
                <div className="mt-1">
                  Upload documents, learn what they mean, and earn coins with quizzes. Then customize your character.
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm font-extrabold text-black/75">How should we help you?</div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Link
                    href="/docs"
                    className="group rounded-3xl border border-black/10 bg-[#A3CCDA]/40 p-5 shadow-sm hover:bg-[#A3CCDA]/55"
                  >
                    <div className="text-2xl">📄</div>
                    <div className="mt-2 text-sm font-extrabold text-black/75">Docs</div>
                    <div className="mt-1 text-xs text-black/55">
                      Upload a doc and ask Doc Buddy.
                    </div>
                    <div className="mt-3 text-[11px] font-bold text-black/55 group-hover:text-black/70">
                      Open Docs →
                    </div>
                  </Link>

                  <Link
                    href="/shop"
                    className="group rounded-3xl border border-black/10 bg-[#BDE3C3]/45 p-5 shadow-sm hover:bg-[#BDE3C3]/60"
                  >
                    <div className="text-2xl">🎨</div>
                    <div className="mt-2 text-sm font-extrabold text-black/75">Customize</div>
                    <div className="mt-1 text-xs text-black/55">
                      Spend coins on outfits and accessories.
                    </div>
                    <div className="mt-3 text-[11px] font-bold text-black/55 group-hover:text-black/70">
                      Go to Shop →
                    </div>
                  </Link>

                  <Link
                    href="/quiz"
                    className="group rounded-3xl border border-black/10 bg-[#F8F7BA]/55 p-5 shadow-sm hover:bg-[#F8F7BA]/70"
                  >
                    <div className="text-2xl">🧠</div>
                    <div className="mt-2 text-sm font-extrabold text-black/75">Quiz</div>
                    <div className="mt-1 text-xs text-black/55">
                      Learn money skills and earn coins.
                    </div>
                    <div className="mt-3 text-[11px] font-bold text-black/55 group-hover:text-black/70">
                      Start Quiz →
                    </div>
                  </Link>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={addDemoCoin}
                    className="rounded-2xl border border-black/10 bg-white/75 px-4 py-2 text-xs font-extrabold text-black/65 shadow-sm hover:bg-white"
                  >
                    Demo: add 1 coin 🪙
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-black/40">
          Prototype mode. Auth and coin tracking will be connected to the backend later.
        </p>
      </div>
    </main>
  );
}
