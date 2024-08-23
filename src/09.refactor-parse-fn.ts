import * as Option from "effect/Option";
import { arsCaptainList, type ArsCaptain } from "./01-start";
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
  const extractStringInBrackets = (
    raw: string,
  ): Option.Option<StringInBracket> => {
    const openBracketIndex = raw.indexOf("(");
    if (openBracketIndex === -1) return Option.none();
    const closeBracketIndex = raw.indexOf(")");
    if (closeBracketIndex === -1) return Option.none();
    const inBracketString = raw
      .substring(openBracketIndex + 1, closeBracketIndex)
      .trim();
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

  const parseRawStringToArsCaptain = (
    raw: string,
  ): Option.Option<ArsCaptain> => {
    return Option.Do.pipe(
      Option.bind("name", () => extractName(raw)),
      Option.bind("strInBrackets", () => extractStringInBrackets(raw)),
      Option.bind("start", ({ strInBrackets }) =>
        extractYearStart(strInBrackets),
      ),
      Option.bind("end", ({ strInBrackets }) => extractYearEnd(strInBrackets)),
      Option.map(newArsCaptain),
    );
  };

  const resultList = arsCaptainList
    .map(parseRawStringToArsCaptain)
    .flatMap(Option.getOrElse(() => []));
  console.log("results", resultList);

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
  //   { name: 'Pierre-Emerick Aubameyang', start: 2020, end: 2021 }
  // ]
}
