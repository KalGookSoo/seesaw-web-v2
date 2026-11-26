import type { SiteResponse } from '@/types/site';

export function siteIconVersion(site: SiteResponse): string {
  return `${site.profileImage?.id ?? 'default'}-${site.lastModifiedDate ?? ''}`;
}

export function siteIconUrl(site: SiteResponse, size: number, maskable = false): string {
  const params = new URLSearchParams({
    size: String(size),
    version: siteIconVersion(site)
  });
  if (maskable) params.set('maskable', '1');
  return `/site-icon?${params}`;
}
