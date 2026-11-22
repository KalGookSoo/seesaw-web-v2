import sanitizeHtml from 'sanitize-html';
import { decodeHTML } from 'entities';

// 자체 에디터(components/editor)가 실제로 만들어내는 태그/속성만 허용한다.
// 새 서식을 에디터에 추가하면 이 화이트리스트도 함께 넓혀야 한다.
const ALLOWED_TAGS = [
  'p',
  'div',
  'br',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'pre',
  'code',
  'hr',
  'ul',
  'ol',
  'li',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'b',
  'strong',
  'i',
  'em',
  's',
  'del',
  'strike',
  'span',
  'a',
  'img',
  'video',
  'input'
];

const ALLOWED_ATTRIBUTES = {
  a: ['href'],
  img: ['src', 'alt'],
  video: ['src', 'controls', 'aria-label'],
  span: ['style'],
  input: ['type', 'checked', 'disabled'],
  code: ['class']
};

const CSS_LENGTH = /^[\d.]+(px|em|rem|%|pt)?$/;

const ALLOWED_STYLES = {
  '*': {
    'font-size': [CSS_LENGTH],
    'line-height': [CSS_LENGTH],
    'text-align': [/^(left|right|center|justify)$/]
  }
};

export function sanitizeArticleHtml(html: string): string {
  // 일부 기존 게시글은 HTML 태그가 한 번 더 엔티티로 인코딩되어 저장되어 있다.
  // 먼저 한 번만 디코딩한 뒤 sanitizer를 적용해야 정상적인 HTML로 표시하면서
  // 인코딩된 script/event 태그도 허용 목록에서 제거할 수 있다.
  const decodedHtml = decodeHTML(html);

  return sanitizeHtml(decodedHtml, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedClasses: {
      code: ['language-*']
    },
    allowedStyles: ALLOWED_STYLES,
    allowedSchemes: ['http', 'https'],
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard'
  });
}
