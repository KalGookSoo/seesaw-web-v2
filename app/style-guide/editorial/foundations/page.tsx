import type { ReactNode } from 'react';

import editorial from '../editorial.module.css';

const tokens = [
  ['Paper', '#F7F1E7', 'var(--editorial-background)'],
  ['Surface', '#FFFAF1', 'var(--editorial-surface)'],
  ['Ink', '#201A17', 'var(--editorial-ink)'],
  ['Primary', '#5F6F61', 'var(--editorial-primary)'],
  ['Secondary', '#7A817B', 'var(--editorial-secondary)'],
  ['Danger', '#A34F43', 'var(--editorial-danger)']
] as const;

const typeScale = [
  ['Display', 'clamp(4rem, 11vw, 9rem)', 'Editorial headlines and page entrances', 'Components'],
  ['Heading 1', '3.5rem / 0.95', 'Primary section heading', 'Patterns'],
  ['Heading 2', '2.25rem / 1.05', 'Component and content heading', 'Organisms'],
  ['Heading 3', '1.5rem / 1.2', 'Card and molecule heading', 'Molecules'],
  ['Body', '1rem / 1.8', 'Long-form content and descriptions', 'Reading'],
  ['Label', '0.65rem / 1.4', 'Metadata, categories, and utility labels', 'Metadata']
] as const;

const spacing = [['01', '4px', 'hairline gap'], ['02', '8px', 'control gap'], ['03', '16px', 'component padding'], ['04', '32px', 'section rhythm'], ['05', '64px', 'page rhythm'], ['06', '96px', 'editorial opening']] as const;

const line = { borderColor: 'var(--editorial-line)' };
const softLine = { borderColor: 'var(--editorial-line-soft)' };

function Rule({ children }: Readonly<{ children: ReactNode }>) {
  return <section className="border-t pt-8" style={line}>{children}</section>;
}

