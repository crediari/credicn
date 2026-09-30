export function generateAvatarFallback(name: string | null | undefined): string {
  const trimmedName = name?.trim();
  if (!trimmedName) return "";

  const nameParts = trimmedName.split(/\s+/);
  const firstInitial = Array.from(nameParts[0] ?? "")[0] ?? "";

  if (nameParts.length === 1) {
    return firstInitial.toLocaleUpperCase();
  }

  const lastInitial = Array.from(nameParts.at(-1) ?? "")[0] ?? "";

  return `${firstInitial}${lastInitial}`.toLocaleUpperCase();
}
