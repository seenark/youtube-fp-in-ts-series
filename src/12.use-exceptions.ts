import { arsCaptainList, type ArsCaptain } from "./01-start";
import * as Brand from "effect/Brand";

{
  const newArsCaptain = (data: {
    name: string;
    start: number;
    end: number;
  }): ArsCaptain => ({ ...data });
  const extractName = (raw: string): string => {
    const colonIndex = raw.indexOf(":");
    if (colonIndex === -1) throw new Error("colon not found");
    const name = raw.substring(0, colonIndex).trim();
    return name;
  };

  type StringInBracket = string & Brand.Brand<"StringInBracket">;
  const StringInBracket = Brand.nominal<StringInBracket>();
  const extractStringInBrackets = (raw: string): StringInBracket => {
    const openBracketIndex = raw.indexOf("(");
    if (openBracketIndex === -1) throw new Error("open bracket not found");
    const closeBracketIndex = raw.indexOf(")");
    if (closeBracketIndex === -1) throw new Error("close bracket not found");
    const inBracketString = raw.substring(openBracketIndex + 1, closeBracketIndex).trim();
    // return pipe(inBracketString, StringInBracket, Option.some) // my favorite way is composing with pipe;
    return StringInBracket(inBracketString);
  };

  const extractYearStart = (str: StringInBracket): number => {
    const dashIndex = str.indexOf("-");
    if (dashIndex === -1) throw new Error("dash not found");
    const start = Number.parseInt(str.substring(0, dashIndex).trim());
    if (Number.isNaN(start)) throw new Error("start is not a number");
    return start;
  };

  const extractYearEnd = (str: StringInBracket): number => {
    const dashIndex = str.indexOf("-");
    if (dashIndex === -1) throw new Error("dash not found");
    const end = Number.parseInt(str.substring(dashIndex + 1));
    if (Number.isNaN(end)) throw new Error("end is not a number");
    return end;
  };

  const parseRawStringToArsCaptain = (raw: string): ArsCaptain => {
    const name: string = extractName(raw);
    const stringInBracket: StringInBracket = extractStringInBrackets(raw);
    const start: number = extractYearStart(stringInBracket);
    const end: number = extractYearEnd(stringInBracket);
    return newArsCaptain({ name, start, end });
  };

  const resultList = arsCaptainList.map(parseRawStringToArsCaptain);
  console.log("results", resultList);
}
