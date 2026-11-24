'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Flag,
  Languages,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MessageCircleQuestion,
  Moon,
  PanelLeft,
  PanelRight,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Sun,
  UserRound,
  UserX
} from 'lucide-react';

import type { CategoryResponse } from '@/types/category';
import type { NavigationPosition } from '@/lib/navigation-preferences';
import {
  NAVIGATION_COLLAPSED_COOKIE_KEY,
  NAVIGATION_POSITION_COOKIE_KEY
} from '@/lib/navigation-preferences';
import { Confirm } from '@/components/ui/confirm';
import { Modal } from '@/components/ui/modal';
import { useSiteContext } from '@/app/site-context-provider';
import { useAuth } from '@/hooks/use-auth';
import { openNaverOAuth2Popup, openNaverOAuth2UnlinkPopup } from '@/lib/naver-oauth2-popup';
import { authorizedFetch } from '@/lib/api-fetch';
import { removeMyRoleMapping } from '@/lib/role-mappings';
import { useToast } from '@/components/ui/toast';
import { GlobalSearch } from '@/components/search/global-search';

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

function toRoleDescription(authority: string): string {
  const descriptions: Record<string, string> = {
    ROLE_USER: '일반사용자',
    ROLE_MANAGER: '관리자',
    ROLE_ADMIN: '최고관리자'
  };
  return descriptions[authority] ?? '사이트 이용자';
}

