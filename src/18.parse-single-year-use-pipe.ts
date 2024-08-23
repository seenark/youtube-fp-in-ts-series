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
        pipe(
          strInBrackets,
          extractYearStart,
          Option.orElse(() => extractSingleYear(strInBrackets)),
        ),
      ),
      Option.bind("end", ({ strInBrackets }) =>
        pipe(
          strInBrackets,
          extractYearEnd,
          Option.orElse(() => Option.some(new Date().getFullYear())),
        ),
      ),
      Option.map(newArsCaptain),
    );
  };

  const optionA = Option.some("a");
  console.log(optionA); // { _id: 'Option', _tag: 'Some', value: 'a' }
  const a = Option.getOrElse(() => "No charactor")(optionA);
  // const a = Option.getOrElse(optionA, () => "No charactor");
  console.log(a); // "a"

  const results = arsCaptainList2.map(parseRawStringToArsCaptain).flatMap(Option.getOrElse(() => []));
  console.log("results", results);
  // results [
  //   { name: 'Patrick Vieira', start: 2002, end: 2005 },
  //   { name: 'Thierry Henry', start: 2005, end: 2007 },
  //   { name: 'William Gallas', start: 2007, end: 2008 },
  //   { name: 'Cesc Fabregas', start: 2008, end: 2009 },
  //   { name: 'Cesc Fabregas', start: 2009, end: 2011 },
  //   { name: 'Robin van Persie', start: 2011, end: 2012 },
  //   { name: 'Thomas Vermaelen', start: 2012, end: 2014 },
  //   { name: 'Mikel Arteta', start: 2014, end: 2016 },
  //   { name: 'Per Mertesacker', start: 2016, end: 2018 },
  //   { name: 'Laurent Koscielny', start: 2018, end: 2019 },
  //   { name: 'Pierre-Emerick Aubameyang', start: 2019, end: 2020 },
  //   { name: 'Pierre-Emerick Aubameyang', start: 2020, end: 2021 },
  //   { name: 'Odegaard', start: 2022, end: 2024 }
  // ]
}
