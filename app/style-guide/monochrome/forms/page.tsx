import { PageIntro, PreviewPanel, StyleGuideSection } from 'app/style-guide/monochrome/_components/style-guide-section';
import { MonochromeDropdown } from 'app/style-guide/monochrome/_components/monochrome-dropdown';
import styles from '../monochrome.module.css';

const fieldLabel = (label: string, meta?: string) => (
  <div className={styles.labelRow}>
    <span className={styles.label}>{label}</span>
    {meta ? <span className={styles.labelMeta}>{meta}</span> : null}
  </div>
);

export default function MonochromeFormsPage() {
  return (
    <>
      <PageIntro title="Forms">
        미니멀한 폼은 장식을 줄이는 대신 입력 영역과 상태를 정확하게 보여줘야 합니다. 표면의 깊이, 레이블의 리듬, 포커스 링과 검증 메시지를 같은 규칙으로 사용합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Controls" title="Quiet surfaces, clear actions">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Text input">
            <div className={styles.formGrid}>
              <label className={styles.field}>
                {fieldLabel('사이트 이름', '필수')}
                <input className={styles.control} defaultValue="대전포스트잇" />
                <span className={styles.hint}>사이트 상단과 공유 미리보기에 표시됩니다.</span>
              </label>
              <label className={styles.field}>
                {fieldLabel('설명')}
                <textarea className={`${styles.control} ${styles.textarea}`} placeholder="사이트를 소개해 주세요." />
                <span className={styles.hint}>짧고 명확한 문장으로 작성해 주세요.</span>
              </label>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Select and choices">
            <div className={styles.formGrid}>
              <MonochromeDropdown
                label="콘텐츠 유형"
                defaultValue="article"
                options={[
                  { value: 'article', label: '게시글' },
                  { value: 'event', label: '일정' },
                  { value: 'static', label: '정적 콘텐츠' }
                ]}
              />
              <div className={styles.field}>
                {fieldLabel('공개 범위')}
                <div className={styles.choiceGroup}>
                  <label className={styles.choice}>
                    <input name="monochrome-visibility" type="radio" className={styles.choiceInput} defaultChecked />
                    <span>공개 — 누구나 볼 수 있습니다.</span>
                  </label>
                  <label className={styles.choice}>
                    <input name="monochrome-visibility" type="radio" className={styles.choiceInput} />
                    <span>비공개 — 관리자만 볼 수 있습니다.</span>
                  </label>
                </div>
              </div>
              <label className={styles.choice}>
                <input type="checkbox" className={styles.choiceInput} defaultChecked />
                <span>검색엔진에 노출</span>
              </label>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Input group and range">
            <div className={styles.formGrid}>
              <label className={styles.field}>
                {fieldLabel('사이트 주소')}
                <div className={styles.controlGroup}>
                  <span className={styles.groupAddon}>https://</span>
                  <input className={styles.control} defaultValue="daejeonstickybook.seesaw.me.kr" />
                </div>
              </label>
              <label className={styles.field}>
                {fieldLabel('노출 순서', '6 / 10')}
                <input type="range" min="0" max="10" defaultValue="6" className={styles.range} />
                <span className={`${styles.hint} flex justify-between`}><span>낮음</span><span>높음</span></span>
              </label>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Validation and actions">
            <div className={styles.formGrid}>
              <label className={styles.field}>
                {fieldLabel('정상 입력')}
                <input className={`${styles.control} ${styles.controlSuccess}`} defaultValue="valid-category-id" />
                <span className={styles.statusSuccess}>사용 가능한 값입니다.</span>
              </label>
              <label className={styles.field}>
                {fieldLabel('오류 입력')}
                <input className={`${styles.control} ${styles.controlDanger}`} defaultValue="invalid-domain" aria-invalid="true" />
                <span className={styles.statusDanger}>도메인 형식을 확인해 주세요.</span>
              </label>
              <div className="flex flex-wrap gap-3 border-t border-[var(--monochrome-separator)] pt-5">
                <button className={styles.actionPrimary}>저장하기</button>
                <button className={styles.actionSecondary}>취소</button>
                <button className={styles.actionDisabled} disabled>비활성</button>
              </div>
            </div>
          </PreviewPanel>
        </div>
      </StyleGuideSection>
    </>
  );
}
