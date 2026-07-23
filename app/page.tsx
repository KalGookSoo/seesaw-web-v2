import type { CategoryResponse } from '@/types/category';
import { APPLICATION_NAME } from '@/lib/application-constants';
import { toAttachmentUrl } from '@/lib/home-summary';
import { getSiteContext } from '@/lib/site';
import { CategoryAnchorLink } from '@/components/home/category-anchor-link';
import { HomeSummarySections } from '@/components/home/home-summary-sections';
import { HorizontalCarousel } from '@/components/home/horizontal-carousel';

export const dynamic = 'force-dynamic';

const domainName = `${APPLICATION_NAME}.seesaw.me.kr`;

function isVisibleChildCategory(category: CategoryResponse): boolean {
  return Boolean(category.parentId) && category.siteExposed;
}

function bySiteExposedOrder(
  left: CategoryResponse,
  right: CategoryResponse
): number {
  return left.siteExposedOrder - right.siteExposedOrder;
}

function toCategoryHref(category: CategoryResponse): string {
  return `/articles?categoryId=${encodeURIComponent(category.id)}&categoryType=${encodeURIComponent(category.type ?? 'BOARD')}`;
}

export default async function Home() {
  try {
    const site = await getSiteContext(domainName);
    const categories = site.categories ?? [];
    const profileImage = site.profileImage;
    const backgroundImage = site.backgroundImage;
    const visibleCategories = categories
      .filter(isVisibleChildCategory)
      .sort(bySiteExposedOrder);
    const featuredCategories = visibleCategories.slice(0, 9);
    const establishedYear = site.createdDate
      ? new Date(site.createdDate).getFullYear()
      : null;
    const heroStyle = backgroundImage
      ? {
          backgroundImage: `url(${toAttachmentUrl(backgroundImage.id)})`
        }
      : {
          background: `linear-gradient(135deg, ${site.themeColor}, ${site.backgroundColor})`
        };

    return (
      <main className="bg-default-surface-grouped text-default-label">
        {/* Masthead */}
        <section className="relative">
          <div
            className="relative min-h-[26rem] bg-cover bg-center sm:min-h-[32rem]"
            style={heroStyle}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.12),rgb(0_0_0/0.58)_60%,rgb(0_0_0/0.86))]" />
            <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-4 pt-8 pb-10 sm:px-6 lg:px-8">
              <div className="flex justify-end">
                <span className="text-xs font-semibold tracking-[0.35em] text-white/60 uppercase">
                  {establishedYear
                    ? `Est. ${establishedYear}`
                    : '지금 소개합니다'}
                </span>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-white/70 uppercase">
                    이 공간을 소개합니다
                  </p>
                  <h1 className="mt-3 text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-7xl lg:text-8xl">
                    {site.name}
                  </h1>
                </div>
                {site.description ? (
                  <blockquote className="border-l-2 border-white/40 pl-5 font-serif text-lg leading-8 text-white/90 italic lg:mb-2">
                    {site.description}
                  </blockquote>
                ) : null}
              </div>
            </div>

            {/* Avatar dock: anchored to the masthead's own bottom edge so it always
                sits above the background image, regardless of hero height. */}
            <div className="absolute inset-x-0 bottom-0 z-10 translate-y-1/2">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-end gap-4">
                  {profileImage ? (
                    <img
                      src={toAttachmentUrl(profileImage.id)}
                      alt={`${site.name} 프로필 이미지`}
                      className="ring-default-surface-grouped size-24 shrink-0 rounded-2xl object-cover shadow-xl ring-4 sm:size-28"
                    />
                  ) : (
                    <div
                      className="ring-default-surface-grouped flex size-24 shrink-0 items-center justify-center rounded-2xl text-2xl font-semibold text-white shadow-xl ring-4 sm:size-28"
                      style={{
                        background: `linear-gradient(135deg, ${site.themeColor}, ${site.backgroundColor})`
                      }}
                    >
                      {site.name?.slice(0, 1)}
                    </div>
                  )}
                  <div className="min-w-0 pb-2">
                    <p className="text-default-tertiary-label truncate text-xs font-semibold tracking-[0.25em] uppercase">
                      {site.domainName}
                    </p>
                    <p className="text-default-label truncate text-lg font-semibold">
                      {site.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reserves room for the half of the avatar hanging below the hero. */}
          <div className="h-12 sm:h-14" />
        </section>

        {/* Lede */}
        {site.intro || site.content ? (
          <section className="mx-auto max-w-3xl px-4 pt-10 pb-4 text-center sm:px-6 lg:px-8">
            {site.intro ? (
              <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
                {site.intro}
              </h2>
            ) : null}
            {site.content ? (
              <p className="text-default-secondary-label mt-6 line-clamp-10 text-base leading-8 whitespace-pre-line">
                {site.content}
              </p>
            ) : null}
          </section>
        ) : null}

        {/* Category rail */}
        {featuredCategories.length > 0 ? (
          <section className="mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6 lg:px-8">
            <p className="text-default-tertiary-label mb-4 text-xs font-semibold tracking-[0.25em] uppercase">
              Contents
            </p>
            <HorizontalCarousel>
              {featuredCategories.map((category, index) => {
                const hasOnPageSection =
                  category.type === 'BOARD' || category.type === 'SCHEDULE';

                return (
                  <CategoryAnchorLink
                    key={category.id}
                    href={
                      hasOnPageSection
                        ? `#${category.id}`
                        : toCategoryHref(category)
                    }
                    className="border-default-separator bg-default-surface text-default-label hover:border-default-blue-muted hover:text-default-blue flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium whitespace-nowrap shadow-sm transition"
                  >
                    <span className="text-default-tertiary-label text-xs">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {category.name}
                  </CategoryAnchorLink>
                );
              })}
            </HorizontalCarousel>
          </section>
        ) : null}

        <section className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
          <div className="border-default-separator mb-8 flex items-end gap-4 border-b pb-6">
            <span className="text-default-blue-muted text-5xl leading-none font-bold sm:text-6xl">
              01
            </span>
            <div className="pb-1">
              <p className="text-default-blue text-sm font-semibold">
                둘러보기
              </p>
              <h2 className="text-default-label mt-1 text-2xl font-semibold">
                지금 눈여겨볼 소식
              </h2>
            </div>
          </div>
          <HomeSummarySections categories={categories} />
        </section>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.';

    return (
      <main className="bg-default-surface-grouped text-default-label px-6 py-10">
        <section className="border-default-red-muted bg-default-surface mx-auto max-w-3xl space-y-6 rounded-lg border p-6">
          <div className="space-y-2">
            <p className="text-default-red text-sm font-medium tracking-wide uppercase">
              Site API Error
            </p>
            <h1 className="text-2xl font-semibold">
              사이트 정보를 조회하지 못했습니다.
            </h1>
            <p className="text-default-secondary-label text-base leading-7">
              {message}
            </p>
          </div>
        </section>
      </main>
    );
  }
}