export default function EditorialFoundationsPage() {
  return <section className="space-y-16"><header className="border-b pb-8" style={line}><p className={editorial.label}>Atomic level 00</p><h2 className="mt-3 text-5xl font-black tracking-[-0.07em] uppercase sm:text-7xl">Foundations</h2><p className={`${editorial.body} mt-5 max-w-2xl text-lg leading-8 text-[var(--editorial-ink-soft)]`}>모든 화면이 공유하는 색, 글자, 간격, 선의 기준입니다. Editorial은 장식보다 정보의 순서와 읽기 리듬을 우선합니다.</p></header>

    <Rule><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className={editorial.label}>01 · Color system</p><h3 className="mt-2 text-3xl font-black tracking-[-0.05em] uppercase">Color tokens</h3></div><span className={editorial.label}>Paper / Ink / Primary / Support</span></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tokens.map(([name, hex, token]) => <div key={name} className="border p-4" style={softLine}><div className="h-28 border" style={{ background: token, borderColor: 'var(--editorial-line-soft)' }} /><p className="mt-4 font-bold uppercase">{name}</p><code className="mt-2 block text-xs text-[var(--editorial-ink-muted)]">{hex}</code></div>)}</div><p className={`${editorial.body} mt-5 max-w-2xl text-sm leading-7 text-[var(--editorial-ink-soft)]`}>Primary는 행동과 현재 상태를 표시하고, Secondary는 보조 정보에 사용합니다. Danger는 삭제·오류처럼 주의가 필요한 순간에만 제한적으로 사용합니다.</p></Rule>

    <Rule><div className="mb-6"><p className={editorial.label}>02 · Type system</p><h3 className="mt-2 text-3xl font-black tracking-[-0.05em] uppercase">Typography scale</h3></div><div className="border" style={softLine}>{typeScale.map(([name, size, usage, example]) => <div key={name} className="grid gap-4 border-b p-5 last:border-b-0 lg:grid-cols-[9rem_1fr_16rem] lg:items-center" style={softLine}><div><p className="font-bold uppercase">{name}</p><code className="mt-1 block text-xs text-[var(--editorial-ink-muted)]">{size}</code></div><p className={`${name === 'Body' ? editorial.body : 'font-black tracking-[-0.05em]'} ${name === 'Display' ? 'text-5xl sm:text-7xl' : name === 'Heading 1' ? 'text-4xl' : name === 'Heading 2' ? 'text-3xl' : name === 'Heading 3' ? 'text-2xl' : name === 'Label' ? 'text-xs tracking-widest uppercase' : 'text-base leading-8'}`}>{name === 'Body' ? '정보는 짧고 명확한 문장으로 읽힙니다.' : name === 'Label' ? 'BOARD · 24 NOV 2026' : 'Editorial'}</p><span className="text-xs text-[var(--editorial-ink-muted)]">{usage} · {example}</span></div>)}</div><div className="mt-6 grid gap-8 border-y py-8 lg:grid-cols-2" style={softLine}><div><p className={editorial.label}>Display face</p><p className="mt-4 text-6xl font-black tracking-[-0.08em] uppercase">Aa</p><p className="mt-3 text-xl font-black">Arial Black / tight tracking</p></div><div><p className={editorial.label}>Reading face</p><p className={`${editorial.body} mt-4 text-3xl`}>Aa</p><p className="mt-3 text-xl font-black">Georgia / generous leading</p></div></div></Rule>

    <Rule><div className="mb-6"><p className={editorial.label}>03 · Layout system</p><h3 className="mt-2 text-3xl font-black tracking-[-0.05em] uppercase">Editorial grid</h3></div><div className="border p-3 sm:p-5" style={softLine}><div className="grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-12">{Array.from({ length: 12 }, (_, index) => <div key={index} className="h-32 bg-[var(--editorial-surface-muted)] sm:h-40" />)}</div></div><div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="border p-5" style={softLine}><p className={editorial.label}>Columns</p><p className="mt-3 text-2xl font-black">12</p><p className="mt-2 text-sm text-[var(--editorial-ink-soft)]">Desktop editorial grid</p></div><div className="border p-5" style={softLine}><p className={editorial.label}>Gutter</p><p className="mt-3 text-2xl font-black">16–32px</p><p className="mt-2 text-sm text-[var(--editorial-ink-soft)]">Viewport에 따라 유동적으로 조정</p></div><div className="border p-5" style={softLine}><p className={editorial.label}>Measure</p><p className="mt-3 text-2xl font-black">65ch</p><p className="mt-2 text-sm text-[var(--editorial-ink-soft)]">본문 한 줄의 권장 최대 길이</p></div></div></Rule>

    <Rule><div className="mb-6"><p className={editorial.label}>04 · Spacing</p><h3 className="mt-2 text-3xl font-black tracking-[-0.05em] uppercase">Rhythm &amp; spacing</h3></div><div className="grid gap-3 border p-5" style={softLine}>{spacing.map(([step, size, use]) => <div key={step} className="flex items-center gap-4"><span className="w-8 text-xs text-[var(--editorial-ink-muted)]">{step}</span><div className="h-3 bg-[var(--editorial-ink)]" style={{ width: size }} /><span className="w-14 text-xs font-bold">{size}</span><span className="text-sm text-[var(--editorial-ink-soft)]">{use}</span></div>)}</div><p className={`${editorial.body} mt-5 text-sm leading-7 text-[var(--editorial-ink-soft)]`}>컴포넌트 내부는 4·8·16px 단위로 조밀하게 구성하고, 섹션 사이에는 32·64·96px의 큰 리듬을 사용합니다.</p></Rule>

    <Rule><div className="mb-6"><p className={editorial.label}>05 · Surface language</p><h3 className="mt-2 text-3xl font-black tracking-[-0.05em] uppercase">Rules, radius &amp; surface</h3></div><div className="grid gap-5 md:grid-cols-3"><div className="border p-5" style={line}><div className="border-t pt-4" style={line}><p className="font-bold">Strong rule</p><p className="mt-2 text-sm text-[var(--editorial-ink-soft)]">주요 섹션과 데이터 테이블을 나눕니다.</p></div></div><div className="border p-5" style={softLine}><div className="border-t pt-4" style={softLine}><p className="font-bold">Soft rule</p><p className="mt-2 text-sm text-[var(--editorial-ink-soft)]">보조 정보와 반복 항목을 구분합니다.</p></div></div><div className="border p-5" style={softLine}><div className="flex h-20 items-center justify-center border bg-[var(--editorial-surface-muted)] text-xs font-bold uppercase" style={softLine}>Radius 0 · no decoration</div><p className="mt-3 text-sm text-[var(--editorial-ink-soft)]">편집적인 긴장감을 위해 기본 곡률과 그림자를 최소화합니다.</p></div></div></Rule>

    <Rule><div className="mb-6"><p className={editorial.label}>06 · Responsive behavior</p><h3 className="mt-2 text-3xl font-black tracking-[-0.05em] uppercase">From spread to column</h3></div><div className="grid gap-0 border sm:grid-cols-3" style={line}>{[['Desktop', '≥ 1024px', '12 columns'], ['Tablet', '≥ 640px', '8 columns'], ['Mobile', '< 640px', '4 columns']].map(([name, breakpoint, grid]) => <div key={name} className="border-b p-5 sm:border-b-0 sm:border-r sm:last:border-r-0" style={line}><p className={editorial.label}>{name}</p><p className="mt-8 text-2xl font-black">{breakpoint}</p><p className="mt-2 text-sm text-[var(--editorial-ink-soft)]">{grid}</p></div>)}</div></Rule>
  </section>;
}
