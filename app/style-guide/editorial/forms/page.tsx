import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/editorial/_components/style-guide-section';

const inputClassName =
  'h-11 w-full rounded-none border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-950 focus:ring-0 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-200 font-serif';
const labelClassName =
  'text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 font-sans';
const subtleTextClassName =
  'text-sm leading-6 text-neutral-500 dark:text-neutral-400 font-serif italic';

export default function StyleGuideFormsPage() {
  return (
    <>
      <PageIntro title="Forms">
        form 문서를 타이포그래피와 단단한 직선 경계선 중심의 지면 레이아웃
        감각으로 구성한 기준입니다. form control, select, checks, range, input
        group, floating label, layout, validation 상태를 이 페이지에서 함께
        확인합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Form" title="Controls">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Overview">
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className={labelClassName}>제목</span>
                <input className={inputClassName} placeholder="공지사항 제목" />
              </label>
              <label className="block space-y-2">
                <span className={labelClassName}>본문</span>
                <textarea
                  className={`${inputClassName} h-28 resize-none py-3`}
                  placeholder="내용을 입력하세요."
                />
              </label>
              <p className={subtleTextClassName}>
                기본 입력 표면은 직각 모서리, 단단한 잉크 블랙 테두리, 포커스 시
                테두리 명도 대비 강조로 통일합니다.
              </p>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Select">
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className={labelClassName}>카테고리</span>
                <select className={inputClassName} defaultValue="schedule">
                  <option value="board">게시판</option>
                  <option value="schedule">일정</option>
                  <option value="gallery">갤러리</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className={labelClassName}>비활성화</span>
                <select
                  className={`${inputClassName} border-dashed bg-neutral-100 text-neutral-400 dark:bg-neutral-950 dark:text-neutral-600`}
                  disabled
                >
                  <option>선택할 수 없음</option>
                </select>
              </label>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Checks & radios">
            <div className="space-y-4 font-serif">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-900 dark:text-neutral-200">
                <input
                  type="checkbox"
                  className="size-4 rounded-none accent-[var(--editorial-accent)]"
                  defaultChecked
                />
                검색엔진에 노출
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-900 dark:text-neutral-200">
                <input
                  type="checkbox"
                  className="size-4 rounded-none accent-[var(--editorial-line)]"
                />
                프로필 이미지 노출
              </label>
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-900 dark:text-neutral-200">
                  <input
                    name="visibility"
                    type="radio"
                    className="size-4 accent-[var(--editorial-accent)]"
                    defaultChecked
                  />
                  공개
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-900 dark:text-neutral-200">
                  <input
                    name="visibility"
                    type="radio"
                    className="size-4 accent-[var(--editorial-accent)]"
                  />
                  비공개
                </label>
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Range">
            <div className="space-y-4">
              <label className="block space-y-3">
                <span className={labelClassName}>노출 순서</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  defaultValue="6"
                  className="w-full accent-[var(--editorial-accent)]"
                />
              </label>
              <div className="flex justify-between font-mono text-xs font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                <span>낮음</span>
                <span>높음</span>
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Input group">
            <div className="space-y-4">
              <div className="flex overflow-hidden rounded-none border border-neutral-950 bg-white focus-within:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:focus-within:border-neutral-200">
                <span className="flex items-center border-r border-neutral-950/10 bg-neutral-100 px-3 font-sans text-xs font-bold tracking-wider text-neutral-600 uppercase dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                  https://
                </span>
                <input
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 font-serif text-sm text-neutral-900 outline-none dark:text-neutral-100"
                  defaultValue="daejeonstickybook.seesaw.me.kr"
                />
              </div>
              <div className="flex overflow-hidden rounded-none border border-neutral-950 bg-white focus-within:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:focus-within:border-neutral-200">
                <input
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 font-serif text-sm text-neutral-900 outline-none dark:text-neutral-100"
                  defaultValue="calendar.ics"
                />
                <button className="border-l border-neutral-950 bg-[var(--editorial-accent)] px-6 text-xs font-bold tracking-widest text-[var(--editorial-accent-contrast)] uppercase transition-colors hover:bg-[var(--editorial-line)] hover:text-[var(--editorial-background)] dark:border-neutral-800">
                  복사
                </button>
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Floating labels">
            <div className="space-y-4">
              <label className="relative block">
                <input
                  className={`${inputClassName} h-14 pt-5`}
                  placeholder=" "
                  defaultValue="대전포스트잇"
                />
                <span className="absolute top-2 left-3 font-sans text-[0.625rem] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                  사이트 이름
                </span>
              </label>
              <label className="relative block">
                <input
                  className={`${inputClassName} h-14 border-red-600 pt-5 dark:border-red-400`}
                  placeholder=" "
                  defaultValue="invalid-domain"
                />
                <span className="absolute top-2 left-3 font-sans text-[0.625rem] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
                  도메인 이름
                </span>
              </label>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Layout">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className={labelClassName}>이름</span>
                <input className={inputClassName} defaultValue="Doyevskyi" />
              </label>
              <label className="block space-y-2">
                <span className={labelClassName}>이메일</span>
                <input
                  className={inputClassName}
                  defaultValue="hello@seesaw.me.kr"
                />
              </label>
              <label className="block space-y-2 sm:col-span-2">
                <span className={labelClassName}>주소</span>
                <input
                  className={inputClassName}
                  defaultValue="Daejeon, Korea"
                />
              </label>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Validation">
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className={labelClassName}>정상 입력</span>
                <input
                  className={`${inputClassName} border-emerald-600 focus:border-emerald-600 dark:border-emerald-400 dark:focus:border-emerald-400`}
                  defaultValue="valid-category-id"
                />
                <span className="font-serif text-xs font-bold text-emerald-600 italic dark:text-emerald-400">
                  사용 가능한 값입니다.
                </span>
              </label>
              <label className="block space-y-2">
                <span className={labelClassName}>오류 입력</span>
                <input
                  className={`${inputClassName} border-red-600 focus:border-red-600 dark:border-red-400 dark:focus:border-red-400`}
                  defaultValue="blank"
                />
                <span className="font-serif text-xs font-bold text-red-600 italic dark:text-red-400">
                  UUID v4 형식이 아닙니다.
                </span>
              </label>
            </div>
          </PreviewPanel>
        </div>
      </StyleGuideSection>
    </>
  );
}
