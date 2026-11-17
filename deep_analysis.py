import json
import re
import zipfile
import xml.etree.ElementTree as ET
from collections import defaultdict
from openpyxl import load_workbook
from openpyxl.utils import get_column_letter

XLSX = r"c:\Users\chanithma\Downloads\Copy of GHG_emissions_calculator_ver02.6(1).xlsx"
OUT = r"c:\Users\chanithma\Documents\GHG(green house gas)\deep_analysis_out.txt"

def wprint(f, *a):
    print(*a, file=f)

def db_stats(f):
    wb = load_workbook(XLSX, read_only=True, data_only=True)
    ws = wb["DB"]
    scopes=set(); l1=set(); l2=set(); ghg=set(); sources=set(); countries=set(); vintages=set()
    n=0
    kg_only = 0
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not row or not row[0]:
            continue
        n+=1
        scopes.add(row[0]); l1.add(row[1]); l2.add(row[2])
        if row[8]: ghg.add(row[8])
        if row[12]: sources.add(row[12])
        if row[13]: countries.add(row[13])
        if row[14]: vintages.add(row[14])
        if row[8] == 'kg CO2e':
            kg_only += 1
    wprint(f, "DB rows with Scope:", n)
    wprint(f, "Rows where GHG=kg CO2e:", kg_only)
    wprint(f, "Unique Scope:", sorted(scopes))
    wprint(f, "Unique Level1 ({}):".format(len(l1)), sorted(l1))
    wprint(f, "Unique Level2 count:", len(l2))
    wprint(f, "GHG types in col I:", sorted(ghg))
    wprint(f, "Sources:", sorted(sources))
    wprint(f, "Countries in DB col N ({}):".format(len(countries)))
    for c in sorted(countries):
        wprint(f, "  ", c)
    wprint(f, "Vintages:", sorted(vintages))

    samples = defaultdict(list)
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not row or not row[0]: continue
        key = row[1] or "?"
        if len(samples[key])<5:
            samples[key].append({
                "A":row[0],"B":row[1],"C":row[2],"D":row[3],"E":row[4],"F":row[5],
                "G":row[6],"H":row[7],"I":row[8],"J_formula_key":row[9],"L_factor":row[11],
                "M":row[12],"N":row[13],"O":row[14]
            })
    wprint(f, "\nDB samples by Level1:")
    for k in sorted(samples.keys()):
        wprint(f, "\n--- Level1: {k} ---")
        for s in samples[k]:
            wprint(f, "  {s}")
    # grid electricity block
    wprint(f, "\n--- Country grid rows (D=country name) sample from row 2843 ---")
    wb2 = load_workbook(XLSX, read_only=True, data_only=False)
    ws2 = wb2["DB"]
    for r in range(2843, 2853):
        vals = [ws2.cell(r,c).value for c in range(1,16)]
        wprint(f, "  r{r}:", vals)
    wb2.close()
    wb.close()

def sheet_formula_patterns(f, sheet_name, data_start=6, data_end=20):
    wb = load_workbook(XLSX, data_only=False)
    wbv = load_workbook(XLSX, data_only=True)
    ws = wb[sheet_name]
    wsv = wbv[sheet_name]
    wprint(f, "\n{'='*70}\nSHEET PATTERN: {sheet_name}\n{'='*70}")
    # find header row with 'kg CO2e'
    header_row = None
    for r in range(1, 15):
        for c in range(1, 30):
            v = ws.cell(r,c).value
            if v and 'kg CO2e' in str(v):
                header_row = r
                break
        if header_row: break
    if header_row:
        hdr = []
        for c in range(1, 30):
            v = ws.cell(header_row, c).value
            if v: hdr.append(f"{get_column_letter(c)}:{v}")
        wprint(f, "Header row {header_row}:", ", ".join(hdr))
    r = data_start
    wprint(f, "Row {r} all columns with values/formulas:")
    for c in range(1, 35):
        cell = ws.cell(r,c)
        if cell.value is not None or (cell.data_type=='f'):
            val = wsv.cell(r,c).value
            wprint(f, "  {get_column_letter(c)}{r}: formula={cell.value!r} cached={val!r}")
    # unique formula templates in data rows
    templates = {}
    for rr in range(data_start, min(ws.max_row, data_start+5)+1):
        for c in range(1, 35):
            cell = ws.cell(rr,c)
            if cell.data_type=='f' and cell.value:
                t = re.sub(r'\d+', 'N', str(cell.value))
                templates[t] = str(cell.value)
    wprint(f, "Formula templates (row {data_start}):")
    for t,v in sorted(templates.items()):
        wprint(f, "  {v}")
    wb.close(); wbv.close()

