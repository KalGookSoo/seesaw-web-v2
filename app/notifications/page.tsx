import { Bell } from 'lucide-react';

import { NotificationInbox } from '@/components/notifications/notification-inbox';

export const dynamic = 'force-dynamic';

export default function NotificationsPage() {
  return (
    <main className="min-h-full bg-default-background px-4 py-8 text-default-label sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-end justify-between gap-6 border-b border-default-separator pb-6">
          <div>
            <p className="text-default-primary text-xs font-bold tracking-[0.2em] uppercase">Seesaw activity</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-5xl">알림함</h1>
          </div>
          <Bell aria-hidden className="text-default-primary hidden size-8 sm:block" />
        </header>
        <NotificationInbox />
      </div>
    </main>
  );
}
