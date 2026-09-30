import {
  LockKeyhole,
  SearchX,
  ServerCrash,
  ShieldX,
  TriangleAlert,
  WifiOff,
  Wrench,
} from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";

import { Button } from "@/components/ui/button";

type ErrorPageVariant =
  | "generic"
  | "not-found"
  | "server-error"
  | "forbidden"
  | "unauthorized"
  | "offline"
  | "maintenance";

type ErrorPageButton = {
  label: string;
  url: string;
  variant?: "outline" | "default";
};

type GenericErrorPageProps = {
  variant?: ErrorPageVariant;
  title?: string;
  description?: string;
  buttons?: ErrorPageButton[];
  illustration?: ReactNode;
  className?: string;
};

type VariantContent = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const variantContent: Record<ErrorPageVariant, VariantContent> = {
  generic: {
    code: "Ops",
    eyebrow: "Algo deu errado",
    title: "Não foi possível concluir esta ação",
    description: "Tente novamente em alguns instantes ou volte para uma página conhecida.",
    icon: TriangleAlert,
  },
  "not-found": {
    code: "404",
    eyebrow: "Página não encontrada",
    title: "Parece que não há nada por aqui",
    description:
      "O endereço pode estar incorreto, ter mudado ou o conteúdo não está mais disponível.",
    icon: SearchX,
  },
  "server-error": {
    code: "500",
    eyebrow: "Erro interno",
    title: "O servidor encontrou um problema",
    description:
      "Nossa aplicação não conseguiu responder agora. Tente novamente dentro de alguns instantes.",
    icon: ServerCrash,
  },
  forbidden: {
    code: "403",
    eyebrow: "Acesso negado",
    title: "Você não pode acessar esta página",
    description:
      "Sua conta não tem permissão para visualizar este conteúdo. Fale com um administrador se precisar de acesso.",
    icon: ShieldX,
  },
  unauthorized: {
    code: "401",
    eyebrow: "Autenticação necessária",
    title: "Entre para continuar",
    description: "Sua sessão pode ter expirado. Faça login novamente para acessar este conteúdo.",
    icon: LockKeyhole,
  },
  offline: {
    code: "Offline",
    eyebrow: "Sem conexão",
    title: "Não foi possível acessar a internet",
    description: "Verifique sua conexão e tente novamente quando estiver online.",
    icon: WifiOff,
  },
  maintenance: {
    code: "503",
    eyebrow: "Manutenção programada",
    title: "Voltaremos em breve",
    description:
      "Estamos fazendo alguns ajustes para melhorar sua experiência. Tente novamente mais tarde.",
    icon: Wrench,
  },
};

function ErrorIllustration({ variant }: { variant: ErrorPageVariant }) {
  const content = variantContent[variant];
  const Icon = content.icon;

  return (
    <div
      className="relative mx-auto flex aspect-[4/3] w-full max-w-sm items-center justify-center"
      aria-hidden="true"
    >
      <div className="absolute inset-x-8 bottom-8 h-8 rounded-[50%] bg-muted/70 blur-xl" />
      <svg
        className="absolute inset-0 size-full text-border"
        viewBox="0 0 360 270"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M42 212C76 163 77 96 136 58C190 23 269 55 310 112C347 163 309 225 248 235C187 245 119 235 42 212Z"
          fill="currentColor"
          fillOpacity=".35"
        />
        <path
          d="M34 90L47 77M47 90L34 77M307 61L320 48M320 61L307 48"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="316" cy="183" r="7" fill="currentColor" />
        <circle cx="68" cy="52" r="5" fill="currentColor" />
        <path d="M64 226H297" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="relative flex size-44 rotate-[-3deg] flex-col items-center justify-center rounded-[2.5rem] border bg-card shadow-xl shadow-foreground/5">
        <div className="absolute -top-4 -right-4 flex size-14 rotate-12 items-center justify-center rounded-2xl border bg-background shadow-sm">
          <span className="text-xs font-bold tracking-tight text-muted-foreground">
            {content.code}
          </span>
        </div>
        <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-8 ring-primary/5">
          <Icon className="size-10" strokeWidth={1.7} />
        </div>
        <div className="mt-7 h-2 w-20 rounded-full bg-muted" />
        <div className="mt-2 h-2 w-12 rounded-full bg-muted" />
      </div>
    </div>
  );
}

function GenericErrorPage({
  variant = "generic",
  title,
  description,
  buttons,
  illustration,
  className,
}: GenericErrorPageProps) {
  const content = variantContent[variant];
  const hasButtons = Boolean(buttons?.length);

  return (
    <main
      className={`flex min-h-full w-full items-center justify-center px-6 py-12 sm:px-10 ${className ?? ""}`}
      data-error-variant={variant}
    >
      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            {content.eyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            {title ?? content.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-pretty text-muted-foreground lg:mx-0">
            {description ?? content.description}
          </p>

          {hasButtons ? (
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              {buttons?.map((button, index) => (
                <Button
                  key={`${button.url}-${button.label}`}
                  variant={button.variant ?? (index === 0 ? "default" : "outline")}
                  size="lg"
                  render={<a href={button.url} />}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="order-1 lg:order-2">
          {illustration ?? <ErrorIllustration variant={variant} />}
        </div>
      </div>
    </main>
  );
}

export {
  GenericErrorPage,
  type ErrorPageButton,
  type ErrorPageVariant,
  type GenericErrorPageProps,
};
