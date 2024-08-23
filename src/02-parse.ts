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

    return {
      name,
      start,
      end,
    };
  };

  const result = arsCaptainList.map(parseRawStringToArsCaptain);
  console.log(result);
  // Array(12) [
  //     { name: 'Patrick Vieira', start: 2002, end: 2005 },
  //     { name: 'Thierry Henry', start: 2005, end: 2007 },
  //     { name: 'William Gallas', start: 2007, end: 2008 },
  //     { name: 'Cesc Fabregas', start: 2008, end: 2009 },
  //     { name: 'Cesc Fabregas', start: 2009, end: 2011 },
  //     { name: 'Robin van Persie', start: 2011, end: 2012 },
  //     { name: 'Thomas Vermaelen', start: 2012, end: 2014 },
  //     { name: 'Mikel Arteta', start: 2014, end: 2016 },
  //     { name: 'Per Mertesacker', start: 2016, end: 2018 },
  //     { name: 'Laurent Koscielny', start: 2018, end: 2019 },
  //     { name: 'Pierre-Emerick Aubameyang', start: 2019, end: 2020 },
  //     { name: 'Pierre-Emerick Aubameyang', start: 2020, end: 2021 }
  //   ]
}
