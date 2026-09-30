"use client";

import { FileCodeIcon, FileTextIcon, ImageIcon, XIcon } from "lucide-react";
import { useState } from "react";

import {
  FileCard,
  FileCardAction,
  FileCardActions,
  FileCardContent,
  FileCardDescription,
  FileCardGroup,
  FileCardMedia,
  FileCardTitle,
  FileCardTrigger,
} from "./file-card";

const imagePreview =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#c7d2fe"/><stop offset="1" stop-color="#99f6e4"/></linearGradient></defs><rect width="480" height="480" fill="url(#bg)"/><circle cx="360" cy="112" r="52" fill="#fcd34d"/><path d="M0 390 115 215l93 110 98-155 82 119 92-96v287H0z" fill="#0f766e"/><path d="M0 430 140 310l84 83 105-94 71 70 80-50v161H0z" fill="#115e59" opacity=".72"/></svg>`,
  );

const states = [
  { state: "idle", name: "arquivo-selecionado.pdf", description: "Pronto para enviar" },
  { state: "uploading", name: "design-system.zip", description: "Enviando · 64%" },
  { state: "processing", name: "pesquisa-de-mercado.pdf", description: "Processando documento" },
  {
    state: "error",
    name: "modelo-financeiro.xlsx",
    description: "Falha no envio. Tente novamente.",
  },
  { state: "done", name: "relatorio-enviado.pdf", description: "Enviado · 1,8 MB" },
] as const;

export function Preview() {
  const [feedback, setFeedback] = useState("Selecione um anexo ou uma ação para testar o card.");

  return (
    <div className="grid w-full max-w-3xl gap-8">
      <Example label="Estados">
        <div className="grid gap-2">
          {states.map(({ state, name, description }) => (
            <FileCard key={state} state={state}>
              <FileCardMedia>
                <FileTextIcon />
              </FileCardMedia>
              <FileCardContent>
                <FileCardTitle>{name}</FileCardTitle>
                <FileCardDescription>{description}</FileCardDescription>
              </FileCardContent>
              <FileCardActions>
                <FileCardAction
                  aria-label={`Remover ${name}`}
                  onClick={() => setFeedback(`Remover: ${name}`)}
                >
                  <XIcon />
                </FileCardAction>
              </FileCardActions>
            </FileCard>
          ))}
        </div>
      </Example>

      <Example label="Tamanhos">
        <div className="grid gap-2">
          {(["default", "sm", "xs"] as const).map((size) => (
            <FileCard key={size} size={size}>
              <FileCardMedia>
                <FileCodeIcon />
              </FileCardMedia>
              <FileCardContent>
                <FileCardTitle>{size === "default" ? "Padrão" : size.toUpperCase()}</FileCardTitle>
                {size !== "xs" && <FileCardDescription>TSX · 12 KB</FileCardDescription>}
              </FileCardContent>
            </FileCard>
          ))}
        </div>
      </Example>

      <Example label="Grupo e imagem vertical">
        <FileCardGroup aria-label="Anexos do projeto" role="group" tabIndex={0}>
          <FileCard>
            <FileCardMedia>
              <FileTextIcon />
            </FileCardMedia>
            <FileCardContent>
              <FileCardTitle>briefing.pdf</FileCardTitle>
              <FileCardDescription>PDF · 1,4 MB</FileCardDescription>
            </FileCardContent>
          </FileCard>

          <FileCard orientation="vertical">
            <FileCardMedia variant="image">
              <img alt="Paisagem ilustrada" src={imagePreview} />
            </FileCardMedia>
            <FileCardContent>
              <FileCardTitle>paisagem.png</FileCardTitle>
              <FileCardDescription>PNG · 820 KB</FileCardDescription>
            </FileCardContent>
            <FileCardActions>
              <FileCardAction
                aria-label="Remover paisagem.png"
                onClick={() => setFeedback("Remover: paisagem.png")}
              >
                <XIcon />
              </FileCardAction>
            </FileCardActions>
          </FileCard>

          <FileCard>
            <FileCardMedia>
              <ImageIcon />
            </FileCardMedia>
            <FileCardContent>
              <FileCardTitle>wireframe.svg</FileCardTitle>
              <FileCardDescription>SVG · 46 KB</FileCardDescription>
            </FileCardContent>
          </FileCard>
        </FileCardGroup>
      </Example>

      <Example label="Card interativo">
        <FileCard className="min-w-72">
          <FileCardMedia>
            <FileTextIcon />
          </FileCardMedia>
          <FileCardContent>
            <FileCardTitle>resumo-da-pesquisa.pdf</FileCardTitle>
            <FileCardDescription>Abrir pré-visualização</FileCardDescription>
          </FileCardContent>
          <FileCardActions>
            <FileCardAction
              aria-label="Remover resumo-da-pesquisa.pdf"
              onClick={() => setFeedback("Remover: resumo-da-pesquisa.pdf")}
            >
              <XIcon />
            </FileCardAction>
          </FileCardActions>
          <FileCardTrigger
            aria-label="Visualizar resumo-da-pesquisa.pdf"
            onClick={() => setFeedback("Visualizar: resumo-da-pesquisa.pdf")}
          />
        </FileCard>
      </Example>

      <p aria-live="polite" className="min-h-5 text-xs text-muted-foreground">
        {feedback}
      </p>
    </div>
  );
}

function Example({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </section>
  );
}
