import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

function publishedSources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return publishedSources(path);
    return /\.(?:tsx?|mdx)$/u.test(entry.name) && entry.name !== "_preview.tsx" ? [path] : [];
  });
}

describe("registry theme portability", () => {
  for (const path of publishedSources("registry/items")) {
    test(`${path} inherits host styling and uses Radix composition`, () => {
      const source = readFileSync(path, "utf8");
      // Installing an item must not import preview-shell styles or inject a theme.
      expect(source).not.toMatch(/(?:src\/styles\.css|@fontsource|cssVars:|@base-ui\/react)/u);
      if (path.endsWith("_registry.mdx")) return;
      expect(source).not.toMatch(
        /\b(?:bg|text|border|ring|fill|stroke|from|via|to)-(?:white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d+|\/\d+|\b)/u,
      );
      expect(source).not.toMatch(/\b(?:shimmer|scroll-fade-x|scrollbar-none|cn-font-heading)\b/u);
      expect(source).not.toMatch(/\brender=|--anchor-width|--available-height/u);
    });
  }
});
