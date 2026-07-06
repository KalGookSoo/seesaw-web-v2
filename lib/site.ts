import { cache } from 'react';

import type { SiteResponse } from '@/types/site';
import { APPLICATION_API_BASE_URL } from '@/lib/application-constants';

const SITE_REVALIDATE_SECONDS = 60 * 60 * 24;

export const getCurrentSite = cache(async (domainName: string): Promise<SiteResponse> => {
  const response = await fetch(`${APPLICATION_API_BASE_URL}/sites/by-domain/${encodeURIComponent(domainName)}`, {
    headers: {
      Accept: 'application/json'
    },
    next: {
      revalidate: SITE_REVALIDATE_SECONDS
    }
  });

  if (!response.ok) {
    throw new Error(`사이트 컨텍스트를 조회할 수 없습니다. status=${response.status}, domainName=${domainName}`);
  }

  return response.json();
});

export const getSiteContext = cache(async (domainName: string): Promise<SiteResponse> => {
  const response = await fetch(`${APPLICATION_API_BASE_URL}/sites/by-domain/${encodeURIComponent(domainName)}/context`, {
    headers: {
      Accept: 'application/json'
    },
    next: {
      revalidate: SITE_REVALIDATE_SECONDS
    }
  });

  if (!response.ok) {
    throw new Error(`사이트 컨텍스트를 조회할 수 없습니다. status=${response.status}, domainName=${domainName}`);
  }

  return response.json();
});
