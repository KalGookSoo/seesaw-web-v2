import { ActivityHistory } from '@/components/activity/activity-history';
import { ContentContainer } from '@/components/layout/content-container';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: '내 활동 이력',
  robots: { index: false, follow: false }
};

export default function ActivityPage() {
  return (
    <main className="bg-default-background text-default-label min-h-full">
      <ContentContainer className="py-8 lg:py-12">
        <header className="border-default-separator mb-8 border-b pb-6">
          <p className="text-default-primary text-xs font-bold tracking-[0.2em] uppercase">
            My activity
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-[-0.06em] sm:text-3xl">
            내 활동 이력
          </h1>
          <p className="text-default-secondary-label mt-3 text-sm">
            이 사이트에서 남긴 글과 댓글, 좋아요를 한곳에서 확인합니다.
          </p>
        </header>
        <ActivityHistory />
      </ContentContainer>
    </main>
  );
}
