import type { Metadata } from 'next';
import type { CategoryResponse } from '@/types/category';
import { APPLICATION_NAME } from '@/lib/application-constants';
import { toAttachmentUrl } from '@/lib/home-summary';
import { getSiteContext } from '@/lib/site';
import { CategoryAnchorLink } from '@/components/home/category-anchor-link';
import { HomeSummarySections } from '@/components/home/home-summary-sections';
import { ContentContainer } from '@/components/layout/content-container';
import { MonochromeImage } from '@/components/ui/monochrome-image';
import editorial from './style-guide/editorial/editorial.module.css';

export const dynamic = 'force-dynamic';

const domainName = `${APPLICATION_NAME}.seesaw.me.kr`;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContext(domainName);
  const title = site.name?.trim() || 'Seesaw';
  const description = site.description?.trim() || site.intro?.trim() || undefined;
  const image = site.profileImage ? `/api/attachments/${encodeURIComponent(site.profileImage.id)}` : undefined;
  return {
    alternates: { canonical: '/' },
    openGraph: { type: 'website', title, description, url: '/', siteName: title, images: image ? [image] : undefined },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description, images: image ? [image] : undefined }
  };
}

function isVisibleChildCategory(category: CategoryResponse): boolean {
  return Boolean(category.parentId) && category.siteExposed;
}

function bySiteExposedOrder(left: CategoryResponse, right: CategoryResponse): number {
  return left.siteExposedOrder - right.siteExposedOrder;
}

function toCategoryHref(category: CategoryResponse): string {
  return `/articles?categoryId=${encodeURIComponent(category.id)}&categoryType=${encodeURIComponent(category.type ?? 'BOARD')}`;
}

function formatToday(): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  }).format(new Date());
}

