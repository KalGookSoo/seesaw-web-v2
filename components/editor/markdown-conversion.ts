const BLOCK_TAGS = new Set([
  'P',
  'DIV',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'BLOCKQUOTE',
  'UL',
  'OL',
  'LI',
  'PRE',
  'TABLE',
  'HR'
]);

function isElement(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

function inline(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }
  if (!isElement(node)) {
    return '';
  }

  const children = () => Array.from(node.childNodes).map(inline).join('');

  switch (node.tagName) {
    case 'STRONG':
    case 'B':
      return `**${children()}**`;
    case 'EM':
    case 'I':
      return `*${children()}*`;
    case 'S':
    case 'DEL':
    case 'STRIKE':
      return `~~${children()}~~`;
    case 'CODE':
      return `\`${node.textContent ?? ''}\``;
    case 'A':
      return `[${children()}](${node.getAttribute('href') ?? ''})`;
    case 'IMG':
      return `![${node.getAttribute('alt') ?? ''}](${node.getAttribute('src') ?? ''})`;
    case 'VIDEO':
      return `!video[${node.getAttribute('aria-label') ?? ''}](${node.getAttribute('src') ?? ''})`;
    case 'BR':
      return '  \n';
    default:
      return children();
  }
}

function inlineChildren(el: Element): string {
  return Array.from(el.childNodes).map(inline).join('');
}

function listItems(el: Element, ordered: boolean): string {
  return Array.from(el.children)
    .filter((child) => child.tagName === 'LI')
    .map((li, index) => {
      const checkbox = li.querySelector(':scope > input[type="checkbox"]') as HTMLInputElement | null;
      const marker = checkbox ? `- [${checkbox.checked ? 'x' : ' '}] ` : ordered ? `${index + 1}. ` : '- ';

      const nestedList = Array.from(li.children).find((child) => child.tagName === 'UL' || child.tagName === 'OL');
      const inlineNodes = Array.from(li.childNodes).filter(
        (child) => !(isElement(child) && (child.tagName === 'UL' || child.tagName === 'OL' || child.tagName === 'INPUT'))
      );
      const text = inlineNodes.map(inline).join('').trim();

      let item = `${marker}${text}`;
      if (nestedList) {
        const nested = listItems(nestedList, nestedList.tagName === 'OL')
          .split('\n')
          .map((line) => `  ${line}`)
          .join('\n');
        item += `\n${nested}`;
      }
      return item;
    })
    .join('\n');
}

function tableToMarkdown(table: Element): string {
  const rows = Array.from(table.querySelectorAll('tr'));
  if (rows.length === 0) {
    return '';
  }

  const cellsOf = (row: Element) =>
    Array.from(row.querySelectorAll('th,td')).map((cell) => inlineChildren(cell).trim() || ' ');

  const headerCells = cellsOf(rows[0]);
  const headerLine = `| ${headerCells.join(' | ')} |`;
  const separatorLine = `| ${headerCells.map(() => '---').join(' | ')} |`;
  const bodyLines = rows.slice(1).map((row) => `| ${cellsOf(row).join(' | ')} |`);

  return [headerLine, separatorLine, ...bodyLines].join('\n');
}

function block(el: Element): string {
  switch (el.tagName) {
    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6':
      return `${'#'.repeat(Number(el.tagName[1]))} ${inlineChildren(el)}`;
    case 'BLOCKQUOTE':
      return blockChildren(el)
        .split('\n')
        .map((line) => (line ? `> ${line}` : '>'))
        .join('\n');
    case 'UL':
      return listItems(el, false);
    case 'OL':
      return listItems(el, true);
    case 'PRE': {
      const codeEl = el.querySelector('code');
      const lang = codeEl?.className.replace('language-', '') ?? '';
      return `\`\`\`${lang}\n${(codeEl ?? el).textContent ?? ''}\n\`\`\``;
    }
    case 'HR':
      return '---';
    case 'TABLE':
      return tableToMarkdown(el);
    default:
      return blockChildren(el);
  }
}

function blockChildren(el: Element): string {
  const blocks: string[] = [];
  let buffer: Node[] = [];

  const flush = () => {
    if (buffer.length === 0) {
      return;
    }
    const text = buffer.map(inline).join('');
    if (text.trim()) {
      blocks.push(text);
    }
    buffer = [];
  };

  Array.from(el.childNodes).forEach((child) => {
    if (isElement(child) && BLOCK_TAGS.has(child.tagName)) {
      flush();
      const markdown = block(child);
      if (markdown.trim() || child.tagName === 'HR') {
        blocks.push(markdown);
      }
    } else {
      buffer.push(child);
    }
  });
  flush();

  return blocks.join('\n\n');
}

