import * as Option from "effect/Option";
import type { ArsCaptain } from "./01-start";
import * as Brand from "effect/Brand";

{
  const newArsCaptain = (data: {
    name: string;
    start: number;
    end: number;
  }): ArsCaptain => ({ ...data });
  const extractName = (raw: string): Option.Option<string> => {
    const colonIndex = raw.indexOf(":");
    if (colonIndex === -1) return Option.none();
    const name = raw.substring(0, colonIndex).trim();
    return Option.some(name);
  };

  type StringInBracket = string & Brand.Brand<"StringInBracket">;
  const StringInBracket = Brand.nominal<StringInBracket>();
  const extractStringInBrackets = (raw: string): Option.Option<StringInBracket> => {
    const openBracketIndex = raw.indexOf("(");
    if (openBracketIndex === -1) return Option.none();
    const closeBracketIndex = raw.indexOf(")");
    if (closeBracketIndex === -1) return Option.none();
    const inBracketString = raw.substring(openBracketIndex + 1, closeBracketIndex).trim();
    // return pipe(inBracketString, StringInBracket, Option.some) // my favorite way is composing with pipe;
    return Option.some(StringInBracket(inBracketString));
  };

  const extractYearStart = (str: StringInBracket): Option.Option<number> => {
    const dashIndex = str.indexOf("-");
    if (dashIndex === -1) return Option.none();
    const start = Number.parseInt(str.substring(0, dashIndex).trim());
    if (Number.isNaN(start)) return Option.none();
    return Option.some(start);
  };

  const extractYearEnd = (str: StringInBracket): Option.Option<number> => {
    const dashIndex = str.indexOf("-");
    if (dashIndex === -1) return Option.none();
    const end = Number.parseInt(str.substring(dashIndex + 1));
    if (Number.isNaN(end)) return Option.none();
    return Option.some(end);
  };

  const parseRawStringToArsCaptain = (raw: string): Option.Option<ArsCaptain> => {
    return Option.Do.pipe(
      Option.bind("name", () => extractName(raw)),
      Option.let("test", ({ name }) => "TEST"),
      Option.let("test2", ({ name, test }) => `${name}-${test}`),
    );
  };

  const singleResultOption = parseRawStringToArsCaptain("Patrick Vieira: (2002-2005)");

  console.log("result", singleResultOption);
}