export default async function Home() {
  try {
    const site = await getSiteContext(domainName);
    const categories = site.categories ?? [];
    const visibleCategories = categories
      .filter(isVisibleChildCategory)
      .sort(bySiteExposedOrder);
    const boardCount = visibleCategories.filter((category) => category.type === 'BOARD').length;
    const scheduleCount = visibleCategories.filter((category) => category.type === 'SCHEDULE').length;
    const establishedYear = site.createdDate ? new Date(site.createdDate).getFullYear() : null;

    return (
      <main className={`${editorial.theme} min-h-dvh`}>
        <section className="border-b py-5" style={{ borderColor: 'var(--editorial-line-soft)' }}>
          <ContentContainer>
            <header className="flex items-start justify-between gap-6">
              <div className="flex min-w-0 items-center gap-3">
                {site.profileImage ? (
                  <MonochromeImage className="size-10 shrink-0 border" imageClassName="object-cover" src={toAttachmentUrl(site.profileImage.id)} alt="" fallbackLabel="PROFILE / UNAVAILABLE" />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center border text-lg font-semibold">{site.name?.slice(0, 1)}</span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{site.name}</p>
                  <p className="text-[0.7rem] text-[var(--editorial-ink-muted)]">{site.domainName}</p>
                </div>
              </div>
              <div className="flex items-end gap-5">
                <p className={`${editorial.label} hidden text-[var(--editorial-ink-muted)] sm:block`}>{establishedYear ? `Established ${establishedYear}` : 'Community archive'}</p>
                <p className={`${editorial.label} text-[var(--editorial-ink-muted)]`}>{formatToday()}</p>
              </div>
            </header>

            <div className="grid gap-10 border-b py-14 sm:py-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-16" style={{ borderColor: 'var(--editorial-line-soft)' }}>
              <div>
                <p className={`${editorial.label} text-[var(--editorial-primary)]`}>Editorial archive · Home</p>
                <h1 className={`${editorial.display} mt-5 max-w-5xl text-[clamp(2rem,6vw,4.5rem)]`} style={{ lineHeight: 0.95 }}>{site.name}</h1>
              </div>
              <div className="flex flex-col gap-6 lg:pb-2">
                {site.description ? <p className={`${editorial.body} max-w-md text-lg leading-8 text-[var(--editorial-ink-soft)]`}>{site.description}</p> : null}
                <div className="flex gap-5 border-t pt-4 text-xs" style={{ borderColor: 'var(--editorial-line-soft)' }}>
                  <span><strong className="block text-2xl font-black tracking-tight">{String(boardCount).padStart(2, '0')}</strong><span className="text-[var(--editorial-ink-muted)]">게시판</span></span>
                  <span><strong className="block text-2xl font-black tracking-tight">{String(scheduleCount).padStart(2, '0')}</strong><span className="text-[var(--editorial-ink-muted)]">일정</span></span>
                </div>
              </div>
            </div>

          </ContentContainer>
        </section>

        {site.intro || site.content || site.backgroundImage ? (
          <section
            className="group relative overflow-hidden border-b"
            style={{
              borderColor: 'var(--editorial-line-soft)'
            }}
          >
            {site.backgroundImage ? <div className="image-filter-transition absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${toAttachmentUrl(site.backgroundImage.id)})` }} aria-hidden="true" /> : null}
            <ContentContainer className="relative z-10 grid min-h-80 gap-8 py-10 lg:grid-cols-[0.35fr_1fr] lg:py-14">
              <p className={`${editorial.label} ${editorial.introText} text-[var(--editorial-primary)]`}>About this archive</p>
              <div className="max-w-3xl py-6 sm:py-8">
                {site.intro ? <h2 className={`${editorial.display} ${editorial.introText} text-2xl sm:text-4xl`} style={{ lineHeight: 0.95 }}>{site.intro}</h2> : null}
                {site.content ? <p className={`${editorial.body} ${editorial.introText} mt-5 max-w-2xl text-lg leading-8 text-[var(--editorial-ink-soft)]`}>{site.content}</p> : null}
              </div>
            </ContentContainer>
          </section>
        ) : null}

        {visibleCategories.length > 0 ? (
          <section id="index">
            <ContentContainer className="py-4 lg:py-6">
            <details className="group/index border-b" style={{ borderColor: 'var(--editorial-line-soft)' }}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
                <span className={editorial.label}>Index · Contents <span className="ml-2">카테고리 바로가기</span></span>
                <span className={`${editorial.label} flex shrink-0 items-center gap-3`}>
                  {String(visibleCategories.length).padStart(2, '0')} sections
                  <span aria-hidden="true" className="transition-transform group-open/index:rotate-180">⌄</span>
                </span>
              </summary>
              <nav aria-label="사이트 카테고리 바로가기" className="grid border-l border-t sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: 'var(--editorial-line-soft)' }}>
                {visibleCategories.map((category, index) => {
                  const onPage = category.type === 'BOARD' || category.type === 'SCHEDULE';
                  return (
                    <CategoryAnchorLink
                      key={category.id}
                      href={onPage ? `#${category.id}` : toCategoryHref(category)}
                      className="group flex min-h-14 items-center gap-3 border-r border-b px-4 py-3 transition-colors hover:bg-[#eeeeeb] hover:text-[var(--editorial-ink)]"
                    >
                      <span className={`${editorial.label} shrink-0 text-[var(--editorial-ink-muted)] group-hover:text-[var(--editorial-primary)]`}>{String(index + 1).padStart(2, '0')}</span>
                      <span className="min-w-0 flex-1 text-base font-bold tracking-tight">{category.name}</span>
                      <span aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-1">↗</span>
                    </CategoryAnchorLink>
                  );
                })}
              </nav>
            </details>
            </ContentContainer>
          </section>
        ) : null}

        <section id="archive" className="border-t" style={{ borderColor: 'var(--editorial-line-soft)' }}>
          <ContentContainer className="py-10 lg:py-14">
            <div className="mb-10 flex items-end justify-between border-b pb-3" style={{ borderColor: 'var(--editorial-line-soft)' }}>
              <p className={editorial.label}>Archive · Latest records</p>
              <span className={editorial.label}>Scroll to read</span>
            </div>
            <HomeSummarySections categories={categories} />
          </ContentContainer>
        </section>
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return <main className="bg-default-background px-5 py-10 text-default-label"><section className="mx-auto max-w-3xl space-y-5 border border-default-red-muted bg-default-surface p-6"><p className="text-sm font-medium tracking-wide text-default-red uppercase">Site API Error</p><h1 className="text-base font-semibold">사이트 정보를 조회하지 못했습니다.</h1><p className="text-base leading-7 text-default-secondary-label">{message}</p></section></main>;
  }
}
