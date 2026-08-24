"use client";

import type { Analysis } from "@/types";

/** Client-side resume parsing + analysis orchestration. */

export type ParsedResume = {
  text: string;
  base64?: string;
  mimeType: string;
  fileName: string;
  size: number;
  pageCount?: number;
  wordCount: number;
};

/** Read a File into text (+ base64 for PDFs so Gemini can see layout). */
export async function parseResumeFile(file: File): Promise<ParsedResume> {
  const mimeType = file.type || guessMime(file.name);
  const size = file.size;

  if (/\.docx$/i.test(file.name) || mimeType.includes("wordprocessingml")) {
    const mammoth = await import("mammoth/mammoth.browser");
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return { text: value, mimeType: "text/plain", fileName: file.name, size, wordCount: wc(value) };
  }

  if (/\.pdf$/i.test(file.name) || mimeType === "application/pdf") {
    const [text, pageCount] = await extractPdfText(file);
    const base64 = await fileToBase64(file);
    return { text, base64, mimeType: "application/pdf", fileName: file.name, size, pageCount, wordCount: wc(text) };
  }

  // Plain text fallback
  const text = await file.text();
  return { text, mimeType: "text/plain", fileName: file.name, size, wordCount: wc(text) };
}

async function extractPdfText(file: File): Promise<[string, number]> {
  const pdfjs = await import("pdfjs-dist");
  // Use the worker shipped in node_modules (served by Next from /_next).
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs");
  pdfjs.GlobalWorkerOptions.workerPort = new (worker as unknown as { default: new () => Worker }).default();

  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it) => ("str" in it ? it.str : "")).join(" ") + "\n";
  }
  return [text, pdf.numPages];
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? ""); // strip data: prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function guessMime(name: string) {
  if (/\.pdf$/i.test(name)) return "application/pdf";
  if (/\.docx$/i.test(name)) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "text/plain";
}
function wc(t: string) { return (t.trim().match(/\S+/g) || []).length; }

/** Call the analysis API. Always resolves with a full Analysis (server falls back to mock). */
export async function analyzeResume(input: {
  parsed: ParsedResume;
  jd?: string;
  targetRole?: string;
}): Promise<{ analysis: Analysis; source: string; note?: string }> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resumeText: input.parsed.text,
      base64: input.parsed.base64,
      mimeType: input.parsed.mimeType,
      fileName: input.parsed.fileName,
      jd: input.jd,
      targetRole: input.targetRole,
    }),
  });
  if (!res.ok) throw new Error(`Analysis failed (${res.status})`);
  return res.json();
}
