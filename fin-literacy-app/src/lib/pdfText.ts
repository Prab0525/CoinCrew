export async function extractPdfText(file: File): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("PDF text extraction must run in the browser");
  }

  const pdfjs = await import("pdfjs-dist");

  // ✅ Use worker from the same installed pdfjs-dist version
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const buf = await file.arrayBuffer();
  // @ts-ignore
  const pdf = await pdfjs.getDocument({ data: buf }).promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = (content.items as any[])
      .map((item) => (item?.str ? item.str : ""))
      .join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
}
