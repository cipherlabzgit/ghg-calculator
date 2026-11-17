from openpyxl import load_workbook

p = r"c:\Users\chanithma\Downloads\Copy of GHG_emissions_calculator_ver02.6(1).xlsx"
wb = load_workbook(p, data_only=True)
print("SHEETS:")
for s in wb.sheetnames:
    ws = wb[s]
    print(f"  {s!r} max_r={ws.max_row} max_c={ws.max_column}")

target = [
    "Your organisation",
    "Fuels",
    "Bioenergy",
    "Refrigerants",
    "Electricity, heat, cooling, T&D",
    "Owned vehicles",
    "WTT- fuels",
    "Material use",
    "Waste disposal",
    "Flight and Accommodation",
    "Business travel - land and sea",
    "Freighting goods",
    "Employees commuting",
    "Food",
    "Home Office",
    "Water",
]

print("\n===== HEADERS AND FIRST ROWS =====")
for name in target:
    if name not in wb.sheetnames:
        print(f"\nMISSING {name}")
        continue
    ws = wb[name]
    print(f"\n===== {name} =====")
    for r in range(1, 12):
        vals = []
        for c in range(1, min(ws.max_column, 16) + 1):
            v = ws.cell(r, c).value
            if v is not None:
                vals.append(f"{c}:{v}")
        if vals:
            print(f"R{r}: {vals}")
