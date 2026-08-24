declare module "mammoth/mammoth.browser" {
  export function extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<{ value: string; messages: unknown[] }>;
  const _default: { extractRawText: typeof extractRawText };
  export default _default;
}

declare module "pdfjs-dist/build/pdf.worker.min.mjs" {
  const worker: unknown;
  export default worker;
}
