"use client";

import { useMemo } from "react";

type Props = {
  file: File | null;
  onFileChange: (f: File | null) => void;
  onAnalyze: () => void;
};

export default function UploadCard({ file, onFileChange, onAnalyze }: Props) {
  const canAnalyze = useMemo(() => !!file, [file]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--ink)]">Upload your document</h2>
          <p className="mt-1 text-sm text-[var(--inkSoft)]">
            PDFs work best right now. You can scroll the whole file on the right.
          </p>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--blue)] text-lg shadow-sm ring-1 ring-black/5">
          📄
        </div>
      </div>

      <label className="mt-5 block">
        <div className="rounded-3xl bg-white/70 p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">Choose a file</div>
              <div className="mt-1 text-xs text-black/60">
                PDF recommended. Keep it under about 10MB if possible.
              </div>
            </div>

            {file ? (
              <button
                type="button"
                onClick={() => onFileChange(null)}
                className="rounded-2xl bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink)] shadow-sm ring-1 ring-black/5 hover:bg-white/90"
              >
                Remove
              </button>
            ) : null}
          </div>

          <input
            className="mt-3 w-full cursor-pointer rounded-2xl bg-white px-3 py-2 text-sm text-[var(--ink)] shadow-sm ring-1 ring-black/5 file:mr-3 file:rounded-xl file:border-0 file:bg-[var(--yellow)] file:px-3 file:py-2 file:text-xs file:font-extrabold file:text-[var(--ink)] hover:bg-white/90"
            type="file"
            accept="application/pdf"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />

          {file ? (
            <div className="mt-3 rounded-2xl bg-[var(--green)]/60 px-3 py-2 text-xs font-semibold text-[var(--ink)] ring-1 ring-black/5">
              Selected: <span className="font-extrabold">{file.name}</span>
            </div>
          ) : (
            <div className="mt-3 text-xs text-black/60">
              Tip: If it’s a letter with a deadline, we’ll try to spot the date.
            </div>
          )}
        </div>
      </label>

      <button
        type="button"
        disabled={!canAnalyze}
        onClick={onAnalyze}
        className={[
          "mt-5 w-full rounded-3xl px-4 py-3 text-sm font-extrabold shadow-sm ring-1 ring-black/5 transition",
          canAnalyze
            ? "bg-[var(--pink)] hover:bg-[var(--pink)]/90 text-[var(--ink)]"
            : "cursor-not-allowed bg-white/40 text-black/40",
        ].join(" ")}
      >
        Analyze and simplify ✨
      </button>

      <div className="mt-4 rounded-3xl bg-white/70 p-4 text-xs text-black/60 shadow-sm ring-1 ring-black/5">
        This feature is for learning and support, not legal advice. If something feels urgent, ask a trusted adult or support worker.
      </div>
    </div>
  );
}
