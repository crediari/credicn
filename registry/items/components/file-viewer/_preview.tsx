"use client";

import { useState } from "react";

import {
  FileTypeIcon,
  FileViewer,
  formatFileSize,
  type FileSource,
  type FileViewerFile,
  type FileViewerOfficePreview,
} from "./file-viewer";

type DemoFile = FileViewerFile & { scenario: string; group: string };

const examplesPath = "/examples/file-viewer";

const groups = [
  "Images",
  "Documents and media",
  "Spreadsheets",
  "Text and code",
  "States and limits",
];

const examples: DemoFile[] = [
  {
    id: "image",
    group: "Images",
    scenario: "Landscape image: zoom and rotation",
    name: "landscape.svg",
    size: 1_842,
    type: "image/svg+xml",
    source:
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#bfdbfe"/><stop offset="1" stop-color="#f0fdfa"/></linearGradient></defs><rect width="1200" height="760" fill="url(#sky)"/><circle cx="930" cy="160" r="82" fill="#fbbf24" opacity=".9"/><path d="M0 570L260 260l180 220 210-300 210 300 120-150 220 250v180H0z" fill="#0f766e"/><path d="M0 650l300-210 190 140 220-170 220 170 270-90v270H0z" fill="#115e59" opacity=".78"/></svg>`,
      ),
  },
  {
    id: "spreadsheet",
    group: "Spreadsheets",
    scenario: "CSV with numbers and headers",
    name: "monthly-report.csv",
    size: 156,
    type: "text/csv",
    source: encodeDataUrl(
      "Month,Revenue,Expenses,Result\nJanuary,128500,84200,44300\nFebruary,136900,88750,48150\nMarch,149200,91600,57600",
      "text/csv",
    ),
  },
  {
    id: "text",
    group: "Text and code",
    scenario: "Markdown displayed as text",
    name: "readme.md",
    size: 238,
    type: "text/markdown",
    source: encodeDataUrl(
      "# File viewer\n\nUse the arrow keys to navigate attachments. For images, scroll or use + and - to zoom, R to rotate, and 0 to reset. Text, CSV, and Excel spreadsheets are processed locally in the browser.",
      "text/markdown",
    ),
  },
  {
    id: "excel",
    group: "Spreadsheets",
    scenario: "Three sheets, dates, formulas, and 150 rows",
    name: "planning.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  {
    id: "portrait",
    name: "portrait.svg",
    type: "image/svg+xml",
    source: `${examplesPath}/retrato.svg`,
    group: "Images",
    scenario: "Portrait image to test fit",
  },
  {
    id: "transparent",
    name: "transparent.svg",
    type: "image/svg+xml",
    source: `${examplesPath}/transparente.svg`,
    group: "Images",
    scenario: "Transparency over the dark overlay",
  },
  {
    id: "pdf",
    name: "report.pdf",
    type: "application/pdf",
    source: `${examplesPath}/relatorio.pdf`,
    group: "Documents and media",
    scenario: "Two-page PDF with continuous scrolling",
  },
  {
    id: "pdf-buffer",
    name: "report-buffer.pdf",
    type: "application/pdf",
    group: "Documents and media",
    scenario: "Uint8Array PDF: preview and original download",
  },
  {
    id: "word",
    name: "announcement.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    source: `${examplesPath}/comunicado.docx`,
    group: "Documents and media",
    scenario: "Word: optional Office support",
  },
  {
    id: "presentation",
    name: "presentation.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    source: `${examplesPath}/apresentacao.pptx`,
    group: "Documents and media",
    scenario: "PowerPoint: optional Office support",
  },
  {
    id: "invalid-pdf",
    name: "corrupted-pdf.pdf",
    type: "application/pdf",
    source: encodeDataUrl("Invalid PDF content", "application/pdf"),
    group: "States and limits",
    scenario: "PDF read error",
  },
  {
    id: "audio",
    name: "notification.wav",
    type: "audio/wav",
    source: `${examplesPath}/notificacao.wav`,
    group: "Documents and media",
    scenario: "Two-second audio with native controls",
  },
  {
    id: "video",
    name: "demo.mp4",
    type: "video/mp4",
    source: `${examplesPath}/demonstracao.mp4`,
    group: "Documents and media",
    scenario: "Four-second video with native controls",
  },
  {
    id: "tsv",
    name: "team.tsv",
    type: "text/tab-separated-values",
    source: encodeDataUrl(
      "Name\tDepartment\tStatus\nMarina\tTechnology\tActive\nCarlos\tOperations\tActive\nLuiza\tData\tOn leave",
      "text/tab-separated-values",
    ),
    group: "Spreadsheets",
    scenario: "Tab-separated data",
  },
  {
    id: "quoted-csv",
    name: "special-fields.csv",
    type: "text/csv",
    source: encodeDataUrl(
      'Name;Note;Value\n"Silva, Ana";"Line 1\nLine 2";1250\nCarlos;"Text with ""quotes""";980',
      "text/csv",
    ),
    group: "Spreadsheets",
    scenario: "CSV with semicolons, quotes, and multiline fields",
  },
  {
    id: "json",
    name: "configuration.json",
    type: "application/json",
    source: encodeDataUrl(
      JSON.stringify(
        {
          app: "CrediAri",
          preview: {
            zoom: true,
            shortcuts: ["Escape", "ArrowLeft", "ArrowRight", "+", "-", "R", "0"],
          },
        },
        null,
        2,
      ),
      "application/json",
    ),
    group: "Text and code",
    scenario: "Indented JSON code",
  },
  {
    id: "long-text",
    name: "history.log",
    type: "text/plain",
    source: encodeDataUrl(
      Array.from(
        { length: 180 },
        (_, i) =>
          `[2026-10-01 09:${String(i % 60).padStart(2, "0")}:00] INFO Event ${i + 1}: file processing completed successfully.`,
      ).join("\n"),
      "text/plain",
    ),
    group: "Text and code",
    scenario: "Long text with scrolling",
  },
  {
    id: "empty-text",
    name: "empty.txt",
    size: 0,
    type: "text/plain",
    source: encodeDataUrl("", "text/plain"),
    group: "States and limits",
    scenario: "Empty text file",
  },
  {
    id: "unsupported",
    name: "data.zip",
    type: "application/zip",
    source: `${examplesPath}/dados.zip`,
    group: "States and limits",
    scenario: "Unsupported preview format, available to download",
  },
  {
    id: "slow",
    name: "slow-loading.txt",
    type: "text/plain",
    group: "States and limits",
    scenario: "Simulated two-second load",
  },
  {
    id: "error",
    name: "load-failure.txt",
    type: "text/plain",
    group: "States and limits",
    scenario: "Simulated file resolution failure",
  },
  {
    id: "invalid-excel",
    name: "corrupted-spreadsheet.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    source: encodeDataUrl("Invalid XLSX spreadsheet content", "application/octet-stream"),
    group: "States and limits",
    scenario: "Spreadsheet read error",
  },
  {
    id: "invalid-image",
    name: "corrupted-image.png",
    type: "image/png",
    source: encodeDataUrl("Invalid image content", "image/png"),
    group: "States and limits",
    scenario: "Image read error",
  },
];

