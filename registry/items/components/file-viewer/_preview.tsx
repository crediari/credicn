"use client";

import { useState } from "react";

import {
  FileTypeIcon,
  FileViewer,
  formatFileSize,
  type FileSource,
  type FileViewerFile,
} from "./file-viewer";

type DemoFile = FileViewerFile & { scenario: string; group: string };

const examplesPath = "/examples/file-viewer";

const groups = [
  "Imagens",
  "Documentos e mídia",
  "Planilhas",
  "Texto e código",
  "Estados e limites",
];

const examples: DemoFile[] = [
  {
    id: "image",
    group: "Imagens",
    scenario: "Paisagem horizontal: zoom e rotação",
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
    group: "Planilhas",
    scenario: "CSV com números e cabeçalho",
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
    group: "Texto e código",
    scenario: "Markdown exibido como texto",
    name: "leia-me.md",
    size: 238,
    type: "text/markdown",
    source: encodeDataUrl(
      "# Visualizador de arquivos\n\nUse as setas para navegar entre os anexos. Nas imagens, use scroll ou + e - para zoom, R para girar e 0 para redefinir; textos, CSV e planilhas Excel são processados localmente no navegador.",
      "text/markdown",
    ),
  },
  {
    id: "excel",
    group: "Planilhas",
    scenario: "Três abas, datas, fórmulas e 150 linhas",
    name: "planejamento.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  {
    id: "portrait",
    name: "retrato.svg",
    type: "image/svg+xml",
    source: `${examplesPath}/retrato.svg`,
    group: "Imagens",
    scenario: "Imagem vertical para testar enquadramento",
  },
  {
    id: "transparent",
    name: "transparente.svg",
    type: "image/svg+xml",
    source: `${examplesPath}/transparente.svg`,
    group: "Imagens",
    scenario: "Transparência sobre o overlay escuro",
  },
  {
    id: "pdf",
    name: "relatorio.pdf",
    type: "application/pdf",
    source: `${examplesPath}/relatorio.pdf`,
    group: "Documentos e mídia",
    scenario: "PDF de duas páginas",
  },
  {
    id: "audio",
    name: "notificacao.wav",
    type: "audio/wav",
    source: `${examplesPath}/notificacao.wav`,
    group: "Documentos e mídia",
    scenario: "Áudio de dois segundos com controles nativos",
  },
  {
    id: "video",
    name: "demonstracao.mp4",
    type: "video/mp4",
    source: `${examplesPath}/demonstracao.mp4`,
    group: "Documentos e mídia",
    scenario: "Vídeo de quatro segundos com controles nativos",
  },
  {
    id: "tsv",
    name: "equipe.tsv",
    type: "text/tab-separated-values",
    source: encodeDataUrl(
      "Nome\tÁrea\tStatus\nMarina\tTecnologia\tAtivo\nCarlos\tOperações\tAtivo\nLuiza\tDados\tFérias",
      "text/tab-separated-values",
    ),
    group: "Planilhas",
    scenario: "Dados separados por tabulação e acentos",
  },
  {
    id: "quoted-csv",
    name: "campos-especiais.csv",
    type: "text/csv",
    source: encodeDataUrl(
      'Nome;Observação;Valor\n"Silva, Ana";"Linha 1\nLinha 2";1250\nCarlos;"Texto com ""aspas""";980',
      "text/csv",
    ),
    group: "Planilhas",
    scenario: "CSV com ponto e vírgula, aspas e múltiplas linhas",
  },
  {
    id: "json",
    name: "configuracao.json",
    type: "application/json",
    source: encodeDataUrl(
      JSON.stringify(
        {
          app: "CrediAri",
          preview: {
            zoom: true,
            atalhos: ["Escape", "ArrowLeft", "ArrowRight", "+", "-", "R", "0"],
          },
        },
        null,
        2,
      ),
      "application/json",
    ),
    group: "Texto e código",
    scenario: "Código JSON com indentação",
  },
  {
    id: "long-text",
    name: "historico.log",
    type: "text/plain",
    source: encodeDataUrl(
      Array.from(
        { length: 180 },
        (_, i) =>
          `[2026-10-01 09:${String(i % 60).padStart(2, "0")}:00] INFO Evento ${i + 1}: processamento de arquivo concluído com sucesso.`,
      ).join("\n"),
      "text/plain",
    ),
    group: "Texto e código",
    scenario: "Texto longo com scroll",
  },
  {
    id: "empty-text",
    name: "vazio.txt",
    size: 0,
    type: "text/plain",
    source: encodeDataUrl("", "text/plain"),
    group: "Estados e limites",
    scenario: "Arquivo de texto vazio",
  },
  {
    id: "unsupported",
    name: "dados.zip",
    type: "application/zip",
    source: `${examplesPath}/dados.zip`,
    group: "Estados e limites",
    scenario: "Formato sem preview, disponível para download",
  },
  {
    id: "slow",
    name: "carregamento-lento.txt",
    type: "text/plain",
    group: "Estados e limites",
    scenario: "Carregamento simulado de dois segundos",
  },
  {
    id: "error",
    name: "falha-ao-carregar.txt",
    type: "text/plain",
    group: "Estados e limites",
    scenario: "Falha simulada na resolução do arquivo",
  },
  {
    id: "invalid-excel",
    name: "planilha-corrompida.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    source: encodeDataUrl("Conteúdo inválido para uma planilha XLSX", "application/octet-stream"),
    group: "Estados e limites",
    scenario: "Erro de leitura da planilha",
  },
  {
    id: "invalid-image",
    name: "imagem-corrompida.png",
    type: "image/png",
    source: encodeDataUrl("Conteúdo inválido para uma imagem", "image/png"),
    group: "Estados e limites",
    scenario: "Erro de leitura da imagem",
  },
];