function formatExpiresAt(expiresAt: number): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(expiresAt));
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
  const className = `flex min-h-11 items-center gap-3 border-l-2 px-3 py-2 text-sm font-semibold transition ${
    active
      ? 'border-default-label bg-default-fill text-default-label'
      : 'border-transparent text-default-secondary-label hover:border-default-secondary-label hover:bg-default-fill/60 hover:text-default-label'
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
  const className = `flex min-h-9 items-center justify-between gap-2 border-l-2 px-3 py-2 text-sm transition ${
    active
      ? 'border-default-label bg-default-fill text-default-label font-semibold'
      : 'border-transparent text-default-secondary-label hover:border-default-secondary-label hover:bg-default-fill/60 hover:text-default-label'
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
        <ul className="border-default-separator mt-2 space-y-1 border-l pl-3">
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
              className={`flex min-h-11 items-center border-l-2 px-3 py-2 text-sm font-semibold transition ${
                currentCategory === null
                  ? 'border-default-label bg-default-fill text-default-label'
                  : 'border-transparent text-default-secondary-label hover:border-default-secondary-label hover:bg-default-fill/60 hover:text-default-label'
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
  const [myPageOpen, setMyPageOpen] = useState(false);
  const [receiveEmail, setReceiveEmail] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [reportEmail, setReportEmail] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');
  const [feedbackPending, setFeedbackPending] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginPending, setLoginPending] = useState(false);
  const [extendSessionPending, setExtendSessionPending] = useState(false);
  const [withdrawConfirmOpen, setWithdrawConfirmOpen] = useState(false);
  const [withdrawPending, setWithdrawPending] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [navigationPosition, setNavigationPosition] =
    useState<NavigationPosition>(initialNavigationPosition);
  const [navigationCollapsed, setNavigationCollapsed] = useState(
    initialNavigationCollapsed
  );
  const { CURRENT_CATEGORY, NESTED_CATEGORIES, SITE_CONTEXT } =
    useSiteContext();
  const { isAuthenticated, login, logout, user, expiresAt, refresh, bootstrap } =
    useAuth();
  const { showToast } = useToast();
  const categories = useMemo(
    () => NESTED_CATEGORIES.filter((category) => category.exposed),
    [NESTED_CATEGORIES]
  );

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const initialTheme = getInitialTheme();

    setTheme(initialTheme);
    applyTheme(initialTheme);

    if (savedLocale === 'ko' || savedLocale === 'en') {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    // 로컬에 남아있던 로그인 상태는 새로고침 시 화면이 깜빡이지 않도록 하는 낙관적 표시일 뿐이라,
    // 마운트 시 서버(httpOnly 쿠키)에 실제로도 유효한지 다시 확인한다.
    void bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setMyPageOpen(false);
    }
  }, [isAuthenticated]);

  const startNaverLogin = async () => {
    setLoginPending(true);
    try {
      const tokens = await openNaverOAuth2Popup();
      await login(tokens);
      setLoginOpen(false);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '로그인을 시작하지 못했습니다.'
        , 'error'
      );
    } finally {
      setLoginPending(false);
    }
  };

  const openReport = () => {
    if (!isAuthenticated) {
      void startNaverLogin();
      return;
    }
    setReportEmail(user?.email ?? '');
    setReportOpen(true);
  };

  const openInquiry = () => {
    if (!isAuthenticated) {
      void startNaverLogin();
      return;
    }
    setInquiryEmail(user?.email ?? '');
    setInquiryOpen(true);
  };

  const submitReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackPending(true);
    try {
      const response = await authorizedFetch('/api/mail/send-to-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: SITE_CONTEXT.id,
          title: reportReason,
          content: reportContent
        })
      });
      if (!response.ok) {
        throw new Error('신고 전송에 실패했습니다.');
      }
      showToast(`신고가 성공적으로 전송되었습니다.\n회신은 ${reportEmail} 주소로 발송됩니다.`, 'success');
      setReportReason('');
      setReportContent('');
      setReportOpen(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : '신고 전송에 실패했습니다.', 'error');
    } finally {
      setFeedbackPending(false);
    }
  };

  const submitInquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackPending(true);
    try {
      const response = await authorizedFetch('/api/mail/send-to-helpdesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: SITE_CONTEXT.id,
          title: inquiryTitle,
          content: inquiryContent
        })
      });
      if (!response.ok) {
        throw new Error('문의 전송에 실패했습니다.');
      }
      showToast(`문의가 성공적으로 전송되었습니다.\n회신은 ${inquiryEmail} 주소로 발송됩니다.`, 'success');
      setInquiryTitle('');
      setInquiryContent('');
      setInquiryOpen(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : '문의 전송에 실패했습니다.', 'error');
    } finally {
      setFeedbackPending(false);
    }
  };

  const signOut = () => {
    void logout();
  };

  const handleWithdraw = async () => {
    setWithdrawConfirmOpen(false);
    setWithdrawPending(true);
    try {
      await openNaverOAuth2UnlinkPopup();
      await removeMyRoleMapping(SITE_CONTEXT.id);
      showToast('네이버 연동이 해제되었습니다.', 'success');
      setMyPageOpen(false);
      await logout();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '연동 해제에 실패했습니다.'
        , 'error'
      );
    } finally {
      setWithdrawPending(false);
    }
  };

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

  const handleMyPageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // API가 아직 없어 실제 저장은 이후 연동 시 채운다.
    event.preventDefault();
  };

  const handleExtendSession = async () => {
    setExtendSessionPending(true);
    try {
      const success = await refresh();
      showToast(
        success ? '로그인이 연장되었습니다.' : '로그인 연장에 실패했습니다. 다시 로그인해주세요.',
        success ? 'success' : 'error'
      );
    } finally {
      setExtendSessionPending(false);
    }
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
      onOpenReport={openReport}
      onOpenInquiry={openInquiry}
      onToggleCollapsed={toggleNavigationCollapsed}
    />
  );

  const main = (
    <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
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

        <GlobalSearch />

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
            <button
              className="bg-default-fill text-default-label hover:bg-default-gray-5 hidden h-9 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition sm:inline-flex"
              type="button"
              onClick={() => setMyPageOpen(true)}
            >
              <UserRound size={15} aria-hidden />
              마이페이지
            </button>
            <button
              className="bg-default-fill text-default-label hover:bg-default-gray-5 inline-flex h-9 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition"
              type="button"
              onClick={signOut}
            >
              <LogOut size={15} aria-hidden />
              로그아웃
            </button>
          </>
        ) : (
          <button
            className="bg-default-blue hover:bg-default-blue/90 inline-flex h-9 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-white transition"
            type="button"
            onClick={() => setLoginOpen(true)}
          >
            <LogIn size={15} aria-hidden />
            로그인
          </button>
        )}
      </header>

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );

  return (
    <div
      className={`bg-default-surface-grouped text-default-label min-h-dvh transition-[grid-template-columns] duration-300 ease-out ${desktopShellClassName}`}
    >
      {navigationPosition === 'left' ? (
        <>
          <div
            className={`bg-default-surface hidden min-w-0 self-start overflow-hidden transition-[opacity,transform] duration-300 ease-out lg:flex lg:sticky lg:top-0 lg:h-dvh ${
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
            className={`bg-default-surface hidden min-w-0 self-start overflow-hidden transition-[opacity,transform] duration-300 ease-out lg:flex lg:sticky lg:top-0 lg:h-dvh ${
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

      <Modal
        open={loginOpen}
        title="네이버 계정으로 계속하기"
        description="로그인이 필요한 기능입니다."
        size="sm"
        variant="monochrome"
        onClose={() => setLoginOpen(false)}
        footer={
          <>
            <button
              className="border-default-separator bg-default-surface text-default-secondary-label hover:bg-default-fill inline-flex h-11 items-center justify-center border px-4 text-sm font-semibold transition"
              type="button"
              onClick={() => setLoginOpen(false)}
            >
              취소
            </button>
            <button
              className="bg-default-label text-default-background hover:bg-default-secondary-label inline-flex h-11 items-center justify-center gap-2 px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loginPending}
              type="button"
              onClick={startNaverLogin}
            >
              <span aria-hidden className="bg-default-background text-default-label inline-flex size-5 items-center justify-center text-xs font-black">N</span>
              {loginPending ? '인증 준비 중…' : '네이버 인증 시작'}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <p className="text-default-tertiary-label text-[0.65rem] font-semibold tracking-[0.2em] uppercase">
            Account access
          </p>
          <p className="text-default-secondary-label text-sm leading-6">
            네이버 계정 인증을 마치면 지금 보고 있는 페이지로 자동으로 돌아옵니다.
          </p>
          <div className="border-default-separator grid grid-cols-[1fr_auto_1fr] items-center border-y py-4 text-center text-xs">
            <span className="text-default-label font-semibold">현재 페이지</span>
            <span className="text-default-tertiary-label px-3" aria-hidden>→</span>
            <span className="text-default-label font-semibold">네이버 인증</span>
          </div>
        </div>
      </Modal>

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
              onOpenReport={openReport}
              onOpenInquiry={openInquiry}
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
        variant="monochrome"
        onClose={() => setSettingsOpen(false)}
      >
        <div className="space-y-7">
          <section className="space-y-3">
            <div className="text-default-label flex items-center gap-3 text-sm font-semibold">
              {theme === 'dark' ? (
                <Moon size={16} aria-hidden />
              ) : (
                <Sun size={16} aria-hidden />
              )}
              <span>화면 모드</span>
            </div>
            <div className="border-default-separator grid grid-cols-2 border p-1">
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
            <div className="text-default-label flex items-center gap-3 text-sm font-semibold">
              <Languages size={16} aria-hidden />
              <span>언어</span>
            </div>
            <div className="border-default-separator grid grid-cols-2 border p-1">
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
            <div className="text-default-label flex items-center gap-3 text-sm font-semibold">
              {navigationPosition === 'left' ? (
                <PanelLeft size={16} aria-hidden />
              ) : (
                <PanelRight size={16} aria-hidden />
              )}
              <span>GNB 위치</span>
            </div>
            <div className="border-default-separator grid grid-cols-2 border p-1">
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
        open={myPageOpen}
        title="마이페이지"
        description="계정 정보와 알림 수신 설정을 확인합니다."
        size="md"
        variant="monochrome"
        onClose={() => setMyPageOpen(false)}
        footer={
          <>
            <button
              className="border-default-separator bg-default-surface text-default-label hover:bg-default-fill inline-flex h-11 items-center justify-center border px-4 text-sm font-semibold transition"
              type="button"
              onClick={() => setMyPageOpen(false)}
            >
              닫기
            </button>
            <button
              className="bg-default-label text-default-background hover:bg-default-secondary-label inline-flex h-11 items-center gap-1.5 px-4 text-sm font-semibold transition"
              form="my-page-form"
              type="submit"
            >
              <Check size={15} aria-hidden />
              저장
            </button>
          </>
        }
      >
        {user ? (
          <div className="space-y-7">
            <section className="space-y-3">
              <div className="text-default-label flex items-center gap-3 text-sm font-semibold">
                <UserRound size={16} aria-hidden />
                <span>계정 정보</span>
              </div>
              <div className="border-default-separator divide-default-separator divide-y border">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-default-secondary-label text-sm">
                    아이디
                  </span>
                  <span className="text-default-label text-sm font-medium">
                    {user.username}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-default-secondary-label text-sm">
                    권한
                  </span>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {user.authorities.length > 0 ? (
                      user.authorities.map((authority) => (
                        <span
                          className="bg-default-fill text-default-label border-default-separator rounded-none border px-2.5 py-1 text-xs font-semibold"
                          key={authority}
                        >
                          {toRoleDescription(authority)}
                        </span>
                      ))
                    ) : (
                      <span className="text-default-tertiary-label text-sm">
                        없음
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="text-default-label flex items-center gap-3 text-sm font-semibold">
                <Clock size={16} aria-hidden />
                <span>로그인 세션</span>
              </div>
              <div className="border-default-separator flex flex-col items-stretch gap-4 border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-default-secondary-label text-sm">
                  {expiresAt === null
                    ? '로그인 정보를 확인할 수 없습니다.'
                    : expiresAt <= Date.now()
                      ? '로그인이 만료되었습니다. 연장해주세요.'
                      : `${formatExpiresAt(expiresAt)}까지 로그인이 유지됩니다.`}
                </span>
                <button
                  className="border-default-label text-default-label hover:bg-default-fill inline-flex h-10 shrink-0 items-center justify-center gap-1.5 border px-3 text-sm font-semibold transition disabled:opacity-50"
                  disabled={extendSessionPending}
                  type="button"
                  onClick={handleExtendSession}
                >
                  {extendSessionPending ? (
                    <Loader2 size={14} aria-hidden className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} aria-hidden />
                  )}
                  로그인 연장
                </button>
              </div>
            </section>

            <section className="space-y-3">
              <div className="text-default-label flex items-center gap-3 text-sm font-semibold">
                <UserX size={16} aria-hidden />
                <span>회원탈퇴</span>
              </div>
              <div className="border-default-separator flex flex-col items-stretch gap-4 border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-default-secondary-label text-sm">
                  네이버 연동을 해제하고 이 사이트의 권한을 제거합니다.
                </span>
                <button
                  className="border-default-red-muted text-default-red hover:bg-default-red-soft inline-flex h-10 shrink-0 items-center justify-center gap-1.5 border px-3 text-sm font-semibold transition disabled:opacity-50"
                  disabled={withdrawPending}
                  type="button"
                  onClick={() => setWithdrawConfirmOpen(true)}
                >
                  {withdrawPending ? (
                    <Loader2 size={14} aria-hidden className="animate-spin" />
                  ) : (
                    <UserX size={14} aria-hidden />
                  )}
                  회원탈퇴
                </button>
              </div>
            </section>

            <form
              className="space-y-3"
              id="my-page-form"
              onSubmit={handleMyPageSubmit}
            >
              <div className="text-default-label flex items-center gap-3 text-sm font-semibold">
                <ShieldCheck size={16} aria-hidden />
                <span>알림 설정</span>
              </div>
              <label className="border-default-separator flex items-center justify-between gap-4 border px-4 py-4">
                <span className="flex items-center gap-2 text-sm">
                  <Mail aria-hidden className="text-default-secondary-label size-4" />
                  이메일 수신
                </span>
                <input
                  checked={receiveEmail}
                  className="form-choice"
                  type="checkbox"
                  onChange={(event) => setReceiveEmail(event.target.checked)}
                />
              </label>
            </form>
          </div>
        ) : null}
      </Modal>

      <Confirm
        confirmLabel="회원탈퇴"
        onCancel={() => setWithdrawConfirmOpen(false)}
        onConfirm={handleWithdraw}
        open={withdrawConfirmOpen}
        title="회원탈퇴 하시겠습니까?"
        tone="danger"
      >
        네이버 재인증 후 이 사이트와의 네이버 연동이 해제되고 이 사이트에 대한 권한이 제거됩니다.
        계정 자체와 다른 사이트의 정보는 그대로 유지됩니다.
      </Confirm>

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
              className="bg-default-label text-default-background inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
              form="reportForm"
              type="submit"
              disabled={feedbackPending}
            >
              <Send size={15} aria-hidden />
              보내기
            </button>
          </>
        }
      >
        <form id="reportForm" className="space-y-4" onSubmit={submitReport}>
          <label className="block space-y-2">
            <span className="text-default-label text-sm font-medium">
              홈페이지명
            </span>
            <input
              className="form-control"
              readOnly
              value={SITE_CONTEXT.name}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-default-label text-sm font-medium">
              이메일
            </span>
            <input
              className="form-control"
              type="email"
              placeholder="name@example.com"
              name="email"
              value={reportEmail}
              readOnly
              required
            />
          </label>
          <fieldset className="space-y-2" disabled={feedbackPending}>
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
                  className="form-choice"
                  type="radio"
                  name="reportReason"
                  value={reason}
                  checked={reportReason === reason}
                  onChange={(event) => setReportReason(event.target.value)}
                  required
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
              className="form-control form-textarea h-28 resize-none"
              name="content"
              value={reportContent}
              onChange={(event) => setReportContent(event.target.value)}
              required
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
              className="bg-default-label text-default-background inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
              form="inquiryForm"
              type="submit"
              disabled={feedbackPending}
            >
              <Send size={15} aria-hidden />
              보내기
            </button>
          </>
        }
      >
        <form id="inquiryForm" className="space-y-4" onSubmit={submitInquiry}>
          <label className="block space-y-2">
            <span className="text-default-label text-sm font-medium">
              이메일
            </span>
            <input
              className="form-control"
              type="email"
              placeholder="name@example.com"
              name="email"
              value={inquiryEmail}
              readOnly
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-default-label text-sm font-medium">제목</span>
            <input
              className="form-control"
              name="title"
              value={inquiryTitle}
              onChange={(event) => setInquiryTitle(event.target.value)}
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-default-label text-sm font-medium">내용</span>
            <textarea
              className="form-control form-textarea h-32 resize-none"
              name="content"
              value={inquiryContent}
              onChange={(event) => setInquiryContent(event.target.value)}
              required
            />
          </label>
        </form>
      </Modal>
    </div>
  );
}
