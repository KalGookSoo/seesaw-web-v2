'use client';

import { useState } from 'react';
import { EditorialAlert, EditorialConfirm, EditorialModal } from 'app/style-guide/editorial/_components/feedback';
import { PageIntro, PreviewPanel, StyleGuideSection } from 'app/style-guide/editorial/_components/style-guide-section';

const primaryButtonClassName =
  'bg-[var(--editorial-accent)] text-[var(--editorial-accent-contrast)] hover:bg-[var(--editorial-line)] rounded-none px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors';
const secondaryButtonClassName =
  'border border-[var(--editorial-line-soft)] bg-[var(--editorial-surface)] px-5 py-2.5 text-xs font-bold tracking-widest text-[var(--editorial-ink)] uppercase transition-colors hover:border-[var(--editorial-line)] hover:bg-[var(--editorial-surface-muted)]';
const descriptionClassName = 'font-serif text-sm leading-6 text-[var(--editorial-ink-soft)] italic';
const inputClassName =
  'h-11 w-full rounded-none border border-[var(--editorial-line-soft)] bg-[var(--editorial-surface-muted)] px-3 font-mono text-xs text-[var(--editorial-ink)] outline-none focus:border-[var(--editorial-line)]';

export default function StyleGuideFeedbackPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [largeModalOpen, setLargeModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dangerConfirmOpen, setDangerConfirmOpen] = useState(false);

  return (
    <>
      <PageIntro title="Alert · Modal · Confirm">
        피드백 컴포넌트는 사용자 행동의 결과와 위험한 결정을 명확하게 다룹니다. `Alert`는 인라인 상태 전달, `Modal`은 집중 입력, `Confirm`은
        취소 가능한 최종 확인에 사용합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Alert" title="Alert variants">
        <div className="grid gap-6 lg:grid-cols-2">
          <EditorialAlert title="정보" variant="info">
            새 댓글 알림을 받을 수 있도록 브라우저 알림 권한을 허용해주세요.
          </EditorialAlert>
          <EditorialAlert title="성공" variant="success">
            캘린더 구독 URL이 클립보드에 복사되었습니다.
          </EditorialAlert>
          <EditorialAlert title="주의" variant="warning">
            현재 카테고리는 검색엔진 노출 대상이 아닙니다.
          </EditorialAlert>
          <EditorialAlert title="오류" variant="danger">
            요청 값을 다시 확인해주세요. UUID v4 형식이 아닙니다.
          </EditorialAlert>
          <EditorialAlert variant="neutral">제목 없이 짧은 안내만 전달할 때 사용하는 neutral alert입니다.</EditorialAlert>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Modal" title="Modal sizes and actions">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Default modal">
            <div className="space-y-4">
              <p className={descriptionClassName}>일반적인 입력, 복사, 상세 보기 흐름에 사용합니다.</p>
              <button className={primaryButtonClassName} type="button" onClick={() => setModalOpen(true)}>
                기본 모달 열기
              </button>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Large modal">
            <div className="space-y-4">
              <p className={descriptionClassName}>본문 편집, 긴 설명, 미리보기처럼 넓은 표면이 필요할 때 사용합니다.</p>
              <button className={secondaryButtonClassName} type="button" onClick={() => setLargeModalOpen(true)}>
                큰 모달 열기
              </button>
            </div>
          </PreviewPanel>
        </div>

        <EditorialModal
          open={modalOpen}
          title="캘린더 구독 URL"
          description="구독 가능한 공개 캘린더 주소를 복사합니다."
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className={secondaryButtonClassName} type="button" onClick={() => setModalOpen(false)}>
                닫기
              </button>
              <button className={primaryButtonClassName} type="button" onClick={() => setModalOpen(false)}>
                복사
              </button>
            </>
          }
        >
          <input className={inputClassName} readOnly value="https://daejeonstickybook.seesaw.me.kr/api/calendar.ics" />
        </EditorialModal>

        <EditorialModal
          open={largeModalOpen}
          title="일정 미리보기"
          description="넓은 모달 표면 예시입니다."
          size="lg"
          onClose={() => setLargeModalOpen(false)}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-none border border-[var(--editorial-line-soft)] bg-[var(--editorial-surface-muted)] p-6">
              <p className="font-sans text-xs font-bold tracking-wider text-[var(--editorial-ink)] uppercase">제목</p>
              <p className="mt-2 font-serif text-sm text-[var(--editorial-ink-soft)] italic">7월 정기 독서 모임</p>
            </div>
            <div className="rounded-none border border-[var(--editorial-line-soft)] bg-[var(--editorial-surface-muted)] p-6">
              <p className="font-sans text-xs font-bold tracking-wider text-[var(--editorial-ink)] uppercase">장소</p>
              <p className="mt-2 font-serif text-sm text-[var(--editorial-ink-soft)] italic">대전광역시 중구 중앙로</p>
            </div>
          </div>
        </EditorialModal>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Confirm" title="Confirm flows">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Default confirm">
            <div className="space-y-4">
              <p className={descriptionClassName}>상태 변경, 구독 등록처럼 되돌릴 수 있는 동작에 사용합니다.</p>
              <button className={primaryButtonClassName} type="button" onClick={() => setConfirmOpen(true)}>
                확인 열기
              </button>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Danger confirm">
            <div className="space-y-4">
              <p className={descriptionClassName}>삭제, 초기화처럼 위험한 동작에는 red tone을 사용합니다.</p>
              <button
                className="rounded-none bg-[var(--editorial-danger)] px-5 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-[var(--editorial-line)]"
                type="button"
                onClick={() => setDangerConfirmOpen(true)}
              >
                삭제 확인 열기
              </button>
            </div>
          </PreviewPanel>
        </div>

        <EditorialConfirm
          open={confirmOpen}
          title="알림을 구독할까요?"
          confirmLabel="구독"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => setConfirmOpen(false)}
        >
          이 사이트의 댓글 알림과 일정 변경 알림을 받을 수 있습니다.
        </EditorialConfirm>

        <EditorialConfirm
          open={dangerConfirmOpen}
          title="게시글을 삭제할까요?"
          confirmLabel="삭제"
          tone="danger"
          onCancel={() => setDangerConfirmOpen(false)}
          onConfirm={() => setDangerConfirmOpen(false)}
        >
          삭제한 게시글은 복구할 수 없습니다. 관련 첨부파일과 댓글도 함께 정리됩니다.
        </EditorialConfirm>
      </StyleGuideSection>
    </>
  );
}
