type SearchHighlightProps = Readonly<{
  text: string;
  keyword: string;
}>;

export function SearchHighlight({ text, keyword }: SearchHighlightProps) {
  const normalizedKeyword = keyword.trim();
  if (!normalizedKeyword) return <>{text}</>;

  const lowerText = text.toLocaleLowerCase();
  const lowerKeyword = normalizedKeyword.toLocaleLowerCase();
  const matches: Array<{ text: string; highlighted: boolean }> = [];
  let cursor = 0;

  while (cursor < text.length) {
    const matchIndex = lowerText.indexOf(lowerKeyword, cursor);
    if (matchIndex < 0) {
      matches.push({ text: text.slice(cursor), highlighted: false });
      break;
    }

    if (matchIndex > cursor) {
      matches.push({ text: text.slice(cursor, matchIndex), highlighted: false });
    }
    matches.push({ text: text.slice(matchIndex, matchIndex + normalizedKeyword.length), highlighted: true });
    cursor = matchIndex + normalizedKeyword.length;
  }

  return (
    <>
      {matches.map((match, index) => match.highlighted ? (
        <mark
          className="bg-[#f2d58e] px-0.5 font-semibold text-[#35280f]"
          key={`${match.text}-${index}`}
        >
          {match.text}
        </mark>
      ) : <span key={`${match.text}-${index}`}>{match.text}</span>)}
    </>
  );
}
