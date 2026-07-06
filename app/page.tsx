import Link from 'next/link';

import type { CategoryResponse } from '@/types/site';
import { APPLICATION_NAME } from '@/lib/application-constants';
import { toAttachmentUrl } from '@/lib/home-summary';
import { getSiteContext } from '@/lib/site';
import { HomeSummarySections } from '@/components/home/home-summary-sections';

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

export default async function Home() {
  try {
    const site = await getSiteContext(domainName);
    const categories = site.categories ?? [];
    const profileImage = site.profileImage;
    const backgroundImage = site.backgroundImage;
    const visibleCategories = categories.filter(isVisibleChildCategory).sort(bySiteExposedOrder);
    const featuredCategories = visibleCategories.slice(0, 7);
    const heroStyle = backgroundImage
      ? {
          backgroundImage: `linear-gradient(135deg, rgb(0 0 0 / 0.22), rgb(0 0 0 / 0.62)), url(${toAttachmentUrl(backgroundImage.id)})`
        }
      : {
          background: `linear-gradient(135deg, ${site.themeColor}, ${site.backgroundColor})`
        };

    return (
      <main className="bg-default-surface-grouped text-default-label">
        <section className="px-4 pt-6 pb-16 sm:px-6 lg:px-8 lg:pt-10">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.82fr)] lg:items-stretch">
            <article
              className="relative min-h-[31rem] overflow-hidden rounded-lg border border-white/20 bg-cover bg-center shadow-sm"
              style={heroStyle}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgb(255_255_255/0.28),transparent_34%),linear-gradient(180deg,transparent,rgb(0_0_0/0.18))]" />
              <div className="relative flex min-h-[31rem] flex-col justify-between p-5 text-white sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-white/35 bg-white/18 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-white/85 uppercase backdrop-blur-md">
                    {site.domainName}
                  </span>
                </div>

                <div className="max-w-3xl">
                  {profileImage ? (
                    <img
                      src={toAttachmentUrl(profileImage.id)}
                      alt={`${site.name} 프로필 이미지`}
                      className="mb-6 size-24 rounded-lg border border-white/55 object-cover shadow-lg sm:size-28"
                    />
                  ) : null}
                  <h1 className="max-w-4xl text-4xl font-semibold tracking-normal text-balance sm:text-6xl">{site.name}</h1>
                  {site.description ? (
                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">{site.description}</p>
                  ) : null}
                </div>
              </div>
            </article>

            <aside className="flex flex-col gap-6 lg:py-10">
              <section className="border-default-separator bg-default-surface rounded-lg border p-6 shadow-sm sm:p-7">
                <div>
                  <p className="text-default-blue text-sm font-semibold">어서오세요</p>
                  {site.intro ? <h2 className="text-default-label mt-3 text-2xl font-semibold text-balance">{site.intro}</h2> : null}
                  {site.content ? (
                    <p className="text-default-secondary-label mt-5 line-clamp-10 text-sm leading-8 whitespace-pre-line sm:text-base">
                      {site.content}
                    </p>
                  ) : null}
                </div>
              </section>

              {featuredCategories.length > 0 ? (
                <nav className="border-default-separator bg-default-surface/72 rounded-lg border p-5 shadow-sm backdrop-blur">
                  <p className="text-default-secondary-label text-sm font-medium">어디부터 둘러볼까요?</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {featuredCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={toCategoryHref(category)}
                        className="border-default-separator bg-default-fill text-default-label hover:border-default-blue-muted hover:text-default-blue rounded-full border px-3 py-2 text-sm font-medium transition"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </nav>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-default-blue text-sm font-semibold">둘러보기</p>
              <h2 className="text-default-label mt-1 text-2xl font-semibold">지금 눈여겨볼 소식</h2>
            </div>
            <p className="text-default-secondary-label max-w-xl text-sm leading-6">
              새로 올라온 글과 다가오는 순간들을 골라 첫 화면에 담았습니다.
            </p>
          </div>
          <HomeSummarySections categories={categories} />
        </section>
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

    return (
      <main className="bg-default-surface-grouped text-default-label px-6 py-10">
        <section className="border-default-red-muted bg-default-surface mx-auto max-w-3xl space-y-6 rounded-lg border p-6">
          <div className="space-y-2">
            <p className="text-default-red text-sm font-medium tracking-wide uppercase">Site API Error</p>
            <h1 className="text-2xl font-semibold">사이트 정보를 조회하지 못했습니다.</h1>
            <p className="text-default-secondary-label text-base leading-7">{message}</p>
          </div>
        </section>
      </main>
    );
  }
}
