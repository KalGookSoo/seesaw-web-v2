import { PageIntro, PreviewPanel, StyleGuideSection } from 'app/style-guide/monochrome/_components/style-guide-section';

const componentItems = [
  'Accordion', 'Alert', 'Badge', 'Breadcrumb', 'Button', 'Button group', 'Card',
  'Calendar', 'Carousel', 'Details', 'Dropdown', 'List group', 'Modal', 'Nav', 'Navbar',
  'Offcanvas', 'Pagination', 'Popover', 'Progress', 'Scrollspy', 'Spinner',
  'Tab', 'Toast', 'Tooltip'
] as const;

const buttonBase = 'border px-4 py-2 text-sm font-semibold transition-colors';
const buttonPrimary = `${buttonBase} border-[var(--monochrome-accent)] bg-[var(--monochrome-accent)] text-[var(--monochrome-accent-contrast)] hover:bg-[var(--monochrome-accent-muted)]`;
const buttonSecondary = `${buttonBase} border-[var(--monochrome-separator)] bg-[var(--monochrome-surface)] text-[var(--monochrome-label)] hover:bg-[var(--monochrome-fill)]`;

export default function MonochromeComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        Monochrome 컴포넌트는 둥근 장식과 강한 그림자 대신 선, 간격, 표면의 미세한 차이로 상태와 구조를 표현합니다. 아래 인벤토리는 게시글, 일정, 관리자 화면에서 반복적으로 사용할 공통 UI의 기준선입니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {componentItems.map((item, index) => (
            <a key={item} className="group border border-[var(--monochrome-separator)] bg-[var(--monochrome-surface)] p-4 transition-colors hover:border-[var(--monochrome-line)] hover:bg-[var(--monochrome-surface-elevated)]" href={`#${item.toLowerCase().replaceAll(' ', '-')}`}>
              <span className="text-xs font-semibold text-[var(--monochrome-tertiary-label)]">{String(index + 1).padStart(2, '0')}</span>
              <span className="mt-3 block font-semibold text-[var(--monochrome-label)]">{item}</span>
              <span className="mt-2 block text-xs leading-5 text-[var(--monochrome-secondary-label)]">컴포넌트 샘플 보기 →</span>
            </a>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Samples" title="Content and navigation">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Breadcrumb · Navbar · Nav">
            <div id="breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-[var(--monochrome-secondary-label)]"><a className="hover:text-[var(--monochrome-label)]" href="#">홈</a><span className="text-[var(--monochrome-tertiary-label)]">/</span><a className="hover:text-[var(--monochrome-label)]" href="#">공지</a><span className="text-[var(--monochrome-tertiary-label)]">/</span><strong className="text-[var(--monochrome-label)]">새 소식</strong></div>
            <div id="navbar" className="mt-6 flex items-center justify-between border-y border-[var(--monochrome-separator)] py-3"><span className="font-semibold text-[var(--monochrome-label)]">대전포스트잇</span><nav className="flex gap-4 text-sm text-[var(--monochrome-secondary-label)]" aria-label="샘플 내비게이션"><a className="text-[var(--monochrome-label)]" href="#">홈</a><a href="#">게시판</a><a href="#">일정</a></nav></div>
            <div id="nav" className="mt-6 flex gap-5 border-b border-[var(--monochrome-separator)] text-sm"><button className="border-b-2 border-[var(--monochrome-accent)] pb-3 font-semibold text-[var(--monochrome-label)]">전체</button><button className="pb-3 text-[var(--monochrome-tertiary-label)]">공지</button><button className="pb-3 text-[var(--monochrome-tertiary-label)]">일정</button></div>
          </PreviewPanel>

          <PreviewPanel title="Card · List group · Badge">
            <div id="card" className="border border-[var(--monochrome-separator)] bg-[var(--monochrome-surface-elevated)] p-4"><div className="flex items-start justify-between gap-4"><div><span id="badge" className="border border-[var(--monochrome-line)] px-2 py-1 text-xs text-[var(--monochrome-secondary-label)]">독서모임</span><h3 className="mt-4 font-semibold text-[var(--monochrome-label)]">이번 달의 읽을거리</h3></div><span className="text-xs text-[var(--monochrome-tertiary-label)]">11.22</span></div><p className="mt-2 text-sm leading-6 text-[var(--monochrome-secondary-label)]">콘텐츠의 제목과 요약, 메타데이터를 한 표면에 정리합니다.</p></div>
            <ul id="list-group" className="mt-4 divide-y divide-[var(--monochrome-separator)] border-y border-[var(--monochrome-separator)] text-sm"><li className="flex justify-between gap-4 px-3 py-3"><span className="text-[var(--monochrome-label)]">새로운 게시글</span><span className="text-[var(--monochrome-tertiary-label)]">4분 전</span></li><li className="flex justify-between gap-4 px-3 py-3"><span className="text-[var(--monochrome-label)]">일정 변경 알림</span><span className="text-[var(--monochrome-tertiary-label)]">어제</span></li></ul>
          </PreviewPanel>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Schedule" title="Calendar">
        <PreviewPanel title="Monthly calendar · mobile agenda">
          <div id="calendar" className="border-t border-l border-[var(--monochrome-separator)]">
            <div className="flex items-center justify-between border-r border-b border-[var(--monochrome-separator)] px-4 py-3"><div><p className="text-xs tracking-[0.16em] text-[var(--monochrome-tertiary-label)] uppercase">Schedule</p><h3 className="mt-1 text-lg font-semibold text-[var(--monochrome-label)]">2026년 11월</h3></div><span className="text-sm text-[var(--monochrome-secondary-label)]">이번 달</span></div>
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-[var(--monochrome-tertiary-label)]">{['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day} className="border-r border-b border-[var(--monochrome-separator)] py-2">{day}</span>)}</div>
            <div className="grid grid-cols-7 text-xs"><span className="col-span-1 border-r border-b border-[var(--monochrome-separator)] p-2 text-[var(--monochrome-tertiary-label)]">1</span><span className="border-r border-b border-[var(--monochrome-separator)] p-2">2</span><span className="border-r border-b border-[var(--monochrome-separator)] p-2">3</span><span className="border-r border-b border-[var(--monochrome-separator)] p-2">4</span><span className="border-r border-b border-[var(--monochrome-separator)] p-2">5</span><span className="border-r border-b border-[var(--monochrome-separator)] p-2">6</span><span className="border-r border-b border-[var(--monochrome-separator)] p-2">7</span><span className="border-r border-b border-[var(--monochrome-separator)] p-2">8</span><span className="border-r border-b border-[var(--monochrome-separator)] p-2">9</span><span className="border-r border-b border-[var(--monochrome-separator)] bg-[var(--monochrome-fill)] p-2 font-semibold">10<div className="mt-2 border-l-2 border-[var(--monochrome-accent)] bg-[var(--monochrome-accent-soft)] px-1 py-1 text-[0.6rem] text-[var(--monochrome-accent)]">독서 모임</div></span><span className="border-r border-b border-[var(--monochrome-separator)] p-2">11</span><span className="border-r border-b border-[var(--monochrome-separator)] p-2">12</span><span className="border-r border-b border-[var(--monochrome-separator)] p-2">13</span></div>
            <div className="space-y-2 border-r border-b border-[var(--monochrome-separator)] p-3 sm:hidden"><div className="border-l-2 border-[var(--monochrome-accent)] bg-[var(--monochrome-fill)] p-3"><p className="text-xs text-[var(--monochrome-tertiary-label)]">11월 10일 · 19:00</p><p className="mt-1 text-sm font-semibold text-[var(--monochrome-label)]">독서 모임</p></div><div className="border-l-2 border-[var(--monochrome-line)] bg-[var(--monochrome-fill)] p-3"><p className="text-xs text-[var(--monochrome-tertiary-label)]">11월 22일 · 14:00</p><p className="mt-1 text-sm font-semibold text-[var(--monochrome-label)]">커뮤니티 워크숍</p></div></div>
          </div>
        </PreviewPanel>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Interaction" title="Actions and feedback">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Button · Button group · Dropdown">
            <div id="button" className="flex flex-wrap gap-2"><button className={buttonPrimary}>저장하기</button><button className={buttonSecondary}>미리보기</button><button className={`${buttonSecondary} text-[var(--monochrome-tertiary-label)]`} disabled>비활성</button></div>
            <div id="button-group" className="mt-5 flex w-fit divide-x divide-[var(--monochrome-separator)] border border-[var(--monochrome-separator)]"><button className="bg-[var(--monochrome-fill)] px-3 py-2 text-sm text-[var(--monochrome-label)]">목록</button><button className="bg-[var(--monochrome-surface)] px-3 py-2 text-sm text-[var(--monochrome-secondary-label)]">카드</button><button className="bg-[var(--monochrome-surface)] px-3 py-2 text-sm text-[var(--monochrome-secondary-label)]">달력</button></div>
            <div id="dropdown" className="relative mt-5 w-48 border border-[var(--monochrome-separator)] bg-[var(--monochrome-surface)]"><button className="flex w-full items-center justify-between px-3 py-2 text-sm text-[var(--monochrome-label)]">정렬 기준 <span className="text-[var(--monochrome-tertiary-label)]">⌄</span></button><div className="border-t border-[var(--monochrome-separator)] p-1 text-sm"><div className="bg-[var(--monochrome-fill)] px-3 py-2 text-[var(--monochrome-label)]">최신순</div><div className="px-3 py-2 text-[var(--monochrome-secondary-label)]">오래된순</div></div></div>
          </PreviewPanel>

          <PreviewPanel title="Alert · Toast · Progress · Spinner">
            <div id="alert" className="border-l-2 border-[var(--monochrome-accent)] bg-[var(--monochrome-fill)] px-4 py-3 text-sm text-[var(--monochrome-label)]"><strong className="font-semibold">저장되었습니다.</strong><p className="mt-1 text-[var(--monochrome-secondary-label)]">게시글이 공개 상태로 등록되었습니다.</p></div>
            <div id="toast" className="mt-4 flex items-center justify-between border border-[var(--monochrome-line)] bg-[var(--monochrome-surface-elevated)] px-4 py-3 text-sm"><span className="text-[var(--monochrome-label)]">캘린더 URL을 복사했습니다.</span><button className="text-[var(--monochrome-secondary-label)] hover:text-[var(--monochrome-label)]">닫기</button></div>
            <div id="progress" className="mt-5"><div className="flex justify-between text-xs text-[var(--monochrome-secondary-label)]"><span>업로드 중</span><span>68%</span></div><div className="mt-2 h-1 bg-[var(--monochrome-fill)]"><div className="h-1 w-[68%] bg-[var(--monochrome-accent)]" /></div></div>
            <div id="spinner" className="mt-5 flex items-center gap-3 text-sm text-[var(--monochrome-secondary-label)]"><span className="inline-block size-4 animate-spin border-2 border-[var(--monochrome-fill-strong)] border-t-[var(--monochrome-accent)]" />불러오는 중입니다.</div>
          </PreviewPanel>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Disclosure" title="Expandable and layered content">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Accordion · Details · Tooltip">
            <div id="accordion" className="divide-y divide-[var(--monochrome-separator)] border-y border-[var(--monochrome-separator)]"><details open><summary className="cursor-pointer list-none py-3 text-sm font-semibold text-[var(--monochrome-label)]">콘텐츠 공개 설정 <span className="float-right text-[var(--monochrome-tertiary-label)]">−</span></summary><p className="pb-3 text-sm leading-6 text-[var(--monochrome-secondary-label)]">검색엔진 노출과 사이트맵 포함 여부를 이곳에서 관리합니다.</p></details><details><summary className="cursor-pointer list-none py-3 text-sm font-semibold text-[var(--monochrome-label)]">접근 권한 <span className="float-right text-[var(--monochrome-tertiary-label)]">+</span></summary></details></div>
            <div id="details" className="mt-5 border border-[var(--monochrome-separator)] p-3 text-sm text-[var(--monochrome-secondary-label)]"><strong className="text-[var(--monochrome-label)]">상세 정보</strong><p className="mt-1">작성일, 수정일, 작성자 정보를 보조 영역에 표시합니다.</p></div>
            <p id="tooltip" className="mt-5 text-sm text-[var(--monochrome-secondary-label)]">마우스를 올리면 <span className="border-b border-dotted border-[var(--monochrome-label)] text-[var(--monochrome-label)]" title="콘텐츠를 검색엔진에 노출할지 결정합니다.">설명이 필요한 용어</span>를 확인할 수 있습니다.</p>
          </PreviewPanel>

          <PreviewPanel title="Pagination · Tabs · Popover">
            <div id="pagination" className="flex items-center gap-1 text-sm"><button className="border border-[var(--monochrome-separator)] px-3 py-2 text-[var(--monochrome-tertiary-label)]">이전</button><button className="bg-[var(--monochrome-accent)] px-3 py-2 text-[var(--monochrome-accent-contrast)]">1</button><button className="border border-[var(--monochrome-separator)] px-3 py-2 text-[var(--monochrome-secondary-label)]">2</button><button className="border border-[var(--monochrome-separator)] px-3 py-2 text-[var(--monochrome-secondary-label)]">다음</button></div>
            <div id="tab" className="mt-6 grid grid-cols-3 border border-[var(--monochrome-separator)] text-sm"><button className="border-r border-[var(--monochrome-separator)] bg-[var(--monochrome-fill)] px-3 py-2 font-semibold text-[var(--monochrome-label)]">요약</button><button className="border-r border-[var(--monochrome-separator)] px-3 py-2 text-[var(--monochrome-secondary-label)]">첨부파일</button><button className="px-3 py-2 text-[var(--monochrome-secondary-label)]">댓글</button></div>
            <div id="popover" className="mt-6 border border-[var(--monochrome-line)] bg-[var(--monochrome-surface-elevated)] p-4 text-sm"><p className="font-semibold text-[var(--monochrome-label)]">공개 링크</p><p className="mt-1 text-[var(--monochrome-secondary-label)]">누구나 접근할 수 있는 주소입니다.</p><button className="mt-3 text-xs font-semibold text-[var(--monochrome-accent)]">링크 복사</button></div>
          </PreviewPanel>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Media" title="Carousel and offcanvas placeholders">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Carousel"><div id="carousel" className="border border-[var(--monochrome-separator)] bg-[var(--monochrome-surface-grouped)] p-8 text-center"><p className="text-xs tracking-[0.16em] text-[var(--monochrome-tertiary-label)] uppercase">01 / 03</p><p className="mt-4 text-lg font-semibold text-[var(--monochrome-label)]">콘텐츠를 넘겨보는 영역</p><div className="mt-6 flex justify-center gap-1"><span className="h-1 w-8 bg-[var(--monochrome-accent)]" /><span className="h-1 w-2 bg-[var(--monochrome-fill-strong)]" /><span className="h-1 w-2 bg-[var(--monochrome-fill-strong)]" /></div></div></PreviewPanel>
          <PreviewPanel title="Offcanvas · Modal · Scrollspy"><div id="offcanvas" className="border-l-2 border-[var(--monochrome-accent)] bg-[var(--monochrome-surface-grouped)] p-4"><p className="text-sm font-semibold text-[var(--monochrome-label)]">모바일 메뉴 패널</p><p className="mt-1 text-sm text-[var(--monochrome-secondary-label)]">화면 가장자리에서 나타나는 탐색 영역의 표면과 간격입니다.</p></div><div id="modal" className="mt-4 border border-[var(--monochrome-line)] bg-[var(--monochrome-surface-elevated)] p-5"><p className="text-lg font-semibold text-[var(--monochrome-label)]">게시글을 삭제할까요?</p><p className="mt-2 text-sm text-[var(--monochrome-secondary-label)]">삭제한 콘텐츠는 복구할 수 없습니다.</p><div className="mt-5 flex justify-end gap-2"><button className={buttonSecondary}>취소</button><button className={`${buttonBase} border-[var(--monochrome-danger)] bg-[var(--monochrome-danger)] text-white`}>삭제</button></div></div><div id="scrollspy" className="mt-4 flex gap-3 border-t border-[var(--monochrome-separator)] pt-3 text-xs text-[var(--monochrome-tertiary-label)]"><span className="text-[var(--monochrome-label)]">기본 정보</span><span>권한</span><span>고급 설정</span></div></PreviewPanel>
        </div>
      </StyleGuideSection>
    </>
  );
}
