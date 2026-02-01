"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const USER_KEY = "cc_user";
const AGE_KEY = "cc_age";
const COINS_KEY = "cc_coins";

type AgeBand = "8-11" | "12-15" | "16-18";

export default function AgePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<AgeBand | null>(null);

  useEffect(() => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) router.replace("/login");
  }, [router]);

  const choose = (band: AgeBand) => setSelected(band);

  const continueNext = () => {
    if (!selected) return;

    localStorage.setItem(AGE_KEY, selected);

    const existingCoins = localStorage.getItem(COINS_KEY);
    if (!existingCoins) localStorage.setItem(COINS_KEY, "0");

    router.push("/dashboard");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F5D2D2] via-white to-[#BDE3C3]">
      <div className="pointer-events-none absolute -top-24 right-8 h-72 w-72 rounded-full bg-[#A3CCDA]/65 blur-2xl" />
      <div className="pointer-events-none absolute bottom-[-120px] left-10 h-80 w-80 rounded-full bg-[#F8F7BA]/70 blur-2xl" />

      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-10">
        <div className="w-full rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
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
                <div className="text-xs text-black/50">Quick setup</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60 hover:bg-white"
            >
              Back
            </button>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-black/80">
            What age are you?
          </h1>
          <p className="mt-2 text-sm text-black/60">
            We use this to keep the explanations and quiz difficulty at the right level.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <AgeCard label="8 to 11" value="8-11" selected={selected} onClick={choose} />
            <AgeCard label="12 to 15" value="12-15" selected={selected} onClick={choose} />
            <AgeCard label="16 to 18" value="16-18" selected={selected} onClick={choose} />
          </div>

          <button
            type="button"
            onClick={continueNext}
            disabled={!selected}
            className={[
              "mt-6 w-full rounded-2xl px-4 py-3 text-sm font-extrabold shadow-sm transition",
              selected
                ? "bg-[#A3CCDA]/85 text-black/75 hover:bg-[#A3CCDA]"
                : "cursor-not-allowed bg-black/5 text-black/30",
            ].join(" ")}
          >
            Continue ✨
          </button>
        </div>
      </div>
    </main>
  );
}

function AgeCard({
  label,
  value,
  selected,
  onClick,
}: {
  label: string;
  value: "8-11" | "12-15" | "16-18";
  selected: "8-11" | "12-15" | "16-18" | null;
  onClick: (v: "8-11" | "12-15" | "16-18") => void;
}) {
  const active = selected === value;

  const bg =
    value === "8-11"
      ? "bg-[#F8F7BA]/70"
      : value === "12-15"
      ? "bg-[#F5D2D2]/60"
      : "bg-[#BDE3C3]/60";

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={[
        "rounded-3xl border p-4 text-left shadow-sm transition",
        bg,
        active ? "border-black/30 ring-2 ring-[#A3CCDA]/60" : "border-black/10 hover:border-black/20",
      ].join(" ")}
    >
      <div className="text-sm font-extrabold text-black/75">{label}</div>
      <div className="mt-1 text-xs text-black/55">Select</div>
    </button>
  );
}
