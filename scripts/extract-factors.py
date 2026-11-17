"""Extract UNFCCC GHG Calculator v02.6 DB and visible sheet tables into JSON."""

from __future__ import annotations

import json
from pathlib import Path
from shutil import copy2

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path(r"c:\Users\chanithma\Downloads\Copy of GHG_emissions_calculator_ver02.6(1).xlsx")
WORKBOOK = ROOT / "docs" / "GHG_calculator.xlsx"
DATA_DIR = ROOT / "backend" / "src" / "data"

LEVEL1_CATEGORY = {
    "Fuels": "fuels",
    "Bioenergy": "bioenergy",
    "Refrigerant & other": "refrigerants",
    "Passenger vehicles": "passengerVehicles",
    "Delivery vehicles": "deliveryVehicles",
    "UK electricity": "ukElectricity",
    "UK electricity for Evs": "evElectricity",
    "Heat and steam": "heatSteam",
    "Water supply": "waterSupply",
    "Water treatment": "waterTreatment",
    "Material use": "materialUse",
    "Transmission and distribution": "tdLosses",
    "UK electricity T&D for EVs": "evTdLosses",
    "WTT- fuels": "wttFuels",
    "WTT- UK & overseas elec": "wttElectricity",
    "WTT- heat and steam": "wttHeatSteam",
    "WTT- business travel- air": "wttTravelAir",
    "WTT- business travel- sea": "wttTravelSea",
    "WTT- pass vehs & travel- land": "wttTravelLand",
    "WTT- delivery vehs & freight": "wttFreight",
    "Business travel- air": "businessTravelAir",
    "Business travel- sea": "businessTravelSea",
    "Business travel- land": "businessTravelLand",
    "Managed assets- electricity": "managedElectricity",
    "Managed assets- vehicles": "managedVehicles",
    "Freighting goods": "freight",
    "Waste disposal": "waste",
    "Hotel stay": "hotels",
    "Electricity": "electricityGrid",
}


def cell_str(value) -> str:
    if value is None:
        return ""
    return str(value).strip()


def cell_num(value):
    if isinstance(value, (int, float)):
        return float(value)
    return None


def write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def extract_db(wb):
    db = wb["DB"]
    factors = []
    countries = []
    seen_country = set()

    for row in db.iter_rows(min_row=2, max_row=db.max_row, max_col=15, values_only=True):
        scope, level1, level2, level3, level4, column_text, unit, unit_full, ghg, lookup_key, _unused, factor, source, country, vintage = row
        if not scope and not level1:
            continue

        key = cell_str(lookup_key)
        if not key:
            parts = [scope, level1, level2, level3, level4, column_text, unit]
            if level1 == "Electricity":
                parts.append(unit_full)
            key = "".join(cell_str(part) for part in parts)

        factor_value = cell_num(factor)
        vintage_value = int(vintage) if isinstance(vintage, (int, float)) else None

        record = {
            "lookupKey": key,
            "scope": cell_str(scope),
            "level1": cell_str(level1),
            "level2": cell_str(level2),
            "level3": cell_str(level3),
            "level4": cell_str(level4),
            "columnText": cell_str(column_text),
            "unit": cell_str(unit),
            "unitFull": cell_str(unit_full),
            "ghg": cell_str(ghg) or "kg CO2e",
            "factor": factor_value,
            "source": cell_str(source),
            "country": cell_str(country),
            "vintage": vintage_value,
            "category": LEVEL1_CATEGORY.get(cell_str(level1), "other"),
        }
        factors.append(record)

        if (
            cell_str(level1) == "Electricity"
            and cell_str(country) == "Country based"
            and cell_str(level3)
            and cell_str(level3) != "Choose a country from the list"
        ):
            name = cell_str(level3)
            if name not in seen_country:
                seen_country.add(name)
                countries.append(
                    {
                        "name": name,
                        "gefKgPerKwh": 0.0 if factor_value is None else factor_value,
                        "source": cell_str(source) or "IFI",
                        "vintage": vintage_value,
                    }
                )

    countries.sort(key=lambda item: item["name"])
    return factors, countries