const files = groups.flatMap((group) => examples.filter((file) => file.group === group));

function encodeDataUrl(content: string, mimeType: string) {
  return `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
}

async function resolveDemoFile(file: FileViewerFile, signal: AbortSignal): Promise<FileSource> {
  if (file.id === "error") throw new Error("Falha simulada: não foi possível obter o anexo.");
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
    return new Blob(
      ["Arquivo carregado! Navegue durante o carregamento para testar o cancelamento."],
      { type: "text/plain" },
    );
  }
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

  const summary = workbook.addWorksheet("Resumo");
  summary.addRows([
    ["Indicador", "Valor"],
    ["Orçamento total", { formula: "SUM(Planejamento!D2:D4)", result: 252500 }],
    ["Atualizado em", new Date("2026-10-01T12:00:00Z")],
    ["Documentação", { text: "CrediAri", hyperlink: "https://crediari.com.br" }],
  ]);
  const history = workbook.addWorksheet("Histórico");
  history.addRow(["Registro", "Responsável", "Descrição", "Valor"]);
  for (let index = 0; index < 150; index += 1) {
    history.addRow([
      index + 1,
      ["Marina", "Carlos", "Luiza"][index % 3],
      `Lançamento de demonstração ${index + 1}`,
      (index + 1) * 125,
    ]);
  }
  return workbook.xlsx.writeBuffer();
}

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
        <p className="font-semibold">Explore o visualizador</p>
        <p className="text-sm text-muted-foreground">
          {files.length} exemplos para testar formatos, navegação e estados de erro.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Esc fecha · ← → navegam · Scroll e +/− ampliam · Clique e arraste move a imagem · R gira ·
          0 redefine
        </p>
      </div>

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
          Testar visualizador sem arquivos
        </button>
      </div>

      <FileViewer
        activeIndex={activeIndex}
        files={empty ? [] : files}
        onActiveIndexChange={setActiveIndex}
        onOpenChange={setOpen}
        open={open}
        resolveFile={resolveDemoFile}
      />
    </div>
  );
}
