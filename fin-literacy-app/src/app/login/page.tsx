"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const USER_KEY = "cc_user";
const AGE_KEY = "cc_age";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const existing = localStorage.getItem(USER_KEY);
    if (existing) {
      const age = localStorage.getItem(AGE_KEY);
      router.replace(age ? "/dashboard" : "/age");
    }
  }, [router]);

  const onContinue = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) return;

    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
      })
    );

    router.push("/age");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F8F7BA] via-white to-[#A3CCDA]">
      <div className="pointer-events-none absolute -top-24 left-8 h-72 w-72 rounded-full bg-[#F5D2D2]/70 blur-2xl" />
      <div className="pointer-events-none absolute bottom-[-120px] right-10 h-80 w-80 rounded-full bg-[#BDE3C3]/70 blur-2xl" />

      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
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
                <div className="text-xs text-black/50">Docs help + quizzes + rewards</div>
              </div>
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-black/80">
              Login / Auth sign in
            </h1>
            <p className="mt-2 text-sm text-black/60">
              This is a frontend-only login for now. Later we’ll plug in real auth.
            </p>

            <div className="mt-6 space-y-3">
              <div>
                <label className="text-xs font-bold text-black/60">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Vidhi"
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/80 outline-none focus:ring-2 focus:ring-[#A3CCDA]/70"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-black/60">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vidhi@westernu.ca"
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/80 outline-none focus:ring-2 focus:ring-[#A3CCDA]/70"
                />
              </div>

              <button
                type="button"
                onClick={onContinue}
                className="mt-2 w-full rounded-2xl bg-[#BDE3C3]/90 px-4 py-3 text-sm font-extrabold text-black/75 shadow-sm hover:bg-[#BDE3C3]"
              >
                Continue ✨
              </button>

              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-black/10" />
                <div className="text-[11px] text-black/40">or</div>
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <button
                type="button"
                onClick={() => alert("Google sign in will be added later")}
                className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm font-bold text-black/70 hover:bg-white"
              >
                Continue with Google
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white/55 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur">
            <div className="text-xs font-bold text-black/55">What you get</div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-black/10 bg-[#F5D2D2]/45 p-4">
                <div className="text-sm font-extrabold text-black/75">Doc Buddy 🧠</div>
                <div className="mt-1 text-xs text-black/55">
                  Upload a doc and ask questions without feeling stressed.
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-[#F8F7BA]/55 p-4">
                <div className="text-sm font-extrabold text-black/75">Quizzes 🪙</div>
                <div className="mt-1 text-xs text-black/55">
                  Earn coins by learning money skills.
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-[#A3CCDA]/45 p-4">
                <div className="text-sm font-extrabold text-black/75">Customize 🎨</div>
                <div className="mt-1 text-xs text-black/55">
                  Spend coins to customize your character.
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-black/10 bg-white/70 p-4 text-xs text-black/55">
              Privacy note: don’t upload IDs or addresses. This is a prototype.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
