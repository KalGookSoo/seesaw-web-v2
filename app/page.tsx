import type { CategoryResponse } from '@/types/category';
import { APPLICATION_NAME } from '@/lib/application-constants';
import { toAttachmentUrl } from '@/lib/home-summary';
import { getSiteContext } from '@/lib/site';
import { CategoryAnchorLink } from '@/components/home/category-anchor-link';
import { HomeSummarySections } from '@/components/home/home-summary-sections';
import { MonochromeImage } from '@/components/ui/monochrome-image';

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
    const heroStyle = site.backgroundImage
      ? { backgroundImage: `url(${toAttachmentUrl(site.backgroundImage.id)})` }
      : { background: 'linear-gradient(135deg, #555b55, #20231f 72%)' };

    return (
      <main className="bg-default-background text-default-label">
        <section className="relative overflow-hidden border-b border-default-separator bg-default-label text-white">
          <div className="absolute inset-0 bg-cover bg-center opacity-35 grayscale" style={heroStyle} />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgb(32_34_31/0.98),rgb(32_34_31/0.82)_48%,rgb(32_34_31/0.58))]" />
          <div className="relative mx-auto flex min-h-[31rem] max-w-7xl flex-col justify-between px-5 py-6 sm:min-h-[35rem] sm:px-8 sm:py-8 lg:px-12">
            <header className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {site.profileImage ? (
                  <MonochromeImage className="size-11 shrink-0 border border-white/30" imageClassName="object-cover grayscale" src={toAttachmentUrl(site.profileImage.id)} alt="" fallbackLabel="PROFILE / UNAVAILABLE" />
                ) : (
                  <span className="flex size-11 shrink-0 items-center justify-center border border-white/30 text-lg font-semibold">{site.name?.slice(0, 1)}</span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{site.name}</p>
                  <p className="truncate text-xs text-white/55">{site.domainName}</p>
                </div>
              </div>
              <p className="hidden text-xs tracking-[0.18em] text-white/55 uppercase sm:block">{establishedYear ? `Est. ${establishedYear}` : 'Community space'}</p>
            </header>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
              <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-white/55 uppercase">A place for shared notes</p>
                <h1 className="mt-4 max-w-4xl text-2xl leading-tight font-semibold tracking-tight text-white text-balance sm:text-3xl">{site.name}</h1>
              </div>
              {site.description ? <p className="max-w-sm border-l border-white/35 pl-4 text-base leading-7 text-white/75">{site.description}</p> : null}
            </div>
          </div>
        </section>

        <section className="border-b border-default-separator bg-default-surface">
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-default-separator px-5 sm:px-8 lg:px-12">
            <div className="py-5 pr-4"><p className="text-[0.65rem] tracking-[0.16em] text-default-tertiary-label uppercase">Today</p><p className="mt-2 text-sm font-semibold text-default-label">{formatToday()}</p></div>
            <div className="px-4 py-5"><p className="text-[0.65rem] tracking-[0.16em] text-default-tertiary-label uppercase">Boards</p><p className="mt-2 text-2xl font-semibold text-default-label">{String(boardCount).padStart(2, '0')}</p></div>
            <div className="py-5 pl-4"><p className="text-[0.65rem] tracking-[0.16em] text-default-tertiary-label uppercase">Schedules</p><p className="mt-2 text-2xl font-semibold text-default-label">{String(scheduleCount).padStart(2, '0')}</p></div>
          </div>
        </section>

        {site.intro || site.content ? (
          <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
            <div className="max-w-3xl">
              <p className="text-default-primary text-xs font-semibold tracking-[0.2em] uppercase">이 공간에 대하여</p>
              {site.intro ? <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">{site.intro}</h2> : null}
              {site.content ? <p className="mt-5 max-w-2xl text-sm leading-7 text-default-secondary-label sm:text-base">{site.content}</p> : null}
            </div>
          </section>
        ) : null}

        {visibleCategories.length > 0 ? (
          <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8 lg:px-12">
            <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-default-primary text-xs font-semibold tracking-[0.2em] uppercase">탐색</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">카테고리별 기록</h2></div><span className="text-xs text-default-tertiary-label">{visibleCategories.length}개 섹션</span></div>
            <div className="grid grid-cols-2 border-t border-l border-default-separator sm:grid-cols-3 lg:grid-cols-4">
              {visibleCategories.map((category, index) => {
                const onPage = category.type === 'BOARD' || category.type === 'SCHEDULE';
                return <CategoryAnchorLink key={category.id} href={onPage ? `#${category.id}` : toCategoryHref(category)} className="group min-h-24 border-r border-b border-default-separator bg-default-surface px-4 py-4 transition-colors hover:bg-default-fill sm:min-h-28 sm:px-5"><span className="text-xs text-default-tertiary-label">{String(index + 1).padStart(2, '0')}</span><span className="mt-5 flex items-center justify-between gap-3 text-sm font-semibold text-default-label"><span className="truncate">{category.name}</span><span className="text-default-tertiary-label transition-transform group-hover:translate-x-1">→</span></span></CategoryAnchorLink>;
              })}
            </div>
          </section>
        ) : null}

        <section className="border-t border-default-separator bg-default-surface-grouped">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
            <div className="mb-8 flex items-end justify-between gap-5"><div><p className="text-default-primary text-xs font-semibold tracking-[0.2em] uppercase">최근 기록</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">게시글과 일정</h2></div><span className="hidden max-w-48 text-right text-xs leading-5 text-default-tertiary-label sm:block">최근 게시글은 이미지와 텍스트의 리듬으로, 일정은 날짜의 흐름으로 보여줍니다.</span></div>
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
