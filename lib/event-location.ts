export function formatEventLocation(location?: string | null, locationDetail?: string | null): string {
  return [location?.trim(), locationDetail?.trim()].filter(Boolean).join(' ');
}
