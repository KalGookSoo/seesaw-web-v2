import editorial from '../editorial.module.css';

const colors = [['Paper', '#F7F1E7', 'var(--editorial-background)'], ['Surface', '#FFFAF1', 'var(--editorial-surface)'], ['Ink', '#201A17', 'var(--editorial-ink)'], ['Primary', '#5F6F61', 'var(--editorial-primary)'], ['Secondary', '#7A817B', 'var(--editorial-secondary)'], ['Danger', '#A34F43', 'var(--editorial-danger)']] as const;

export default function EditorialColorsPage() {
  return <section className="space-y-8"><div className="border-b pb-5" style={{ borderColor: 'var(--editorial-line)' }}><p className={editorial.label}>Editorial foundation</p><h2 className="mt-3 text-5xl font-black tracking-[-0.07em] uppercase">Color &amp; contrast</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{colors.map(([name, hex, token]) => <div key={name} className="border p-4" style={{ borderColor: 'var(--editorial-line-soft)' }}><div className="h-36 border" style={{ background: token, borderColor: 'var(--editorial-line-soft)' }} /><p className="mt-4 font-bold uppercase">{name}</p><code className="mt-2 block text-xs text-[var(--editorial-ink-muted)]">{hex}</code></div>)}</div></section>;
}
