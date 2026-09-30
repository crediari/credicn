"use client";

import { useState } from "react";

import {
  FileTypeIcon,
  FileViewer,
  formatFileSize,
  type FileSource,
  type FileViewerFile,
} from "./file-viewer";

const files: FileViewerFile[] = [
  {
    id: "image",
    name: "paisagem.svg",
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
    name: "relatorio-mensal.csv",
    size: 156,
    type: "text/csv",
    source: encodeDataUrl(
      "Mês,Receita,Despesas,Resultado\nJaneiro,128500,84200,44300\nFevereiro,136900,88750,48150\nMarço,149200,91600,57600",
      "text/csv",
    ),
  },
  {
    id: "text",
    name: "leia-me.md",
    size: 238,
    type: "text/markdown",
    source: encodeDataUrl(
      "# Visualizador de arquivos\n\nUse as setas para navegar entre os anexos. Imagens aceitam zoom e rotação; textos, CSV e planilhas Excel são processados localmente no navegador.",
      "text/markdown",
    ),
  },
  {
    id: "excel",
    name: "planejamento.xlsx",
    size: 7_214,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
];

function encodeDataUrl(content: string, mimeType: string) {
  return `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
}

async function resolveDemoFile(file: FileViewerFile): Promise<FileSource> {
  if (file.id !== "excel") throw new Error("Arquivo de demonstração não encontrado");

  const { Workbook } = await import("exceljs");
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet("Planejamento");
  sheet.addRows([
    ["Projeto", "Responsável", "Status", "Orçamento"],
    ["Portal interno", "Marina", "Em andamento", 85000],
    ["Aplicativo", "Carlos", "Planejado", 120000],
    ["Dados", "Luiza", "Concluído", 47500],
  ]);

  return workbook.xlsx.writeBuffer();
}

export function Preview() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  function openFile(index: number) {
    setActiveIndex(index);
    setOpen(true);
  }

  return (
    <div className="w-full max-w-xl rounded-3xl border bg-card p-3 shadow-sm">
      <div className="px-2 pt-1 pb-3">
        <p className="font-semibold">Arquivos recentes</p>
        <p className="text-sm text-muted-foreground">Selecione um arquivo para visualizar.</p>
      </div>

      <div className="grid gap-1">
        {files.map((file, index) => (
          <button
            className="flex items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            key={file.id}
            onClick={() => openFile(index)}
            type="button"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
              <FileTypeIcon file={file} className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{file.name}</span>
              <span className="block text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
            </span>
            <span className="text-xs font-medium text-muted-foreground">Visualizar</span>
          </button>
        ))}
      </div>

      <FileViewer
        activeIndex={activeIndex}
        files={files}
        onActiveIndexChange={setActiveIndex}
        onOpenChange={setOpen}
        open={open}
        resolveFile={resolveDemoFile}
      />
    </div>
  );
}