def owned_vehicles(f):
    wb = load_workbook(XLSX, data_only=False)
    ws = wb['Owned vehicles']
    wprint(f, "\n### Owned vehicles special cells ###")
    for addr in ['C84', 'B6', 'G6', 'H6', 'I6', 'J6', 'K6', 'L6', 'M6', 'N6']:
        wprint(f, " {addr}: {ws[addr].value}")
    wprint(f, " Row 6-8 formulas:")
    for r in range(6, 9):
        for col in ['G','H','I','J','K','L','M','N']:
            c = ws[f'{col}{r}']
            if c.value: wprint(f, f"  {col}{r}: {c.value}")
    # find PHEV/BEV rows
    for r in range(6, 200):
        d = ws.cell(r, 4).value or ws.cell(r, 3).value
        if d and ('Electric' in str(d) or 'Plug' in str(d) or 'Battery' in str(d)):
            wprint(f, f" EV-related row {r}: B={ws.cell(r,2).value} C={ws.cell(r,3).value} D={ws.cell(r,4).value}")
            for col in range(1, 15):
                v = ws.cell(r,col).value
                if v: wprint(f, f"   {get_column_letter(col)}: {v}")
            if r > 30: break
    wb.close()

def electricity_sheet(f):
    wb = load_workbook(XLSX, data_only=False)
    ws = wb['Electricity, heat, cooling, T&D']
    for r in [6,7,8,12,17]:
        wprint(f, "\n Elec row {r}:")
        for c in range(1, 15):
            v = ws.cell(r,c).value
            if v: wprint(f, f"  {get_column_letter(c)}: {v}")
    for addr in ['K6','K12','J12','C17','E17','H17','I17']:
        wprint(f, f" {addr}: {ws[addr].value}")
    wb.close()

def home_office(f):
    wb = load_workbook(XLSX, data_only=False)
    ws = wb['Home Office']
    wprint(f, "\n### Home Office lookup table R6:T8 and M8:M10 ###")
    for r in range(6, 11):
        wprint(f, f" row{r} A={ws.cell(r,1).value} J formula={ws.cell(r,10).value}")
        wprint(f, f"   R={ws.cell(r,17).value} S={ws.cell(r,18).value} T={ws.cell(r,19).value} M={ws.cell(r,13).value} P={ws.cell(r,16).value}")
    wprint(f, f" J6 formula: {ws['J6'].value}")
    wb.close()

def data_validations_xml(f):
    wprint(f, "\n### Data validations from xlsx XML ###")
    with zipfile.ZipFile(XLSX,'r') as z:
        sheets = [n for n in z.namelist() if n.startswith('xl/worksheets/sheet') and n.endswith('.xml')]
        wb_xml = ET.fromstring(z.read('xl/workbook.xml'))
        ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        sheet_map = {}
        for sh in wb_xml.findall('.//m:sheet', ns):
            sheet_map[sh.get('name')] = sh.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
        # read rels
        rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
        rid_to_target = {}
        for rel in rels:
            rid_to_target[rel.get('Id')] = rel.get('Target')
        name_to_file = {}
        for name, rid in sheet_map.items():
            t = rid_to_target.get(rid, '')
            if not t.startswith('/'): t = 'xl/' + t.lstrip('/')
            name_to_file[name] = t
        for sname, path in sorted(name_to_file.items()):
            if sname in ('DB',): continue
            try:
                root = ET.fromstring(z.read(path))
            except KeyError:
                continue
            dvs = root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}dataValidation')
            if not dvs: continue
            wprint(f, f"\n{sname}:")
            for dv in dvs[:30]:
                wprint(f, "  type={dv.get('type')} sqref={dv.get('sqref')} formula1={dv.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}formula1').text if dv.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}formula1') is not None else None}")

