"""Read-only GHG calculator workbook analysis. Do not modify xlsx."""
import json
import zipfile
import re
from collections import defaultdict
from openpyxl import load_workbook
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

XLSX = r"c:\Users\chanithma\Downloads\Copy of GHG_emissions_calculator_ver02.6(1).xlsx"

def sheet_dims(ws):
    return ws.max_row, ws.max_column

def cell_value(ws, row, col):
    return ws.cell(row=row, column=col).value

def analyze_named_ranges(wb):
    out = []
    for name, defn in wb.defined_names.items():
        try:
            destinations = list(defn.destinations)
        except Exception:
            destinations = []
        out.append({
            "name": name,
            "attr_text": defn.attr_text if hasattr(defn, 'attr_text') else str(defn),
            "destinations": [f"{s}!{r}" for s, r in destinations[:5]],
            "dest_count": len(destinations),
        })
    return out

def list_validations(ws):
    dvs = []
    if not ws.data_validations:
        return dvs
    for dv in ws.data_validations.dataValidation:
        dvs.append({
            "type": dv.type,
            "formula1": dv.formula1,
            "formula2": dv.formula2,
            "allow_blank": dv.allow_blank,
            "sqref": str(dv.sqref) if dv.sqref else None,
        })
    return dvs

def sample_formulas(ws, max_samples=30):
    """Collect unique formula patterns from sheet."""
    formulas = []
    seen = set()
    for row in ws.iter_rows():
        for cell in row:
            if cell.data_type == 'f' and cell.value:
                f = str(cell.value)
                if f not in seen:
                    seen.add(f)
                    formulas.append({"cell": cell.coordinate, "formula": f})
                    if len(formulas) >= max_samples:
                        return formulas
    return formulas

def find_formula_cells_containing(ws, substr, limit=20):
    found = []
    for row in ws.iter_rows():
        for cell in row:
            if cell.data_type == 'f' and cell.value and substr.lower() in str(cell.value).lower():
                found.append({"cell": cell.coordinate, "formula": str(cell.value)})
                if len(found) >= limit:
                    return found
    return found

def read_header_row(ws, row=1, max_col=None):
    max_col = max_col or ws.max_column
    headers = []
    for c in range(1, min(max_col, 50) + 1):
        v = ws.cell(row=row, column=c).value
        headers.append((get_column_letter(c), v))
    return headers

def db_analysis(ws):
    """Analyze hidden DB sheet."""
    headers = []
    for c in range(1, ws.max_column + 1):
        h = ws.cell(row=1, column=c).value
        headers.append((get_column_letter(c), h))
    rows = ws.max_row
    # collect unique values for key columns by header name
    col_by_name = {h: i+1 for i, (_, h) in enumerate(headers) if h}
    scopes = set()
    l1 = set()
    l2 = set()
    samples_by_scope = defaultdict(list)
    for r in range(2, min(rows + 1, 50000)):
        row_vals = {}
        for letter, h in headers:
            if h:
                row_vals[h] = ws.cell(row=r, column=col_by_name.get(h, 0)).value if h in col_by_name else None
        if not any(row_vals.values()):
            continue
        sc = row_vals.get("Scope") or row_vals.get("scope") or row_vals.get(list(col_by_name.keys())[0] if col_by_name else "")
        # try first few columns
        vals = [ws.cell(row=r, column=c).value for c in range(1, min(8, ws.max_column+1))]
        if vals[0]:
            scopes.add(vals[0])
        if len(vals) > 1 and vals[1]:
            l1.add(vals[1])
        if len(vals) > 2 and vals[2]:
            l2.add(vals[2])
        key = str(vals[0]) if vals else "unknown"
        if len(samples_by_scope[key]) < 8:
            samples_by_scope[key].append({headers[i][1] or f"col{i+1}": ws.cell(row=r, column=i+1).value for i in range(min(len(headers), 15))})
    return {
        "headers": headers,
        "row_count": rows,
        "unique_scope_sample": sorted(scopes, key=str)[:50],
        "unique_scope_count": len(scopes),
        "unique_level1_count": len(l1),
        "unique_level2_count": len(l2),
        "samples_by_scope": dict(samples_by_scope),
    }

def main():
    wb = load_workbook(XLSX, read_only=False, data_only=False, keep_links=False)
    wb_data = load_workbook(XLSX, read_only=True, data_only=True, keep_links=False)

    report = {"file": XLSX, "sheets": [], "named_ranges": analyze_named_ranges(wb)}

    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        ws_d = wb_data[sheet_name]
        state = ws.sheet_state  # visible / hidden / veryHidden
        mr, mc = sheet_dims(ws)
        report["sheets"].append({
            "name": sheet_name,
            "state": state,
            "max_row": mr,
            "max_col": mc,
            "validations_count": len(list_validations(ws)),
        })

    # Detailed per-sheet (write to stdout in sections)
    print("=== SHEET LIST ===")
    for s in report["sheets"]:
        print(f"{s['name']}\tstate={s['state']}\t{s['max_row']}x{s['max_col']}\tvalidations={s['validations_count']}")

    print("\n=== NAMED RANGES (first 80) ===")
    for nr in report["named_ranges"][:80]:
        print(json.dumps(nr, default=str))

    print("\n=== NAMED RANGES COUNT ===", len(report["named_ranges"]))

    # For each sheet: headers row 1-5, validations, key formulas
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        print(f"\n{'='*60}\nSHEET: {sheet_name} ({ws.sheet_state})\n{'='*60}")
        for hr in [1, 2, 3, 4, 5]:
            h = read_header_row(ws, hr, 30)
            if any(v for _, v in h):
                print(f"Row {hr} headers:", h)
        dvs = list_validations(ws)
        if dvs:
            print(f"Data validations ({len(dvs)}):")
            for dv in dvs[:25]:
                print(" ", dv)
            if len(dvs) > 25:
                print(f"  ... and {len(dvs)-25} more")
        # CO2e related formulas
        for term in ["CO2", "VLOOKUP", "INDEX", "MATCH", "XLOOKUP", "SUM(", "IF("]:
            found = find_formula_cells_containing(ws, term, limit=8)
            if found and sheet_name not in ("DB",):  # DB may be huge
                print(f"Formulas containing '{term}':")
                for f in found[:8]:
                    print(f"  {f['cell']}: {f['formula'][:200]}")

    wb.close()
    wb_data.close()

if __name__ == "__main__":
    main()
