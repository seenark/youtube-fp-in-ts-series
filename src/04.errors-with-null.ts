import type { ArsCaptain } from "./01-start";

{
  const parseRawStringToArsCaptain = (raw: string): ArsCaptain | null => {
    const colonIndex = raw.indexOf(":");
    const openBracketIndex = raw.indexOf("(");
    const closeBracketIndex = raw.indexOf(")");

    const name = raw.substring(0, colonIndex).trim();
    const yearStartToEnd = raw
      .substring(openBracketIndex + 1, closeBracketIndex)
      .trim();
    const dashIndex = yearStartToEnd.indexOf("-");
    const start = Number.parseInt(
      yearStartToEnd.substring(0, dashIndex).trim(),
    );
    const end = Number.parseInt(yearStartToEnd.substring(dashIndex + 1));

    if (Number.isNaN(start) || Number.isNaN(end)) return null;

    return {
      name,
      start,
      end,
    };
  };

  const singleResult = parseRawStringToArsCaptain("Patrick Vieira: 2002-2005"); // null
  if (singleResult !== null) {
    console.log(singleResult);
  }
  // do other things
}
