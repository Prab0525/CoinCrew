"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import UploadCard from "./components/UploadCard";
import dynamic from "next/dynamic";

const FilePreview = dynamic(() => import("./components/FilePreview"), {
  ssr: false,
});

type StoredDocsFile = {
  name: string;
  type: string;
  dataUrl: string;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DocsPage() {
  const [file, setFile] = useState<File | null>(null);

  const fileUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F8F7BA] via-white to-[#A3CCDA]">
      {/* cute floating blobs */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-[#F5D2D2]/70 blur-2xl" />
      <div className="pointer-events-none absolute top-24 -right-20 h-72 w-72 rounded-full bg-[#BDE3C3]/60 blur-2xl" />
      <div className="pointer-events-none absolute bottom-[-80px] left-1/3 h-72 w-72 rounded-full bg-[#A3CCDA]/55 blur-2xl" />

      {/* lil sticker squares */}
      <div className="pointer-events-none absolute right-16 top-28 h-12 w-12 rotate-6 rounded-2xl bg-[#BDE3C3]/70 shadow-sm" />
      <div className="pointer-events-none absolute left-20 bottom-24 h-14 w-14 -rotate-6 rounded-2xl bg-[#F5D2D2]/70 shadow-sm" />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-black/70 shadow-sm">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#F8F7BA]">✨</span>
              Docs Help for kids and teens
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-black/80">
              Upload a document <span className="text-black/40">and we’ll explain it</span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-black/60">
              Upload a PDF and we’ll break it into simple parts, highlight what matters, and suggest next steps.
              Please avoid uploading anything with names, addresses, or ID numbers.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F5D2D2]/70 px-3 py-1 text-xs font-semibold text-black/70">
                Deadlines
              </span>
              <span className="rounded-full bg-[#F8F7BA]/80 px-3 py-1 text-xs font-semibold text-black/70">
                What it means
              </span>
              <span className="rounded-full bg-[#BDE3C3]/75 px-3 py-1 text-xs font-semibold text-black/70">
                Next steps
              </span>
              <span className="rounded-full bg-[#A3CCDA]/70 px-3 py-1 text-xs font-semibold text-black/70">
                Glossary
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-4 py-2 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F8F7BA] text-lg">
                💰
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold text-black/75">Doc Buddy</div>
                <div className="text-xs text-black/55">I’ll translate the scary stuff</div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-black/70 shadow-sm hover:bg-white"
            >
              Back to dashboard
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
            <UploadCard
              file={file}
              onFileChange={setFile}
              onAnalyze={async () => {
                if (!file) return;

                try {
                  const dataUrl = await fileToDataUrl(file);

                  const payload: StoredDocsFile = {
                    name: file.name,
                    type: file.type,
                    dataUrl,
                  };

                  sessionStorage.setItem("docs-file", JSON.stringify(payload));
                  window.location.href = "/docs/result";
                } catch (e) {
                  console.error(e);
                  alert("Could not read that file. Try another PDF.");
                }
              }}
            />
          </div>

          <div className="rounded-3xl border border-black/10 bg-white/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-black/70">Document preview</h2>
              <div className="text-xs text-black/50">{file ? file.name : "No file yet"}</div>
            </div>

            <FilePreview fileUrl={fileUrl} />
          </div>
        </section>
      </div>
    </main>
  );
}
