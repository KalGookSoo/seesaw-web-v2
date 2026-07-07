'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Flag,
  Languages,
  LogIn,
  LogOut,
  Menu,
  MessageCircleQuestion,
  Moon,
  PanelLeft,
  PanelRight,
  Send,
  Settings,
  Sun,
  UserRound
} from 'lucide-react';

import type { CategoryResponse } from '@/types/site';
import type { NavigationPosition } from '@/lib/navigation-preferences';
import {
  NAVIGATION_COLLAPSED_COOKIE_KEY,
  NAVIGATION_POSITION_COOKIE_KEY
} from '@/lib/navigation-preferences';
import { Modal } from '@/components/ui/modal';
import { useSiteContext } from '@/app/site-context-provider';

type Locale = 'ko' | 'en';
type ThemeMode = 'light' | 'dark';

const LOCALE_STORAGE_KEY = 'seesaw-locale';
const THEME_STORAGE_KEY = 'seesaw-theme';

type GlobalShellProps = Readonly<{
  children: ReactNode;
  initialNavigationPosition: NavigationPosition;
  initialNavigationCollapsed: boolean;
}>;

function getSystemTheme(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getInitialTheme(): ThemeMode {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : getSystemTheme();
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.dataset.theme = theme;
}

function setPreferenceCookie(name: string, value: string) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function getCategoryHref(category: CategoryResponse): string | null {
  if (category.type && category.type !== 'NONE') {
    return `/articles?categoryType=${category.type}&categoryId=${category.id}`;
  }

  const firstChild = category.children?.find(
    (child) => child.type && child.type !== 'NONE'
  );
  if (firstChild?.type) {
    return `/articles?categoryType=${firstChild.type}&categoryId=${firstChild.id}`;
  }

  return null;
}

function isCategoryActive(
  category: CategoryResponse,
  currentCategory: CategoryResponse | null
): boolean {
  if (!currentCategory) {
    return false;
  }

  return (
    category.id === currentCategory.id ||
    category.id === currentCategory.parentId
  );
}

function isChildCategoryActive(
  category: CategoryResponse,
  currentCategory: CategoryResponse | null
): boolean {
  return currentCategory?.id === category.id;
}

function RecentBadge({ count }: Readonly<{ count: number }>) {
  if (count < 1) {
    return null;
  }

  return (
    <span className="bg-default-orange-soft text-default-orange-contrast ring-default-orange-muted/50 rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold ring-1">
      {count}
    </span>
  );
}

function ParentCategoryLink({
  active,
  category,
  collapsed,
  onNavigate
}: Readonly<{
  active: boolean;
  category: CategoryResponse;
  collapsed: boolean;
  onNavigate?: () => void;
}>) {
  const href = getCategoryHref(category);
  const recentCount = category.recentArticles?.length ?? 0;
  const className = `flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
    active
      ? 'bg-default-blue-soft text-default-blue-contrast ring-1 ring-default-blue-muted'
      : 'text-default-secondary-label hover:bg-default-fill hover:text-default-label'
  } ${collapsed ? 'justify-center' : 'justify-between'}`;

  const content = (
    <>
      <span className={collapsed ? 'sr-only' : 'truncate'}>
        {category.name}
      </span>
      {collapsed ? (
        <span aria-hidden>{category.name.slice(0, 1)}</span>
      ) : (
        <RecentBadge count={recentCount} />
      )}
    </>
  );

  if (!href) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link
      className={className}
      href={href}
      title={collapsed ? category.name : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}

function ChildCategoryLink({
  active,
  category,
  onNavigate
}: Readonly<{
  active: boolean;
  category: CategoryResponse;
  onNavigate?: () => void;
}>) {
  const href = getCategoryHref(category);
  const recentCount = category.recentArticles?.length ?? 0;
  const className = `flex min-h-9 items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition ${
    active
      ? 'bg-default-label text-default-background'
      : 'text-default-secondary-label hover:bg-default-fill hover:text-default-label'
  }`;
  const content = (
    <>
      <span className="truncate">{category.name}</span>
      <RecentBadge count={recentCount} />
    </>
  );

  if (!href) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link className={className} href={href} onClick={onNavigate}>
      {content}
    </Link>
  );
}

function NavigationCategoryGroup({
  category,
  collapsed,
  currentCategory,
  onNavigate
}: Readonly<{
  category: CategoryResponse;
  collapsed: boolean;
  currentCategory: CategoryResponse | null;
  onNavigate?: () => void;
}>) {
  const children = category.children?.filter((child) => child.exposed) ?? [];

  return (
    <li>
      <ParentCategoryLink
        active={isCategoryActive(category, currentCategory)}
        category={category}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />
      {!collapsed && children.length > 0 ? (
        <ul className="border-default-separator mt-1 space-y-1 border-l pl-3">
          {children.map((child) => (
            <li key={child.id}>
              <ChildCategoryLink
                active={isChildCategoryActive(child, currentCategory)}
                category={child}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function SegmentedButton({
  active,
  children,
  onClick
}: Readonly<{
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}>) {
  return (
    <button
      className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
        active
          ? 'bg-default-label text-default-background'
          : 'text-default-secondary-label hover:bg-default-fill hover:text-default-label'
      }`}
      type="button"
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function SideNavigation({
  collapsed,
  currentCategory,
  navigationPosition,
  onOpenInquiry,
  onOpenPolicy,
  onOpenReport,
  onNavigate,
  onToggleCollapsed,
  siteName,
  categories
}: Readonly<{
  collapsed: boolean;
  currentCategory: CategoryResponse | null;
  navigationPosition: NavigationPosition;
  onOpenInquiry: () => void;
  onOpenPolicy: () => void;
  onOpenReport: () => void;
  onNavigate?: () => void;
  onToggleCollapsed: () => void;
  siteName: string;
  categories: readonly CategoryResponse[];
}>) {
  return (
    <aside className="border-default-separator bg-default-surface flex h-full min-h-0 w-full flex-col lg:sticky lg:top-0 lg:h-dvh">
      <header className="border-default-separator flex h-16 flex-none items-center justify-between gap-2 border-b px-4">
        <Link className="min-w-0" href="/" onClick={onNavigate}>
          <span
            className={
              collapsed
                ? 'sr-only'
                : 'text-default-label block truncate text-base font-semibold'
            }
          >
            {siteName}
          </span>
          {collapsed ? (
            <span className="text-default-label block text-lg font-semibold">
              {siteName.slice(0, 1)}
            </span>
          ) : null}
        </Link>
        <button
          className="text-default-secondary-label hover:bg-default-fill hover:text-default-label hidden size-8 items-center justify-center rounded-full transition lg:inline-flex"
          type="button"
          aria-label={collapsed ? '내비게이션 펼치기' : '내비게이션 접기'}
          onClick={onToggleCollapsed}
        >
          {navigationPosition === 'left' ? (
            <ChevronLeft size={18} aria-hidden />
          ) : (
            <ChevronRight size={18} aria-hidden />
          )}
        </button>
      </header>

      <nav
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
        aria-label="글로벌 내비게이션"
      >
        <ul className="space-y-2">
          <li>
            <Link
              className={`flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-semibold transition ${
                currentCategory === null
                  ? 'bg-default-blue-soft text-default-blue-contrast ring-default-blue-muted ring-1'
                  : 'text-default-secondary-label hover:bg-default-fill hover:text-default-label'
              } ${collapsed ? 'justify-center' : ''}`}
              href="/"
              title={collapsed ? '홈' : undefined}
              onClick={onNavigate}
            >
              <span className={collapsed ? 'sr-only' : ''}>홈</span>
              {collapsed ? <span aria-hidden>⌂</span> : null}
            </Link>
          </li>
          {categories.map((category) => (
            <NavigationCategoryGroup
              key={category.id}
              category={category}
              collapsed={collapsed}
              currentCategory={currentCategory}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>

      <footer className="border-default-separator flex-none space-y-4 border-t px-4 py-4">
        <div className="grid grid-cols-3 gap-1">
          <button
            className="text-default-secondary-label hover:bg-default-fill hover:text-default-label inline-flex h-9 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition"
            type="button"
            onClick={onOpenPolicy}
          >
            <FileText size={14} aria-hidden />
            정책
          </button>
          <button
            className="text-default-secondary-label hover:bg-default-fill hover:text-default-label inline-flex h-9 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition"
            type="button"
            onClick={onOpenReport}
          >
            <Flag size={14} aria-hidden />
            신고
          </button>
          <button
            className="text-default-secondary-label hover:bg-default-fill hover:text-default-label inline-flex h-9 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition"
            type="button"
            onClick={onOpenInquiry}
          >
            <MessageCircleQuestion size={14} aria-hidden />
            문의
          </button>
        </div>
        <p className="text-default-tertiary-label text-xs leading-5">
          © 2025 SEESAW. All Rights Reserved.
        </p>
      </footer>
    </aside>
  );
}

export function GlobalShell({
  children,
  initialNavigationCollapsed,
  initialNavigationPosition
}: GlobalShellProps) {
  const [locale, setLocale] = useState<Locale>('ko');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [navigationPosition, setNavigationPosition] =
    useState<NavigationPosition>(initialNavigationPosition);
  const [navigationCollapsed, setNavigationCollapsed] = useState(
    initialNavigationCollapsed
  );
  const { CURRENT_CATEGORY, NESTED_CATEGORIES, SITE_CONTEXT } =
    useSiteContext();
  const categories = useMemo(
    () => NESTED_CATEGORIES.filter((category) => category.exposed),
    [NESTED_CATEGORIES]
  );

  const isAuthenticated = false;
  const signInHref = '/oauth2/authorization/naver';
  const signOutHref = '/sign-out';
  const myPageHref = '/my-page';

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const initialTheme = getInitialTheme();

    setTheme(initialTheme);
    applyTheme(initialTheme);

    if (savedLocale === 'ko' || savedLocale === 'en') {
      setLocale(savedLocale);
    }
  }, []);

  const changeTheme = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  };

  const changeNavigationPosition = (nextPosition: NavigationPosition) => {
    setNavigationPosition(nextPosition);
    setPreferenceCookie(NAVIGATION_POSITION_COOKIE_KEY, nextPosition);
  };

  const toggleNavigationCollapsed = () => {
    const nextCollapsed = !navigationCollapsed;
    setNavigationCollapsed(nextCollapsed);
    setPreferenceCookie(NAVIGATION_COLLAPSED_COOKIE_KEY, String(nextCollapsed));
  };

  const desktopShellClassName =
    navigationPosition === 'left'
      ? navigationCollapsed
        ? 'lg:grid lg:grid-cols-[0rem_minmax(0,1fr)]'
        : 'lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]'
      : navigationCollapsed
        ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_0rem]'
        : 'lg:grid lg:grid-cols-[minmax(0,1fr)_18rem]';

  const navigation = (
    <SideNavigation
      collapsed={false}
      currentCategory={CURRENT_CATEGORY}
      navigationPosition={navigationPosition}
      siteName={SITE_CONTEXT.name}
      categories={categories}
      onOpenPolicy={() => setPolicyOpen(true)}
      onOpenReport={() => setReportOpen(true)}
      onOpenInquiry={() => setInquiryOpen(true)}
      onToggleCollapsed={toggleNavigationCollapsed}
    />
  );

  const main = (
    <div className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <header className="border-default-separator bg-default-surface/90 sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur lg:px-6">
        <button
          className="border-default-separator bg-default-surface text-default-label hover:bg-default-fill inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition lg:hidden"
          type="button"
          aria-label="글로벌 내비게이션 열기"
          aria-expanded={mobileNavigationOpen}
          onClick={() => setMobileNavigationOpen(true)}
        >
          <Menu size={18} aria-hidden />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-default-label truncate text-sm font-semibold">
            {SITE_CONTEXT.name}
          </p>
          <p className="text-default-secondary-label truncate text-xs">
            {SITE_CONTEXT.domainName}
          </p>
        </div>

        <button
          className="border-default-separator bg-default-surface text-default-secondary-label hover:bg-default-fill hover:text-default-label inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition"
          type="button"
          aria-label="환경설정 열기"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings size={18} aria-hidden />
        </button>
        {isAuthenticated ? (
          <>
            <Link
              className="bg-default-fill text-default-label hover:bg-default-gray-5 hidden h-9 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition sm:inline-flex"
              href={myPageHref}
            >
              <UserRound size={15} aria-hidden />
              마이페이지
            </Link>
            <Link
              className="bg-default-fill text-default-label hover:bg-default-gray-5 inline-flex h-9 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition"
              href={signOutHref}
            >
              <LogOut size={15} aria-hidden />
              로그아웃
            </Link>
          </>
        ) : (
          <Link
            className="bg-default-blue hover:bg-default-blue/90 inline-flex h-9 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-white transition"
            href={signInHref}
          >
            <LogIn size={15} aria-hidden />
            로그인
          </Link>
        )}
      </header>

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </main>
    </div>
  );

  return (
    <div
      className={`bg-default-surface-grouped text-default-label h-dvh overflow-hidden transition-[grid-template-columns] duration-300 ease-out ${desktopShellClassName}`}
    >
      {navigationPosition === 'left' ? (
        <>
          <div
            className={`bg-default-surface hidden min-w-0 self-stretch overflow-hidden transition-[opacity,transform] duration-300 ease-out lg:flex ${
              navigationCollapsed
                ? '-translate-x-4 opacity-0'
                : 'translate-x-0 opacity-100'
            } ${navigationCollapsed ? 'border-r-0' : 'border-default-separator border-r'}`}
          >
            {navigation}
          </div>
          {main}
        </>
      ) : (
        <>
          {main}
          <div
            className={`bg-default-surface hidden min-w-0 self-stretch overflow-hidden transition-[opacity,transform] duration-300 ease-out lg:flex ${
              navigationCollapsed
                ? 'translate-x-4 opacity-0'
                : 'translate-x-0 opacity-100'
            } ${navigationCollapsed ? 'border-l-0' : 'border-default-separator border-l'}`}
          >
            {navigation}
          </div>
        </>
      )}

      {navigationCollapsed ? (
        <button
          className={`border-default-separator bg-default-surface text-default-label hover:bg-default-fill fixed top-20 z-40 hidden size-11 items-center justify-center rounded-full border text-xl font-semibold shadow-lg transition lg:inline-flex ${
            navigationPosition === 'left' ? 'left-4' : 'right-4'
          }`}
          type="button"
          aria-label="내비게이션 열기"
          onClick={toggleNavigationCollapsed}
        >
          {navigationPosition === 'left' ? (
            <ChevronRight size={22} aria-hidden />
          ) : (
            <ChevronLeft size={22} aria-hidden />
          )}
        </button>
      ) : null}

      {mobileNavigationOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
          role="presentation"
        >
          <button
            className="absolute inset-0 cursor-default"
            type="button"
            aria-label="내비게이션 닫기"
            onClick={() => setMobileNavigationOpen(false)}
          />
          <div
            className={`border-default-separator absolute top-0 h-full w-[min(20rem,88vw)] overflow-hidden shadow-2xl ${
              navigationPosition === 'left'
                ? 'left-0 border-r'
                : 'right-0 border-l'
            }`}
          >
            <SideNavigation
              collapsed={false}
              currentCategory={CURRENT_CATEGORY}
              navigationPosition={navigationPosition}
              siteName={SITE_CONTEXT.name}
              categories={categories}
              onOpenPolicy={() => setPolicyOpen(true)}
              onOpenReport={() => setReportOpen(true)}
              onOpenInquiry={() => setInquiryOpen(true)}
              onToggleCollapsed={toggleNavigationCollapsed}
              onNavigate={() => setMobileNavigationOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <Modal
        open={settingsOpen}
        title="환경설정"
        description="화면 표시, 글로벌 내비게이션 위치, 언어 설정을 변경합니다."
        size="md"
        onClose={() => setSettingsOpen(false)}
      >
        <div className="space-y-6">
          <section className="space-y-3">
            <div className="text-default-label flex items-center gap-2 text-sm font-semibold">
              {theme === 'dark' ? (
                <Moon size={16} aria-hidden />
              ) : (
                <Sun size={16} aria-hidden />
              )}
              화면 모드
            </div>
            <div className="bg-default-fill grid grid-cols-2 gap-2 rounded-lg p-1">
              <SegmentedButton
                active={theme === 'light'}
                onClick={() => changeTheme('light')}
              >
                <Sun size={16} aria-hidden />
                Light
              </SegmentedButton>
              <SegmentedButton
                active={theme === 'dark'}
                onClick={() => changeTheme('dark')}
              >
                <Moon size={16} aria-hidden />
                Dark
              </SegmentedButton>
            </div>
          </section>

          <section className="space-y-3">
            <div className="text-default-label flex items-center gap-2 text-sm font-semibold">
              <Languages size={16} aria-hidden />
              언어
            </div>
            <div className="bg-default-fill grid grid-cols-2 gap-2 rounded-lg p-1">
              <SegmentedButton
                active={locale === 'ko'}
                onClick={() => changeLocale('ko')}
              >
                한국어
              </SegmentedButton>
              <SegmentedButton
                active={locale === 'en'}
                onClick={() => changeLocale('en')}
              >
                English
              </SegmentedButton>
            </div>
          </section>

          <section className="space-y-3">
            <div className="text-default-label flex items-center gap-2 text-sm font-semibold">
              {navigationPosition === 'left' ? (
                <PanelLeft size={16} aria-hidden />
              ) : (
                <PanelRight size={16} aria-hidden />
              )}
              GNB 위치
            </div>
            <div className="bg-default-fill grid grid-cols-2 gap-2 rounded-lg p-1">
              <SegmentedButton
                active={navigationPosition === 'left'}
                onClick={() => changeNavigationPosition('left')}
              >
                <PanelLeft size={16} aria-hidden />
                좌측
              </SegmentedButton>
              <SegmentedButton
                active={navigationPosition === 'right'}
                onClick={() => changeNavigationPosition('right')}
              >
                <PanelRight size={16} aria-hidden />
                우측
              </SegmentedButton>
            </div>
          </section>
        </div>
      </Modal>

      <Modal
        open={policyOpen}
        title="운영정책"
        description="SEESAW 서비스 이용을 위한 기본 운영 기준입니다."
        size="lg"
        onClose={() => setPolicyOpen(false)}
      >
        <div className="text-default-secondary-label max-h-[60vh] space-y-5 overflow-y-auto pr-2 text-sm leading-7">
          <section>
            <h3 className="text-default-label font-semibold">운영 정책</h3>
            <p className="mt-2">
              운영 정책을 지키지 않은 경우 서비스 이용이 제한될 수 있습니다.
              서비스를 이용하기 전에 정책을 확인하고 준수해주세요.
            </p>
          </section>
          <section>
            <h3 className="text-default-label font-semibold">서비스 이용</h3>
            <p className="mt-2">
              회원은 사이트를 생성하고 게시글, 일정, 첨부파일 등 제공되는 기능을
              이용할 수 있습니다. 관련 법령, 약관, 운영정책에 위반되는 콘텐츠는
              제한될 수 있습니다.
            </p>
          </section>
          <section>
            <h3 className="text-default-label font-semibold">이용 제한</h3>
            <p className="mt-2">
              음란물, 불법 게시물, 권리침해, 스팸성 콘텐츠, 타인에게 피해를 주는
              행위가 확인되는 경우 게시물 차단, 삭제, 서비스 이용 제한 등의
              조치가 이루어질 수 있습니다.
            </p>
          </section>
          <section>
            <h3 className="text-default-label font-semibold">정책 변경</h3>
            <p className="mt-2">
              운영정책의 추가, 삭제, 수정이 있는 경우 사전에 공지할 수 있습니다.
            </p>
          </section>
        </div>
      </Modal>

      <Modal
        open={reportOpen}
        title="신고하기"
        description={
          isAuthenticated
            ? '부적절한 콘텐츠나 권리침해 내용을 신고합니다.'
            : '신고 기능은 로그인 후 이용할 수 있습니다.'
        }
        size="md"
        onClose={() => setReportOpen(false)}
        footer={
          <>
            <button
              className="border-default-separator bg-default-surface text-default-label hover:bg-default-fill rounded-md border px-4 py-2 text-sm font-semibold transition"
              type="button"
              onClick={() => setReportOpen(false)}
            >
              닫기
            </button>
            <button
              className="bg-default-blue inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={!isAuthenticated}
            >
              <Send size={15} aria-hidden />
              보내기
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <label className="block space-y-2">
            <span className="text-default-label text-sm font-medium">
              홈페이지명
            </span>
            <input
              className="border-default-separator bg-default-fill text-default-label h-11 w-full rounded-md border px-3 text-sm outline-none"
              readOnly
              value={SITE_CONTEXT.name}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-default-label text-sm font-medium">
              이메일
            </span>
            <input
              className="border-default-separator bg-default-surface text-default-label focus:border-default-blue focus:ring-default-blue/15 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-4"
              type="email"
              placeholder="name@example.com"
              disabled={!isAuthenticated}
            />
          </label>
          <fieldset className="space-y-2" disabled={!isAuthenticated}>
            <legend className="text-default-label text-sm font-medium">
              신고사유
            </legend>
            {[
              '음란성 또는 청소년에게 부적합한 내용',
              '부적합한 스팸성 내용',
              '기타'
            ].map((reason) => (
              <label
                key={reason}
                className="text-default-secondary-label flex items-center gap-2 text-sm"
              >
                <input
                  className="accent-default-blue size-4"
                  type="radio"
                  name="reportReason"
                />
                {reason}
              </label>
            ))}
          </fieldset>
          <label className="block space-y-2">
            <span className="text-default-label text-sm font-medium">
              상세내용
            </span>
            <textarea
              className="border-default-separator bg-default-surface text-default-label focus:border-default-blue focus:ring-default-blue/15 h-28 w-full resize-none rounded-md border px-3 py-3 text-sm outline-none focus:ring-4"
              disabled={!isAuthenticated}
            />
          </label>
        </form>
      </Modal>

      <Modal
        open={inquiryOpen}
        title="문의하기"
        description={
          isAuthenticated
            ? '서비스 이용 중 궁금한 점을 문의합니다.'
            : '문의 기능은 로그인 후 이용할 수 있습니다.'
        }
        size="md"
        onClose={() => setInquiryOpen(false)}
        footer={
          <>
            <button
              className="border-default-separator bg-default-surface text-default-label hover:bg-default-fill rounded-md border px-4 py-2 text-sm font-semibold transition"
              type="button"
              onClick={() => setInquiryOpen(false)}
            >
              닫기
            </button>
            <button
              className="bg-default-blue inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={!isAuthenticated}
            >
              <Send size={15} aria-hidden />
              보내기
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <label className="block space-y-2">
            <span className="text-default-label text-sm font-medium">
              이메일
            </span>
            <input
              className="border-default-separator bg-default-surface text-default-label focus:border-default-blue focus:ring-default-blue/15 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-4"
              type="email"
              placeholder="name@example.com"
              disabled={!isAuthenticated}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-default-label text-sm font-medium">제목</span>
            <input
              className="border-default-separator bg-default-surface text-default-label focus:border-default-blue focus:ring-default-blue/15 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-4"
              disabled={!isAuthenticated}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-default-label text-sm font-medium">내용</span>
            <textarea
              className="border-default-separator bg-default-surface text-default-label focus:border-default-blue focus:ring-default-blue/15 h-32 w-full resize-none rounded-md border px-3 py-3 text-sm outline-none focus:ring-4"
              disabled={!isAuthenticated}
            />
          </label>
        </form>
      </Modal>
    </div>
  );
}