def extract_food(wb):
    ws = wb["Food"]
    foods = []
    for row in range(6, 18):
        name = ws.cell(row, 1).value
        unit = ws.cell(row, 2).value
        factor = ws.cell(row, 3).value
        if not name or factor is None:
            continue
        foods.append(
            {
                "foodType": str(name).strip(),
                "unit": str(unit).strip() if unit else "unit",
                "factor": float(factor),
                "source": "IOC / Olympic carbon methodology",
                "vintage": None,
            }
        )
    return foods


def extract_home_office(wb):
    ws = wb["Home Office"]
    types = []
    for row in range(6, 9):
        name = ws.cell(row, 18).value
        unit = ws.cell(row, 19).value
        kwh = ws.cell(row, 20).value
        if not name:
            continue
        types.append(
            {
                "officeType": str(name).strip(),
                "unit": str(unit).strip() if unit else "kWh",
                "kWhPerHour": float(kwh),
                "source": "EcoAct Homeworking emissions whitepaper",
            }
        )
    return {"hoursPerMonth": 160, "types": types}


def sheet_rows(ws, start, end, mapping, required):
    """Read visible Excel table rows. mapping: field -> column number."""
    seen = []
    keys = set()
    last = {}
    for row in range(start, end + 1):
        item = {}
        for field, col in mapping.items():
            raw = ws.cell(row, col).value
            if field == "factor" or field.endswith("Factor"):
                item[field] = cell_num(raw)
            else:
                item[field] = cell_str(raw)
        if not item.get(required):
            continue
        for field, value in item.items():
            if field != "factor" and not field.endswith("Factor") and value:
                last[field] = value
            elif field != "factor" and not field.endswith("Factor") and not value and field in last:
                item[field] = last[field]
        key = tuple((k, item.get(k)) for k in mapping if k != "factor" and not k.endswith("Factor"))
        if key in keys:
            continue
        keys.add(key)
        seen.append(item)
    return seen


def first_factor_map(factors):
    out = {}
    for record in factors:
        key = record["lookupKey"].lower()
        if key not in out:
            out[key] = record["factor"]
    return out


WASTE_PROCESS_ORDER = [
    "Landfill",
    "Closed-loop",
    "Open-loop",
    "Combustion",
    "Composting",
    "Anaerobic digestion",
    "Re-use",
]
MATERIAL_PROCESS_ORDER = [
    "Primary material production",
    "Closed-loop source",
    "Open-loop source",
    "Re-used",
]


def catalog_from_db(factors, category, builder, process_order):
    rows = []
    seen = set()
    for record in factors:
        if record["category"] != category or record["factor"] is None:
            continue
        item = builder(record)
        key = tuple((field, item[field]) for field in item if field != "factor")
        if key in seen:
            continue
        seen.add(key)
        rows.append(item)

    def sort_key(item):
        process = item.get("process", "")
        try:
            order = process_order.index(process)
        except ValueError:
            order = 99
        return (order, item.get("activity", ""), item.get("wasteType") or item.get("material", ""), item.get("unit", ""))

    rows.sort(key=sort_key)
    return rows


def overlay_owned_vehicle_factors(rows, fmap):
    for row in rows:
        fuel_key = "".join(
            [
                "Scope 1",
                row.get("level1") or "",
                row.get("level2") or "",
                row.get("level3") or "",
                row.get("fuel") or "",
                row.get("unit") or "",
            ]
        ).lower()
        ev_key = "".join(
            [
                "Scope 2UK electricity for Evs",
                row.get("level2") or "",
                row.get("level3") or "",
                row.get("fuel") or "",
                row.get("unit") or "",
            ]
        ).lower()
        if fmap.get(fuel_key) is not None:
            row["factor"] = fmap[fuel_key]
        row["evFactor"] = fmap.get(ev_key)
    return rows


