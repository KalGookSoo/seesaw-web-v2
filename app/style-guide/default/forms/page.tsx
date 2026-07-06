import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/default/_components/style-guide-section';

const inputClassName =
  'h-11 w-full rounded-md border border-default-separator bg-default-surface px-3 text-sm text-default-label outline-none transition focus:border-default-blue focus:ring-4 focus:ring-default-blue/15';
const labelClassName = 'text-sm font-medium text-default-label';
const subtleTextClassName = 'text-sm leading-6 text-default-secondary-label';

export default function StyleGuideFormsPage() {
  return (
    <>
      <PageIntro title="Forms">
        Bootstrap 5 form 문서를 Tailwind 표면으로 옮긴 기준입니다. form control,
        select, checks, range, input group, floating label, layout, validation
        상태를 이 페이지에서 함께 확인합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Form" title="Controls">
        <div className="grid gap-5 lg:grid-cols-2">
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
                기본 입력 표면은 흰색, separator, blue focus ring으로
                통일합니다.
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
                  className={`${inputClassName} bg-default-fill text-default-tertiary-label`}
                  disabled
                >
                  <option>선택할 수 없음</option>
                </select>
              </label>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Checks & radios">
            <div className="space-y-4">
              <label className="text-default-label flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="accent-default-blue size-4"
                  defaultChecked
                />
                검색엔진에 노출
              </label>
              <label className="text-default-label flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="accent-default-green size-4"
                />
                프로필 이미지 노출
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="text-default-label flex items-center gap-2 text-sm">
                  <input
                    name="visibility"
                    type="radio"
                    className="accent-default-blue size-4"
                    defaultChecked
                  />
                  공개
                </label>
                <label className="text-default-label flex items-center gap-2 text-sm">
                  <input
                    name="visibility"
                    type="radio"
                    className="accent-default-blue size-4"
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
                  className="accent-default-blue w-full"
                />
              </label>
              <div className="text-default-tertiary-label flex justify-between text-xs">
                <span>낮음</span>
                <span>높음</span>
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Input group">
            <div className="space-y-4">
              <div className="border-default-separator bg-default-surface focus-within:border-default-blue focus-within:ring-default-blue/15 flex overflow-hidden rounded-md border focus-within:ring-4">
                <span className="border-default-separator bg-default-fill text-default-secondary-label flex items-center border-r px-3 text-sm">
                  https://
                </span>
                <input
                  className="text-default-label h-11 min-w-0 flex-1 px-3 text-sm outline-none"
                  defaultValue="daejeonstickybook.seesaw.me.kr"
                />
              </div>
              <div className="border-default-separator bg-default-surface flex overflow-hidden rounded-md border">
                <input
                  className="text-default-label h-11 min-w-0 flex-1 px-3 text-sm outline-none"
                  defaultValue="calendar.ics"
                />
                <button className="border-default-separator bg-default-blue border-l px-4 text-sm font-semibold text-white">
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
                <span className="text-default-secondary-label absolute top-2 left-3 text-xs font-medium">
                  사이트 이름
                </span>
              </label>
              <label className="relative block">
                <input
                  className={`${inputClassName} border-default-red ring-default-red/10 h-14 pt-5 ring-4`}
                  placeholder=" "
                  defaultValue="invalid-domain"
                />
                <span className="text-default-red absolute top-2 left-3 text-xs font-medium">
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
                  className={`${inputClassName} border-default-green focus:border-default-green focus:ring-default-green/15`}
                  defaultValue="valid-category-id"
                />
                <span className="text-default-green text-xs font-medium">
                  사용 가능한 값입니다.
                </span>
              </label>
              <label className="block space-y-2">
                <span className={labelClassName}>오류 입력</span>
                <input
                  className={`${inputClassName} border-default-red focus:border-default-red focus:ring-default-red/15`}
                  defaultValue="blank"
                />
                <span className="text-default-red text-xs font-medium">
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
