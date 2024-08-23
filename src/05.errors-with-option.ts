import * as Option from "effect/Option";
import type { ArsCaptain } from "./01-start";

{
  const parseRawStringToArsCaptain = (
    raw: string,
  ): Option.Option<ArsCaptain> => {
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

    if (Number.isNaN(start) || Number.isNaN(end)) return Option.none();

    return Option.some({
      name,
      start,
      end,
    });
  };

  const singleResultOption = parseRawStringToArsCaptain(
    "Patrick Vieira: 2002-2005",
  ); // { _id: 'Option', _tag: 'None' }
}
