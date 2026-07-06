import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/neo-brutalism/_components/style-guide-section';

const inputClassName =
  'h-11 w-full border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] px-3 text-sm font-semibold text-[var(--neo-brutalism-label)] shadow-[3px_3px_0_var(--neo-brutalism-separator)] outline-none transition-transform placeholder:text-[var(--neo-brutalism-tertiary-label)] focus:-translate-y-0.5 focus:bg-[var(--neo-brutalism-accent-soft)]';
const labelClassName =
  'text-sm font-black text-[var(--neo-brutalism-label)] uppercase';
const subtleTextClassName =
  'text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]';

export default function StyleGuideFormsPage() {
  return (
    <>
      <PageIntro title="Forms">
        Form control은 입력 영역을 숨기지 않습니다. 굵은 테두리, 단단한 그림자,
        뚜렷한 focus 상태로 사용자가 어디에 값을 넣고 있는지 노골적으로
        보여줍니다.
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
                기본 입력 표면은 두꺼운 경계선, offset shadow, 강한 focus
                background로 통일합니다.
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
                  className={`${inputClassName} border-dashed opacity-55`}
                  disabled
                >
                  <option>선택할 수 없음</option>
                </select>
              </label>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Checks & radios">
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-[var(--neo-brutalism-ink)]">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--neo-brutalism-blue)]"
                  defaultChecked
                />
                검색엔진에 노출
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-[var(--neo-brutalism-ink)]">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--neo-brutalism-green)]"
                />
                프로필 이미지 노출
              </label>
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--neo-brutalism-ink)]">
                  <input
                    name="visibility"
                    type="radio"
                    className="size-4 accent-[var(--neo-brutalism-blue)]"
                    defaultChecked
                  />
                  공개
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--neo-brutalism-ink)]">
                  <input
                    name="visibility"
                    type="radio"
                    className="size-4 accent-[var(--neo-brutalism-blue)]"
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
                  className="w-full accent-[var(--neo-brutalism-blue)]"
                />
              </label>
              <div className="flex justify-between text-xs text-[var(--neo-brutalism-tertiary-label)]">
                <span>낮음</span>
                <span>높음</span>
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Input group">
            <div className="space-y-4">
              <div className="flex border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[3px_3px_0_var(--neo-brutalism-separator)] focus-within:bg-[var(--neo-brutalism-accent-soft)]">
                <span className="flex items-center border-r-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)] px-4 text-sm font-black text-[var(--neo-brutalism-secondary-label)]">
                  https://
                </span>
                <input
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-[var(--neo-brutalism-label)] outline-none"
                  defaultValue="daejeonstickybook.seesaw.me.kr"
                />
              </div>
              <div className="flex border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[3px_3px_0_var(--neo-brutalism-separator)] focus-within:bg-[var(--neo-brutalism-accent-soft)]">
                <input
                  className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-[var(--neo-brutalism-label)] outline-none"
                  defaultValue="calendar.ics"
                />
                <button className="border-l-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-blue)] px-5 text-sm font-black text-[var(--neo-brutalism-accent-contrast)] transition-transform hover:-translate-y-0.5">
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
                <span className="absolute top-2 left-3 text-xs font-medium text-[var(--neo-brutalism-tertiary-label)]">
                  사이트 이름
                </span>
              </label>
              <label className="relative block">
                <input
                  className={`${inputClassName} h-14 border-red-600 pt-5 dark:border-red-400`}
                  placeholder=" "
                  defaultValue="invalid-domain"
                />
                <span className="absolute top-2 left-3 text-xs font-medium text-[var(--neo-brutalism-red)]">
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
                <span className="text-xs font-medium text-[var(--neo-brutalism-green)]">
                  사용 가능한 값입니다.
                </span>
              </label>
              <label className="block space-y-2">
                <span className={labelClassName}>오류 입력</span>
                <input
                  className={`${inputClassName} border-red-600 focus:border-red-600 dark:border-red-400 dark:focus:border-red-400`}
                  defaultValue="blank"
                />
                <span className="text-xs font-medium text-[var(--neo-brutalism-red)]">
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
