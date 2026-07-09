'use client';

import type { ComponentProps, ReactNode, RefObject } from 'react';
import { useRef, useState } from 'react';
import {
  NeoBrutalismAlert,
  NeoBrutalismModal
} from 'app/style-guide/neo-brutalism/_components/feedback';
import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/neo-brutalism/_components/style-guide-section';
import {
  getNeoBrutalismComponentItem,
  type NeoBrutalismComponentSlug
} from 'app/style-guide/neo-brutalism/components/_components/component-items';

function NeoBrutalismWindowBox({
  children,
  title
}: Readonly<{
  children: ReactNode;
  title: string;
}>) {
  return (
    <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
      <div className="flex items-center justify-between border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-3 py-2 text-sm font-black text-[var(--neo-brutalism-accent-contrast)] uppercase">
        <span>{title}</span>
        <button
          className="flex size-6 shrink-0 items-center justify-center border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)] text-sm leading-none font-black text-[var(--neo-brutalism-label)]"
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
  'border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] px-4 py-2 text-sm font-black text-[var(--neo-brutalism-label)] uppercase shadow-[3px_3px_0_var(--neo-brutalism-separator)] transition-transform hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none';

const activeButton =
  'border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-4 py-2 text-sm font-black text-[var(--neo-brutalism-accent-contrast)] uppercase shadow-[3px_3px_0_var(--neo-brutalism-separator)]';

const outlineButton =
  'border-4 border-[var(--neo-brutalism-separator)] bg-transparent px-4 py-2 text-sm font-black text-[var(--neo-brutalism-label)] uppercase shadow-[3px_3px_0_var(--neo-brutalism-separator)] transition-transform hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none';

const linkButton =
  'text-sm font-black text-[var(--neo-brutalism-accent)] uppercase underline underline-offset-4 hover:text-[var(--neo-brutalism-label)]';

const textInput =
  'h-10 border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] px-3 text-sm font-semibold text-[var(--neo-brutalism-label)] outline-none focus:shadow-[3px_3px_0_var(--neo-brutalism-separator)]';

const compactIconButton =
  'border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] px-2 py-1 text-sm font-black leading-none text-[var(--neo-brutalism-label)] shadow-[3px_3px_0_var(--neo-brutalism-separator)] transition-transform hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none';

function NeoBrutalismTextInput({
  className = '',
  ...props
}: Readonly<ComponentProps<'input'>>) {
  return <input {...props} className={`${textInput} ${className}`} />;
}

function NeoBrutalismIconButton({
  className = '',
  ...props
}: Readonly<ComponentProps<'button'>>) {
  return <button {...props} className={`${compactIconButton} ${className}`} />;
}

function NeoBrutalismDropdown({
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
          className="absolute top-full left-0 z-20 mt-2 min-w-52 border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-elevated)] p-1 shadow-[var(--neo-brutalism-shadow)]"
          role="menu"
          aria-label={label}
        >
          {options.map((item) => (
            <button
              key={item}
              className={`block w-full px-4 py-2 text-left text-sm font-bold ${
                selected === item
                  ? 'bg-[var(--neo-brutalism-accent)] font-black text-[var(--neo-brutalism-accent-contrast)]'
                  : 'text-[var(--neo-brutalism-label)] hover:bg-[var(--neo-brutalism-accent)] hover:text-[var(--neo-brutalism-accent-contrast)]'
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
  slug: NeoBrutalismComponentSlug,
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
        <div className="space-y-3">
          {['카테고리 정책', 'PWA 정책', '알림 정책'].map((title, index) => (
            <details
              key={title}
              className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]"
              open={index === 0}
            >
              <summary className="cursor-pointer bg-[var(--neo-brutalism-fill)] px-4 py-3 text-sm font-black text-[var(--neo-brutalism-label)] uppercase">
                {title}
              </summary>
              <p className="border-t-4 border-[var(--neo-brutalism-separator)] px-4 py-3 text-sm font-semibold text-[var(--neo-brutalism-secondary-label)]">
                Neo-Brutalism 스타일의 접힘 영역입니다. 굵은 테두리와 옵셋
                그림자로 영역을 분리합니다.
              </p>
            </details>
          ))}
        </div>
      );
    case 'alert':
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <NeoBrutalismAlert title="정보" variant="info">
            새 댓글 알림을 받을 수 있도록 브라우저 알림 권한을 허용해주세요.
          </NeoBrutalismAlert>
          <NeoBrutalismAlert title="성공" variant="success">
            캘린더 구독 URL이 클립보드에 복사되었습니다.
          </NeoBrutalismAlert>
          <NeoBrutalismAlert title="주의" variant="warning">
            현재 카테고리는 검색엔진 노출 대상이 아닙니다.
          </NeoBrutalismAlert>
          <NeoBrutalismAlert title="오류" variant="danger">
            요청 값을 다시 확인해주세요. UUID v4 형식이 아닙니다.
          </NeoBrutalismAlert>
          <NeoBrutalismAlert variant="neutral">
            제목 없이 짧은 안내만 전달할 때 사용하는 neutral alert입니다.
          </NeoBrutalismAlert>
        </div>
      );
    case 'badge':
      return (
        <div className="flex flex-wrap gap-3">
          {['NEW', 'D-3', 'PUBLIC', 'ADMIN', 'SYNC'].map((label, index) => (
            <span
              key={label}
              className={`border-2 border-[var(--neo-brutalism-separator)] px-3 py-1 text-xs font-black shadow-[2px_2px_0_var(--neo-brutalism-separator)] ${
                index === 0
                  ? 'bg-[var(--neo-brutalism-accent)] text-[var(--neo-brutalism-accent-contrast)]'
                  : 'bg-[var(--neo-brutalism-fill)] text-[var(--neo-brutalism-label)]'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      );
    case 'breadcrumb':
      return (
        <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)] px-4 py-3 text-sm font-bold">
          <a className="underline" href="#">
            Home
          </a>
          <span className="px-2">/</span>
          <a className="underline" href="#">
            Articles
          </a>
          <span className="px-2">/</span>
          <span className="font-black">Schedule</span>
        </div>
      );
    case 'button':
      return (
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-black text-[var(--neo-brutalism-secondary-label)] uppercase">
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
            <p className="text-xs font-black text-[var(--neo-brutalism-secondary-label)] uppercase">
              Color variants
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {[
                ['Info', 'bg-[var(--neo-brutalism-blue)] text-white'],
                ['Success', 'bg-[var(--neo-brutalism-success)] text-white'],
                ['Warning', 'bg-[var(--neo-brutalism-warning)] text-black'],
                [
                  'Danger',
                  'bg-[var(--neo-brutalism-red)] text-[var(--neo-brutalism-danger-contrast)]'
                ],
                [
                  'Secondary',
                  'bg-[var(--neo-brutalism-fill-strong)] text-[var(--neo-brutalism-label)]'
                ]
              ].map(([label, className]) => (
                <button
                  key={label}
                  className={`border-4 border-[var(--neo-brutalism-separator)] px-4 py-2 text-sm font-black uppercase shadow-[3px_3px_0_var(--neo-brutalism-separator)] transition-transform hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${className}`}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black text-[var(--neo-brutalism-secondary-label)] uppercase">
              Outline and link
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button className={outlineButton} type="button">
                Outline
              </button>
              <button
                className={`${outlineButton} border-[var(--neo-brutalism-accent)] text-[var(--neo-brutalism-accent)]`}
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
            <p className="text-xs font-black text-[var(--neo-brutalism-secondary-label)] uppercase">
              Sizes
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] px-6 py-3 text-base font-black text-[var(--neo-brutalism-label)] uppercase shadow-[4px_4px_0_var(--neo-brutalism-separator)] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
                type="button"
              >
                Large
              </button>
              <button className={raisedButton} type="button">
                Default
              </button>
              <button
                className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] px-3 py-1.5 text-xs font-black text-[var(--neo-brutalism-label)] uppercase shadow-[2px_2px_0_var(--neo-brutalism-separator)] transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                type="button"
              >
                Small
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black text-[var(--neo-brutalism-secondary-label)] uppercase">
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
        <div className="inline-flex border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)] p-1">
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
          <article className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
            <div className="border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-3 py-2 text-sm font-black text-[var(--neo-brutalism-accent-contrast)] uppercase">
              Image card
            </div>
            <div className="p-3">
              <div className="flex aspect-[4/3] items-end border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-blue)] p-3">
                <span className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] px-2 py-1 text-xs font-black text-[var(--neo-brutalism-label)] shadow-[2px_2px_0_var(--neo-brutalism-separator)]">
                  PHOTO
                </span>
              </div>
              <div className="space-y-3 pt-4">
                <div>
                  <p className="text-xs font-black text-[var(--neo-brutalism-secondary-label)] uppercase">
                    Exhibition
                  </p>
                  <h4 className="mt-1 font-black text-[var(--neo-brutalism-label)] uppercase">
                    기록으로 남긴 골목 산책
                  </h4>
                </div>
                <p className="text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]">
                  이미지가 핵심인 게시글 목록, 앨범형 콘텐츠, 장소 소개에
                  사용하는 기본 카드입니다.
                </p>
                <button className={raisedButton} type="button">
                  Open
                </button>
              </div>
            </div>
          </article>

          <article className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)] lg:col-span-2">
            <div className="grid min-h-full md:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="flex aspect-[16/10] items-end justify-between border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-purple)] p-4 md:aspect-auto md:border-r-4 md:border-b-0">
                <span className="text-xs font-black text-white uppercase">
                  Cover image
                </span>
                <span className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-warning)] px-2 py-1 text-xs font-black text-black shadow-[2px_2px_0_var(--neo-brutalism-separator)]">
                  NEW
                </span>
              </div>
              <div className="flex flex-col justify-between bg-[var(--neo-brutalism-surface-elevated)] p-5">
                <div className="space-y-3">
                  <p className="text-xs font-black text-[var(--neo-brutalism-secondary-label)] uppercase">
                    Featured
                  </p>
                  <h4 className="text-lg font-black text-[var(--neo-brutalism-label)] uppercase">
                    이번 주 커뮤니티 하이라이트
                  </h4>
                  <p className="text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]">
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

          <article className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)] lg:col-span-3">
            <div className="grid gap-4 p-3 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
              <div className="aspect-square border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-success)]" />
              <div>
                <p className="text-xs font-black text-[var(--neo-brutalism-secondary-label)] uppercase">
                  Compact image card
                </p>
                <h4 className="mt-1 font-black text-[var(--neo-brutalism-label)] uppercase">
                  정사각 썸네일을 가진 리스트형 카드
                </h4>
                <p className="mt-2 text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]">
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
          <div className="flex aspect-[16/7] flex-col items-center justify-center gap-3 border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] text-[var(--neo-brutalism-accent-contrast)] shadow-[var(--neo-brutalism-shadow)]">
            <span className="text-sm font-black uppercase">
              {carouselSlide.caption}
            </span>
            <span className="text-xs font-semibold">
              {carouselSlide.description}
            </span>
          </div>
          <div className="flex justify-between">
            <button
              className={raisedButton}
              type="button"
              onClick={controls.onCarouselPrevious}
            >
              Prev
            </button>
            <div className="flex items-center gap-2">
              {carouselSlides.map((slide, index) => (
                <button
                  key={slide.caption}
                  className={`size-4 border-2 border-[var(--neo-brutalism-separator)] ${
                    index === controls.carouselIndex
                      ? 'bg-[var(--neo-brutalism-accent)]'
                      : 'bg-[var(--neo-brutalism-surface)]'
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
          className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]"
          open
        >
          <summary className="cursor-pointer bg-[var(--neo-brutalism-fill)] px-4 py-3 text-sm font-black uppercase">
            System details
          </summary>
          <dl className="grid grid-cols-[8rem_1fr] gap-2 border-t-4 border-[var(--neo-brutalism-separator)] p-4 text-sm font-semibold">
            <dt className="font-black">Theme</dt>
            <dd>Neo-Brutalism</dd>
            <dt className="font-black">Status</dt>
            <dd>Ready</dd>
          </dl>
        </details>
      );
    case 'dropdown':
      return (
        <NeoBrutalismDropdown
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
        <ul className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-elevated)] text-sm font-bold shadow-[var(--neo-brutalism-shadow)]">
          {['최근 공지', '이번 주 일정', '문의 내역'].map((item, index) => (
            <li
              key={item}
              className={`px-4 py-3 ${index < 2 ? 'border-b-4 border-[var(--neo-brutalism-separator)]' : 'font-black'}`}
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
          <NeoBrutalismModal
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
              className="h-11 w-full border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-elevated)] px-3 text-xs font-bold text-[var(--neo-brutalism-label)] outline-none"
              readOnly
              value="https://daejeonstickybook.seesaw.me.kr/api/calendar.ics"
            />
          </NeoBrutalismModal>
        </div>
      );
    case 'nav':
      return (
        <nav className="flex flex-wrap gap-2 border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)] p-2">
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
          <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
            <div className="flex items-center justify-between gap-3 border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-3 py-2 text-[var(--neo-brutalism-accent-contrast)]">
              <NeoBrutalismIconButton type="button" aria-label="메뉴 열기">
                ☰
              </NeoBrutalismIconButton>
              <strong className="text-sm font-black uppercase">
                대전스티키북
              </strong>
              <nav className="hidden items-center gap-4 text-sm font-black md:flex">
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
            <div className="grid gap-2 bg-[var(--neo-brutalism-surface-elevated)] p-3 sm:grid-cols-[1fr_auto]">
              <NeoBrutalismTextInput
                defaultValue="동네 소식"
                aria-label="통합검색어"
              />
              <button className={raisedButton} type="button">
                통합검색
              </button>
            </div>
          </div>

          <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
            <div className="grid gap-3 bg-[var(--neo-brutalism-surface-elevated)] p-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="flex items-center gap-3">
                <NeoBrutalismIconButton type="button" aria-label="메뉴 열기">
                  ☰
                </NeoBrutalismIconButton>
                <div>
                  <strong className="block text-sm font-black whitespace-nowrap text-[var(--neo-brutalism-label)] uppercase">
                    Local Market
                  </strong>
                  <span className="text-xs font-bold text-[var(--neo-brutalism-secondary-label)]">
                    대전 중구
                  </span>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-[minmax(12rem,1fr)_auto]">
                <NeoBrutalismTextInput
                  placeholder="동네 물건, 모임, 장소 검색"
                  aria-label="동네 검색어"
                />
                <button className={activeButton} type="button">
                  찾아보기
                </button>
              </div>
              <nav className="flex flex-wrap justify-start gap-2 lg:justify-end">
                {['중고거래', '동네생활', '알바', '부동산'].map((item) => (
                  <a
                    key={item}
                    className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)] px-3 py-2 text-xs font-black text-[var(--neo-brutalism-label)] shadow-[2px_2px_0_var(--neo-brutalism-separator)]"
                    href="#"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
            <div className="space-y-3 bg-[var(--neo-brutalism-fill)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-3 py-2 text-sm font-black text-[var(--neo-brutalism-accent-contrast)] shadow-[2px_2px_0_var(--neo-brutalism-separator)]">
                    SHOP
                  </span>
                  <strong className="text-sm font-black text-[var(--neo-brutalism-label)] uppercase">
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
                <nav className="flex gap-2 overflow-x-auto">
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
                <NeoBrutalismTextInput
                  placeholder="브랜드, 상품명 검색"
                  aria-label="상품 검색어"
                />
                <button className={raisedButton} type="button">
                  검색
                </button>
              </div>
            </div>
          </div>

          <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
            <div className="grid gap-3 bg-[var(--neo-brutalism-surface-elevated)] p-3 md:grid-cols-[auto_1fr_auto] md:items-center">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="size-8 border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-pink)]" />
                  <strong className="text-sm font-black text-[var(--neo-brutalism-label)] uppercase">
                    Daily Feed
                  </strong>
                </div>
                <NeoBrutalismIconButton
                  type="button"
                  aria-label="메뉴 열기"
                  className="md:hidden"
                >
                  ☰
                </NeoBrutalismIconButton>
              </div>
              <div className="mx-auto grid max-w-md grid-cols-[1fr_auto] gap-2">
                <NeoBrutalismTextInput
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

          <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
            <div className="grid gap-3 bg-[var(--neo-brutalism-fill)] p-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="flex items-center gap-3">
                <NeoBrutalismIconButton type="button" aria-label="메뉴 열기">
                  ☰
                </NeoBrutalismIconButton>
                <span className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-red)] px-3 py-2 text-sm font-black text-white shadow-[2px_2px_0_var(--neo-brutalism-separator)]">
                  PLAY
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <NeoBrutalismTextInput
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

          <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
            <div className="space-y-3 bg-[var(--neo-brutalism-surface-elevated)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <strong className="block text-sm font-black text-[var(--neo-brutalism-label)] uppercase">
                    Magazine 98
                  </strong>
                  <span className="text-xs font-bold text-[var(--neo-brutalism-secondary-label)]">
                    오늘의 에디션
                  </span>
                </div>
                <NeoBrutalismIconButton type="button" aria-label="메뉴 열기">
                  ☰
                </NeoBrutalismIconButton>
              </div>
              <div className="grid gap-2 md:grid-cols-[auto_1fr_auto] md:items-center">
                <nav className="flex flex-wrap gap-3">
                  {['컬렉션', '인터뷰', '리뷰', '뉴스'].map((item) => (
                    <a
                      key={item}
                      className="text-sm font-black underline"
                      href="#"
                    >
                      {item}
                    </a>
                  ))}
                </nav>
                <NeoBrutalismTextInput
                  placeholder="콘텐츠 검색"
                  aria-label="콘텐츠 검색어"
                />
                <button className={raisedButton} type="button">
                  구독
                </button>
              </div>
            </div>
          </div>

          <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
            <div className="grid gap-3 bg-[var(--neo-brutalism-fill)] p-3 md:grid-cols-[auto_1fr_auto] md:items-center">
              <strong className="text-sm font-black text-[var(--neo-brutalism-label)] uppercase">
                N-Portal
              </strong>
              <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto]">
                <NeoBrutalismDropdown
                  label="검색 범위"
                  open={controls.searchScopeDropdownOpen}
                  options={['통합', '게시글', '일정']}
                  selected={controls.searchScopeSelected}
                  onToggle={() =>
                    controls.onSearchScopeSelect(controls.searchScopeSelected)
                  }
                  onSelect={controls.onSearchScopeSelect}
                />
                <NeoBrutalismTextInput
                  placeholder="무엇이든 검색"
                  aria-label="통합 포털 검색어"
                />
                <button className={activeButton} type="button">
                  검색
                </button>
              </div>
              <nav className="flex justify-start gap-3 md:justify-end">
                {['메일', '카페', '블로그'].map((item) => (
                  <a
                    key={item}
                    className="text-sm font-black underline"
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

          <div className="relative min-h-[28rem] overflow-hidden border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
            <div className="flex h-full min-h-[27.5rem] flex-col">
              <div className="flex items-center justify-between border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-3 py-2 text-sm font-black text-[var(--neo-brutalism-accent-contrast)] uppercase">
                <span>Application viewport</span>
                <span className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] px-2 text-[var(--neo-brutalism-label)]">
                  ×
                </span>
              </div>
              <div className="grid flex-1 place-items-center bg-[var(--neo-brutalism-fill)] p-6 text-center">
                <div className="max-w-sm space-y-3">
                  <p className="text-sm font-black text-[var(--neo-brutalism-label)] uppercase">
                    Page content
                  </p>
                  <p className="text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]">
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
                className={`absolute z-20 flex flex-col overflow-hidden border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)] ${offcanvasPlacementClassNames[controls.offcanvasPlacement]}`}
                aria-label="오프캔버스 예시"
              >
                <div className="flex items-center justify-between border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-3 py-2 text-sm font-black text-[var(--neo-brutalism-accent-contrast)] uppercase">
                  <span>Offcanvas</span>
                  <button
                    className="flex size-6 items-center justify-center border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] text-sm leading-none font-black text-[var(--neo-brutalism-label)]"
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
                  <p className="text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]">
                    Content for the offcanvas goes here. 필터, 메뉴, 액션,
                    드롭다운 같은 컴포넌트를 조합할 수 있습니다.
                  </p>
                  <div
                    className={
                      offcanvasHorizontal
                        ? 'grid gap-2 sm:grid-cols-3 md:grid-cols-1'
                        : 'space-y-2'
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
                  <NeoBrutalismDropdown
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
            <div className="max-w-xs border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
              <div className="border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-3 py-1 text-sm font-black text-[var(--neo-brutalism-accent-contrast)] uppercase">
                Popover
              </div>
              <p className="p-3 text-sm font-semibold text-[var(--neo-brutalism-secondary-label)]">
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
              className="h-5 border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-elevated)]"
            >
              <div
                className="h-full bg-[var(--neo-brutalism-accent)]"
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
          <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
            <nav className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-3 py-2 text-[var(--neo-brutalism-accent-contrast)]">
              <strong className="text-sm font-black uppercase">
                Navbar scroll
              </strong>
              <div className="flex flex-wrap gap-2">
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
                <NeoBrutalismDropdown
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
              className="h-72 overflow-auto bg-[var(--neo-brutalism-surface-elevated)] p-5"
              tabIndex={0}
              onScroll={controls.onScrollspyTopScroll}
            >
              {topItems.map(([id, label], index) => (
                <section
                  key={id}
                  id={id}
                  className="min-h-48 scroll-mt-4 border-b-4 border-[var(--neo-brutalism-separator)] pb-6"
                >
                  <h4 className="text-base font-black text-[var(--neo-brutalism-label)] uppercase">
                    {label} heading
                  </h4>
                  <p className="mt-3 text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]">
                    Neo-Brutalism scrollspy content block #{index + 1}. 스크롤
                    위치에 따라 상단 navbar 항목이 활성화됩니다.
                  </p>
                </section>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
            <nav className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
              <div className="border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-3 py-2 text-sm font-black text-[var(--neo-brutalism-accent-contrast)] uppercase">
                Nested nav
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
              className="h-96 overflow-auto border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-elevated)] p-5 shadow-[var(--neo-brutalism-shadow)]"
              tabIndex={0}
              onScroll={controls.onScrollspyNestedScroll}
            >
              {nestedItems.map(([id, label, depth], index) => {
                const Heading = depth ? 'h5' : 'h4';
                return (
                  <section
                    key={id}
                    id={id}
                    className="min-h-44 scroll-mt-4 border-b-4 border-[var(--neo-brutalism-separator)] pb-6"
                  >
                    <Heading className="text-base font-black text-[var(--neo-brutalism-label)] uppercase">
                      {label}
                    </Heading>
                    <p className="mt-3 text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]">
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
          <span className="size-8 animate-spin rounded-full border-4 border-[var(--neo-brutalism-fill-strong)] border-t-[var(--neo-brutalism-accent)]" />
          <span className="text-sm font-bold">Loading system resources...</span>
        </div>
      );
    case 'tab':
      return (
        <div>
          <div className="flex gap-2">
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
          <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-elevated)] p-5 font-semibold shadow-[var(--neo-brutalism-shadow)]">
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
            <div className="max-w-sm border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]">
              <div className="flex items-center justify-between border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-3 py-1 text-sm font-black text-white uppercase">
                <span>Notification</span>
                <button
                  className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)] px-1 text-[var(--neo-brutalism-label)]"
                  type="button"
                  onClick={controls.onToastClose}
                >
                  ×
                </button>
              </div>
              <p className="p-3 text-sm font-semibold">
                클립보드에 복사되었습니다.
              </p>
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
            <span className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-warning)] px-3 py-2 text-xs font-black text-black shadow-[3px_3px_0_var(--neo-brutalism-separator)]">
              Tooltip text
            </span>
          )}
        </div>
      );
  }
}

export function NeoBrutalismComponentDemo({
  slug
}: Readonly<{
  slug: NeoBrutalismComponentSlug;
}>) {
  const item = getNeoBrutalismComponentItem(slug);
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
        Neo-Brutalism 스타일의 {item?.label ?? 'component'} 컴포넌트 샘플입니다.
        각 페이지는 독립적인 구현 예시를 담고 있습니다.
      </PageIntro>
      <StyleGuideSection
        eyebrow="Preview"
        title={`${item?.label ?? 'Component'} variants`}
      >
        <PreviewPanel title={`${item?.label ?? 'Component'} preview`}>
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
