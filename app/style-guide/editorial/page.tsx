import Link from 'next/link';
import editorial from './editorial.module.css';

const sections = [
  ['Foundations', '/style-guide/editorial/foundations', 'Tokens, typography, spacing, and the editorial grid.'],
  ['Atoms', '/style-guide/editorial/atoms', 'The smallest visible units: labels, controls, and actions.'],
  ['Molecules', '/style-guide/editorial/molecules', 'Useful combinations that create a clear reading rhythm.'],
  ['Organisms', '/style-guide/editorial/organisms', 'Reusable content blocks for boards, articles, and comments.'],
  ['Patterns', '/style-guide/editorial/patterns', 'Complete page compositions built from the system.']
] as const;

export default function EditorialPage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 border-b pb-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]" style={{ borderColor: 'var(--editorial-line)' }}>
        <div className={editorial.displayContainer}>
          <p className={`${editorial.label} text-[var(--editorial-accent)]`}>Issue 01 · Design direction</p>
          <h2 className={`${editorial.display} ${editorial.responsiveDisplay} mt-5`}>Content<br />in print.</h2>
        </div>
        <div className="flex items-end">
          <p className={`${editorial.body} max-w-md text-lg leading-8 text-[var(--editorial-ink-soft)]`}>편집 디자인의 긴장감과 여백을 디지털 화면에 옮깁니다. 크고 명확한 제목, 얇은 선, 정교한 정보 계층으로 콘텐츠가 먼저 보이게 합니다.</p>
        </div>
      </section>

      <section className="grid gap-0 border-y sm:grid-cols-2 lg:grid-cols-5" style={{ borderColor: 'var(--editorial-line)' }}>
        {sections.map(([title, href, description], index) => (
          <Link key={href} href={href} className="group border-b p-6 transition-colors hover:bg-[var(--editorial-ink)] hover:text-[var(--editorial-surface)] lg:border-b-0 lg:border-r lg:last:border-r-0" style={{ borderColor: 'var(--editorial-line)' }}>
            <span className={`${editorial.label} text-[var(--editorial-ink-muted)] group-hover:text-[var(--editorial-accent)]`}>0{index + 1}</span>
            <h3 className="mt-16 text-3xl font-black tracking-[-0.05em] uppercase">{title}</h3>
            <p className={`${editorial.body} mt-4 text-sm leading-6 text-[var(--editorial-ink-soft)] group-hover:text-[var(--editorial-surface)]`}>{description}</p>
            <span className="mt-12 block text-xs font-bold tracking-widest uppercase">Open →</span>
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between border-b pb-3" style={{ borderColor: 'var(--editorial-line)' }}>
          <p className={editorial.label}>Composition study</p><span className={editorial.label}>03 / 03</span>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className={`${editorial.imagePlaceholder} min-h-80 p-6 text-white`}><p className={editorial.label}>Feature image</p><p className="mt-24 text-5xl font-black tracking-[-0.07em] uppercase">The<br />cover<br />story</p></div>
          <div className="border p-5" style={{ borderColor: 'var(--editorial-line-soft)' }}><p className={editorial.label}>01 · Article</p><h3 className="mt-20 text-2xl font-black tracking-[-0.05em] uppercase">Strong hierarchy</h3><p className={`${editorial.body} mt-4 leading-7 text-[var(--editorial-ink-soft)]`}>정보의 우선순위를 크기와 간격, 규칙선으로 명확하게 전달합니다.</p></div>
          <div className="border p-5" style={{ borderColor: 'var(--editorial-line-soft)' }}><p className={editorial.label}>02 · Note</p><p className={`${editorial.body} mt-20 text-2xl leading-8`}>“Good design is as little design as possible.”</p></div>
        </div>
      </section>
    </div>
  );
}
