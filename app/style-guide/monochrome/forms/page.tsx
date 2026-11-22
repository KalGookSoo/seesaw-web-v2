import { PageIntro, PreviewPanel, StyleGuideSection } from 'app/style-guide/monochrome/_components/style-guide-section';
import { MonochromeDropdown } from 'app/style-guide/monochrome/_components/monochrome-dropdown';

const input = 'h-11 w-full rounded-lg border border-[var(--monochrome-separator)] bg-[var(--monochrome-surface)] px-3 text-sm text-[var(--monochrome-label)] outline-none transition-colors placeholder:text-[var(--monochrome-tertiary-label)] focus:border-[var(--monochrome-accent)] focus:ring-2 focus:ring-[var(--monochrome-accent-soft)]';

export default function MonochromeFormsPage() {
  return (
    <>
      <PageIntro title="Forms">입력 컨트롤은 표면과 경계의 차이를 작게 유지하고, 포커스와 오류 상태에서만 의미 있는 대비를 사용합니다. 레이블과 도움말은 입력값보다 먼저 읽히도록 배치합니다.</PageIntro>
      <StyleGuideSection eyebrow="Controls" title="Calm, legible inputs">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Text input"><div className="space-y-4"><label className="block space-y-2"><span className="text-sm font-semibold text-[var(--monochrome-label)]">사이트 이름</span><input className={input} defaultValue="대전포스트잇" /></label><label className="block space-y-2"><span className="text-sm font-semibold text-[var(--monochrome-label)]">설명</span><textarea className={`${input} h-28 resize-none py-3`} placeholder="사이트를 소개해 주세요." /></label></div></PreviewPanel>
          <PreviewPanel title="Dropdown and checks"><div className="space-y-5"><MonochromeDropdown label="콘텐츠 유형" defaultValue="article" options={[{ value: 'article', label: '게시글' }, { value: 'event', label: '일정' }, { value: 'static', label: '정적 콘텐츠' }]} /><label className="flex items-center gap-3 text-sm text-[var(--monochrome-label)]"><input type="checkbox" className="size-4 accent-[var(--monochrome-accent)]" defaultChecked />검색엔진에 노출</label><div className="flex gap-5 text-sm text-[var(--monochrome-label)]"><label className="flex items-center gap-2"><input type="radio" name="visibility" className="size-4 accent-[var(--monochrome-accent)]" defaultChecked />공개</label><label className="flex items-center gap-2"><input type="radio" name="visibility" className="size-4 accent-[var(--monochrome-accent)]" />비공개</label></div></div></PreviewPanel>
          <PreviewPanel title="Validation"><div className="space-y-4"><label className="block space-y-2"><span className="text-sm font-semibold text-[var(--monochrome-label)]">정상 입력</span><input className={`${input} border-[var(--monochrome-success)]`} defaultValue="valid-category-id" /><span className="text-xs text-[var(--monochrome-success)]">사용 가능한 값입니다.</span></label><label className="block space-y-2"><span className="text-sm font-semibold text-[var(--monochrome-label)]">오류 입력</span><input className={`${input} border-[var(--monochrome-danger)]`} defaultValue="invalid-domain" /><span className="text-xs text-[var(--monochrome-danger)]">도메인 형식을 확인해 주세요.</span></label></div></PreviewPanel>
          <PreviewPanel title="Actions"><div className="flex flex-wrap gap-3"><button className="rounded-lg bg-[var(--monochrome-accent)] px-5 py-3 text-sm font-semibold text-[var(--monochrome-accent-contrast)] transition-colors hover:bg-[var(--monochrome-accent-muted)]">저장하기</button><button className="rounded-lg border border-[var(--monochrome-separator)] bg-[var(--monochrome-surface)] px-5 py-3 text-sm font-semibold text-[var(--monochrome-label)] transition-colors hover:bg-[var(--monochrome-fill)]">취소</button><button className="rounded-lg bg-[var(--monochrome-fill)] px-5 py-3 text-sm font-semibold text-[var(--monochrome-tertiary-label)]" disabled>비활성</button></div></PreviewPanel>
        </div>
      </StyleGuideSection>
    </>
  );
}
