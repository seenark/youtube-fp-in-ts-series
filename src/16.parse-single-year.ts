import * as Option from "effect/Option";
import type { ArsCaptain } from "./01-start";
import * as Brand from "effect/Brand";
import { pipe } from "effect";

export const arsCaptainList2 = [
  "Patrick Vieira: (2002-2005)",
  "Thierry Henry: (2005-2007)",
  "William Gallas: (2007-2008)",
  "Cesc Fabregas: (2008-2009)",
  "Cesc Fabregas: (2009-2011)",
  "Robin van Persie: (2011-2012)",
  "Thomas Vermaelen: (2012-2014)",
  "Mikel Arteta: (2014-2016)",
  "Per Mertesacker: (2016-2018)",
  "Laurent Koscielny: (2018-2019)",
  "Pierre-Emerick Aubameyang: (2019-2020)",
  "Pierre-Emerick Aubameyang: (2020-2021)",
  "Odegaard: (2022)",
];

{
  const newArsCaptain = (data: {
    name: string;
    start: number;
    end: number;
  }): ArsCaptain => ({ name: data.name, start: data.start, end: data.end });
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

  const extractSingleYear = (str: StringInBracket): Option.Option<number> => {
    const end = Number.parseInt(str);
    if (Number.isNaN(end)) return Option.none();
    return Option.some(end);
  };

  const parseRawStringToArsCaptain = (raw: string): Option.Option<ArsCaptain> => {
    return Option.Do.pipe(
      Option.bind("name", () => extractName(raw)),
      Option.bind("strInBrackets", () => extractStringInBrackets(raw)),
      Option.bind("start", ({ strInBrackets }) =>
        extractYearStart(strInBrackets).pipe(Option.orElse(() => extractSingleYear(strInBrackets))),
      ),
      Option.bind("end", ({ strInBrackets }) =>
        extractYearEnd(strInBrackets).pipe(Option.orElse(() => Option.some(new Date().getFullYear()))),
      ),
      Option.map(newArsCaptain),
    );
  };

  const odegaard = parseRawStringToArsCaptain("Odegaard: (2022)");
  console.log("od", odegaard);
  // { _id: 'Option', _tag: 'None' }
}
