import type { CategoryResponse } from '@/types/category';
import { APPLICATION_NAME } from '@/lib/application-constants';
import { toAttachmentUrl } from '@/lib/home-summary';
import { getSiteContext } from '@/lib/site';
import { CategoryAnchorLink } from '@/components/home/category-anchor-link';
import { HomeSummarySections } from '@/components/home/home-summary-sections';
import { MonochromeImage } from '@/components/ui/monochrome-image';
import editorial from './style-guide/editorial/editorial.module.css';

export const dynamic = 'force-dynamic';

const domainName = `${APPLICATION_NAME}.seesaw.me.kr`;

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
        <section className="border-b px-5 py-5 sm:px-8 lg:px-10" style={{ borderColor: 'var(--editorial-line-soft)' }}>
          <div className="mx-auto max-w-7xl">
            <header className="flex items-start justify-between gap-6">
              <div className="flex min-w-0 items-center gap-3">
                {site.profileImage ? (
                  <MonochromeImage className="size-10 shrink-0 border" imageClassName="object-cover grayscale" src={toAttachmentUrl(site.profileImage.id)} alt="" fallbackLabel="PROFILE / UNAVAILABLE" />
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
                <h1 className={`${editorial.display} mt-5 max-w-5xl text-[clamp(2.5rem,7vw,5.5rem)]`} style={{ lineHeight: 0.95 }}>{site.name}</h1>
              </div>
              <div className="flex flex-col gap-6 lg:pb-2">
                {site.description ? <p className={`${editorial.body} max-w-md text-lg leading-8 text-[var(--editorial-ink-soft)]`}>{site.description}</p> : null}
                <div className="flex gap-5 border-t pt-4 text-xs" style={{ borderColor: 'var(--editorial-line-soft)' }}>
                  <span><strong className="block text-2xl font-black tracking-tight">{String(boardCount).padStart(2, '0')}</strong><span className="text-[var(--editorial-ink-muted)]">게시판</span></span>
                  <span><strong className="block text-2xl font-black tracking-tight">{String(scheduleCount).padStart(2, '0')}</strong><span className="text-[var(--editorial-ink-muted)]">일정</span></span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {site.intro || site.content || site.backgroundImage ? (
          <section
            className="relative overflow-hidden border-b bg-cover bg-center"
            style={{
              ...(site.backgroundImage ? { backgroundImage: `url(${toAttachmentUrl(site.backgroundImage.id)})` } : {}),
              borderColor: 'var(--editorial-line-soft)'
            }}
          >
            <div className="absolute inset-0 bg-[var(--editorial-background)]/78 backdrop-grayscale" aria-hidden="true" />
            <div className="relative mx-auto grid min-h-80 max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.35fr_1fr] lg:px-10 lg:py-14">
              <p className={`${editorial.label} text-[var(--editorial-primary)]`}>About this archive</p>
              <div className="max-w-3xl border border-[var(--editorial-line-soft)] bg-[var(--editorial-background)]/90 p-6 backdrop-blur-sm sm:p-8">
                {site.intro ? <h2 className={`${editorial.display} text-xl sm:text-3xl`} style={{ lineHeight: 0.95 }}>{site.intro}</h2> : null}
                {site.content ? <p className={`${editorial.body} mt-5 max-w-2xl text-lg leading-8 text-[var(--editorial-ink-soft)]`}>{site.content}</p> : null}
              </div>
            </div>
          </section>
        ) : null}

        {visibleCategories.length > 0 ? (
          <section id="index" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
            <div className="mb-5 flex items-end justify-between border-b pb-3" style={{ borderColor: 'var(--editorial-line-soft)' }}>
              <p className={editorial.label}>Index · Contents</p>
              <span className={editorial.label}>{String(visibleCategories.length).padStart(2, '0')} sections</span>
            </div>
            <nav aria-label="사이트 카테고리 바로가기" className="grid border-l border-t sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: 'var(--editorial-line-soft)' }}>
              {visibleCategories.map((category, index) => {
                const onPage = category.type === 'BOARD' || category.type === 'SCHEDULE';
                return (
                  <CategoryAnchorLink
                    key={category.id}
                    href={onPage ? `#${category.id}` : toCategoryHref(category)}
                    className="group min-h-36 border-r border-b p-5 transition-colors hover:bg-[var(--editorial-ink)] hover:text-[var(--editorial-surface)] sm:p-6"
                  >
                    <span className={`${editorial.label} text-[var(--editorial-ink-muted)] group-hover:text-[var(--editorial-primary)]`}>{String(index + 1).padStart(2, '0')}</span>
                    <span className="mt-12 flex items-center justify-between gap-3 text-lg font-black tracking-tight">
                      <span className="truncate">{category.name}</span>
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
                    </span>
                    <span className={`${editorial.label} mt-2 block text-[var(--editorial-ink-muted)] group-hover:text-[var(--editorial-surface)]`}>{category.type === 'SCHEDULE' ? 'Schedule' : 'Board'}</span>
                  </CategoryAnchorLink>
                );
              })}
            </nav>
          </section>
        ) : null}

        <section id="archive" className="border-t" style={{ borderColor: 'var(--editorial-line-soft)' }}>
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
            <div className="mb-10 flex items-end justify-between border-b pb-3" style={{ borderColor: 'var(--editorial-line-soft)' }}>
              <p className={editorial.label}>Archive · Latest records</p>
              <span className={editorial.label}>Scroll to read</span>
            </div>
            <HomeSummarySections categories={categories} />
          </div>
        </section>
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return <main className="bg-default-background px-5 py-10 text-default-label"><section className="mx-auto max-w-3xl space-y-5 border border-default-red-muted bg-default-surface p-6"><p className="text-sm font-medium tracking-wide text-default-red uppercase">Site API Error</p><h1 className="text-2xl font-semibold">사이트 정보를 조회하지 못했습니다.</h1><p className="text-base leading-7 text-default-secondary-label">{message}</p></section></main>;
  }
}
