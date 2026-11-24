import { Settings } from 'lucide-react';

import { NotificationSettings } from '@/components/notifications/notification-settings';
import { ContentContainer } from '@/components/layout/content-container';

export const dynamic = 'force-dynamic';

export default function NotificationSettingsPage() {
  return (
    <main className="min-h-full bg-default-background text-default-label">
      <ContentContainer className="py-8 lg:py-12">
        <header className="mb-8 flex items-end justify-between gap-6 border-b border-default-separator pb-6">
          <div>
            <p className="text-default-primary text-xs font-bold tracking-[0.2em] uppercase">Delivery channels</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-5xl">알림 설정</h1>
          </div>
          <Settings aria-hidden className="text-default-primary hidden size-8 sm:block" />
        </header>
        <NotificationSettings />
      </ContentContainer>
    </main>
  );
}