const files = groups.flatMap((group) => examples.filter((file) => file.group === group));

function encodeDataUrl(content: string, mimeType: string) {
  return `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
}

async function resolveDemoFile(file: FileViewerFile, signal: AbortSignal): Promise<FileSource> {
  if (file.id === "pdf-buffer") {
    const response = await fetch(`${examplesPath}/relatorio.pdf`, { signal });
    if (!response.ok) throw new Error("Failed to load PDF");
    return new Uint8Array(await response.arrayBuffer());
  }
  if (file.id === "error") throw new Error("Simulated failure: could not retrieve the attachment.");
  if (file.id === "slow") {
    await new Promise<void>((resolve, reject) => {
      if (signal.aborted) {
        reject(signal.reason);
        return;
      }
      const timer = window.setTimeout(() => {
        signal.removeEventListener("abort", abort);
        resolve();
      }, 2_000);
      function abort() {
        window.clearTimeout(timer);
        reject(signal.reason);
      }
      signal.addEventListener("abort", abort, { once: true });
    });
    return new Blob(["File loaded! Navigate during loading to test cancellation."], {
      type: "text/plain",
    });
  }
  if (file.id !== "excel") throw new Error("Demo file not found");

  const { Workbook } = await import("exceljs");
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet("Planning");
  sheet.addRows([
    ["Project", "Assignee", "Status", "Budget"],
    ["Internal portal", "Marina", "In progress", 85000],
    ["Application", "Carlos", "Planned", 120000],
    ["Data", "Luiza", "Completed", 47500],
  ]);

  const summary = workbook.addWorksheet("Summary");
  summary.addRows([
    ["Metric", "Value"],
    ["Total budget", { formula: "SUM(Planning!D2:D4)", result: 252500 }],
    ["Updated at", new Date("2026-10-01T12:00:00Z")],
    ["Documentation", { text: "CrediAri", hyperlink: "https://crediari.com.br" }],
  ]);
  const history = workbook.addWorksheet("History");
  history.addRow(["Record", "Assignee", "Description", "Value"]);
  for (let index = 0; index < 150; index += 1) {
    history.addRow([
      index + 1,
      ["Marina", "Carlos", "Luiza"][index % 3],
      `Demo entry ${index + 1}`,
      (index + 1) * 125,
    ]);
  }
  return workbook.xlsx.writeBuffer();
}

// Simulates the response of a conversion endpoint; no Office conversion runs in this demo.
const demoOfficePdf: FileViewerOfficePreview = async (_file, _source, signal) => {
  const response = await fetch(`${examplesPath}/relatorio.pdf`, { signal });
  if (!response.ok) throw new Error("Could not load the demo PDF");
  return response.blob();
};

export function Preview() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [empty, setEmpty] = useState(false);

  function openFile(index: number) {
    setEmpty(false);
    setActiveIndex(index);
    setOpen(true);
  }

  return (
    <div>
      <div className="px-2 pt-1 pb-3">
        <p className="font-semibold">Explore the viewer</p>
        <p className="text-sm text-muted-foreground">
          {files.length} examples to test formats, navigation, and error states.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Esc or backdrop click closes · ← → navigate · Scroll zooms images · Ctrl/Cmd + scroll
          zooms PDFs · R rotates · 0 resets
        </p>
      </div>

      <p className="mb-4 px-2 text-xs text-muted-foreground">
        Office documents use simulated conversion: the sample PDF is displayed, and downloads
        preserve the original document.
      </p>

      <div className="max-h-136 space-y-4 overflow-auto overscroll-contain px-1 pb-2">
        {groups.map((group) => (
          <section key={group} aria-label={group}>
            <h3 className="px-2 pb-1 text-xs font-semibold text-muted-foreground">{group}</h3>
            <div className="grid gap-1 sm:grid-cols-2">
              {files.map((file, index) =>
                file.group === group ? (
                  <button
                    className="flex min-w-0 items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    key={file.id}
                    onClick={() => openFile(index)}
                    type="button"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                      <FileTypeIcon file={file} className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{file.name}</span>
                      <span className="block text-xs text-muted-foreground">{file.scenario}</span>
                      {file.size !== undefined && (
                        <span className="block text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                      )}
                    </span>
                  </button>
                ) : null,
              )}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-2 border-t px-2 pt-3 pb-1">
        <button
          type="button"
          className="text-xs font-medium underline underline-offset-4"
          onClick={() => {
            setEmpty(true);
            setOpen(true);
          }}
        >
          Test the viewer without files
        </button>
      </div>

      <FileViewer
        activeIndex={activeIndex}
        files={empty ? [] : files}
        onActiveIndexChange={setActiveIndex}
        onOpenChange={setOpen}
        open={open}
        resolveFile={resolveDemoFile}
        officePreview={demoOfficePdf}
      />
    </div>
  );
}
