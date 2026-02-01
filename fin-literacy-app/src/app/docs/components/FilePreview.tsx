"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
}

type Props = {
  fileUrl: string | null;
};

export default function FilePreview({ fileUrl }: Props) {
  const shellRef = useRef<HTMLDivElement | null>(null);

  const [numPages, setNumPages] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [shellWidth, setShellWidth] = useState(720);

  // Default zoom makes it feel less “in your face”
  const [zoom, setZoom] = useState(1);

  // Must match Tailwind below
  const SHELL_PADDING_PX = 16; // p-4
  const PAGE_CARD_PADDING_PX = 12; // p-3
  const PAGE_CARD_BORDER_PX = 1; // border

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const update = () => setShellWidth(el.clientWidth);

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const baseWidth = useMemo(() => {
    const usable =
      shellWidth -
      SHELL_PADDING_PX * 2 -
      PAGE_CARD_PADDING_PX * 2 -
      PAGE_CARD_BORDER_PX * 2;

    // Smaller cap so it never feels “too zoomed”
    return Math.max(280, Math.min(usable, 760));
  }, [shellWidth]);

  const pageWidth = useMemo(() => {
    return Math.floor(baseWidth * zoom);
  }, [baseWidth, zoom]);

  const zoomOut = () =>
    setZoom((z) => Math.max(0.6, Math.round((z - 0.05) * 100) / 100));
  const zoomIn = () =>
    setZoom((z) => Math.min(1.25, Math.round((z + 0.05) * 100) / 100));
  const fit = () => setZoom(0.85);

  if (!fileUrl) {
    return (
      <div className="flex h-[560px] items-center justify-center rounded-2xl border border-black/10 bg-white/50">
        <div className="text-center">
          <div className="text-sm font-semibold text-black/80">
            Document preview
          </div>
          <div className="mt-1 text-xs text-black/50">
            Upload a PDF to see it here.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className="h-[560px] overflow-auto rounded-2xl border border-black/10 bg-white/50 p-4"
    >
      {/* toolbar */}
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-medium text-black/50">Zoom</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={zoomOut}
            className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-semibold text-black/70 hover:bg-black/5"
          >
            −
          </button>

          <div className="min-w-[64px] text-center text-xs font-semibold text-black/60">
            {Math.round(zoom * 100)}%
          </div>

          <button
            type="button"
            onClick={zoomIn}
            className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-semibold text-black/70 hover:bg-black/5"
          >
            +
          </button>

          <button
            type="button"
            onClick={fit}
            className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-semibold text-black/70 hover:bg-black/5"
          >
            Fit
          </button>
        </div>
      </div>

      {err ? (
        <div className="mb-4 rounded-2xl border border-rose-300/60 bg-rose-100/70 p-4 text-sm text-rose-900">
          <div className="font-semibold">Could not render this PDF</div>
          <div className="mt-1 text-xs opacity-80">{err}</div>
        </div>
      ) : null}

      <Document
        file={fileUrl}
  loading={<div className="h-40 animate-pulse rounded-2xl bg-black/5" />}
  onLoadSuccess={(pdf) => {
    setErr(null);
    setNumPages(pdf.numPages);
  }}
  onLoadError={(e) => {
    console.error(e);
    setErr("Try re-exporting the PDF or using a different file.");
  }}
>
  {/* ✅ horizontal scroll wrapper */}
  <div className="w-full overflow-x-auto pb-2">
    {/* ✅ keeps content from shrinking so scroll actually appears */}
    <div className="min-w-max">
      <div className="flex flex-col gap-5">
        {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
          <div key={pageNum} className="w-full">
            <div className="mb-2 px-1 text-xs font-medium text-black/50">
              Page {pageNum} of {numPages}
            </div>

            <div className="flex w-full justify-center">
              {/* ✅ critical: this width forces horizontal overflow when zoomed */}
              <div
                className="overflow-hidden rounded-2xl border border-black/10 bg-white p-3 shadow-sm"
                style={{ width: pageWidth + 24 }} // 24px = padding buffer
              >
                <Page
                  pageNumber={pageNum}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
      </Document>
    </div>
  );
}
