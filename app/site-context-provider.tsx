'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import type { CurrentSiteContextModel, SiteContextModel } from '@/types/site-context';

const SiteContext = createContext<CurrentSiteContextModel | null>(null);

export function SiteContextProvider({
  children,
  siteContext
}: Readonly<{
  children: React.ReactNode;
  siteContext: SiteContextModel;
}>) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const currentCategory = categoryId ? (siteContext.ALL_CATEGORIES[categoryId] ?? null) : null;
  const value = useMemo<CurrentSiteContextModel>(
    () => ({
      ...siteContext,
      CURRENT_CATEGORY: currentCategory
    }),
    [currentCategory, siteContext]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteContext(): CurrentSiteContextModel {
  const siteContext = useContext(SiteContext);
  if (!siteContext) {
    throw new Error('SiteContextProvider 내부에서만 useSiteContext를 사용할 수 있습니다.');
  }
  return siteContext;
}