def info_sources(f):
    wb = load_workbook(XLSX, data_only=True)
    ws = wb['Info and sources']
    wprint(f, "\n### Info and sources table ###")
    for r in range(5, 32):
        row = [ws.cell(r,c).value for c in range(1,6)]
        if any(row): wprint(f, " r{r}: {row}")
    wb.close()

def test_cases(f):
    wb = load_workbook(XLSX, data_only=True)
    wbf = load_workbook(XLSX, data_only=False)
    wprint(f, "\n### Numerical test cases ###")
    # Fuels: CNG litres factor 0.44423
    ws = wb['Fuels']; wsf = wbf['Fuels']
    r=6
    wprint(f, "Fuels row6: type={ws.cell(r,3).value} fuel={ws.cell(r,4).value} unit={ws.cell(r,5).value} factor={ws.cell(r,6).value} lookup={wsf.cell(r,9).value}")
    wprint(f, "  If amount=1000 kg CO2e would be {ws.cell(r,6).value * 1000}")
    # Bioenergy first row
    ws = wb['Bioenergy']
    for r in range(6, 15):
        if ws.cell(r,6).value:
            wprint(f, "Bioenergy r{r}: {ws.cell(r,3).value}/{ws.cell(r,4).value}/{ws.cell(r,5).value} factor={ws.cell(r,6).value}")
            break
    # Refrigerant
    ws = wb['Refrigerants']
    for r in range(6, 20):
        if ws.cell(r,6).value:
            wprint(f, "Refrigerants r{r}: cols D-H = {[ws.cell(r,c).value for c in range(4,9)]} factor F={ws.cell(r,6).value}")
            break
    # Hotel factor
    ws = wb['Flight and Accommodation']
    wsf = wbf['Flight and Accommodation']
    for r in range(6, 10):
        if wsf.cell(r,14).value:
            wprint(f, "Hotel r{r}: country={ws.cell(r,9).value} N concat={wsf.cell(r,14).value} factor L={ws.cell(r,12).value}")
    # Water
    ws = wb['Water']
    wprint(f, "Water supply r6: type={ws.cell(6,2).value} factor={ws.cell(6,4).value} lookup key col G via formula")
    wsf = wbf['Water']
    wprint(f, " Water G6 formula: {wsf['G6'].value}")
    wb.close(); wbf.close()

def fuels_dropdown_lists(f):
    wb = load_workbook(XLSX, data_only=True)
    ws = wb['Fuels']
    wprint(f, "\n### Fuels pre-filled dropdown source columns (A-E rows 6-30 unique) ###")
    for col, name in [(1,'Scope'),(2,'L1'),(3,'Type'),(4,'Fuel'),(5,'Unit')]:
        vals = []
        for r in range(6, 88):
            v = ws.cell(r,col).value
            if v and v not in vals: vals.append(v)
        wprint(f, " Col {get_column_letter(col)} {name}: {vals[:20]}... total unique {len(vals)}")
    wb.close()

def freighting_food(f):
    wbf = load_workbook(XLSX, data_only=False)
    for sn in ['Freighting goods','Food','Material use','Waste disposal','Refrigerants']:
        ws = wbf[sn]
        wprint(f, f"\n{sn} row6 formulas:")
        for c in range(1, 20):
            v = ws.cell(6,c).value
            if v and (str(v).startswith('=') or c<=10):
                wprint(f, f"  {get_column_letter(c)}6: {v}")
    wbf.close()

def main():
    with open(OUT, 'w', encoding='utf-8') as f:
        wprint(f, "Source:", XLSX)
        db_stats(f)
        fuels_dropdown_lists(f)
        for sn in ['Fuels','Bioenergy','Refrigerants','WTT- fuels','Material use','Waste disposal',
                   'Business travel - land and sea','Employees commuting']:
            sheet_formula_patterns(f, sn)
        owned_vehicles(f)
        electricity_sheet(f)
        home_office(f)
        freighting_food(f)
        sheet_formula_patterns(f, 'Freighting goods', 6, 6)
        sheet_formula_patterns(f, 'Flight and Accommodation', 6, 6)
        sheet_formula_patterns(f, 'Water', 6, 6)
        data_validations_xml(f)
        info_sources(f)
        test_cases(f)
    print("Wrote", OUT)

if __name__ == '__main__':
    main()
