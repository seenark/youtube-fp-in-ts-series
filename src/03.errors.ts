const arsCaptainList = [
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
];

{
  type ArsCaptain = {
    name: string;
    start: number;
    end: number;
  };

  const parseRawStringToArsCaptain = (raw: string): ArsCaptain => {
    const colonIndex = raw.indexOf(":");
    const openBracketIndex = raw.indexOf("(");
    openBracketIndex;
    const closeBracketIndex = raw.indexOf(")");
    closeBracketIndex;

    const name = raw.substring(0, colonIndex).trim();
    const yearStartToEnd = raw
      .substring(openBracketIndex + 1, closeBracketIndex)
      .trim();
    const dashIndex = yearStartToEnd.indexOf("-");
    const start = Number.parseInt(
      yearStartToEnd.substring(0, dashIndex).trim(),
    );
    const end = Number.parseInt(yearStartToEnd.substring(dashIndex + 1));

    return {
      name,
      start,
      end,
    };
  };

  const singleResult = parseRawStringToArsCaptain("Patrick Vieira: 2002-2005");
  console.log(singleResult);
}
