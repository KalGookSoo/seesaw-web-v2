import { PageIntro, PreviewPanel, StyleGuideSection } from 'app/style-guide/editorial/_components/style-guide-section';

const inputClassName =
  'h-11 w-full rounded-none border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-950 focus:ring-0 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-200 font-serif';
const labelClassName = 'text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 font-sans';
const subtleTextClassName = 'text-sm leading-6 text-neutral-500 dark:text-neutral-400 font-serif italic';

export default function StyleGuideFormsPage() {
  return (
    <>
      <PageIntro title="Forms">
        form 문서를 타이포그래피와 단단한 직선 경계선 중심의 지면 레이아웃 감각으로 구성한 기준입니다. form control, select,
        checks, range, input group, floating label, layout, validation 상태를 이 페이지에서 함께 확인합니다.
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
                <textarea className={`${inputClassName} h-28 resize-none py-3`} placeholder="내용을 입력하세요." />
              </label>
              <p className={subtleTextClassName}>기본 입력 표면은 직각 모서리, 단단한 잉크 블랙 테두리, 포커스 시 테두리 명도 대비 강조로 통일합니다.</p>
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
                <select className={`${inputClassName} bg-neutral-100 text-neutral-400 dark:bg-neutral-950 dark:text-neutral-600 border-dashed`} disabled>
                  <option>선택할 수 없음</option>
                </select>
              </label>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Checks & radios">
            <div className="space-y-4 font-serif">
              <label className="text-neutral-900 dark:text-neutral-200 flex items-center gap-3 text-sm cursor-pointer">
                <input type="checkbox" className="accent-[#6b1d2f] dark:accent-[#e05a76] size-4 rounded-none" defaultChecked />
                검색엔진에 노출
              </label>
              <label className="text-neutral-900 dark:text-neutral-200 flex items-center gap-3 text-sm cursor-pointer">
                <input type="checkbox" className="accent-neutral-950 dark:accent-neutral-200 size-4 rounded-none" />
                프로필 이미지 노출
              </label>
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="text-neutral-900 dark:text-neutral-200 flex items-center gap-2 text-sm cursor-pointer">
                  <input name="visibility" type="radio" className="accent-[#6b1d2f] dark:accent-[#e05a76] size-4" defaultChecked />
                  공개
                </label>
                <label className="text-neutral-900 dark:text-neutral-200 flex items-center gap-2 text-sm cursor-pointer">
                  <input name="visibility" type="radio" className="accent-[#6b1d2f] dark:accent-[#e05a76] size-4" />
                  비공개
                </label>
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Range">
            <div className="space-y-4">
              <label className="block space-y-3">
                <span className={labelClassName}>노출 순서</span>
                <input type="range" min="0" max="10" defaultValue="6" className="accent-[#6b1d2f] dark:accent-[#e05a76] w-full" />
              </label>
              <div className="text-neutral-400 dark:text-neutral-500 flex justify-between text-xs font-mono uppercase tracking-wider font-bold">
                <span>낮음</span>
                <span>높음</span>
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Input group">
            <div className="space-y-4">
              <div className="border-neutral-950 bg-white flex overflow-hidden rounded-none border dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-neutral-950 dark:focus-within:border-neutral-200">
                <span className="border-neutral-950/10 bg-neutral-100 text-neutral-600 flex items-center border-r px-3 text-xs font-bold uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 font-sans">
                  https://
                </span>
                <input
                  className="text-neutral-900 dark:text-neutral-100 h-11 min-w-0 flex-1 px-3 text-sm outline-none font-serif bg-transparent"
                  defaultValue="daejeonstickybook.seesaw.me.kr"
                />
              </div>
              <div className="border-neutral-950 bg-white flex overflow-hidden rounded-none border dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-neutral-950 dark:focus-within:border-neutral-200">
                <input className="text-neutral-900 dark:text-neutral-100 h-11 min-w-0 flex-1 px-3 text-sm outline-none font-serif bg-transparent" defaultValue="calendar.ics" />
                <button className="bg-[#6b1d2f] dark:bg-[#e05a76] border-l border-neutral-950 dark:border-neutral-800 px-6 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-950 dark:hover:bg-white dark:hover:text-neutral-950 transition-colors">복사</button>
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Floating labels">
            <div className="space-y-4">
              <label className="relative block">
                <input className={`${inputClassName} h-14 pt-5`} placeholder=" " defaultValue="대전포스트잇" />
                <span className="text-neutral-400 dark:text-neutral-500 absolute top-2 left-3 text-[10px] font-bold uppercase tracking-wider font-sans">사이트 이름</span>
              </label>
              <label className="relative block">
                <input
                  className={`${inputClassName} border-red-600 dark:border-red-400 h-14 pt-5`}
                  placeholder=" "
                  defaultValue="invalid-domain"
                />
                <span className="text-red-600 dark:text-red-400 absolute top-2 left-3 text-[10px] font-bold uppercase tracking-wider font-sans">도메인 이름</span>
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
                <input className={inputClassName} defaultValue="hello@seesaw.me.kr" />
              </label>
              <label className="block space-y-2 sm:col-span-2">
                <span className={labelClassName}>주소</span>
                <input className={inputClassName} defaultValue="Daejeon, Korea" />
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
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold font-serif italic">사용 가능한 값입니다.</span>
              </label>
              <label className="block space-y-2">
                <span className={labelClassName}>오류 입력</span>
                <input
                  className={`${inputClassName} border-red-600 focus:border-red-600 dark:border-red-400 dark:focus:border-red-400`}
                  defaultValue="blank"
                />
                <span className="text-red-600 dark:text-red-400 text-xs font-bold font-serif italic">UUID v4 형식이 아닙니다.</span>
              </label>
            </div>
          </PreviewPanel>
        </div>
      </StyleGuideSection>
    </>
  );
}

