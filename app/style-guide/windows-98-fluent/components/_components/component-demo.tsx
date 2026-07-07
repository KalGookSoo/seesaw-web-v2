'use client';

import type { ComponentProps, ReactNode, RefObject } from 'react';
import { useRef, useState } from 'react';
import {
  Windows98FluentAlert,
  Windows98FluentModal
} from 'app/style-guide/windows-98-fluent/_components/feedback';
import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/windows-98-fluent/_components/style-guide-section';
import {
  getWindows98ComponentItem,
  type Windows98ComponentSlug
} from 'app/style-guide/windows-98-fluent/components/_components/component-items';

function WindowBox({
  children,
  title
}: Readonly<{
  children: ReactNode;
  title: string;
}>) {
  return (
    <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
      <div className="flex items-center justify-between bg-[var(--windows-98-fluent-accent)] px-3 py-2 font-mono text-sm font-bold text-[var(--windows-98-fluent-accent-contrast)]">
        <span>{title}</span>
        <button
          className="flex size-6 shrink-0 items-center justify-center border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] font-mono text-sm leading-none font-bold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)]"
          type="button"
          aria-label="닫기"
        >
          ×
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const raisedButton =
  'border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] px-4 py-2 font-mono text-sm font-semibold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)] active:shadow-[var(--windows-98-fluent-inset-pressed)]';

const activeButton =
  'border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-accent)] px-4 py-2 font-mono text-sm font-semibold text-[var(--windows-98-fluent-accent-contrast)] shadow-[var(--windows-98-fluent-inset-pressed)]';

const outlineButton =
  'border border-[var(--windows-98-fluent-separator)] bg-transparent px-4 py-2 font-mono text-sm font-semibold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)] active:shadow-[var(--windows-98-fluent-inset-pressed)]';

const linkButton =
  'font-mono text-sm font-semibold text-[var(--windows-98-fluent-accent)] underline underline-offset-4 hover:text-[var(--windows-98-fluent-blue)]';

const textInput =
  'h-10 border border-[var(--windows-98-fluent-separator)] bg-white px-3 font-mono text-sm text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset-pressed)] outline-none';

const compactIconButton =
  'border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] px-2 py-1 font-mono text-sm font-bold leading-none text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)] active:shadow-[var(--windows-98-fluent-inset-pressed)]';

function Windows98TextInput({
  className = '',
  ...props
}: Readonly<ComponentProps<'input'>>) {
  return <input {...props} className={`${textInput} ${className}`} />;
}

function Windows98IconButton({
  className = '',
  ...props
}: Readonly<ComponentProps<'button'>>) {
  return <button {...props} className={`${compactIconButton} ${className}`} />;
}

function Windows98Dropdown({
  label,
  onSelect,
  onToggle,
  open,
  options,
  selected
}: Readonly<{
  label: string;
  onSelect: (item: string) => void;
  onToggle: () => void;
  open: boolean;
  options: readonly string[];
  selected: string;
}>) {
  return (
    <div className="relative inline-block">
      <button
        className={`${raisedButton} min-w-52 text-left`}
        type="button"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="flex items-center justify-between gap-4">
          <span>{selected}</span>
          <span aria-hidden="true">▾</span>
        </span>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 z-20 mt-1 min-w-52 border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface-elevated)] p-1 shadow-[var(--windows-98-fluent-inset)]"
          role="menu"
          aria-label={label}
        >
          {options.map((item) => (
            <button
              key={item}
              className={`block w-full px-4 py-2 text-left font-mono text-sm ${
                selected === item
                  ? 'bg-[var(--windows-98-fluent-accent)] font-bold text-[var(--windows-98-fluent-accent-contrast)]'
                  : 'text-[var(--windows-98-fluent-label)] hover:bg-[var(--windows-98-fluent-accent)] hover:text-[var(--windows-98-fluent-accent-contrast)]'
              }`}
              type="button"
              role="menuitem"
              onClick={() => onSelect(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const carouselSlides = [
  {
    caption: 'SLIDE 01',
    description: '사이트 대표 공지 영역'
  },
  {
    caption: 'SLIDE 02',
    description: '이번 달 일정 요약'
  },
  {
    caption: 'SLIDE 03',
    description: '최근 게시글 묶음'
  }
] as const;

function renderDemo(
  slug: Windows98ComponentSlug,
  controls: Readonly<{
    carouselIndex: number;
    dropdownOpen: boolean;
    dropdownSelected: string;
    modalOpen: boolean;
    navActive: string;
    offcanvasBackdrop: boolean;
    offcanvasOpen: boolean;
    offcanvasPlacement: string;
    pageNumber: string;
    popoverOpen: boolean;
    progressValue: number;
    selectedGroup: string;
    selectedTab: string;
    searchScopeDropdownOpen: boolean;
    searchScopeSelected: string;
    scrollspyNestedActive: string;
    scrollspyTopActive: string;
    toastVisible: boolean;
    tooltipVisible: boolean;
    onCarouselNext: () => void;
    onCarouselPrevious: () => void;
    onDropdownToggle: () => void;
    onDropdownSelect: (item: string) => void;
    onModalClose: () => void;
    onModalOpen: () => void;
    onNavSelect: (item: string) => void;
    onOffcanvasBackdropToggle: () => void;
    onOffcanvasPlacementChange: (item: string) => void;
    onOffcanvasToggle: () => void;
    onPageSelect: (item: string) => void;
    onPopoverToggle: () => void;
    onProgressAdvance: () => void;
    onSelectedGroupChange: (item: string) => void;
    onSelectedTabChange: (item: string) => void;
    onSearchScopeSelect: (item: string) => void;
    onScrollspyNestedScroll: () => void;
    onScrollspyTopScroll: () => void;
    onToastClose: () => void;
    onToastOpen: () => void;
    onTooltipHide: () => void;
    onTooltipShow: () => void;
    scrollspyNestedRef: RefObject<HTMLDivElement | null>;
    scrollspyTopRef: RefObject<HTMLDivElement | null>;
  }>
) {
  switch (slug) {
    case 'accordion':
      return (
        <div className="space-y-2">
          {['카테고리 정책', 'PWA 정책', '알림 정책'].map((title, index) => (
            <details
              key={title}
              className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface-elevated)] shadow-[var(--windows-98-fluent-inset)]"
              open={index === 0}
            >
              <summary className="cursor-pointer bg-[var(--windows-98-fluent-fill)] px-4 py-3 font-mono text-sm font-bold text-[var(--windows-98-fluent-label)]">
                {title}
              </summary>
              <p className="border-t border-[var(--windows-98-fluent-separator)] px-4 py-3 text-sm text-[var(--windows-98-fluent-secondary-label)]">
                Windows 98 스타일의 접힘 영역입니다. 열린 패널은 눌린 영역처럼
                보입니다.
              </p>
            </details>
          ))}
        </div>
      );
    case 'alert':
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <Windows98FluentAlert title="정보" variant="info">
            새 댓글 알림을 받을 수 있도록 브라우저 알림 권한을 허용해주세요.
          </Windows98FluentAlert>
          <Windows98FluentAlert title="성공" variant="success">
            캘린더 구독 URL이 클립보드에 복사되었습니다.
          </Windows98FluentAlert>
          <Windows98FluentAlert title="주의" variant="warning">
            현재 카테고리는 검색엔진 노출 대상이 아닙니다.
          </Windows98FluentAlert>
          <Windows98FluentAlert title="오류" variant="danger">
            요청 값을 다시 확인해주세요. UUID v4 형식이 아닙니다.
          </Windows98FluentAlert>
          <Windows98FluentAlert variant="neutral">
            제목 없이 짧은 안내만 전달할 때 사용하는 neutral alert입니다.
          </Windows98FluentAlert>
        </div>
      );
    case 'badge':
      return (
        <div className="flex flex-wrap gap-3">
          {['NEW', 'D-3', 'PUBLIC', 'ADMIN', 'SYNC'].map((label, index) => (
            <span
              key={label}
              className={`border border-[var(--windows-98-fluent-separator)] px-3 py-1 font-mono text-xs font-bold shadow-[var(--windows-98-fluent-inset)] ${
                index === 0
                  ? 'bg-[var(--windows-98-fluent-accent)] text-[var(--windows-98-fluent-accent-contrast)]'
                  : 'bg-[var(--windows-98-fluent-fill)] text-[var(--windows-98-fluent-label)]'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      );
    case 'breadcrumb':
      return (
        <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] px-4 py-3 font-mono text-sm shadow-[var(--windows-98-fluent-inset-pressed)]">
          <a className="underline" href="#">
            Home
          </a>
          <span className="px-2">\</span>
          <a className="underline" href="#">
            Articles
          </a>
          <span className="px-2">\</span>
          <span className="font-bold">Schedule</span>
        </div>
      );
    case 'button':
      return (
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="font-mono text-xs font-bold tracking-normal text-[var(--windows-98-fluent-secondary-label)] uppercase">
              Basic
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button className={raisedButton} type="button">
                Default
              </button>
              <button className={activeButton} type="button">
                Primary
              </button>
              <button
                className={`${raisedButton} opacity-60`}
                type="button"
                disabled
              >
                Disabled
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-xs font-bold tracking-normal text-[var(--windows-98-fluent-secondary-label)] uppercase">
              Color variants
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {[
                ['Info', 'bg-[var(--windows-98-fluent-blue)] text-white'],
                ['Success', 'bg-[var(--windows-98-fluent-success)] text-white'],
                ['Warning', 'bg-[var(--windows-98-fluent-warning)] text-black'],
                [
                  'Danger',
                  'bg-[var(--windows-98-fluent-red)] text-[var(--windows-98-fluent-danger-contrast)]'
                ],
                [
                  'Secondary',
                  'bg-[var(--windows-98-fluent-fill-strong)] text-[var(--windows-98-fluent-label)]'
                ]
              ].map(([label, className]) => (
                <button
                  key={label}
                  className={`border border-[var(--windows-98-fluent-separator)] px-4 py-2 font-mono text-sm font-semibold shadow-[var(--windows-98-fluent-inset)] active:shadow-[var(--windows-98-fluent-inset-pressed)] ${className}`}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-xs font-bold tracking-normal text-[var(--windows-98-fluent-secondary-label)] uppercase">
              Outline and link
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button className={outlineButton} type="button">
                Outline
              </button>
              <button
                className={`${outlineButton} border-[var(--windows-98-fluent-accent)] text-[var(--windows-98-fluent-accent)]`}
                type="button"
              >
                Outline primary
              </button>
              <button className={linkButton} type="button">
                Link button
              </button>
              <a className={linkButton} href="#">
                Anchor link
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-xs font-bold tracking-normal text-[var(--windows-98-fluent-secondary-label)] uppercase">
              Sizes
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] px-6 py-3 font-mono text-base font-semibold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)] active:shadow-[var(--windows-98-fluent-inset-pressed)]"
                type="button"
              >
                Large
              </button>
              <button className={raisedButton} type="button">
                Default
              </button>
              <button
                className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] px-3 py-1.5 font-mono text-xs font-semibold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)] active:shadow-[var(--windows-98-fluent-inset-pressed)]"
                type="button"
              >
                Small
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-xs font-bold tracking-normal text-[var(--windows-98-fluent-secondary-label)] uppercase">
              Block
            </p>
            <button
              className={`${activeButton} w-full justify-center`}
              type="button"
            >
              Full width button
            </button>
          </div>
        </div>
      );
    case 'button-group':
      return (
        <div className="inline-flex border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] p-1 shadow-[var(--windows-98-fluent-inset-pressed)]">
          {['Left', 'Center', 'Right'].map((item) => (
            <button
              key={item}
              className={
                controls.selectedGroup === item ? activeButton : raisedButton
              }
              type="button"
              onClick={() => controls.onSelectedGroupChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      );
    case 'card':
      return (
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
            <div className="bg-[var(--windows-98-fluent-accent)] px-3 py-2 font-mono text-sm font-bold text-[var(--windows-98-fluent-accent-contrast)]">
              IMAGE_CARD.EXE
            </div>
            <div className="p-3">
              <div className="aspect-[4/3] border border-[var(--windows-98-fluent-separator)] bg-[linear-gradient(135deg,var(--windows-98-fluent-blue),var(--windows-98-fluent-background))] p-2 shadow-[var(--windows-98-fluent-inset-pressed)]">
                <div className="flex h-full items-end border border-white/40 bg-[radial-gradient(circle_at_72%_24%,rgba(255,255,255,0.88)_0_9%,transparent_10%),linear-gradient(160deg,rgba(255,255,255,0.2),rgba(0,0,0,0.15))] p-3">
                  <span className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] px-2 py-1 font-mono text-xs font-bold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)]">
                    PHOTO.BMP
                  </span>
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <div>
                  <p className="font-mono text-xs font-bold text-[var(--windows-98-fluent-secondary-label)] uppercase">
                    Exhibition
                  </p>
                  <h4 className="mt-1 font-semibold text-[var(--windows-98-fluent-label)]">
                    기록으로 남긴 골목 산책
                  </h4>
                </div>
                <p className="text-sm leading-6 text-[var(--windows-98-fluent-secondary-label)]">
                  이미지가 핵심인 게시글 목록, 앨범형 콘텐츠, 장소 소개에
                  사용하는 기본 카드입니다.
                </p>
                <button className={raisedButton} type="button">
                  Open
                </button>
              </div>
            </div>
          </article>

          <article className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)] lg:col-span-2">
            <div className="grid min-h-full md:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="aspect-[16/10] border border-[var(--windows-98-fluent-separator)] bg-[linear-gradient(135deg,#1f4ea8,#76a9ff_48%,#dfefff)] p-3 shadow-[var(--windows-98-fluent-inset-pressed)] md:aspect-auto">
                <div className="flex h-full items-end justify-between border border-white/50 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.35))] p-4">
                  <span className="font-mono text-xs font-bold text-white">
                    COVER_IMAGE.JPG
                  </span>
                  <span className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-warning)] px-2 py-1 font-mono text-xs font-bold text-black shadow-[var(--windows-98-fluent-inset)]">
                    NEW
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-between border border-[var(--windows-98-fluent-line-soft)] bg-[var(--windows-98-fluent-surface-elevated)] p-5 shadow-[var(--windows-98-fluent-inset-pressed)]">
                <div className="space-y-3">
                  <p className="font-mono text-xs font-bold text-[var(--windows-98-fluent-secondary-label)] uppercase">
                    Featured
                  </p>
                  <h4 className="text-lg font-semibold text-[var(--windows-98-fluent-label)]">
                    이번 주 커뮤니티 하이라이트
                  </h4>
                  <p className="text-sm leading-6 text-[var(--windows-98-fluent-secondary-label)]">
                    넓은 커버 이미지를 먼저 보여주고, 우측에 설명과 액션을
                    배치하는 강조 카드입니다.
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button className={activeButton} type="button">
                    Read
                  </button>
                  <button className={raisedButton} type="button">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)] lg:col-span-3">
            <div className="grid gap-4 p-3 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
              <div className="aspect-square border border-[var(--windows-98-fluent-separator)] bg-[linear-gradient(135deg,var(--windows-98-fluent-success),var(--windows-98-fluent-surface-elevated))] p-2 shadow-[var(--windows-98-fluent-inset-pressed)]">
                <div className="h-full border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.25),rgba(0,0,0,0.12))]" />
              </div>
              <div>
                <p className="font-mono text-xs font-bold text-[var(--windows-98-fluent-secondary-label)] uppercase">
                  Compact image card
                </p>
                <h4 className="mt-1 font-semibold text-[var(--windows-98-fluent-label)]">
                  정사각 썸네일을 가진 리스트형 카드
                </h4>
                <p className="mt-2 text-sm leading-6 text-[var(--windows-98-fluent-secondary-label)]">
                  모바일 목록이나 검색 결과처럼 이미지와 텍스트를 압축해서
                  보여줄 때 사용합니다.
                </p>
              </div>
              <button className={raisedButton} type="button">
                Details
              </button>
            </div>
          </article>
        </div>
      );
    case 'carousel':
      const carouselSlide = carouselSlides[controls.carouselIndex];
      return (
        <div className="space-y-3">
          <div className="flex aspect-[16/7] flex-col items-center justify-center gap-3 border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-background)] font-mono text-white shadow-[var(--windows-98-fluent-inset-pressed)]">
            <span className="text-sm font-bold">{carouselSlide.caption}</span>
            <span className="text-xs">{carouselSlide.description}</span>
          </div>
          <div className="flex justify-between">
            <button
              className={raisedButton}
              type="button"
              onClick={controls.onCarouselPrevious}
            >
              Prev
            </button>
            <div className="flex items-center gap-1">
              {carouselSlides.map((slide, index) => (
                <button
                  key={slide.caption}
                  className={`size-3 border border-[var(--windows-98-fluent-separator)] ${
                    index === controls.carouselIndex
                      ? 'bg-[var(--windows-98-fluent-accent)]'
                      : 'bg-[var(--windows-98-fluent-surface)]'
                  }`}
                  type="button"
                  aria-label={`${index + 1}번 슬라이드`}
                />
              ))}
            </div>
            <button
              className={raisedButton}
              type="button"
              onClick={controls.onCarouselNext}
            >
              Next
            </button>
          </div>
        </div>
      );
    case 'details':
      return (
        <details
          className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] shadow-[var(--windows-98-fluent-inset)]"
          open
        >
          <summary className="cursor-pointer bg-[var(--windows-98-fluent-fill)] px-4 py-3 font-mono text-sm font-bold">
            SYSTEM DETAILS
          </summary>
          <dl className="grid grid-cols-[8rem_1fr] gap-2 border-t border-[var(--windows-98-fluent-separator)] p-4 text-sm">
            <dt className="font-bold">Theme</dt>
            <dd>Windows 98 Fluent</dd>
            <dt className="font-bold">Status</dt>
            <dd>Ready</dd>
          </dl>
        </details>
      );
    case 'dropdown':
      return (
        <Windows98Dropdown
          label="정렬 기준"
          open={controls.dropdownOpen}
          options={['Latest', 'Fixed order', 'Most viewed']}
          selected={controls.dropdownSelected}
          onToggle={controls.onDropdownToggle}
          onSelect={controls.onDropdownSelect}
        />
      );
    case 'list-group':
      return (
        <ul className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface-elevated)] text-sm shadow-[var(--windows-98-fluent-inset-pressed)]">
          {['최근 공지', '이번 주 일정', '문의 내역'].map((item, index) => (
            <li
              key={item}
              className={`px-4 py-3 ${index < 2 ? 'border-b border-[var(--windows-98-fluent-separator)]' : 'font-bold'}`}
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case 'modal':
      return (
        <div className="space-y-4">
          <button
            className={raisedButton}
            type="button"
            onClick={controls.onModalOpen}
          >
            Open modal
          </button>
          <Windows98FluentModal
            open={controls.modalOpen}
            title="캘린더 구독 URL"
            description="구독 가능한 공개 캘린더 주소를 복사합니다."
            onClose={controls.onModalClose}
            footer={
              <>
                <button
                  className={raisedButton}
                  type="button"
                  onClick={controls.onModalClose}
                >
                  닫기
                </button>
                <button
                  className={activeButton}
                  type="button"
                  onClick={controls.onModalClose}
                >
                  복사
                </button>
              </>
            }
          >
            <input
              className="h-11 w-full border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface-elevated)] px-3 font-mono text-xs text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset-pressed)] outline-none focus:bg-white"
              readOnly
              value="https://daejeonstickybook.seesaw.me.kr/api/calendar.ics"
            />
          </Windows98FluentModal>
        </div>
      );
    case 'nav':
      return (
        <nav className="flex flex-wrap gap-1 border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] p-1 shadow-[var(--windows-98-fluent-inset-pressed)]">
          {['Home', 'Articles', 'Calendar'].map((item) => (
            <button
              key={item}
              className={
                controls.navActive === item ? activeButton : raisedButton
              }
              type="button"
              onClick={() => controls.onNavSelect(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      );
    case 'navbar':
      return (
        <div className="space-y-6">
          <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
            <div className="flex items-center justify-between gap-3 bg-[var(--windows-98-fluent-accent)] px-3 py-2 text-[var(--windows-98-fluent-accent-contrast)]">
              <Windows98IconButton type="button" aria-label="메뉴 열기">
                ☰
              </Windows98IconButton>
              <strong className="font-mono text-sm">
                daejeonstickybook.exe
              </strong>
              <nav className="hidden items-center gap-4 font-mono text-sm font-semibold md:flex">
                <a className="underline" href="#">
                  홈
                </a>
                <a className="underline" href="#">
                  공지
                </a>
                <a className="underline" href="#">
                  일정
                </a>
              </nav>
            </div>
            <div className="grid gap-2 border border-[var(--windows-98-fluent-line-soft)] bg-[var(--windows-98-fluent-surface-elevated)] p-3 shadow-[var(--windows-98-fluent-inset-pressed)] sm:grid-cols-[1fr_auto]">
              <Windows98TextInput
                defaultValue="동네 소식"
                aria-label="통합검색어"
              />
              <button className={raisedButton} type="button">
                통합검색
              </button>
            </div>
          </div>

          <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
            <div className="grid gap-3 bg-[var(--windows-98-fluent-surface-elevated)] p-3 shadow-[var(--windows-98-fluent-inset-pressed)] lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="flex items-center gap-3">
                <Windows98IconButton type="button" aria-label="메뉴 열기">
                  ☰
                </Windows98IconButton>
                <div>
                  <strong className="block font-mono text-sm whitespace-nowrap text-[var(--windows-98-fluent-label)]">
                    LOCAL.MARKET
                  </strong>
                  <span className="font-mono text-xs text-[var(--windows-98-fluent-secondary-label)]">
                    대전 중구
                  </span>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-[minmax(12rem,1fr)_auto]">
                <Windows98TextInput
                  placeholder="동네 물건, 모임, 장소 검색"
                  aria-label="동네 검색어"
                />
                <button className={activeButton} type="button">
                  찾아보기
                </button>
              </div>
              <nav className="flex flex-wrap justify-start gap-1 lg:justify-end">
                {['중고거래', '동네생활', '알바', '부동산'].map((item) => (
                  <a
                    key={item}
                    className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] px-3 py-2 font-mono text-xs font-bold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)]"
                    href="#"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
            <div className="space-y-3 bg-[var(--windows-98-fluent-fill)] p-3 shadow-[var(--windows-98-fluent-inset-pressed)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-accent)] px-3 py-2 font-mono text-sm font-bold text-[var(--windows-98-fluent-accent-contrast)] shadow-[var(--windows-98-fluent-inset)]">
                    SHOP
                  </span>
                  <strong className="font-mono text-sm text-[var(--windows-98-fluent-label)]">
                    Select Goods
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  <button className={raisedButton} type="button">
                    로그인
                  </button>
                  <button className={raisedButton} type="button">
                    장바구니 2
                  </button>
                </div>
              </div>
              <div className="grid gap-2 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                <nav className="flex gap-1 overflow-x-auto">
                  {['New', 'Women', 'Men', 'Life', 'Sale'].map((item) => (
                    <button
                      key={item}
                      className={item === 'New' ? activeButton : raisedButton}
                      type="button"
                    >
                      {item}
                    </button>
                  ))}
                </nav>
                <Windows98TextInput
                  placeholder="브랜드, 상품명 검색"
                  aria-label="상품 검색어"
                />
                <button className={raisedButton} type="button">
                  검색
                </button>
              </div>
            </div>
          </div>

          <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
            <div className="grid gap-3 bg-[var(--windows-98-fluent-surface-elevated)] p-3 shadow-[var(--windows-98-fluent-inset-pressed)] md:grid-cols-[auto_1fr_auto] md:items-center">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="size-8 border border-[var(--windows-98-fluent-separator)] bg-[linear-gradient(135deg,#ff7a90,#ffc5d0)] shadow-[var(--windows-98-fluent-inset)]" />
                  <strong className="font-mono text-sm text-[var(--windows-98-fluent-label)]">
                    DAILY.FEED
                  </strong>
                </div>
                <Windows98IconButton
                  type="button"
                  aria-label="메뉴 열기"
                  className="md:hidden"
                >
                  ☰
                </Windows98IconButton>
              </div>
              <div className="mx-auto grid max-w-md grid-cols-[1fr_auto] gap-1">
                <Windows98TextInput
                  placeholder="계정, 태그, 장소 검색"
                  aria-label="피드 검색어"
                />
                <button className={raisedButton} type="button">
                  검색
                </button>
              </div>
              <div className="flex justify-start gap-2 md:justify-end">
                {['홈', '탐색', '작성', '프로필'].map((item, index) => (
                  <button
                    key={item}
                    className={index === 0 ? activeButton : raisedButton}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
            <div className="grid gap-3 bg-[var(--windows-98-fluent-fill)] p-3 shadow-[var(--windows-98-fluent-inset-pressed)] lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="flex items-center gap-3">
                <Windows98IconButton type="button" aria-label="메뉴 열기">
                  ☰
                </Windows98IconButton>
                <span className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-red)] px-3 py-2 font-mono text-sm font-bold text-white shadow-[var(--windows-98-fluent-inset)]">
                  PLAY
                </span>
              </div>
              <div className="grid gap-1 sm:grid-cols-[1fr_auto]">
                <Windows98TextInput
                  placeholder="영상, 채널, 재생목록 검색"
                  aria-label="영상 검색어"
                />
                <button className={activeButton} type="button">
                  검색
                </button>
              </div>
              <div className="flex justify-start gap-2 lg:justify-end">
                <button className={raisedButton} type="button">
                  업로드
                </button>
                <button className={raisedButton} type="button">
                  알림
                </button>
              </div>
            </div>
          </div>

          <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
            <div className="space-y-3 bg-[var(--windows-98-fluent-surface-elevated)] p-3 shadow-[var(--windows-98-fluent-inset-pressed)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <strong className="block font-mono text-sm text-[var(--windows-98-fluent-label)]">
                    MAGAZINE 98
                  </strong>
                  <span className="font-mono text-xs text-[var(--windows-98-fluent-secondary-label)]">
                    오늘의 에디션
                  </span>
                </div>
                <Windows98IconButton type="button" aria-label="메뉴 열기">
                  ☰
                </Windows98IconButton>
              </div>
              <div className="grid gap-2 md:grid-cols-[auto_1fr_auto] md:items-center">
                <nav className="flex flex-wrap gap-2">
                  {['컬렉션', '인터뷰', '리뷰', '뉴스'].map((item) => (
                    <a
                      key={item}
                      className="font-mono text-sm font-semibold underline"
                      href="#"
                    >
                      {item}
                    </a>
                  ))}
                </nav>
                <Windows98TextInput
                  placeholder="콘텐츠 검색"
                  aria-label="콘텐츠 검색어"
                />
                <button className={raisedButton} type="button">
                  구독
                </button>
              </div>
            </div>
          </div>

          <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
            <div className="grid gap-3 bg-[var(--windows-98-fluent-fill)] p-3 shadow-[var(--windows-98-fluent-inset-pressed)] md:grid-cols-[auto_1fr_auto] md:items-center">
              <strong className="font-mono text-sm text-[var(--windows-98-fluent-label)]">
                N-PORTAL
              </strong>
              <div className="grid gap-1 sm:grid-cols-[auto_1fr_auto]">
                <Windows98Dropdown
                  label="검색 범위"
                  open={controls.searchScopeDropdownOpen}
                  options={['통합', '게시글', '일정']}
                  selected={controls.searchScopeSelected}
                  onToggle={() =>
                    controls.onSearchScopeSelect(controls.searchScopeSelected)
                  }
                  onSelect={controls.onSearchScopeSelect}
                />
                <Windows98TextInput
                  placeholder="무엇이든 검색"
                  aria-label="통합 포털 검색어"
                />
                <button className={activeButton} type="button">
                  검색
                </button>
              </div>
              <nav className="flex justify-start gap-2 md:justify-end">
                {['메일', '카페', '블로그'].map((item) => (
                  <a
                    key={item}
                    className="font-mono text-sm font-semibold underline"
                    href="#"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      );
    case 'offcanvas': {
      const offcanvasPlacementClassNames: Record<string, string> = {
        start: 'bottom-0 left-0 top-0 w-72 translate-x-0',
        end: 'bottom-0 right-0 top-0 w-72 translate-x-0',
        top: 'left-0 right-0 top-0 max-h-[17rem] translate-y-0',
        bottom: 'bottom-0 left-0 right-0 max-h-[17rem] translate-y-0'
      };
      const offcanvasHorizontal =
        controls.offcanvasPlacement === 'top' ||
        controls.offcanvasPlacement === 'bottom';

      return (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <button
              className={raisedButton}
              type="button"
              onClick={controls.onOffcanvasToggle}
            >
              {controls.offcanvasOpen ? 'Hide offcanvas' : 'Show offcanvas'}
            </button>
            <button
              className={
                controls.offcanvasBackdrop ? activeButton : raisedButton
              }
              type="button"
              onClick={controls.onOffcanvasBackdropToggle}
            >
              Backdrop
            </button>
            {['start', 'end', 'top', 'bottom'].map((item) => (
              <button
                key={item}
                className={
                  controls.offcanvasPlacement === item
                    ? activeButton
                    : raisedButton
                }
                type="button"
                onClick={() => controls.onOffcanvasPlacementChange(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="relative min-h-[28rem] overflow-hidden border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface-elevated)] p-1 shadow-[var(--windows-98-fluent-inset-pressed)]">
            <div className="flex h-full min-h-[27.5rem] flex-col">
              <div className="flex items-center justify-between bg-[var(--windows-98-fluent-accent)] px-3 py-2 font-mono text-sm font-bold text-[var(--windows-98-fluent-accent-contrast)]">
                <span>APPLICATION_VIEWPORT.EXE</span>
                <span className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] px-2 text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)]">
                  ×
                </span>
              </div>
              <div className="grid flex-1 place-items-center border border-[var(--windows-98-fluent-line-soft)] bg-[var(--windows-98-fluent-fill)] p-6 text-center shadow-[var(--windows-98-fluent-inset-pressed)]">
                <div className="max-w-sm space-y-3">
                  <p className="font-mono text-sm font-bold text-[var(--windows-98-fluent-label)]">
                    Page content
                  </p>
                  <p className="text-sm leading-6 text-[var(--windows-98-fluent-secondary-label)]">
                    오프캔버스는 현재 화면 위에 떠 있는 보조 패널입니다. 메뉴,
                    필터, 장바구니, 알림 목록처럼 본문을 잠깐 밀어내거나 덮는
                    흐름에 사용합니다.
                  </p>
                </div>
              </div>
            </div>

            {controls.offcanvasOpen && controls.offcanvasBackdrop ? (
              <button
                className="absolute inset-0 z-10 bg-black/25"
                type="button"
                aria-label="오프캔버스 닫기"
                onClick={controls.onOffcanvasToggle}
              />
            ) : null}

            {controls.offcanvasOpen ? (
              <aside
                className={`absolute z-20 flex flex-col overflow-hidden border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)] ${offcanvasPlacementClassNames[controls.offcanvasPlacement]}`}
                aria-label="오프캔버스 예시"
              >
                <div className="flex items-center justify-between bg-[var(--windows-98-fluent-accent)] px-3 py-2 font-mono text-sm font-bold text-[var(--windows-98-fluent-accent-contrast)]">
                  <span>OFFCANVAS.EXE</span>
                  <button
                    className="flex size-6 items-center justify-center border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] font-mono text-sm leading-none font-bold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)]"
                    type="button"
                    aria-label="닫기"
                    onClick={controls.onOffcanvasToggle}
                  >
                    ×
                  </button>
                </div>
                <div
                  className={`min-h-0 flex-1 overflow-auto p-4 ${
                    offcanvasHorizontal
                      ? 'grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-start'
                      : 'space-y-4'
                  }`}
                >
                  <p className="text-sm leading-6 text-[var(--windows-98-fluent-secondary-label)]">
                    Content for the offcanvas goes here. 필터, 메뉴, 액션,
                    드롭다운 같은 컴포넌트를 조합할 수 있습니다.
                  </p>
                  <div
                    className={
                      offcanvasHorizontal
                        ? 'grid gap-1 sm:grid-cols-3 md:grid-cols-1'
                        : 'space-y-1'
                    }
                  >
                    {['Profile', 'Settings', 'Notification'].map((item) => (
                      <button
                        key={item}
                        className={`${raisedButton} w-full text-left whitespace-nowrap`}
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <Windows98Dropdown
                    label="오프캔버스 액션"
                    open={controls.dropdownOpen}
                    options={['Action', 'Another action', 'Something else']}
                    selected={controls.dropdownSelected}
                    onToggle={controls.onDropdownToggle}
                    onSelect={controls.onDropdownSelect}
                  />
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      );
    }
    case 'pagination':
      return (
        <div className="flex flex-wrap gap-2">
          {['Previous', '1', '2', '3', 'Next'].map((item) => (
            <button
              key={item}
              className={
                controls.pageNumber === item ? activeButton : raisedButton
              }
              type="button"
              onClick={() => controls.onPageSelect(item)}
            >
              {item}
            </button>
          ))}
        </div>
      );
    case 'popover':
      return (
        <div className="flex flex-wrap items-start gap-4">
          <button
            className={raisedButton}
            type="button"
            aria-expanded={controls.popoverOpen}
            onClick={controls.onPopoverToggle}
          >
            Target
          </button>
          {controls.popoverOpen && (
            <div className="max-w-xs border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
              <div className="bg-[var(--windows-98-fluent-accent)] px-3 py-1 font-mono text-sm font-bold text-white">
                Popover
              </div>
              <p className="p-3 text-sm text-[var(--windows-98-fluent-secondary-label)]">
                작은 설명 창입니다.
              </p>
            </div>
          )}
        </div>
      );
    case 'progress':
      return (
        <div className="space-y-3">
          {[
            ['queued', 35],
            ['active', controls.progressValue],
            ['done', 92]
          ].map(([key, value]) => (
            <div
              key={key}
              className="h-5 border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface-elevated)] shadow-[var(--windows-98-fluent-inset-pressed)]"
            >
              <div
                className="h-full bg-[var(--windows-98-fluent-accent)]"
                style={{ width: `${value}%` }}
              />
            </div>
          ))}
          <button
            className={raisedButton}
            type="button"
            onClick={controls.onProgressAdvance}
          >
            Advance middle progress
          </button>
        </div>
      );
    case 'scrollspy':
      const topItems = [
        ['scrollspyHeading1', 'First'],
        ['scrollspyHeading2', 'Second'],
        ['scrollspyHeading3', 'Third'],
        ['scrollspyHeading4', 'Fourth'],
        ['scrollspyHeading5', 'Fifth']
      ] as const;
      const nestedItems = [
        ['item-1', 'Item 1', 0],
        ['item-1-1', 'Item 1-1', 1],
        ['item-1-2', 'Item 1-2', 1],
        ['item-2', 'Item 2', 0],
        ['item-3', 'Item 3', 0],
        ['item-3-1', 'Item 3-1', 1],
        ['item-3-2', 'Item 3-2', 1]
      ] as const;

      return (
        <div className="space-y-8">
          <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
            <nav className="flex flex-wrap items-center justify-between gap-3 bg-[var(--windows-98-fluent-accent)] px-3 py-2 text-[var(--windows-98-fluent-accent-contrast)]">
              <strong className="font-mono text-sm">NAVBAR_SCROLL.EXE</strong>
              <div className="flex flex-wrap gap-1">
                {topItems.map(([id, label]) => (
                  <a
                    key={id}
                    className={
                      controls.scrollspyTopActive === id
                        ? activeButton
                        : raisedButton
                    }
                    href={`#${id}`}
                  >
                    {label}
                  </a>
                ))}
                <Windows98Dropdown
                  label="Scrollspy dropdown"
                  open={controls.dropdownOpen}
                  options={['Third', 'Fourth', 'Fifth']}
                  selected={
                    topItems.find(
                      ([id]) => id === controls.scrollspyTopActive
                    )?.[1] ?? 'Dropdown'
                  }
                  onToggle={controls.onDropdownToggle}
                  onSelect={(label) => {
                    const selected = topItems.find(
                      ([, item]) => item === label
                    );
                    if (selected) {
                      document.getElementById(selected[0])?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                    controls.onDropdownSelect(label);
                  }}
                />
              </div>
            </nav>
            <div
              ref={controls.scrollspyTopRef}
              className="h-72 overflow-auto border border-[var(--windows-98-fluent-line-soft)] bg-[var(--windows-98-fluent-surface-elevated)] p-5 shadow-[var(--windows-98-fluent-inset-pressed)]"
              tabIndex={0}
              onScroll={controls.onScrollspyTopScroll}
            >
              {topItems.map(([id, label], index) => (
                <section
                  key={id}
                  id={id}
                  className="min-h-48 scroll-mt-4 border-b border-[var(--windows-98-fluent-line-soft)] pb-6"
                >
                  <h4 className="font-mono text-base font-bold text-[var(--windows-98-fluent-label)]">
                    {label} heading
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-[var(--windows-98-fluent-secondary-label)]">
                    Windows 98 Fluent scrollspy content block #{index + 1}.
                    스크롤 위치에 따라 상단 navbar 항목이 활성화됩니다.
                  </p>
                </section>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
            <nav className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
              <div className="bg-[var(--windows-98-fluent-accent)] px-3 py-2 font-mono text-sm font-bold text-[var(--windows-98-fluent-accent-contrast)]">
                NESTED_NAV.EXE
              </div>
              <div className="space-y-1 p-3">
                {nestedItems.map(([id, label, depth]) => (
                  <a
                    key={id}
                    className={`block ${
                      controls.scrollspyNestedActive === id
                        ? activeButton
                        : raisedButton
                    } ${depth ? 'ml-5 text-xs' : ''}`}
                    href={`#${id}`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </nav>
            <div
              ref={controls.scrollspyNestedRef}
              className="h-96 overflow-auto border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface-elevated)] p-5 shadow-[var(--windows-98-fluent-inset-pressed)]"
              tabIndex={0}
              onScroll={controls.onScrollspyNestedScroll}
            >
              {nestedItems.map(([id, label, depth], index) => {
                const Heading = depth ? 'h5' : 'h4';
                return (
                  <section
                    key={id}
                    id={id}
                    className="min-h-44 scroll-mt-4 border-b border-[var(--windows-98-fluent-line-soft)] pb-6"
                  >
                    <Heading className="font-mono text-base font-bold text-[var(--windows-98-fluent-label)]">
                      {label}
                    </Heading>
                    <p className="mt-3 text-sm leading-6 text-[var(--windows-98-fluent-secondary-label)]">
                      Nested scrollspy content #{index + 1}. 계층형 카테고리와
                      긴 문서 목차를 표현할 때 사용합니다.
                    </p>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      );
    case 'spinner':
      return (
        <div className="flex items-center gap-4">
          <span className="size-8 animate-spin rounded-full border-4 border-[var(--windows-98-fluent-fill-strong)] border-t-[var(--windows-98-fluent-accent)]" />
          <span className="font-mono text-sm">Loading system resources...</span>
        </div>
      );
    case 'tab':
      return (
        <div>
          <div className="flex gap-1">
            {['General', 'Display', 'Network'].map((item) => (
              <button
                key={item}
                className={
                  controls.selectedTab === item ? activeButton : raisedButton
                }
                type="button"
                onClick={() => controls.onSelectedTabChange(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface-elevated)] p-5 shadow-[var(--windows-98-fluent-inset-pressed)]">
            {controls.selectedTab} tab content
          </div>
        </div>
      );
    case 'toast':
      return (
        <div className="space-y-4">
          <button
            className={raisedButton}
            type="button"
            onClick={controls.onToastOpen}
          >
            Show toast
          </button>
          {controls.toastVisible && (
            <div className="max-w-sm border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
              <div className="flex items-center justify-between bg-[var(--windows-98-fluent-accent)] px-3 py-1 font-mono text-sm font-bold text-white">
                <span>Notification</span>
                <button
                  className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] px-1 text-[var(--windows-98-fluent-label)]"
                  type="button"
                  onClick={controls.onToastClose}
                >
                  ×
                </button>
              </div>
              <p className="p-3 text-sm">클립보드에 복사되었습니다.</p>
            </div>
          )}
        </div>
      );
    case 'tooltip':
      return (
        <div className="flex items-center gap-4">
          <button
            className={raisedButton}
            type="button"
            onMouseEnter={controls.onTooltipShow}
            onMouseLeave={controls.onTooltipHide}
            onFocus={controls.onTooltipShow}
            onBlur={controls.onTooltipHide}
          >
            Hover target
          </button>
          {controls.tooltipVisible && (
            <span className="border border-[var(--windows-98-fluent-separator)] bg-[#ffffe1] px-3 py-2 font-mono text-xs text-black shadow-[var(--windows-98-fluent-shadow-soft)]">
              Tooltip text
            </span>
          )}
        </div>
      );
  }
}

export function Windows98ComponentDemo({
  slug
}: Readonly<{
  slug: Windows98ComponentSlug;
}>) {
  const item = getWindows98ComponentItem(slug);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSelected, setDropdownSelected] = useState('Latest');
  const [modalOpen, setModalOpen] = useState(false);
  const [navActive, setNavActive] = useState('Home');
  const [offcanvasBackdrop, setOffcanvasBackdrop] = useState(true);
  const [offcanvasOpen, setOffcanvasOpen] = useState(true);
  const [offcanvasPlacement, setOffcanvasPlacement] = useState('start');
  const [pageNumber, setPageNumber] = useState('2');
  const [popoverOpen, setPopoverOpen] = useState(true);
  const [progressValue, setProgressValue] = useState(68);
  const [selectedGroup, setSelectedGroup] = useState('Center');
  const [selectedTab, setSelectedTab] = useState('General');
  const [searchScopeDropdownOpen, setSearchScopeDropdownOpen] = useState(false);
  const [searchScopeSelected, setSearchScopeSelected] = useState('통합');
  const [scrollspyNestedActive, setScrollspyNestedActive] = useState('item-1');
  const [scrollspyTopActive, setScrollspyTopActive] =
    useState('scrollspyHeading1');
  const [toastVisible, setToastVisible] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const scrollspyNestedRef = useRef<HTMLDivElement>(null);
  const scrollspyTopRef = useRef<HTMLDivElement>(null);

  const resolveScrollspyActiveId = (
    container: HTMLDivElement | null,
    ids: readonly string[]
  ) => {
    if (!container) {
      return ids[0] ?? '';
    }

    const containerTop = container.getBoundingClientRect().top;
    return ids.reduce((activeId, id) => {
      const activeElement = container.querySelector<HTMLElement>(
        `#${CSS.escape(activeId)}`
      );
      const currentElement = container.querySelector<HTMLElement>(
        `#${CSS.escape(id)}`
      );

      if (!activeElement || !currentElement) {
        return activeId;
      }

      const activeDistance = Math.abs(
        activeElement.getBoundingClientRect().top - containerTop
      );
      const currentDistance = Math.abs(
        currentElement.getBoundingClientRect().top - containerTop
      );

      return currentDistance < activeDistance ? id : activeId;
    }, ids[0] ?? '');
  };

  return (
    <>
      <PageIntro title={item?.label ?? 'Component'}>
        Windows 98 Fluent 스타일의 {item?.label ?? 'component'} 컴포넌트
        샘플입니다. 각 페이지는 독립적인 구현 예시를 담고 있습니다.
      </PageIntro>
      <StyleGuideSection
        eyebrow="Preview"
        title={`${item?.label ?? 'Component'} variants`}
      >
        <PreviewPanel title={`${item?.label ?? 'Component'}.preview`}>
          {renderDemo(slug, {
            carouselIndex,
            dropdownOpen,
            dropdownSelected,
            modalOpen,
            navActive,
            offcanvasBackdrop,
            offcanvasOpen,
            offcanvasPlacement,
            pageNumber,
            popoverOpen,
            progressValue,
            selectedGroup,
            selectedTab,
            searchScopeDropdownOpen,
            searchScopeSelected,
            scrollspyNestedActive,
            scrollspyTopActive,
            toastVisible,
            tooltipVisible,
            onCarouselNext: () =>
              setCarouselIndex(
                (current) => (current + 1) % carouselSlides.length
              ),
            onCarouselPrevious: () =>
              setCarouselIndex(
                (current) =>
                  (current - 1 + carouselSlides.length) % carouselSlides.length
              ),
            onDropdownToggle: () => setDropdownOpen((current) => !current),
            onDropdownSelect: (item) => {
              setDropdownSelected(item);
              setDropdownOpen(false);
            },
            onModalClose: () => setModalOpen(false),
            onModalOpen: () => setModalOpen(true),
            onNavSelect: setNavActive,
            onOffcanvasBackdropToggle: () =>
              setOffcanvasBackdrop((current) => !current),
            onOffcanvasPlacementChange: setOffcanvasPlacement,
            onOffcanvasToggle: () => setOffcanvasOpen((current) => !current),
            onPageSelect: setPageNumber,
            onPopoverToggle: () => setPopoverOpen((current) => !current),
            onProgressAdvance: () =>
              setProgressValue((current) =>
                current >= 95 ? 20 : current + 15
              ),
            onSelectedGroupChange: setSelectedGroup,
            onSelectedTabChange: setSelectedTab,
            onSearchScopeSelect: (item) => {
              if (item === searchScopeSelected) {
                setSearchScopeDropdownOpen((current) => !current);
                return;
              }
              setSearchScopeSelected(item);
              setSearchScopeDropdownOpen(false);
            },
            onScrollspyNestedScroll: () =>
              setScrollspyNestedActive(
                resolveScrollspyActiveId(scrollspyNestedRef.current, [
                  'item-1',
                  'item-1-1',
                  'item-1-2',
                  'item-2',
                  'item-3',
                  'item-3-1',
                  'item-3-2'
                ])
              ),
            onScrollspyTopScroll: () =>
              setScrollspyTopActive(
                resolveScrollspyActiveId(scrollspyTopRef.current, [
                  'scrollspyHeading1',
                  'scrollspyHeading2',
                  'scrollspyHeading3',
                  'scrollspyHeading4',
                  'scrollspyHeading5'
                ])
              ),
            onToastClose: () => setToastVisible(false),
            onToastOpen: () => setToastVisible(true),
            onTooltipHide: () => setTooltipVisible(false),
            onTooltipShow: () => setTooltipVisible(true),
            scrollspyNestedRef,
            scrollspyTopRef
          })}
        </PreviewPanel>
      </StyleGuideSection>
    </>
  );
}