def extract_trees(wb, factors):
    hotels = []
    hotel_ws = wb["Flight and Accommodation"]
    fmap = first_factor_map(factors)
    for row in range(7, 60):
        name = hotel_ws.cell(row, 25).value
        if not name:
            continue
        country = str(name).strip()
        factor = fmap.get(f"Scope 3Hotel stay{country}".lower())
        if factor is None:
            factor = cell_num(hotel_ws.cell(row, 26).value)
        hotels.append({"country": country, "factor": factor})

    heat_key = "scope 2heat and steamheat and steamdistrict heat and steamkwh"
    heat_td_key = "scope 3transmission and distributiondistribution - district heat & steam5% losskwh"
    water_supply_key = "scope 3water supplywater supplywater supplycubic metres"
    water_treatment_key = "scope 3water treatmentwater treatmentwater treatmentcubic metres"

    owned = overlay_owned_vehicle_factors(
        sheet_rows(
            wb["Owned vehicles"],
            7,
            199,
            {"level1": 2, "level2": 3, "level3": 4, "fuel": 5, "unit": 6, "factor": 7, "evFactor": 8},
            "level3",
        ),
        fmap,
    )

    return {
        "fuels": sheet_rows(wb["Fuels"], 6, 87, {"type": 3, "fuel": 4, "unit": 5, "factor": 6}, "fuel"),
        "bioenergy": sheet_rows(wb["Bioenergy"], 6, 69, {"type": 3, "fuel": 4, "unit": 5, "factor": 6}, "fuel"),
        "refrigerants": sheet_rows(
            wb["Refrigerants"], 6, 94, {"type": 3, "emission": 4, "unit": 5, "factor": 6}, "emission"
        ),
        "ownedVehicles": owned,
        "wttFuels": sheet_rows(wb["WTT- fuels"], 6, 30, {"type": 3, "fuel": 4, "unit": 5, "factor": 6}, "fuel"),
        "materialUse": catalog_from_db(
            factors,
            "materialUse",
            lambda record: {
                "process": record["columnText"] or "Primary material production",
                "activity": record["level2"],
                "material": record["level3"],
                "unit": record["unit"] or "tonnes",
                "factor": record["factor"],
            },
            MATERIAL_PROCESS_ORDER,
        ),
        "waste": catalog_from_db(
            factors,
            "waste",
            lambda record: {
                "process": record["columnText"] or record["level4"] or "Landfill",
                "activity": record["level2"],
                "wasteType": record["level3"],
                "unit": record["unit"] or "tonnes",
                "factor": record["factor"],
            },
            WASTE_PROCESS_ORDER,
        ),
        "businessTravel": sheet_rows(
            wb["Business travel - land and sea"],
            6,
            78,
            {"vehicle": 2, "type": 3, "fuel": 4, "unit": 5, "factor": 6},
            "type",
        ),
        "commuting": sheet_rows(
            wb["Employees commuting"],
            6,
            78,
            {"vehicle": 2, "type": 3, "fuel": 4, "unit": 5, "factor": 6},
            "type",
        ),
        "freight": sheet_rows(
            wb["Freighting goods"],
            6,
            111,
            {"vehicle": 2, "type": 3, "fuel": 4, "unit": 5, "factor": 6},
            "type",
        ),
        "hotels": hotels,
        "heatSteam": [
            {
                "activity": "Heat and steam",
                "type": "District heat and steam",
                "unit": "kWh",
                "factor": fmap.get(heat_key),
                "tdFactor": fmap.get(heat_td_key),
            }
        ],
        "water": [
            {
                "kind": "supply",
                "label": "Water Supply",
                "unit": "cubic metres",
                "factor": fmap.get(water_supply_key),
            },
            {
                "kind": "treatment",
                "label": "Water Treatment",
                "unit": "cubic metres",
                "factor": fmap.get(water_treatment_key),
            },
        ],
    }


def main() -> None:
    source = DOWNLOADS if DOWNLOADS.exists() else WORKBOOK
    if not source.exists():
        raise SystemExit(f"Workbook not found: {source}")
    WORKBOOK.parent.mkdir(parents=True, exist_ok=True)
    if source.resolve() != WORKBOOK.resolve():
        copy2(source, WORKBOOK)

    wb = load_workbook(WORKBOOK, data_only=True)
    factors, countries = extract_db(wb)
    food = extract_food(wb)
    home_office = extract_home_office(wb)
    trees = extract_trees(wb, factors)

    write_json(DATA_DIR / "emission-factors.json", factors)
    write_json(DATA_DIR / "countries.json", countries)
    write_json(DATA_DIR / "food-factors.json", food)
    write_json(DATA_DIR / "home-office.json", home_office)
    write_json(DATA_DIR / "factor-trees.json", trees)

    print(f"Source: {source}")
    print(f"Wrote {len(factors)} factors, {len(countries)} countries, {len(food)} foods")
    for key, value in trees.items():
        print(f"  {key}: {len(value)} rows")
    print(f"Output: {DATA_DIR}")


if __name__ == "__main__":
    main()
