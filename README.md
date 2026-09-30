# credicn

<p align="center">
  <img src="docs/media/readme-dark.gif" alt="Crediari library homepage in dark theme with Ghost Fibers" />
</p>
<p align="center">
  <img src="docs/media/readme-light.gif" alt="Crediari library homepage in light theme with Scanner" />
</p>

The private CrediAri platform for organizing, documenting, and sharing our reusable UI components through a [shadcn-compatible registry](https://ui.shadcn.com/docs/registry).

The app uses [TanStack Start](https://tanstack.com/start/latest) and [Vite+](https://viteplus.dev/), with authored docs, live previews, syntax-highlighted source, schema validation, and package-manager install commands.

## Quick Start

Clone the CrediAri repository and ensure [Vite+](https://viteplus.dev/guide/) (`vp`) is installed on your system.

```bash
git clone https://github.com/crediari/credicn.git
cd credicn

# Install Vite+
curl -fsSL https://vite.plus | bash

# Setup and start local server
vp install
vp dev
```

Open the localhost URL from the Vite+ output to browse the docs, components, blocks, and utilities.

## Agent Skill

This repository includes an installable Agent Skill for authoring credicn registry items. Install it with the [Skills CLI](https://skills.sh/):

```bash
npx skills add crediari/credicn --skill shadcn-registry
```

After installing the skill, ask your agent for registry authoring work directly:

- "add a button component to the registry"
- "adapt this modal from my app to make it reusable via this shadcn registry"
- "add a reusable hook to the registry"
- "turn this dashboard section into a registry block"

## Usage

### Configuration

Edit `registry/config.ts`.

```ts
export const registryConfig = {
  name: "credicn",
  registryName: "credicn",
  namespace: "@credicn",
  description: "A private CrediAri registry for organizing and sharing UI components.",
  homepage: "https://library-prototype-cn.vercel.app",
  repositoryUrl: "https://github.com/crediari/credicn",
} as const;
```

Set `homepage` before deploying. Install commands and local registry dependency URLs are built from this value.

### Author Docs

Create public documentation pages under `registry/docs/`.

```text
registry/docs/
  index.mdx
  installation.mdx
  registry.mdx
```

Docs render under `/docs`: `registry/docs/index.mdx` becomes `/docs`, and `registry/docs/installation.mdx` becomes `/docs/installation`. Keep docs files directly under `registry/docs` for now; nested docs pages are not supported yet.

```mdx
---
title: Installation
description: Install and run this registry.
order: 1
group: Getting Started
---

# Installation

Use Markdown or MDX with the built-in docs components.
```

### Add A Registry Item

#### Automatic

Run `bun --bun ./scripts/new.ts` to interactively scaffold new registry items under `registry/items/**`.

It's always a good idea to also run `bun --bun ./scripts/doctor.ts` after making changes in the `registry` directory; this validates registry metadata and reports ignored or suspicious files within the directory.

#### Manual

Create a folder under `registry/items/<section>/<item-name>/`.

```text
registry/items/components/project-card/
  _registry.mdx
  _preview.tsx
  project-card.tsx
```

Write metadata and usage docs in `_registry.mdx`.

````mdx
---
name: project-card
type: registry:ui
title: Project Card
description: A compact project card.
registryDependencies:
  - card
localRegistryDependencies:
  - other-local-item
---

Use the component anywhere you need a compact content summary.

```tsx
import { ProjectCard } from "@/components/ui/project-card";

export function Example() {
  return <ProjectCard />;
}
```
````

Put the interactive preview in `_preview.tsx`.

```tsx
"use client";

import { ProjectCard } from "./project-card";

export function Preview() {
  return <ProjectCard />;
}
```

For a one-file component, the catalog infers the source file from the item root and `name`, then emits a shadcn target placeholder such as `@ui/project-card.tsx`. List `files` explicitly in frontmatter for hooks, libs, blocks, pages, custom target paths, or any item with multiple published files; file paths are relative to the item `_registry.mdx` file. Metadata-only styles, themes, fonts, bases, and universal items can omit `files`. Do not publish `_registry.mdx`, `_preview.tsx`, or other authoring-only files.

The MDX body renders as the optional Usage section on the docs page. Fenced code blocks are syntax highlighted and keep the docs site's copy button. `_preview.tsx` is authoring-only and can use local state or events behind its `"use client"` boundary, but server-only logic should stay out of previews. Use `localRegistryDependencies` for dependencies on other local registry items; they are converted into canonical registry URLs in the public JSON.

## Server

The public registry index is available at both the root and `/r` paths, while installable item JSON lives under `/r`:

- `/registry.json` serves the registry index.
- `/r/registry.json` serves the same registry index.
- `/r/<name>.json` serves an item JSON file.
- `/llms.txt` and `/llms-full.txt` are generated from the same Markdown docs and registry item pages used by the site.

> [!TIP]
> credicn validates authored registry metadata against schemas directly from [`shadcn/schema`](https://github.com/shadcn-ui/ui/blob/main/packages/shadcn/src/registry/schema.ts) to ensure compatibility.

### Content Negotiation

Human-facing registry URLs support the shadcn CLI's request headers. CLI requests with `Accept: application/vnd.shadcn.v1+json` or `User-Agent: shadcn` receive the shadcn-compliant JSON from the same URL as the human-readable docs page:

- `/registry` returns the registry index JSON.
- `/registry/<name>` and section item pages like `/components/<name>` return item JSON.

All pages also support Markdown content negotiation (inspired by [Fumadocs](https://www.fumadocs.dev/docs/headless/utils/negotiation)). AI clients that request `text/markdown`, `text/x-markdown`, or `text/plain` in the `Accept` header receive the Markdown version of the current page directly, while normal browser requests still receive HTML.

## Checklist

- [ ] Keep the registry identity, domain, and repository URL current in `registry/config.ts`.
- [ ] Update docs under `registry/docs` as the platform evolves.
- [ ] Add registry items under `registry/items`; use `bun --bun ./scripts/new.ts` to generate new stubs.
- [ ] Run `bun --bun ./scripts/doctor.ts` to verify changes.
- [ ] Run `vp check` and `vp build`.
- [ ] Deploy to the internal environment.
- [ ] Test the install commands with npm, pnpm, yarn, bun, vite+, and deno.

## Gotchas

> [!WARNING]
> The docs site uses the local shadcn UI configuration in [`components.json`](components.json); that styling is for this app shell and does **not** affect the published registry items in any way.

## License

[MIT](LICENSE)
