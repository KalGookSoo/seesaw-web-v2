'use client';

import { useState } from 'react';
import {
  IosAlert,
  IosConfirm,
  IosModal
} from 'app/style-guide/ios/_components/feedback';
import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/ios/_components/style-guide-section';

const primaryButtonClassName =
  'rounded-lg bg-[var(--ios-blue)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--ios-blue-muted)]';
const secondaryButtonClassName =
  'rounded-lg bg-[var(--ios-fill)] px-5 py-3 text-sm font-semibold text-[var(--ios-label)] transition-colors hover:bg-[var(--ios-fill-strong)]';
const descriptionClassName =
  'text-sm leading-6 text-[var(--ios-secondary-label)]';
const inputClassName =
  'h-11 w-full rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-surface)] px-3 font-mono text-xs text-[var(--ios-label)] outline-none focus:border-[var(--ios-blue)]';

export default function StyleGuideFeedbackPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [largeModalOpen, setLargeModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dangerConfirmOpen, setDangerConfirmOpen] = useState(false);

  return (
    <>
      <PageIntro title="Alert · Modal · Confirm">
        피드백 컴포넌트는 사용자 행동의 결과와 위험한 결정을 명확하게 다룹니다.
        `Alert`는 인라인 상태 전달, `Modal`은 집중 입력, `Confirm`은 취소 가능한
        최종 확인에 사용합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Alert" title="Alert variants">
        <div className="grid gap-6 lg:grid-cols-2">
          <IosAlert title="정보" variant="info">
            새 댓글 알림을 받을 수 있도록 브라우저 알림 권한을 허용해주세요.
          </IosAlert>
          <IosAlert title="성공" variant="success">
            캘린더 구독 URL이 클립보드에 복사되었습니다.
          </IosAlert>
          <IosAlert title="주의" variant="warning">
            현재 카테고리는 검색엔진 노출 대상이 아닙니다.
          </IosAlert>
          <IosAlert title="오류" variant="danger">
            요청 값을 다시 확인해주세요. UUID v4 형식이 아닙니다.
          </IosAlert>
          <IosAlert variant="neutral">
            제목 없이 짧은 안내만 전달할 때 사용하는 neutral alert입니다.
          </IosAlert>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Modal" title="Modal sizes and actions">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Default modal">
            <div className="space-y-4">
              <p className={descriptionClassName}>
                일반적인 입력, 복사, 상세 보기 흐름에 사용합니다.
              </p>
              <button
                className={primaryButtonClassName}
                type="button"
                onClick={() => setModalOpen(true)}
              >
                기본 모달 열기
              </button>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Large modal">
            <div className="space-y-4">
              <p className={descriptionClassName}>
                본문 편집, 긴 설명, 미리보기처럼 넓은 표면이 필요할 때
                사용합니다.
              </p>
              <button
                className={secondaryButtonClassName}
                type="button"
                onClick={() => setLargeModalOpen(true)}
              >
                큰 모달 열기
              </button>
            </div>
          </PreviewPanel>
        </div>

        <IosModal
          open={modalOpen}
          title="캘린더 구독 URL"
          description="구독 가능한 공개 캘린더 주소를 복사합니다."
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button
                className={secondaryButtonClassName}
                type="button"
                onClick={() => setModalOpen(false)}
              >
                닫기
              </button>
              <button
                className={primaryButtonClassName}
                type="button"
                onClick={() => setModalOpen(false)}
              >
                복사
              </button>
            </>
          }
        >
          <input
            className={inputClassName}
            readOnly
            value="https://daejeonstickybook.seesaw.me.kr/api/calendar.ics"
          />
        </IosModal>

        <IosModal
          open={largeModalOpen}
          title="일정 미리보기"
          description="넓은 모달 표면 예시입니다."
          size="lg"
          onClose={() => setLargeModalOpen(false)}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-surface-grouped)] p-5">
              <p className="text-sm font-semibold text-[var(--ios-label)]">
                제목
              </p>
              <p className="mt-2 text-sm text-[var(--ios-secondary-label)]">
                7월 정기 독서 모임
              </p>
            </div>
            <div className="rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-surface-grouped)] p-5">
              <p className="text-sm font-semibold text-[var(--ios-label)]">
                장소
              </p>
              <p className="mt-2 text-sm text-[var(--ios-secondary-label)]">
                대전광역시 중구 중앙로
              </p>
            </div>
          </div>
        </IosModal>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Confirm" title="Confirm flows">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Default confirm">
            <div className="space-y-4">
              <p className={descriptionClassName}>
                상태 변경, 구독 등록처럼 되돌릴 수 있는 동작에 사용합니다.
              </p>
              <button
                className={primaryButtonClassName}
                type="button"
                onClick={() => setConfirmOpen(true)}
              >
                확인 열기
              </button>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Danger confirm">
            <div className="space-y-4">
              <p className={descriptionClassName}>
                삭제, 초기화처럼 위험한 동작에는 red tone을 사용합니다.
              </p>
              <button
                className="rounded-lg bg-[var(--ios-red)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110"
                type="button"
                onClick={() => setDangerConfirmOpen(true)}
              >
                삭제 확인 열기
              </button>
            </div>
          </PreviewPanel>
        </div>

        <IosConfirm
          open={confirmOpen}
          title="알림을 구독할까요?"
          confirmLabel="구독"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => setConfirmOpen(false)}
        >
          이 사이트의 댓글 알림과 일정 변경 알림을 받을 수 있습니다.
        </IosConfirm>

        <IosConfirm
          open={dangerConfirmOpen}
          title="게시글을 삭제할까요?"
          confirmLabel="삭제"
          tone="danger"
          onCancel={() => setDangerConfirmOpen(false)}
          onConfirm={() => setDangerConfirmOpen(false)}
        >
          삭제한 게시글은 복구할 수 없습니다. 관련 첨부파일과 댓글도 함께
          정리됩니다.
        </IosConfirm>
      </StyleGuideSection>
    </>
  );
}
