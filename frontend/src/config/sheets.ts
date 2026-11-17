export type SheetScope = 1 | 2 | 3 | null;

export type CalcSheet = {
  id: string;
  path: string;
  excelName: string;
  tabLabel: string;
  shortLabel: string;
  title: string;
  intro: string;
  help: string;
  scope: SheetScope;
  skipId?: string;
};

export const CALC_SHEETS: CalcSheet[] = [
  {
    id: "organisation",
    path: "/organisation",
    excelName: "Your organisation",
    tabLabel: "Your organisation",
    shortLabel: "Your details",
    title: "Who are you reporting for?",
    intro: "Just a few details. We use the country to estimate electricity.",
    help: "Type the organisation name, choose the country, and enter the year. Then press Continue.",
    scope: null,
  },
  {
    id: "fuels",
    path: "/sheet/fuels",
    excelName: "Fuels",
    tabLabel: "Fuels",
    shortLabel: "Gas, oil or diesel",
    title: "Fuels",
    intro: "Combustion of fuels in owned or controlled stationary equipment such as boilers, furnaces, burners, turbines, heaters, incinerators, engines, flares, etc.\n\nDo NOT include here the combustion of fuels in transportation devices.",
    help: "Find the fuel in the table and type the amount for each month. Blank months count as zero. The year total is the sum of all 12 months. If you do not burn fuel, tick “We don’t have this”.",
    scope: 1,
    skipId: "fuels",
  },
  {
    id: "bioenergy",
    path: "/sheet/bioenergy",
    excelName: "Bioenergy",
    tabLabel: "Bioenergy",
    shortLabel: "Wood or biogas",
    title: "Bioenergy",
    intro: "Combustion of fuels produced from recently living sources (such as trees) at a site or in an asset under the direct control of the reporting organisation.",
    help: "Type an amount next to wood, pellets or biogas you used, or tick “We don’t have this”.",
    scope: 1,
    skipId: "bioenergy",
  },
  {
    id: "refrigerants",
    path: "/sheet/refrigerants",
    excelName: "Refrigerants",
    tabLabel: "Refrigerants",
    shortLabel: "Air-con leaks",
    title: "Refrigerant and others",
    intro: "From leakage from air-conditioning and refrigeration units or the release to the atmosphere of other gases that have a global warming potential.",
    help: "Find the gas in the table and type kg leaked. If you do not know, tick “We don’t have this”.",
    scope: 1,
    skipId: "refrigerants",
  },
  {
    id: "energy",
    path: "/sheet/energy",
    excelName: "Electricity, heat, cooling, T&D",
    tabLabel: "Electricity, heat, cooling",
    shortLabel: "Electricity & heat",
    title: "Electricity, heating, transmission and distribution losses, district cooling",
    intro: "Market-based emissions from the generation of purchased electricity, heat, steam or cooling.\nT&D: Emissions associated with grid losses (the energy loss that occurs in getting the electricity from the power plant to your organisation).",
    help: "Enter electricity kWh for each month. Blank months count as zero. Fill heat or cooling only if you buy them.",
    scope: 2,
    skipId: "electricity",
  },
  {
    id: "owned-vehicles",
    path: "/sheet/owned-vehicles",
    excelName: "Owned vehicles",
    tabLabel: "Owned vehicles",
    shortLabel: "Company cars",
    title: "Own or controlled vehicles",
    intro: "Travel in cars and on motorcycles owned or controlled by the reporting organisation. This does not include vehicles owned by employees that are used for business purposes.",
    help: "Type kilometres for each month next to each vehicle you own. Leave the rest blank.",
    scope: 1,
    skipId: "ownedVehicles",
  },
  {
    id: "wtt-fuels",
    path: "/sheet/wtt-fuels",
    excelName: "WTT- fuels",
    tabLabel: "WTT - fuels",
    shortLabel: "Making the fuel",
    title: "Extra emissions from making the fuels you used",
    intro: "This is the same well-to-tank table as the Excel sheet. Type amounts only if you want this extra part.",
    help: "You can skip this. If you fill it, use the same fuels you already entered.",
    scope: 3,
    skipId: "wttFuels",
  },
  {
    id: "material-use",
    path: "/sheet/material-use",
    excelName: "Material use",
    tabLabel: "Material use",
    shortLabel: "Things you bought",
    title: "Did you buy construction or office materials?",
    intro: "This is the same materials table as the Excel sheet. Type tonnes only for things you bought.",
    help: "Type an amount next to each material you purchased. Leave the rest blank.",
    scope: 3,
    skipId: "materialUse",
  },
  {
    id: "waste-disposal",
    path: "/sheet/waste-disposal",
    excelName: "Waste disposal",
    tabLabel: "Waste disposal",
    shortLabel: "Rubbish",
    title: "How did you dispose of waste?",
    intro: "This is the same waste table as the Excel sheet. Type amounts only for waste you disposed of.",
    help: "Type an amount next to each waste type. Leave the rest blank.",
    scope: 3,
    skipId: "waste",
  },
  {
    id: "flight-accommodation",
    path: "/sheet/flight-accommodation",
    excelName: "Flight and Accommodation",
    tabLabel: "Flight and Accommodation",
    shortLabel: "Flights & hotels",
    title: "Did staff fly or stay in hotels for work?",
    intro: "Paste flight kg CO2e from the ICAO calculator. Hotel countries are the same list as Excel.",
    help: "Add flights, then type rooms and nights for each hotel country.",
    scope: 3,
  },
  {
    id: "business-travel",
    path: "/sheet/business-travel",
    excelName: "Business travel - land and sea",
    tabLabel: "Business travel - land and sea",
    shortLabel: "Trains, taxis, ferries",
    title: "Did staff travel by train, taxi, bus or ferry?",
    intro: "This is the same land and sea travel table as the Excel sheet. Type kilometres only for trips you made.",
    help: "Type distance next to each travel type. Leave the rest blank.",
    scope: 3,
    skipId: "businessTravel",
  },
  {
    id: "freighting-goods",
    path: "/sheet/freighting-goods",
    excelName: "Freighting goods",
    tabLabel: "Freighting goods",
    shortLabel: "Deliveries",
    title: "Did a company deliver goods for you?",
    intro: "This is the same freight table as the Excel sheet. Type tonnes and kilometres for deliveries you had.",
    help: "Type weight and distance next to each delivery type. Leave the rest blank.",
    scope: 3,
    skipId: "freight",
  },
  {
    id: "commuting",
    path: "/sheet/commuting",
    excelName: "Employees commuting",
    tabLabel: "Employees commuting",
    shortLabel: "Travel to work",
    title: "How do employees travel to work?",
    intro: "This is the same commuting table as the Excel sheet. Type kilometres only if you track it.",
    help: "Type distance next to each way staff travel to work. Leave the rest blank.",
    scope: 3,
    skipId: "commuting",
  },
  {
    id: "food",
    path: "/sheet/food",
    excelName: "Food",
    tabLabel: "Food",
    shortLabel: "Canteen food",
    title: "Do you provide food at work?",
    intro: "This is the same food table as the Excel sheet. Type amounts only for food you provided.",
    help: "Type an amount next to each food type. Leave the rest blank.",
    scope: 3,
    skipId: "food",
  },
  {
    id: "home-office",
    path: "/sheet/home-office",
    excelName: "Home Office",
    tabLabel: "Home Office",
    shortLabel: "Working from home",
    title: "Do employees work from home?",
    intro: "This is the same home-office table as the Excel sheet. Enter employees and percentages from 0 to 100.",
    help: "Fill the home-working type that applies. Leave the others blank.",
    scope: 3,
    skipId: "homeOffice",
  },
  {
    id: "water",
    path: "/sheet/water",
    excelName: "Water",
    tabLabel: "Water",
    shortLabel: "Water",
    title: "Do you use mains water?",
    intro: "This is the same water table as the Excel sheet. Type cubic metres from your bill.",
    help: "Type supply and/or treatment amounts. Leave a row blank if you do not have it.",
    scope: 3,
    skipId: "water",
  },
  {
    id: "report",
    path: "/report",
    excelName: "Report",
    tabLabel: "Report",
    shortLabel: "Results",
    title: "GHG emissions report",
    intro: "Totals are in t CO2e, using the same layout as the UNFCCC calculator Report sheet.",
    help: "This is the same Report sheet as the Excel calculator. Download Excel if you want a copy.",
    scope: null,
  },
];

export function getSheet(id: string | undefined): CalcSheet | undefined {
  return CALC_SHEETS.find((sheet) => sheet.id === id);
}

export function getSheetByPath(path: string): CalcSheet | undefined {
  return CALC_SHEETS.find((sheet) => sheet.path === path);
}

export function adjacentSheets(id: string) {
  const index = CALC_SHEETS.findIndex((sheet) => sheet.id === id);
  return {
    current: CALC_SHEETS[index],
    prev: index > 0 ? CALC_SHEETS[index - 1] : undefined,
    next: index >= 0 && index < CALC_SHEETS.length - 1 ? CALC_SHEETS[index + 1] : undefined,
    index,
    total: CALC_SHEETS.length,
  };
}
