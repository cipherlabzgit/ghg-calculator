/** Static content copied from the UNFCCC GHG calculator v02.6 "Disclaimer" and
 * "Info and sources" sheets. Used both in-app and in the Excel export. */

export const DISCLAIMER = {
  title: "Disclaimer",
  header:
    "Title: Greenhouse Gas (GHG) Emissions Calculator\nDocument version: 02.6\nPublication date: September 2022",
  body: [
    "The UNFCCC secretariat has prepared this greenhouse gas (GHG) emissions calculator to provide the general public with a free and up-to-date methodology for estimating GHG emissions.",
    "This Spreadsheet aims only to support organizations to estimate their GHG emissions in order to raise awareness and to promote climate action.",
    "However, the UNFCCC secretariat makes no representations as to the accuracy, completeness, suitability or validity of any information on this Spreadsheet and will not be liable for any errors, omissions, or delays in this information or any losses, injuries, or damages arising from its display or use. All information is provided on an \u201Cas-is\u201D basis.",
    "All data and information provided on this Spreadsheet are for reference purposes only. The emission factors used on this Spreadsheet are publicly available on third parties\u2019 websites and the links are provided in the tab \u2018Info and sources\u2019. The contents in, and linked to, this spreadsheet do not reflect the policy or position of the UNFCCC nor the UNFCCC secretariat\u2019s and do not imply UNFCCC secretariat\u2019s endorsement. Under no circumstances shall the UNFCCC be liable for any loss, damage, liability or expense incurred or suffered that is claimed to have resulted from the use of this Spreadsheet, its data or its methodology, or from the conduct of any user. Use of this Spreadsheet and reliance upon the content in or linked to it is solely at the user\u2019s own risk.",
    "Furthermore, this Spreadsheet does not replace a formal, tailored GHG inventory development process nor third-party verified GHG inventories and should be not used for certification purposes.",
    "The emission factors used in this spreadsheet are sourced from references that may not be applicable to all geographic locations. The user is encouraged to use more suitable emission factors when they are available.",
    "Each user agrees to decide if, when and how to use this Spreadsheet, and does so at his or her sole risk.",
    "This Spreadsheet may be copied and shared for the user's non-commercial use. Further distribution and/or any commercial use of this Spreadsheet are strictly prohibited without the explicit written permission of the UNFCCC secretariat. The UNFCCC secretariat is not responsible for, nor does it endorse, the results of third parties\u2019 calculations using this Spreadsheet.",
  ],
};

export type InfoSourceRow = {
  scope: string;
  tab: string;
  activity: string;
  source: string;
  assumptions: string;
};

