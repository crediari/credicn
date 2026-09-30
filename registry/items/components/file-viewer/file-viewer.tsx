"use client";

import type { CellValue } from "exceljs";
import {
  AlertCircle,
  Archive,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  File,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  LoaderCircle,
  Maximize2,
  Presentation,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type FileSource = string | Blob | ArrayBuffer | Uint8Array;

type FileViewerFile = {
  id?: string | number;
  name: string;
  size?: number;
  type?: string;
  source?: FileSource;
};

type FilePreviewKind = "image" | "pdf" | "video" | "audio" | "text" | "spreadsheet" | "unsupported";

type FileViewerRenderContext = {
  file: FileViewerFile;
  kind: FilePreviewKind;
  source: FileSource;
  sourceUrl: string;
};

type FileViewerLabels = {
  close: string;
  download: string;
  loading: string;
  next: string;
  previous: string;
  unsupportedDescription: string;
  unsupportedTitle: string;
};

type FileViewerProps = {
  files: FileViewerFile[];
  open?: boolean;
  defaultOpen?: boolean;
  activeIndex?: number;
  defaultActiveIndex?: number;
  className?: string;
  labels?: Partial<FileViewerLabels>;
  resolveFile?: (file: FileViewerFile, signal: AbortSignal) => FileSource | Promise<FileSource>;
  onActiveIndexChange?: (index: number) => void;
  onDownload?: (file: FileViewerFile) => void | Promise<void>;
  onError?: (error: unknown, file: FileViewerFile) => void;
  onOpenChange?: (open: boolean) => void;
  renderPreview?: (context: FileViewerRenderContext) => ReactNode;
};

type ScrollLockSnapshot = {
  bodyLeft: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
  bodyPosition: string;
  bodyRight: string;
  bodyTop: string;
  bodyWidth: string;
  htmlOverflow: string;
  scrollX: number;
  scrollY: number;
};

let scrollLockCount = 0;
let scrollLockSnapshot: ScrollLockSnapshot | null = null;

const defaultLabels: FileViewerLabels = {
  close: "Fechar",
  download: "Baixar arquivo",
  loading: "Carregando visualização...",
  next: "Próximo arquivo",
  previous: "Arquivo anterior",
  unsupportedDescription:
    "Este formato não pode ser exibido no navegador, mas você ainda pode baixá-lo.",
  unsupportedTitle: "Pré-visualização indisponível",
};

const extensionGroups = {
  image: ["avif", "bmp", "gif", "ico", "jpeg", "jpg", "png", "svg", "webp"],
  pdf: ["pdf"],
  video: ["m4v", "mov", "mp4", "ogv", "webm"],
  audio: ["aac", "flac", "m4a", "mp3", "oga", "ogg", "wav"],
  text: [
    "css",
    "env",
    "html",
    "ini",
    "java",
    "js",
    "json",
    "jsx",
    "log",
    "md",
    "mdx",
    "py",
    "sql",
    "toml",
    "ts",
    "tsx",
    "txt",
    "xml",
    "yaml",
    "yml",
  ],
  spreadsheet: ["csv", "tsv", "xlsx", "xlsm"],
} satisfies Record<Exclude<FilePreviewKind, "unsupported">, string[]>;

const extensionKinds: [Exclude<FilePreviewKind, "unsupported">, readonly string[]][] = [
  ["image", extensionGroups.image],
  ["pdf", extensionGroups.pdf],
  ["video", extensionGroups.video],
  ["audio", extensionGroups.audio],
  ["text", extensionGroups.text],
  ["spreadsheet", extensionGroups.spreadsheet],
];

const mimeGroups: [FilePreviewKind, string][] = [
  ["spreadsheet", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ["spreadsheet", "application/vnd.ms-excel.sheet.macroenabled.12"],
  ["spreadsheet", "text/csv"],
  ["spreadsheet", "text/tab-separated-values"],
  ["image", "image/"],
  ["video", "video/"],
  ["audio", "audio/"],
  ["pdf", "application/pdf"],
  ["text", "text/"],
];

function getExtension(name: string) {
  return name.includes(".") ? (name.split(".").pop()?.toLowerCase() ?? "") : "";
}

function getFilePreviewKind(file: Pick<FileViewerFile, "name" | "type">): FilePreviewKind {
  const extension = getExtension(file.name);
  const byExtension = extensionKinds.find(([, values]) => values.includes(extension))?.[0];

  if (byExtension) return byExtension;

  const mimeType = file.type?.toLowerCase() ?? "";
  return mimeGroups.find(([, prefix]) => mimeType.startsWith(prefix))?.[0] ?? "unsupported";
}

function formatFileSize(size?: number) {
  if (size === undefined) return null;
  if (size === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / 1024 ** unitIndex;

  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: value < 10 ? 1 : 0 }).format(value)} ${units[unitIndex]}`;
}

function sourceToBlob(source: Exclude<FileSource, string>, type?: string) {
  if (source instanceof Blob) return source;
  if (source instanceof ArrayBuffer) return new Blob([source], { type });

  const copy = new ArrayBuffer(source.byteLength);
  new Uint8Array(copy).set(source);
  return new Blob([copy], { type });
}

async function sourceToArrayBuffer(source: FileSource, signal?: AbortSignal) {
  if (typeof source === "string") {
    const response = await fetch(source, { signal });
    if (!response.ok) throw new Error(`Could not load file (${response.status})`);
    return response.arrayBuffer();
  }

  if (source instanceof Blob) return source.arrayBuffer();
  if (source instanceof ArrayBuffer) return source;
  const copy = new ArrayBuffer(source.byteLength);
  new Uint8Array(copy).set(source);
  return copy;
}

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  const setValue = useCallback(
    (nextValue: T) => {
      if (value === undefined) setInternalValue(nextValue);
      onChange?.(nextValue);
    },
    [onChange, value],
  );

  return [currentValue, setValue] as const;
}

function lockDocumentScroll() {
  scrollLockCount += 1;
  if (scrollLockCount > 1) return;

  const { body, documentElement } = document;
  const scrollbarWidth = Math.max(0, window.innerWidth - documentElement.clientWidth);
  const bodyPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

  scrollLockSnapshot = {
    bodyLeft: body.style.left,
    bodyOverflow: body.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
    bodyPosition: body.style.position,
    bodyRight: body.style.right,
    bodyTop: body.style.top,
    bodyWidth: body.style.width,
    htmlOverflow: documentElement.style.overflow,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  };

  documentElement.style.overflow = "hidden";
  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${scrollLockSnapshot.scrollY}px`;
  body.style.left = `-${scrollLockSnapshot.scrollX}px`;
  body.style.right = "0";
  body.style.width = "100%";
  if (scrollbarWidth > 0) body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;
}

function unlockDocumentScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount > 0 || !scrollLockSnapshot) return;

  const { body, documentElement } = document;
  const snapshot = scrollLockSnapshot;
  scrollLockSnapshot = null;

  documentElement.style.overflow = snapshot.htmlOverflow;
  body.style.overflow = snapshot.bodyOverflow;
  body.style.position = snapshot.bodyPosition;
  body.style.top = snapshot.bodyTop;
  body.style.left = snapshot.bodyLeft;
  body.style.right = snapshot.bodyRight;
  body.style.width = snapshot.bodyWidth;
  body.style.paddingRight = snapshot.bodyPaddingRight;
  window.scrollTo(snapshot.scrollX, snapshot.scrollY);
}

function FileViewer({
  files,
  open: controlledOpen,
  defaultOpen = false,
  activeIndex: controlledActiveIndex,
  defaultActiveIndex = 0,
  className,
  labels: labelOverrides,
  resolveFile,
  onActiveIndexChange,
  onDownload,
  onError,
  onOpenChange,
  renderPreview,
}: FileViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [activeIndex, setActiveIndex] = useControllableState({
    value: controlledActiveIndex,
    defaultValue: defaultActiveIndex,
    onChange: onActiveIndexChange,
  });
  const [resolvedSource, setResolvedSource] = useState<FileSource | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const labels = { ...defaultLabels, ...labelOverrides };
  const safeIndex = files.length ? Math.min(Math.max(activeIndex, 0), files.length - 1) : 0;
  const currentFile = files[safeIndex];
  const previewKind = currentFile ? getFilePreviewKind(currentFile) : "unsupported";
  const canNavigate = files.length > 1;

  useEffect(() => {
    if (!open) return undefined;
    lockDocumentScroll();
    return unlockDocumentScroll;
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (activeIndex !== safeIndex) setActiveIndex(safeIndex);
  }, [activeIndex, safeIndex, setActiveIndex]);

  useEffect(() => {
    setImageZoom(1);
    setImageRotation(0);
  }, [safeIndex]);

  useEffect(() => {
    if (!open || !currentFile) return undefined;

    const controller = new AbortController();
    let objectUrl = "";

    async function loadFile() {
      setIsLoading(true);
      setLoadError(null);
      setResolvedSource(null);
      setSourceUrl("");

      try {
        const nextSource =
          currentFile.source ?? (await resolveFile?.(currentFile, controller.signal));
        if (nextSource === undefined) throw new Error("No source was provided for this file");
        if (controller.signal.aborted) return;

        setResolvedSource(nextSource);
        if (typeof nextSource === "string") {
          setSourceUrl(nextSource);
        } else {
          objectUrl = URL.createObjectURL(sourceToBlob(nextSource, currentFile.type));
          setSourceUrl(objectUrl);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoadError(error);
        onError?.(error, currentFile);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadFile();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [currentFile, onError, open, resolveFile]);

  const move = useCallback(
    (direction: -1 | 1) => {
      if (!files.length) return;
      setActiveIndex((safeIndex + direction + files.length) % files.length);
    },
    [files.length, safeIndex, setActiveIndex],
  );

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (event.key === "ArrowLeft" && canNavigate) move(-1);
      if (event.key === "ArrowRight" && canNavigate) move(1);
      if (previewKind === "image" && (event.key === "+" || event.key === "=")) {
        setImageZoom((value) => Math.min(value + 0.25, 4));
      }
      if (previewKind === "image" && event.key === "-") {
        setImageZoom((value) => Math.max(value - 0.25, 0.25));
      }
      if (previewKind === "image" && event.key.toLowerCase() === "r") {
        setImageRotation((value) => (value + 90) % 360);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canNavigate, move, open, previewKind]);

  async function handleDownload() {
    if (!currentFile || !resolvedSource) return;
    setIsDownloading(true);

    try {
      if (onDownload) {
        await onDownload(currentFile);
        return;
      }

      const link = document.createElement("a");
      link.download = currentFile.name;
      link.href = sourceUrl;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      onError?.(error, currentFile);
    } finally {
      setIsDownloading(false);
    }
  }

  const customPreview =
    currentFile && resolvedSource && sourceUrl
      ? renderPreview?.({ file: currentFile, kind: previewKind, source: resolvedSource, sourceUrl })
      : null;

  return (
    <dialog
      aria-label={currentFile ? `Visualização de ${currentFile.name}` : "Visualizador de arquivos"}
      className={cn(
        "fixed inset-0 z-50 m-0 hidden h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-foreground backdrop:bg-black/72 backdrop:backdrop-blur-sm open:flex",
        className,
      )}
      onCancel={(event) => {
        event.preventDefault();
        setOpen(false);
      }}
      onClose={() => setOpen(false)}
      ref={dialogRef}
    >
      <div className="flex min-h-0 w-full flex-col bg-background/96 shadow-2xl supports-[backdrop-filter]:bg-background/92">
        <header className="flex min-h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-3 py-2 backdrop-blur-xl sm:px-5">
          <FileTypeIcon file={currentFile} className="size-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold sm:text-base">
              {currentFile?.name ?? "Nenhum arquivo"}
            </h2>
            <p className="flex gap-2 text-xs text-muted-foreground">
              {formatFileSize(currentFile?.size) && (
                <span>{formatFileSize(currentFile?.size)}</span>
              )}
              {canNavigate && (
                <span>
                  {safeIndex + 1} de {files.length}
                </span>
              )}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            {previewKind === "image" && (
              <>
                <ViewerButton
                  label="Diminuir zoom"
                  disabled={imageZoom <= 0.25}
                  onClick={() => setImageZoom((value) => Math.max(value - 0.25, 0.25))}
                >
                  <ZoomOut />
                </ViewerButton>
                <span className="hidden min-w-11 text-center text-xs text-muted-foreground tabular-nums sm:block">
                  {Math.round(imageZoom * 100)}%
                </span>
                <ViewerButton
                  label="Aumentar zoom"
                  disabled={imageZoom >= 4}
                  onClick={() => setImageZoom((value) => Math.min(value + 0.25, 4))}
                >
                  <ZoomIn />
                </ViewerButton>
                <ViewerButton
                  label="Girar imagem"
                  onClick={() => setImageRotation((value) => (value + 90) % 360)}
                >
                  <RotateCw />
                </ViewerButton>
                <ViewerButton
                  label="Redefinir visualização"
                  className="hidden sm:inline-flex"
                  onClick={() => {
                    setImageZoom(1);
                    setImageRotation(0);
                  }}
                >
                  <Maximize2 />
                </ViewerButton>
                <div className="mx-1 h-5 w-px bg-border" />
              </>
            )}

            <ViewerButton
              label={labels.download}
              disabled={!resolvedSource || isDownloading}
              onClick={() => void handleDownload()}
            >
              {isDownloading ? <LoaderCircle className="animate-spin" /> : <Download />}
            </ViewerButton>
            <ViewerButton label={labels.close} onClick={() => setOpen(false)}>
              <X />
            </ViewerButton>
          </div>
        </header>

        <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-muted/35">
          {isLoading && (
            <ViewerMessage
              icon={<LoaderCircle className="animate-spin" />}
              title={labels.loading}
            />
          )}

          {!isLoading && Boolean(loadError) && (
            <ViewerMessage
              icon={<AlertCircle />}
              title="Não foi possível carregar o arquivo"
              description={loadError instanceof Error ? loadError.message : undefined}
            />
          )}

          {!isLoading && !loadError && currentFile && resolvedSource && sourceUrl && (
            <div className="h-full w-full">{customPreview ?? renderBuiltInPreview()}</div>
          )}

          {!isLoading && !loadError && !currentFile && (
            <ViewerMessage icon={<File />} title="Nenhum arquivo para visualizar" />
          )}

          {canNavigate && (
            <>
              <ViewerButton
                label={labels.previous}
                className="absolute top-1/2 left-3 z-10 size-11 -translate-y-1/2 rounded-full border bg-background/90 shadow-lg backdrop-blur-sm"
                onClick={() => move(-1)}
              >
                <ChevronLeft />
              </ViewerButton>
              <ViewerButton
                label={labels.next}
                className="absolute top-1/2 right-3 z-10 size-11 -translate-y-1/2 rounded-full border bg-background/90 shadow-lg backdrop-blur-sm"
                onClick={() => move(1)}
              >
                <ChevronRight />
              </ViewerButton>
            </>
          )}
        </main>
      </div>
    </dialog>
  );

  function renderBuiltInPreview() {
    if (!currentFile || !resolvedSource) return null;

    if (previewKind === "image") {
      return (
        <div className="flex h-full w-full items-center justify-center overflow-auto p-6 sm:p-12">
          <img
            alt={currentFile.name}
            className="max-h-full max-w-full rounded-sm object-contain shadow-2xl transition-transform duration-200"
            draggable={false}
            src={sourceUrl}
            style={{ transform: `scale(${imageZoom}) rotate(${imageRotation}deg)` }}
          />
        </div>
      );
    }

    if (previewKind === "pdf") {
      return (
        <iframe
          className="h-full w-full border-0 bg-white"
          sandbox="allow-same-origin"
          src={sourceUrl}
          title={currentFile.name}
        />
      );
    }

    if (previewKind === "video") {
      return (
        <div className="flex h-full items-center justify-center p-6 sm:p-12">
          <video
            className="max-h-full max-w-full rounded-xl bg-black shadow-2xl"
            controls
            src={sourceUrl}
          >
            <track kind="captions" src={emptyCaptionsUrl} srcLang="pt-BR" />
            Seu navegador não suporta a reprodução deste vídeo.
          </video>
        </div>
      );
    }

    if (previewKind === "audio") {
      return (
        <div className="flex h-full items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-3xl border bg-background p-8 text-center shadow-xl">
            <FileAudio className="mx-auto mb-5 size-14 text-muted-foreground" />
            <p className="mb-6 truncate font-medium">{currentFile.name}</p>
            <audio className="w-full" controls src={sourceUrl}>
              <track kind="captions" src={emptyCaptionsUrl} srcLang="pt-BR" />
              Seu navegador não suporta a reprodução deste áudio.
            </audio>
          </div>
        </div>
      );
    }

    if (previewKind === "text") {
      return <TextPreview source={resolvedSource} />;
    }

    if (previewKind === "spreadsheet") {
      return (
        <SpreadsheetPreview extension={getExtension(currentFile.name)} source={resolvedSource} />
      );
    }

    return (
      <ViewerMessage
        icon={<AlertCircle />}
        title={labels.unsupportedTitle}
        description={labels.unsupportedDescription}
        action={
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            disabled={isDownloading}
            onClick={() => void handleDownload()}
            type="button"
          >
            {isDownloading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {labels.download}
          </button>
        }
      />
    );
  }
}

function ViewerButton({
  label,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
        className,
      )}
      title={label}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

function ViewerMessage({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-6 flex max-w-md flex-col items-center rounded-3xl border bg-background/95 p-8 text-center shadow-xl">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground [&_svg]:size-7">
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

function TextPreview({ source }: { source: FileSource }) {
  const [content, setContent] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadText() {
      try {
        const buffer = await sourceToArrayBuffer(source, controller.signal);
        if (buffer.byteLength > 5_000_000)
          throw new Error("O arquivo de texto excede o limite de 5 MB.");
        if (!controller.signal.aborted) {
          setContent(new TextDecoder().decode(buffer));
          setIsReady(true);
        }
      } catch (nextError) {
        if (!controller.signal.aborted) setError(nextError);
      }
    }

    void loadText();
    return () => controller.abort();
  }, [source]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <ViewerMessage
          icon={<AlertCircle />}
          title="Não foi possível ler o arquivo"
          description={error instanceof Error ? error.message : undefined}
        />
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderCircle className="size-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4 sm:p-8">
      <pre className="mx-auto min-h-full max-w-6xl overflow-x-auto rounded-2xl border bg-background p-5 font-mono text-xs leading-relaxed shadow-sm sm:text-sm">
        <code>{content}</code>
      </pre>
    </div>
  );
}

function SpreadsheetPreview({ source, extension }: { source: FileSource; extension: string }) {
  const [sheets, setSheets] = useState<{ name: string; rows: string[][] }[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSpreadsheet() {
      try {
        const buffer = await sourceToArrayBuffer(source, controller.signal);
        let nextSheets: { name: string; rows: string[][] }[];

        if (extension === "csv" || extension === "tsv") {
          const text = new TextDecoder().decode(buffer);
          nextSheets = [
            {
              name: "Dados",
              rows: parseDelimitedText(text, extension === "tsv" ? "\t" : undefined),
            },
          ];
        } else {
          const { Workbook } = await import("exceljs");
          const workbook = new Workbook();
          await workbook.xlsx.load(buffer);
          nextSheets = workbook.worksheets.map((worksheet) => {
            const rows: string[][] = [];
            worksheet.eachRow({ includeEmpty: true }, (row) => {
              const values = Array.isArray(row.values) ? row.values.slice(1) : [];
              rows.push(values.map((cell) => formatCellValue(cell)));
            });
            return { name: worksheet.name, rows };
          });
        }

        if (!controller.signal.aborted) {
          setSheets(nextSheets);
          setActiveSheet(0);
          setIsReady(true);
        }
      } catch (nextError) {
        if (!controller.signal.aborted) setError(nextError);
      }
    }

    void loadSpreadsheet();
    return () => controller.abort();
  }, [extension, source]);

  const sheet = sheets[activeSheet];
  const columnCount = useMemo(
    () => Math.min(Math.max(0, ...(sheet?.rows.map((row) => row.length) ?? [])), 50),
    [sheet],
  );

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <ViewerMessage
          icon={<AlertCircle />}
          title="Não foi possível ler a planilha"
          description={error instanceof Error ? error.message : undefined}
        />
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderCircle className="size-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!sheet) {
    return (
      <div className="flex h-full items-center justify-center">
        <ViewerMessage icon={<FileSpreadsheet />} title="A planilha não possui abas visíveis" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-max min-w-full border-separate border-spacing-0 text-xs">
          <thead className="sticky top-0 z-10 bg-muted">
            <tr>
              <th className="sticky left-0 z-20 h-8 min-w-12 border-r border-b bg-muted px-2" />
              {Array.from({ length: columnCount }, (_, index) => (
                <th
                  className="h-8 min-w-28 border-r border-b px-3 text-center font-medium text-muted-foreground"
                  key={index}
                >
                  {columnLabel(index)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.slice(0, 1_000).map((row, rowIndex) => (
              <tr key={JSON.stringify(row)}>
                <th className="sticky left-0 z-10 h-8 border-r border-b bg-muted px-2 text-center font-medium text-muted-foreground">
                  {rowIndex + 1}
                </th>
                {Array.from({ length: columnCount }, (_, cellIndex) => (
                  <td
                    className="max-w-80 truncate border-r border-b bg-background px-3 py-2"
                    key={cellIndex}
                    title={row[cellIndex]}
                  >
                    {row[cellIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sheets.length > 1 && (
        <div className="flex shrink-0 gap-1 overflow-x-auto border-t bg-muted/60 px-3 py-2">
          {sheets.map((item, index) => (
            <button
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-background data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-sm"
              data-active={activeSheet === index}
              key={item.name}
              onClick={() => setActiveSheet(index)}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function parseDelimitedText(input: string, forcedDelimiter?: string) {
  const delimiter = forcedDelimiter ?? detectDelimiter(input);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (character === '"') {
      if (quoted && input[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && input[index + 1] === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function detectDelimiter(input: string) {
  const firstLine = input.split(/\r?\n/, 1)[0] ?? "";
  const candidates = [",", ";", "\t"];
  return candidates.toSorted((a, b) => firstLine.split(b).length - firstLine.split(a).length)[0];
}

function formatCellValue(value: CellValue): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value !== "object") return String(value);
  if ("richText" in value) return value.richText.map((part) => part.text).join("");
  if ("text" in value) return value.text;
  if ("result" in value) return formatCellValue(value.result);
  if ("error" in value) return value.error;
  return JSON.stringify(value);
}

function columnLabel(index: number) {
  let label = "";
  let value = index + 1;
  while (value > 0) {
    value -= 1;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }
  return label;
}

const emptyCaptionsUrl = "data:text/vtt;charset=utf-8,WEBVTT";

function FileTypeIcon({
  file,
  className,
  style,
}: {
  file?: Pick<FileViewerFile, "name" | "type">;
  className?: string;
  style?: CSSProperties;
}) {
  if (!file) return <File className={className} style={style} />;

  const kind = getFilePreviewKind(file);
  const extension = getExtension(file.name);
  const iconProps = { className, style };

  if (kind === "image") return <FileImage {...iconProps} />;
  if (kind === "video") return <FileVideo {...iconProps} />;
  if (kind === "audio") return <FileAudio {...iconProps} />;
  if (kind === "spreadsheet" || ["xls", "xlsb", "ods"].includes(extension)) {
    return <FileSpreadsheet {...iconProps} />;
  }
  if (kind === "text" && ["js", "jsx", "ts", "tsx", "html", "css", "json"].includes(extension)) {
    return <Code2 {...iconProps} />;
  }
  if (kind === "pdf" || ["doc", "docx", "odt", "rtf"].includes(extension)) {
    return <FileText {...iconProps} />;
  }
  if (["ppt", "pptx", "odp"].includes(extension)) return <Presentation {...iconProps} />;
  if (["7z", "gz", "rar", "tar", "zip"].includes(extension)) return <Archive {...iconProps} />;
  return <File {...iconProps} />;
}

export {
  FileTypeIcon,
  FileViewer,
  formatFileSize,
  getFilePreviewKind,
  type FilePreviewKind,
  type FileSource,
  type FileViewerFile,
  type FileViewerLabels,
  type FileViewerProps,
  type FileViewerRenderContext,
};
