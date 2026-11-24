import editorial from '../editorial.module.css';

const tokens = [
  ['Paper', '#F7F1E7', 'var(--editorial-background)'],
  ['Surface', '#FFFAF1', 'var(--editorial-surface)'],
  ['Ink', '#201A17', 'var(--editorial-ink)'],
  ['Primary', '#5F6F61', 'var(--default-primary)'],
  ['Secondary', '#7A817B', 'var(--default-secondary)'],
  ['Danger', '#A34F43', 'var(--default-danger)']
] as const;

export default function EditorialFoundationsPage() {
  return <section className="space-y-12">
    <header className="border-b pb-5" style={{ borderColor: 'var(--editorial-line)' }}><p className={editorial.label}>Atomic level 00</p><h2 className="mt-3 text-5xl font-black tracking-[-0.07em] uppercase">Foundations</h2><p className={`${editorial.body} mt-4 max-w-xl text-lg leading-8 text-[var(--editorial-ink-soft)]`}>모든 화면이 공유하는 색, 글자, 간격, 선의 기준입니다. 장식보다 정보의 순서를 우선합니다.</p></header>
    <section><div className="mb-5 flex items-end justify-between border-b pb-3" style={{ borderColor: 'var(--editorial-line)' }}><h3 className="font-black uppercase">Color tokens</h3><span className={editorial.label}>Paper / Ink / Primary / Support</span></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tokens.map(([name, hex, token]) => <div key={name} className="border p-4" style={{ borderColor: 'var(--editorial-line-soft)' }}><div className="h-28 border" style={{ background: token, borderColor: 'var(--editorial-line-soft)' }} /><p className="mt-4 font-bold uppercase">{name}</p><code className="mt-2 block text-xs text-[var(--editorial-ink-muted)]">{hex}</code></div>)}</div></section>
    <section className="grid gap-8 border-y py-8 lg:grid-cols-2" style={{ borderColor: 'var(--editorial-line)' }}><div><p className={editorial.label}>Typography</p><p className="mt-5 text-7xl font-black tracking-[-0.09em] uppercase">Aa</p><p className="mt-4 text-2xl font-black tracking-[-0.04em]">Display / Arial Black</p><p className={`${editorial.body} mt-3 text-lg leading-7 text-[var(--editorial-ink-soft)]`}>본문 / Georgia · 긴 호흡의 설명과 인용문에 사용합니다.</p></div><div><p className={editorial.label}>Spacing scale</p><div className="mt-5 space-y-3">{[['01', '4px'], ['02', '8px'], ['03', '16px'], ['04', '32px'], ['05', '64px']].map(([step, size]) => <div key={step} className="flex items-center gap-4"><span className="w-8 text-xs text-[var(--editorial-ink-muted)]">{step}</span><div className="h-3 bg-[var(--editorial-ink)]" style={{ width: size }} /><span className="text-xs">{size}</span></div>)}</div></div></section>
    <section><p className={editorial.label}>Editorial grid</p><div className="mt-5 grid grid-cols-12 gap-2 border p-3" style={{ borderColor: 'var(--editorial-line-soft)' }}>{Array.from({ length: 12 }, (_, index) => <div key={index} className="h-24 bg-[var(--editorial-surface-muted)]" />)}</div></section>
  </section>;
}
