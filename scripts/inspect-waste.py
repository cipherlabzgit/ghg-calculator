from openpyxl import load_workbook
p = r"c:\Users\chanithma\Downloads\Copy of GHG_emissions_calculator_ver02.6(1).xlsx"
wb = load_workbook(p, data_only=True)
ws = wb["Waste disposal"]
print("sample every 20 rows col 2-8")
for r in range(6, 256, 10):
    vals = [ws.cell(r, c).value for c in range(2, 9)]
    print(r, vals)
print("unique col3:")
s = set()
for r in range(6, 256):
    v = ws.cell(r, 3).value
    if v:
        s.add(str(v))
print(sorted(s))
print("nonempty col5 count", sum(1 for r in range(6, 256) if ws.cell(r, 5).value))
