import { arsCaptainList, type ArsCaptain } from "./01-start";
import * as Brand from "effect/Brand";

{
  const newArsCaptain = (data: {
    name: string;
    start: number;
    end: number;
  }): ArsCaptain => ({ ...data });
  const extractName = (raw: string): string | null => {
    const colonIndex = raw.indexOf(":");
    if (colonIndex === -1) return null;
    const name = raw.substring(0, colonIndex).trim();
    return name;
  };

  type StringInBracket = string & Brand.Brand<"StringInBracket">;
  const StringInBracket = Brand.nominal<StringInBracket>();
  const extractStringInBrackets = (raw: string): StringInBracket | null => {
    const openBracketIndex = raw.indexOf("(");
    if (openBracketIndex === -1) return null;
    const closeBracketIndex = raw.indexOf(")");
    if (closeBracketIndex === -1) return null;
    const inBracketString = raw
      .substring(openBracketIndex + 1, closeBracketIndex)
      .trim();
    // return pipe(inBracketString, StringInBracket, Option.some) // my favorite way is composing with pipe;
    return StringInBracket(inBracketString);
  };

  const extractYearStart = (str: StringInBracket): number | null => {
    const dashIndex = str.indexOf("-");
    if (dashIndex === -1) return null;
    const start = Number.parseInt(str.substring(0, dashIndex).trim());
    if (Number.isNaN(start)) return null;
    return start;
  };

  const extractYearEnd = (str: StringInBracket): number | null => {
    const dashIndex = str.indexOf("-");
    if (dashIndex === -1) return null;
    const end = Number.parseInt(str.substring(dashIndex + 1));
    if (Number.isNaN(end)) return null;
    return end;
  };

  const parseRawStringToArsCaptain = (raw: string): ArsCaptain | null => {
    const name: string | null = extractName(raw);
    const stringInBracket: StringInBracket | null =
      extractStringInBrackets(raw);
    if (stringInBracket !== null) {
      const start: number | null = extractYearStart(stringInBracket);
      const end: number | null = extractYearEnd(stringInBracket);
      if (start !== null && end !== null && name !== null) {
        return newArsCaptain({ name, start, end });
      }
    }
    return null;
  };

  const resultList = arsCaptainList.map(parseRawStringToArsCaptain);
  console.log("results", resultList);
  // results [
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'Patrick Vieira', start: 2002, end: 2005 }
  //   },
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'Thierry Henry', start: 2005, end: 2007 }
  //   },
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'William Gallas', start: 2007, end: 2008 }
  //   },
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'Cesc Fabregas', start: 2008, end: 2009 }
  //   },
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'Cesc Fabregas', start: 2009, end: 2011 }
  //   },
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'Robin van Persie', start: 2011, end: 2012 }
  //   },
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'Thomas Vermaelen', start: 2012, end: 2014 }
  //   },
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'Mikel Arteta', start: 2014, end: 2016 }
  //   },
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'Per Mertesacker', start: 2016, end: 2018 }
  //   },
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'Laurent Koscielny', start: 2018, end: 2019 }
  //   },
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'Pierre-Emerick Aubameyang', start: 2019, end: 2020 }
  //   },
  //   {
  //     _id: 'Option',
  //     _tag: 'Some',
  //     value: { name: 'Pierre-Emerick Aubameyang', start: 2020, end: 2021 }
  //   }
  // ]
}
