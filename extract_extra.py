import re
import zipfile
from openpyxl import load_workbook
from openpyxl.utils import get_column_letter

XLSX = r"c:\Users\chanithma\Downloads\Copy of GHG_emissions_calculator_ver02.6(1).xlsx"

wbf = load_workbook(XLSX, data_only=False)
ref = wbf["Refrigerants"]
for c in range(1, 10):
    print(get_column_letter(c), "r5", ref.cell(5, c).value, "r6", ref.cell(6, c).value)

el = wbf["Electricity, heat, cooling, T&D"]
for r in range(6, 18):
    vals = [el.cell(r, c).value for c in [2, 3, 7, 8]]
    if any(vals):
        print("elec r", r, vals)

with zipfile.ZipFile(XLSX) as z:
    txt = z.read("xl/worksheets/sheet6.xml").decode("utf-8", errors="ignore")
    print("sheet6 (Fuels) size", len(txt))
    for m in re.finditer(r'sqref="([^"]+)"', txt):
        print(" sqref", m.group(1)[:120])
    for m in re.finditer(r"<formula1>([^<]+)</formula1>", txt):
        print(" f1", m.group(1)[:100])
    if "x14:dataValidation" in txt:
        print("x14 DV count", txt.count("x14:dataValidation"))

    # sheet5 = Your organisation?
    for i in [5, 6, 7, 10, 11]:
        p = f"xl/worksheets/sheet{i}.xml"
        t = z.read(p).decode("utf-8", errors="ignore")
        if "dataValidation" in t or "x14:dataValidation" in t:
            print(p, "validations standard", t.count("dataValidation"), "x14", t.count("x14:dataValidation"))

# DB key examples for different sheets
wbv = load_workbook(XLSX, data_only=True)
db = wbv["DB"]
# find UK electricity GEF for comparison
for r in range(2843, 2900):
    d = db.cell(r, 4).value
    if d == "United Kingdom":
        print("UK grid row", r, "L", db.cell(r, 12).value)
        break

# R134a factor
for r in range(2, 500):
    if db.cell(r, 4).value == "HFC-134a":
        print("HFC-134a L", db.cell(r, 12).value, "key col K", db.cell(r, 11).value)
        break

wbf.close()
wbv.close()
