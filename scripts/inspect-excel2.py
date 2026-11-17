from openpyxl import load_workbook

p = r"c:\Users\chanithma\Downloads\Copy of GHG_emissions_calculator_ver02.6(1).xlsx"
wb = load_workbook(p, data_only=True)

def dump(name, start, end, maxc=16):
    ws = wb[name]
    print(f"\n===== {name} rows {start}-{end} =====")
    for r in range(start, end + 1):
        vals = []
        for c in range(1, maxc + 1):
            v = ws.cell(r, c).value
            if v is not None:
                text = str(v).replace("\n", " ")
                if len(text) > 80:
                    text = text[:80] + "..."
                vals.append(f"{c}:{text}")
        if vals:
            print(f"R{r}: {vals}")

# Refrigerants header area
dump("Refrigerants", 1, 8, 10)
# count fuel-like rows
for name, start, col in [
    ("Fuels", 6, 4),
    ("Bioenergy", 6, 4),
    ("Refrigerants", 6, 4),
    ("Owned vehicles", 7, 4),
    ("WTT- fuels", 6, 4),
    ("Material use", 6, 5),
    ("Waste disposal", 6, 5),
    ("Business travel - land and sea", 6, 3),
    ("Freighting goods", 6, 3),
    ("Employees commuting", 6, 3),
]:
    ws = wb[name]
    n = 0
    for r in range(start, ws.max_row + 1):
        if ws.cell(r, col).value:
            n += 1
    print(f"COUNT {name}: {n} rows with col {col}")

dump("Electricity, heat, cooling, T&D", 1, 21, 12)
dump("Material use", 1, 8, 10)
dump("Waste disposal", 1, 8, 10)
dump("Water", 1, 13, 8)
dump("Home Office", 1, 16, 21)
dump("Flight and Accommodation", 1, 15, 26)
# hotel country list
ws = wb["Flight and Accommodation"]
print("\nHotel country sample col 25:")
for r in range(1, 20):
    v = ws.cell(r, 25).value
    if v:
        print(f"  R{r}C25: {v}")
print("last country rows:")
found = 0
for r in range(1, 80):
    v = ws.cell(r, 25).value
    if v:
        found += 1
        if found <= 3 or r > 50:
            print(f"  R{r}C25: {v}")
print("country count", found)
