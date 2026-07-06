'use client';

import { useState } from 'react';

import { Alert } from 'components/ui/alert';
import { Confirm } from 'components/ui/confirm';
import { Modal } from 'components/ui/modal';
import { PageIntro, PreviewPanel, StyleGuideSection } from 'app/style-guide/editorial/_components/style-guide-section';

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
        <div className="grid gap-4 lg:grid-cols-2">
          <Alert title="정보" variant="info">
            새 댓글 알림을 받을 수 있도록 브라우저 알림 권한을 허용해주세요.
          </Alert>
          <Alert title="성공" variant="success">
            캘린더 구독 URL이 클립보드에 복사되었습니다.
          </Alert>
          <Alert title="주의" variant="warning">
            현재 카테고리는 검색엔진 노출 대상이 아닙니다.
          </Alert>
          <Alert title="오류" variant="danger">
            요청 값을 다시 확인해주세요. UUID v4 형식이 아닙니다.
          </Alert>
          <Alert variant="neutral">제목 없이 짧은 안내만 전달할 때 사용하는 neutral alert입니다.</Alert>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Modal" title="Modal sizes and actions">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Default modal">
            <div className="space-y-4">
              <p className="text-neutral-600 text-sm leading-6 dark:text-neutral-400 font-serif italic">일반적인 입력, 복사, 상세 보기 흐름에 사용합니다.</p>
              <button
                className="bg-[#6b1d2f] dark:bg-[#e05a76] hover:bg-neutral-950 dark:hover:bg-white dark:hover:text-neutral-950 rounded-none px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors"
                type="button"
                onClick={() => setModalOpen(true)}
              >
                기본 모달 열기
              </button>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Large modal">
            <div className="space-y-4">
              <p className="text-neutral-600 text-sm leading-6 dark:text-neutral-400 font-serif italic">
                본문 편집, 긴 설명, 미리보기처럼 넓은 표면이 필요할 때 사용합니다.
              </p>
              <button
                className="border-neutral-950 text-neutral-950 hover:bg-neutral-950 hover:text-white rounded-none border px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors dark:border-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-50 dark:hover:text-neutral-950"
                type="button"
                onClick={() => setLargeModalOpen(true)}
              >
                큰 모달 열기
              </button>
            </div>
          </PreviewPanel>
        </div>

        <Modal
          open={modalOpen}
          title="캘린더 구독 URL"
          description="구독 가능한 공개 캘린더 주소를 복사합니다."
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button
                className="border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100 rounded-none border px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-950"
                type="button"
                onClick={() => setModalOpen(false)}
              >
                닫기
              </button>
              <button
                className="bg-[#6b1d2f] dark:bg-[#e05a76] hover:bg-neutral-950 dark:hover:bg-white dark:hover:text-neutral-950 rounded-none px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors"
                type="button"
                onClick={() => setModalOpen(false)}
              >
                복사
              </button>
            </>
          }
        >
          <input
            className="border-neutral-300 bg-neutral-50 text-neutral-900 h-11 w-full rounded-none border px-3 font-mono text-xs outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
            readOnly
            value="https://daejeonstickybook.seesaw.me.kr/api/calendar.ics"
          />
        </Modal>

        <Modal
          open={largeModalOpen}
          title="일정 미리보기"
          description="넓은 모달 표면 예시입니다."
          size="lg"
          onClose={() => setLargeModalOpen(false)}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="bg-neutral-100/50 p-6 rounded-none dark:bg-neutral-900/50 border border-neutral-950/10 dark:border-neutral-800">
              <p className="text-neutral-900 dark:text-neutral-100 text-xs font-bold uppercase tracking-wider font-sans">제목</p>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-sm font-serif italic">7월 정기 독서 모임</p>
            </div>
            <div className="bg-neutral-100/50 p-6 rounded-none dark:bg-neutral-900/50 border border-neutral-950/10 dark:border-neutral-800">
              <p className="text-neutral-900 dark:text-neutral-100 text-xs font-bold uppercase tracking-wider font-sans">장소</p>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-sm font-serif italic">대전광역시 중구 중앙로</p>
            </div>
          </div>
        </Modal>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Confirm" title="Confirm flows">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Default confirm">
            <div className="space-y-4">
              <p className="text-neutral-600 text-sm leading-6 dark:text-neutral-400 font-serif italic">상태 변경, 구독 등록처럼 되돌릴 수 있는 동작에 사용합니다.</p>
              <button
                className="bg-[#6b1d2f] dark:bg-[#e05a76] hover:bg-neutral-950 dark:hover:bg-white dark:hover:text-neutral-950 rounded-none px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors"
                type="button"
                onClick={() => setConfirmOpen(true)}
              >
                확인 열기
              </button>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Danger confirm">
            <div className="space-y-4">
              <p className="text-neutral-600 text-sm leading-6 dark:text-neutral-400 font-serif italic">삭제, 초기화처럼 위험한 동작에는 red tone을 사용합니다.</p>
              <button
                className="bg-red-700 hover:bg-red-800 rounded-none px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors"
                type="button"
                onClick={() => setDangerConfirmOpen(true)}
              >
                삭제 확인 열기
              </button>
            </div>
          </PreviewPanel>
        </div>

        <Confirm
          open={confirmOpen}
          title="알림을 구독할까요?"
          confirmLabel="구독"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => setConfirmOpen(false)}
        >
          이 사이트의 댓글 알림과 일정 변경 알림을 받을 수 있습니다.
        </Confirm>

        <Confirm
          open={dangerConfirmOpen}
          title="게시글을 삭제할까요?"
          confirmLabel="삭제"
          tone="danger"
          onCancel={() => setDangerConfirmOpen(false)}
          onConfirm={() => setDangerConfirmOpen(false)}
        >
          삭제한 게시글은 복구할 수 없습니다. 관련 첨부파일과 댓글도 함께 정리됩니다.
        </Confirm>
      </StyleGuideSection>
    </>
  );
}