export const INFO_SOURCES: InfoSourceRow[] = [
  { scope: "Scope 1", tab: "Fuels", activity: "Fuels", source: "UK Government GHG Conversion Factors for Company Reporting", assumptions: "Full set of factors for kg CO2e from DEFRA 2021" },
  { scope: "Scope 1", tab: "Bioenergy", activity: "Bioenergy", source: "UK Government GHG Conversion Factors for Company Reporting", assumptions: "Full set of factors for kg CO2e from DEFRA 2021" },
  { scope: "Scope 1", tab: "Refrigerants", activity: "Refrigerants", source: "UK Government GHG Conversion Factors for Company Reporting", assumptions: "Full set of factors for kg CO2e from DEFRA 2021" },
  {
    scope: "Scope 1 & 2",
    tab: "Owned vehicles",
    activity: "Cars and motorbikes",
    source: "UK Government GHG Conversion Factors for Company Reporting",
    assumptions:
      "Battery Electric cars: DEFRA Electricity EF for EVs / GEF UK \u00D7 Country-specific IFI GEF 2021.\nPlug-in Hybrid Electric cars: DEFRA Electricity EF for EVs / GEF UK \u00D7 Country-specific IFI GEF 2021 (fuel portion counted as Scope 1 and electricity portion as Scope 2).\nOther vehicles: Full set of factors for kg CO2e from DEFRA 2021.",
  },
  {
    scope: "Scope 1",
    tab: "Owned vehicles",
    activity: "Vans and HGVs",
    source: "UK Government GHG Conversion Factors for Company Reporting",
    assumptions:
      "Battery Electric: DEFRA Electricity EF for EVs / GEF UK \u00D7 Country-specific IFI GEF 2021. Other vehicles: Full set of factors for kg CO2e from DEFRA 2021.",
  },
  {
    scope: "Scope 2",
    tab: "Electricity and Heat",
    activity: "Electricity",
    source: "IFI 2021 Harmonized Grid Emission factor (GEF) data set",
    assumptions:
      "Country-specific grid emission factors. Some territories use regional averages (see UNFCCC calculator notes).",
  },
  { scope: "Scope 2", tab: "Electricity and Heat", activity: "Heat and steam", source: "UK Government GHG Conversion Factors for Company Reporting", assumptions: "Full set of factors for kg CO2e from DEFRA 2021" },
  {
    scope: "Scope 2",
    tab: "Electricity and Heat",
    activity: "District cooling",
    source: "GSAS SEER TOOL v2.0",
    assumptions: "District cooling maximum average \u00D7 country-based Grid Emission Factor (IFI Harmonized GEF 2021).",
  },
  { scope: "Scope 3", tab: "WTT fuels", activity: "Well-to-tank fuels", source: "UK Government GHG Conversion Factors for Company Reporting", assumptions: "Full set of factors for kg CO2e from DEFRA 2021" },
  { scope: "Scope 3", tab: "T&D (Data for UK)", activity: "Transmission and distribution losses", source: "UK Government GHG Conversion Factors for Company Reporting", assumptions: "Full set of factors for kg CO2e from DEFRA 2021" },
  { scope: "Scope 3", tab: "Water", activity: "Water supply and treatment", source: "UK Government GHG Conversion Factors for Company Reporting", assumptions: "Full set of factors for kg CO2e from DEFRA 2021" },
  { scope: "Scope 3", tab: "Material use", activity: "Primary material production", source: "UK Government GHG Conversion Factors for Company Reporting", assumptions: "Primary material production factors from DEFRA 2021" },
  { scope: "Scope 3", tab: "Waste", activity: "Landfill disposal", source: "UK Government GHG Conversion Factors for Company Reporting", assumptions: "Factors for landfill from DEFRA 2021" },
  {
    scope: "Scope 3",
    tab: "Flight and Hotel",
    activity: "Flights",
    source: "Use of ICAO aviation carbon emissions calculator is recommended",
    assumptions: "For many flights the UNFCCC secretariat may support proxies. RFI value of 1 is applied.",
  },
  {
    scope: "Scope 3",
    tab: "Flight and Hotel",
    activity: "Hotels",
    source: "2020 Cornell Hotel Sustainability Benchmarking Index",
    assumptions: "Hotel Carbon Footprint Per Occupied Room | All hotels upper-quartile emission factor value",
  },
  { scope: "Scope 3", tab: "Business travel land and sea", activity: "Sea", source: "UK Government GHG Conversion Factors for Company Reporting", assumptions: "Full set of factors for kg CO2e from DEFRA 2021" },
  { scope: "Scope 3", tab: "Business travel land and sea", activity: "Land", source: "UK Government GHG Conversion Factors for Company Reporting", assumptions: "Full set of factors for kg CO2e from DEFRA 2021" },
  {
    scope: "Scope 3",
    tab: "Freighting goods",
    activity: "Vans, HGVs, cargo ship, freight flights, rail and sea tanker",
    source: "UK Government GHG Conversion Factors for Company Reporting",
    assumptions: "Freight flights with RFI value of 1. For HGVs, average laden values were used.",
  },
  {
    scope: "Scope 3",
    tab: "Employees commuting",
    activity: "Cars, taxis, bus, rail",
    source: "UK Government GHG Conversion Factors for Company Reporting / UNFCCC Harmonized GEF data set",
    assumptions: "Full set of factors for kg CO2e from DEFRA 2021",
  },
  {
    scope: "Scope 3",
    tab: "Food",
    activity: "Food",
    source: "Carbon footprint methodology for the Olympic Games",
    assumptions:
      "Emission factors from the International Olympic Committee and vegan meal based on average diet values for Germany from FAO.",
  },
  {
    scope: "Scope 3",
    tab: "Home office",
    activity: "Home office",
    source: "EcoAct Homeworking emissions whitepaper",
    assumptions:
      "Home office energy use. \u2018With heating\u2019: workstation, lighting and heating. \u2018With cooling\u2019: workstation, lighting and cooling. \u2018No heating, no cooling\u2019: workstation and lighting. Consumption \u00D7 country-based Grid Emission Factor (IFI Harmonized GEF data set).",
  },
];

export const DEFINITIONS: Array<{ title: string; body: string }> = [
  {
    title: "Scope 1 — direct emissions",
    body:
      "Emissions from activities owned or controlled by your organisation. Examples: combustion in owned or controlled boilers, furnaces and vehicles; and emissions from chemical production in owned or controlled process equipment. (DEFRA 2020)",
  },
  {
    title: "Scope 2 — energy indirect",
    body:
      "Emissions released into the atmosphere that are associated with your consumption of purchased electricity, heat, steam and cooling. These indirect emissions are a consequence of your organisation\u2019s energy use, but occur at sources you do not own or control. (DEFRA 2020)",
  },
  {
    title: "Scope 3 — other indirect",
    body:
      "Emissions that occur at sources you do not own or control and are not Scope 2. Examples: business travel by means not owned or controlled by your organisation, waste disposal, materials or fuels your organisation purchases. Whether a vehicle, office or factory is Scope 1 or Scope 3 may depend on how you define your operational boundaries, and Scope 3 can be upstream or downstream of your organisation. (DEFRA 2020)",
  },
];
