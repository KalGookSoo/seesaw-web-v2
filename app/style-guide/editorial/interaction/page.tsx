import { Bell, CheckCheck, Heart } from 'lucide-react';

import editorial from '../editorial.module.css';

const line = { borderColor: 'var(--editorial-line)' };
const softLine = { borderColor: 'var(--editorial-line-soft)' };

function Sample({
  name,
  description,
  children
}: Readonly<{ name: string; description: string; children: React.ReactNode }>) {
  return (
    <article className="border p-5" style={softLine}>
      <div className="flex items-start justify-between gap-4 border-b pb-3" style={softLine}>
        <p className={editorial.label}>{name}</p>
        <span className="text-xs text-[var(--editorial-ink-muted)]">sample</span>
      </div>
      <div className="mt-5">{children}</div>
      <p className="mt-5 text-sm leading-6 text-[var(--editorial-ink-muted)]">{description}</p>
    </article>
  );
}

export default function EditorialInteractionPage() {
  return (
    <section className="space-y-12">
      <header className="border-b pb-8" style={line}>
        <p className={editorial.label}>Product interaction</p>
        <h2 className="mt-3 text-5xl font-black tracking-[-0.07em] uppercase sm:text-7xl">Interaction</h2>
        <p className={`${editorial.body} mt-4 max-w-2xl text-lg leading-8 text-[var(--editorial-ink-soft)]`}>
          게시글과 댓글의 반응, 사용자의 활동 알림을 하나의 Editorial 규칙으로 묶습니다. 행동은 짧고 명확하게, 상태는 색상과 아이콘을 함께 사용해 전달합니다.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Sample name="Vote button" description="좋아요 안내 문구를 별도로 노출하지 않고, 하트와 숫자만으로 반응 상태를 표현합니다.">
          <div className="flex items-center justify-between border-b pb-4" style={softLine}>
            <div>
              <p className={editorial.label}>댓글</p>
              <p className="mt-2 text-sm text-[var(--editorial-ink-soft)]">좋은 글 잘 읽었습니다.</p>
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="좋아요" className="inline-flex min-h-9 items-center gap-1.5 border px-2.5 text-xs font-semibold text-[var(--editorial-ink-muted)]" style={softLine} type="button"><Heart aria-hidden className="size-4" /> 12</button>
              <button aria-label="좋아요 취소" className="bg-[var(--editorial-primary-soft)] text-[var(--editorial-primary)] inline-flex min-h-9 items-center gap-1.5 border border-[var(--editorial-primary)] px-2.5 text-xs font-semibold" type="button"><Heart aria-hidden className="size-4 fill-current" /> 13</button>
            </div>
          </div>
        </Sample>

        <Sample name="Notification bell" description="헤더에서는 벨과 읽지 않은 개수만 노출하고, 상세 알림은 팝오버와 알림함에서 확인합니다.">
          <div className="border p-4" style={softLine}>
            <div className="flex items-center justify-between border-b pb-3" style={softLine}>
              <span className={editorial.label}>Header utility</span>
              <button aria-label="읽지 않은 알림 3개" className="relative flex size-10 items-center justify-center border text-[var(--editorial-primary)]" style={softLine} type="button"><Bell aria-hidden className="size-4" /><span className="absolute -top-2 -right-2 min-w-4 border border-[var(--editorial-surface)] bg-[var(--editorial-primary)] px-1 text-[0.6rem] font-bold leading-4 text-white">3</span></button>
            </div>
            <div className="mt-3 flex items-start gap-3 bg-[var(--editorial-primary-soft)]/60 p-3">
              <span className="flex size-7 items-center justify-center border border-[var(--editorial-line-soft)] text-[var(--editorial-primary)]"><Bell aria-hidden className="size-3.5" /></span>
              <div className="min-w-0"><p className="text-xs font-bold">새 댓글</p><p className="mt-1 truncate text-xs text-[var(--editorial-ink-soft)]">내 게시글에 새로운 댓글이 등록되었습니다.</p></div>
            </div>
            <button className="mt-3 inline-flex items-center gap-1 text-xs font-bold" type="button"><CheckCheck aria-hidden className="size-3.5" /> 모두 읽음</button>
          </div>
        </Sample>
      </div>

      <section className="grid gap-0 border sm:grid-cols-3" style={line}>
        <div className="border-b p-6 sm:border-r sm:border-b-0" style={line}><p className={editorial.label}>Visibility</p><p className="mt-4 text-sm leading-7 text-[var(--editorial-ink-soft)]">Vote는 텍스트 설명보다 하트 아이콘과 상태 변화로 의미를 전달합니다.</p></div>
        <div className="border-b p-6 sm:border-r sm:border-b-0" style={line}><p className={editorial.label}>Feedback</p><p className="mt-4 text-sm leading-7 text-[var(--editorial-ink-soft)]">읽지 않은 알림은 primary-soft 배경과 배지로 구분하고, 읽음 상태는 표면색으로 낮춥니다.</p></div>
        <div className="p-6"><p className={editorial.label}>Accessibility</p><p className="mt-4 text-sm leading-7 text-[var(--editorial-ink-soft)]">아이콘 버튼에는 상태를 설명하는 accessible name과 focus-visible 규칙을 항상 제공합니다.</p></div>
      </section>
    </section>
  );
}