export function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return blockChildren(doc.body).trim();
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 유니코드 개인 사용 영역(Private Use Area) 문자로 자리표시자를 감싼다. 일반 텍스트(URL의 숫자, 날짜 등)와
// 겹칠 일이 없어야, 아래 자리표시자 복원 정규식이 인라인 코드가 아닌 순수 숫자까지 잘못 집어삼키지 않는다.
const CODE_PLACEHOLDER_MARK = '\uE000';

function inlineToHtml(text: string): string {
  // 인라인 코드 구간은 안의 *_~ 같은 문자가 이후 규칙에 다시 걸리지 않도록 먼저 떼어내 자리표시자로 치환한다.
  const codeSpans: string[] = [];
  let result = text.replace(/`([^`]+)`/g, (_match, code: string) => {
    codeSpans.push(`<code>${escapeHtml(code)}</code>`);
    return `${CODE_PLACEHOLDER_MARK}${codeSpans.length - 1}${CODE_PLACEHOLDER_MARK}`;
  });

  result = escapeHtml(result);
  result = result.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1">');
  result = result.replace(/!video\[([^\]]*)\]\(([^)]*)\)/g, '<video src="$2" controls aria-label="$1"></video>');
  result = result.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2">$1</a>');
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  result = result.replace(
    new RegExp(`${CODE_PLACEHOLDER_MARK}(\\d+)${CODE_PLACEHOLDER_MARK}`, 'g'),
    (_match, index: string) => codeSpans[Number(index)]
  );

  return result;
}

function indentOf(line: string): number {
  return line.match(/^(\s*)/)?.[1].length ?? 0;
}

function isListLine(line: string): boolean {
  return /^\s*([-*]|\d+\.)\s+/.test(line);
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function parseList(lines: string[], startIndex: number): { html: string; nextIndex: number } {
  const baseIndent = indentOf(lines[startIndex]);
  const items: string[] = [];
  let ordered = /^\s*\d+\.\s+/.test(lines[startIndex]);
  let i = startIndex;

  while (i < lines.length && lines[i].trim() !== '' && indentOf(lines[i]) === baseIndent) {
    const line = lines[i];
    const taskMatch = line.match(/^\s*[-*]\s+\[([ xX])\]\s+(.*)$/);
    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    const ulMatch = line.match(/^\s*[-*]\s+(.*)$/);
    const match = taskMatch ?? olMatch ?? ulMatch;
    if (!match) {
      break;
    }

    ordered = Boolean(olMatch) && !taskMatch;
    const text = taskMatch ? taskMatch[2] : match[1];
    i += 1;

    let nested = '';
    if (i < lines.length && indentOf(lines[i]) > baseIndent && isListLine(lines[i])) {
      const nestedResult = parseList(lines, i);
      nested = nestedResult.html;
      i = nestedResult.nextIndex;
    }

    const checkbox = taskMatch
      ? `<input type="checkbox" disabled${taskMatch[1].toLowerCase() === 'x' ? ' checked' : ''}> `
      : '';
    items.push(`<li>${checkbox}${inlineToHtml(text)}${nested}</li>`);
  }

  const tag = ordered ? 'ol' : 'ul';
  return { html: `<${tag}>${items.join('')}</${tag}>`, nextIndex: i };
}

export function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i += 1;
      continue;
    }

    const fenceMatch = line.match(/^```(\w*)\s*$/);
    if (fenceMatch) {
      const lang = fenceMatch[1];
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      const langAttr = lang ? ` class="language-${lang}"` : '';
      blocks.push(`<pre><code${langAttr}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${inlineToHtml(headingMatch[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^-{3,}\s*$/.test(line) || /^\*{3,}\s*$/.test(line)) {
      blocks.push('<hr>');
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push(`<blockquote>${markdownToHtml(quoteLines.join('\n'))}</blockquote>`);
      continue;
    }

    if (/^\|.*\|\s*$/.test(line) && lines[i + 1] && /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(lines[i + 1])) {
      const headerCells = splitTableRow(line);
      i += 2;
      const bodyRows: string[][] = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        bodyRows.push(splitTableRow(lines[i]));
        i += 1;
      }
      const headerHtml = `<tr>${headerCells.map((cell) => `<th>${inlineToHtml(cell)}</th>`).join('')}</tr>`;
      const bodyHtml = bodyRows
        .map((row) => `<tr>${row.map((cell) => `<td>${inlineToHtml(cell)}</td>`).join('')}</tr>`)
        .join('');
      blocks.push(`<table><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table>`);
      continue;
    }

    if (isListLine(line)) {
      const { html, nextIndex } = parseList(lines, i);
      blocks.push(html);
      i = nextIndex;
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !isListLine(lines[i]) &&
      !/^\|.*\|\s*$/.test(lines[i]) &&
      !/^-{3,}\s*$/.test(lines[i])
    ) {
      paragraphLines.push(lines[i]);
      i += 1;
    }
    blocks.push(`<p>${inlineToHtml(paragraphLines.join(' '))}</p>`);
  }

  return blocks.join('');
}
