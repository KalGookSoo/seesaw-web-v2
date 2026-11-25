import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import { cookies } from 'next/headers';

import { APPLICATION_NAME } from '@/lib/application-constants.ts';
import { NAVIGATION_COLLAPSED_COOKIE_KEY, NAVIGATION_POSITION_COOKIE_KEY } from '@/lib/navigation-preferences';
import { getSiteContext } from '@/lib/site';
import { createSiteContext } from '@/lib/site-context';
import { GlobalShell } from '@/components/layout/global-shell';
import { ServiceWorkerRegistration } from '@/app/service-worker-registration';
import { SiteContextProvider } from '@/app/site-context-provider';
import { ToastProvider } from '@/components/ui/toast';

import './globals.css';

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  weight: '400',
  subsets: ['latin']
});

const domainName = `${APPLICATION_NAME}.seesaw.me.kr`;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContext(domainName);
  const name = site.name?.trim() || 'Seesaw';
  const description = site.description?.trim() || site.intro?.trim() || undefined;
  return {
    metadataBase: new URL(`https://${domainName}`),
    title: { default: name, template: `%s | ${name}` },
    description,
    manifest: '/manifest.json',
    robots: site.searchEngineExposed === false ? { index: false, follow: false } : undefined
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const site = await getSiteContext(domainName);
  const siteContext = createSiteContext(site);
  const cookieStore = await cookies();
  const navigationPositionCookie = cookieStore.get(NAVIGATION_POSITION_COOKIE_KEY)?.value;
  const navigationCollapsedCookie = cookieStore.get(NAVIGATION_COLLAPSED_COOKIE_KEY)?.value;
  const initialNavigationPosition = navigationPositionCookie === 'right' ? 'right' : 'left';
  const initialNavigationCollapsed = navigationCollapsedCookie === 'true';

  return (
    <html lang="ko" className={`${plexMono.variable} h-full overflow-hidden antialiased`} suppressHydrationWarning>
      <body className="flex h-full min-h-0 flex-col overflow-hidden">
        <ToastProvider>
          <SiteContextProvider siteContext={siteContext}>
            <GlobalShell initialNavigationCollapsed={initialNavigationCollapsed} initialNavigationPosition={initialNavigationPosition}>
              {children}
            </GlobalShell>
          </SiteContextProvider>
        </ToastProvider>
        <ServiceWorkerRegistration siteId={site.id} siteName={site.name} />
      </body>
    </html>
  );
}
