"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import DocsChatWidget from "../components/DocsChat";

const FilePreview = dynamic(() => import("../components/FilePreview"), {
  ssr: false,
});

type StoredDocsFile = {
  name: string;
  type: string;
  dataUrl?: string;
  data?: string;
};

export default function DocsResultPage() {
  const stored = useMemo(() => {
    if (typeof window === "undefined") {
      return { fileUrl: null as string | null, fileName: "" };
    }

    const raw = sessionStorage.getItem("docs-file");
    if (!raw) return { fileUrl: null as string | null, fileName: "" };

    try {
      const parsed = JSON.parse(raw) as StoredDocsFile;
      const url = parsed.dataUrl ?? parsed.data ?? null;
      return { fileUrl: url, fileName: parsed.name ?? "" };
    } catch {
      return { fileUrl: null as string | null, fileName: "" };
    }
  }, []);

  const fileUrl = stored.fileUrl;
  const fileName = stored.fileName;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#BDE3C3] via-white to-[#F5D2D2]">
      <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-[#A3CCDA]/65 blur-2xl" />
      <div className="pointer-events-none absolute bottom-[-100px] left-10 h-80 w-80 rounded-full bg-[#F8F7BA]/70 blur-2xl" />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-black/80">
              Simplified Explanation ✨
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-black/60">
              Once your backend is connected, we’ll show the explanation, key highlights, and next steps here.
              For now, we’re previewing the file reliably.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/docs"
              className="rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-black/70 shadow-sm hover:bg-white"
            >
              Back to docs
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-black/70 shadow-sm hover:bg-white"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-black/70">Document preview</h2>

              {/* This avoids hydration yelling if name differs */}
              <div className="text-xs text-black/50" suppressHydrationWarning>
                {fileName || "No file"}
              </div>
            </div>

            <FilePreview fileUrl={fileUrl} />
          </div>

          <div className="rounded-3xl border border-black/10 bg-white/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-bold text-black/70">What this means</h2>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#A3CCDA]/70 text-lg shadow-sm">
                🧠
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-black/10 bg-white/60 p-4">
              <p className="text-sm text-black/65">Placeholder for now.</p>
            </div>
          </div>
        </section>
      </div>

      <DocsChatWidget docName={fileName} />
    </main>
  );
}
