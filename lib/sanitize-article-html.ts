import sanitizeHtml from 'sanitize-html';

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

const CSS_COLOR = /^(#[0-9a-fA-F]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\)|[a-zA-Z]+)$/;
const CSS_LENGTH = /^[\d.]+(px|em|rem|%|pt)?$/;

const ALLOWED_STYLES = {
  '*': {
    color: [CSS_COLOR],
    'background-color': [CSS_COLOR],
    'font-size': [CSS_LENGTH],
    'line-height': [CSS_LENGTH],
    'text-align': [/^(left|right|center|justify)$/]
  }
};

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
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
