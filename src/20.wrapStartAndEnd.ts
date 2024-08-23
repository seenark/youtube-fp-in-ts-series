import * as Option from "effect/Option";
import type { ArsCaptain } from "./01-start";
import * as Brand from "effect/Brand";
import { Either, pipe } from "effect";

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
  const extractName = (raw: string): Either.Either<string, string> => {
    const colonIndex = raw.indexOf(":");
    if (colonIndex === -1) return Either.left(`colon not found in ${raw}`);
    const name = raw.substring(0, colonIndex).trim();
    return Either.right(name);
  };

  const nameRawOk = "Odegaard: (2022)";
  const nameRight = extractName(nameRawOk);
  console.log("name", nameRight);
  // name { _id: 'Either', _tag: 'Right', right: 'Odegaard' }

  const nameRawNotOk = "Odegaard (2022)";
  const nameLeft = extractName(nameRawNotOk);
  console.log("name", nameLeft);
  // name { _id: 'Either', _tag: 'Left', left: 'colon not found in Odegaard (2022)' }

  type StringInBracket = string & Brand.Brand<"StringInBracket">;
  const StringInBracket = Brand.nominal<StringInBracket>();
  const extractStringInBrackets = (raw: string): Either.Either<StringInBracket, string> => {
    const openBracketIndex = raw.indexOf("(");
    if (openBracketIndex === -1) return Either.left(`open bracket not found in ${raw}`);
    const closeBracketIndex = raw.indexOf(")");
    if (closeBracketIndex === -1) return Either.left(`close bracket not found in ${raw}`);
    const inBracketString = raw.substring(openBracketIndex + 1, closeBracketIndex).trim();
    return pipe(inBracketString, StringInBracket, Either.right);
  };

  const extractYearStart = (str: StringInBracket): Either.Either<number, string> => {
    const dashIndex = str.indexOf("-");
    if (dashIndex === -1) return Either.left(`dash not found in ${str}`);
    const start = Number.parseInt(str.substring(0, dashIndex).trim());
    if (Number.isNaN(start)) return Either.left(`start is not a number in ${str}`);
    return Either.right(start);
  };

  const extractYearEnd = (str: StringInBracket): Either.Either<number, string> => {
    const dashIndex = str.indexOf("-");
    if (dashIndex === -1) return Either.left(`dash not found in ${str}`);
    const end = Number.parseInt(str.substring(dashIndex + 1));
    if (Number.isNaN(end)) return Either.left(`end is not a number in ${str}`);
    return Either.right(end);
  };

  const extractSingleYear = (str: StringInBracket): Either.Either<number, string> => {
    const end = Number.parseInt(str);
    if (Number.isNaN(end)) return Either.left(`end is not a number in ${str}`);
    return Either.right(end);
  };

  const parseStartYearFromStringInBrackets = ({
    strInBrackets,
  }: { strInBrackets: StringInBracket }): Either.Either<number, string> =>
    pipe(
      strInBrackets,
      extractYearStart,
      Either.orElse(() => extractSingleYear(strInBrackets)),
    );

  const parseEndYearFromStringInBrackets = ({
    strInBrackets,
  }: { strInBrackets: StringInBracket }): Either.Either<number, string> =>
    pipe(
      strInBrackets,
      extractYearEnd,
      Either.orElse(() => Either.right(new Date().getFullYear())),
    );

  const parseRawStringToArsCaptain = (raw: string): Either.Either<ArsCaptain, string> => {
    return Either.Do.pipe(
      Either.bind("name", () => extractName(raw)),
      Either.bind("strInBrackets", () => extractStringInBrackets(raw)),
      Either.bind("start", parseStartYearFromStringInBrackets),
      Either.bind("end", parseEndYearFromStringInBrackets),
      Either.map(newArsCaptain),
    );
  };

  const results = arsCaptainList2.map(parseRawStringToArsCaptain).flatMap(Either.getOrElse(() => []));
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
