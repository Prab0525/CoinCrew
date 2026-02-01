"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
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

type ExplainResponse = {
  ok: boolean;
  docId?: string;
  oneSentence?: string;
  breakdown?: string[];
  keyDetails?: {
    deadline: string | null;
    amount: string | null;
    whoIsItFrom: string | null;
    whatToDoNext: string;
  };
  glossary?: { term: string; meaning: string }[];
  safeSummary?: string;
};

export default function DocsResultPage() {
  // 1) load file preview from sessionStorage (your existing logic)
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

  // 2) NEW: load explain result from sessionStorage
  const [explain, setExplain] = useState<ExplainResponse | null>(null);
  const [ageRange, setAgeRange] = useState<"8-11" | "12-15" | "16-18">("12-15");

  useEffect(() => {
    const raw = sessionStorage.getItem("docs-explain");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as ExplainResponse;
      setExplain(parsed);
    } catch {
      setExplain(null);
    }

    const age = sessionStorage.getItem("docs-ageRange");
    if (age === "8-11" || age === "12-15" || age === "16-18") {
      setAgeRange(age);
    }
  }, []);

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
              Here’s a kid-friendly breakdown + key details. Ask the chat if anything is confusing.
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
              {!explain?.ok ? (
                <p className="text-sm text-black/65">
                  No explanation found yet. Go back and click Explain again.
                </p>
              ) : (
                <div className="space-y-4">
                  {/* One sentence */}
                  <div>
                    <p className="text-sm font-semibold text-black/70">In one sentence</p>
                    <p className="mt-1 text-sm text-black/70">{explain.oneSentence}</p>
                  </div>

                  {/* Breakdown */}
                  {Array.isArray(explain.breakdown) && explain.breakdown.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-black/70">Step-by-step</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-black/70">
                        {explain.breakdown.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key details */}
                  {explain.keyDetails && (
                    <div>
                      <p className="text-sm font-semibold text-black/70">Key details</p>
                      <div className="mt-2 grid gap-2 text-sm text-black/70">
                        <div>
                          <span className="font-semibold">Deadline:</span>{" "}
                          {explain.keyDetails.deadline ?? "Not found"}
                        </div>
                        <div>
                          <span className="font-semibold">Amount:</span>{" "}
                          {explain.keyDetails.amount ?? "Not found"}
                        </div>
                        <div>
                          <span className="font-semibold">From:</span>{" "}
                          {explain.keyDetails.whoIsItFrom ?? "Not sure"}
                        </div>
                        <div>
                          <span className="font-semibold">Next step:</span>{" "}
                          {explain.keyDetails.whatToDoNext}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Glossary */}
                  {Array.isArray(explain.glossary) && explain.glossary.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-black/70">Glossary</p>
                      <ul className="mt-2 space-y-2 text-sm text-black/70">
                        {explain.glossary.map((g, i) => (
                          <li key={i}>
                            <span className="font-semibold">{g.term}:</span> {g.meaning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* pass what chat needs */}
      <DocsChatWidget
        docName={fileName}
        safeSummary={explain?.safeSummary ?? ""}
      />
    </main>
  );
}
