# UNFCCC GHG Emissions Calculator v02.6 — inventory

Source workbook: `docs/GHG_calculator.xlsx` (document version 02.6, September 2022).

## Sheets

| Sheet | Role |
| --- | --- |
| DB (hidden) | 3,075 emission-factor rows. Lookup key in column J, kg CO2e factor in L. |
| Disclaimer | Legal text and version. |
| Info and sources | Instructions, source table, Scope definitions. |
| Report | t CO2e totals (`kg / 1000`) by GHG Protocol category. |
| Your organisation | Name, country, city, period, employees. |
| Fuels / Bioenergy / Refrigerants | Scope 1 stationary / fugitive. |
| Owned vehicles | Scope 1 mobile + Scope 2 EV electricity. |
| Electricity, heat, cooling, T&D | Scope 2 energy + Scope 3 T&D. |
| WTT- fuels, Water, Material use, Waste disposal | Scope 3 purchased / waste. |
| Flight and Accommodation | Scope 3 flights (user kg) and hotels. |
| Business travel - land and sea | Scope 3 travel (`Ferry` = sea). |
| Freighting goods | Scope 3 freight (`tonnes × km × factor`). |
| Employees commuting | Scope 3 commuting. |
| Food | Scope 3 meals (IOC factors, not in DB). |
| Home Office | Scope 3 homeworking (EcoAct kWh/h × country GEF). |

## Core lookup

`lookupKey = CONCATENATE(Scope, Level1, Level2, Level3, Level4, ColumnText, Unit)`  
Excel `VLOOKUP(..., FALSE)` is case-insensitive and returns the first match.

Special keys:

- Electricity GEF: country name in `DB!D`, factor in `L` (IFI 2020).
- T&D electricity: `Scope 3Transmission and distributionT&D- UK electricityElectricity: UKkWh`
- Heat T&D: `Scope 3Transmission and distributionDistribution - district heat & steam5% losskWh`
- Hotels (Cornell): `Scope 3Hotel stay` + country
- Water: `Scope 3Water supplyWater supplyWater supply` + unit (case-insensitive)
- Material / waste: `Scope + Level1 + Activity + Type + Process + Unit`
- Owned-vehicle EV: `"Scope 2UK electricity for Evs" + level2 + level3 + fuel + unit`

## Report

`t CO2e = SUM(kg range) / 1000`. Owned vehicles are split with `SUMPRODUCT` so fuel kg stays Scope 1 and EV kg is Scope 2.
