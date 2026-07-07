import contentTheme from 'app/style-guide/windows-98-fluent/windows-98-fluent-content.module.css';

export function RichContentPreview() {
  return (
    <div className={contentTheme.window}>
      <div className={contentTheme.titleBar}>
        <span>ARTICLE_VIEWER.EXE</span>
        <span className={contentTheme.titleActions} aria-hidden="true">
          <span className={contentTheme.titleAction}>_</span>
          <span className={contentTheme.titleAction}>□</span>
          <span className={contentTheme.titleAction}>×</span>
        </span>
      </div>

      <article className={contentTheme.viewer}>
        <h1>CMS 본문 렌더링 타이포그래피</h1>
        <p>
          이 영역은 WYSIWYG 에디터의 viewer에 적용할 기본 HTML element 스타일을
          확인하기 위한 샘플입니다. 테마 module css만 바꾸면 동일한 마크업이
          다른 룩앤필로 렌더링되는 구조를 목표로 합니다.
        </p>
        <p>
          <strong>강조 텍스트</strong>, <em>기울임 텍스트</em>,{' '}
          <s>취소선 텍스트</s>, <a href="#">링크 텍스트</a>를 같은 문단 안에서
          확인합니다.
        </p>

        <h2>Heading 2: 문단 구조</h2>
        <p>
          Windows 98 Fluent 테마는 시스템 회색 표면, 파란 타이틀바, sunken
          content panel을 사용합니다. 본문은 지나치게 둥글지 않고 단단한
          경계선을 유지합니다.
        </p>

        <h3>Heading 3: 목록</h3>
        <ul>
          <li>unordered list는 square marker를 사용합니다.</li>
          <li>marker 색상은 active titlebar 색상과 연결됩니다.</li>
          <li>
            <label>
              <input type="checkbox" defaultChecked readOnly /> task item도 같은
              viewer 안에서 확인합니다.
            </label>
          </li>
        </ul>
        <ol>
          <li>ordered list 첫 번째 항목</li>
          <li>ordered list 두 번째 항목</li>
          <li>ordered list 세 번째 항목</li>
        </ol>

        <hr />

        <h4>Heading 4: 인용문과 코드</h4>
        <blockquote>
          <p>
            좋은 viewer 스타일은 에디터가 만든 HTML을 과하게 해석하지 않고,
            문서의 위계를 또렷하게 보여줍니다.
          </p>
        </blockquote>
        <p>
          문장 안의 <code>inline code</code>는 눌린 입력창처럼 보이고,
          codeblock은 고전 터미널의 대비를 빌립니다.
        </p>
        <pre>
          <code>{`const theme = 'windows-98-fluent';
renderViewer(theme);`}</code>
        </pre>

        <h5>Heading 5: 표</h5>
        <table>
          <thead>
            <tr>
              <th>Element</th>
              <th>Role</th>
              <th>Style</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>p</td>
              <td>본문 문단</td>
              <td>system text</td>
            </tr>
            <tr>
              <td>blockquote</td>
              <td>인용</td>
              <td>sunken panel</td>
            </tr>
            <tr>
              <td>table</td>
              <td>구조화 데이터</td>
              <td>classic grid</td>
            </tr>
          </tbody>
        </table>

        <h6>Heading 6: Figure</h6>
        <figure>
          <img
            alt="Windows 98 style placeholder"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='960' height='420' viewBox='0 0 960 420'%3E%3Crect width='960' height='420' fill='%23008080'/%3E%3Crect x='80' y='72' width='800' height='276' fill='%23c0c0c0' stroke='%23404040' stroke-width='4'/%3E%3Crect x='96' y='88' width='768' height='42' fill='%23000080'/%3E%3Ctext x='120' y='116' font-family='Arial' font-size='22' fill='white'%3ESEESAW VIEWER%3C/text%3E%3Ctext x='120' y='220' font-family='Arial' font-size='34' fill='%23000000'%3EWindows 98 Fluent Content%3C/text%3E%3C/svg%3E"
          />
          <figcaption>figure와 figcaption 스타일을 함께 확인합니다.</figcaption>
        </figure>
      </article>

      <div className={contentTheme.statusBar}>
        <span className={contentTheme.statusItem}>HTML</span>
        <span className={contentTheme.statusItem}>Ready</span>
        <span className={contentTheme.statusItem}>Windows 98 Fluent</span>
      </div>
    </div>
  );
}
