import json
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

BOOK = Path('MBA_colleges_ranked-1.xlsx')
OUT = Path('firebase_seed.json')
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def cell_value(cell):
    return ''.join(cell.itertext()).strip()

def city_for(name):
    n = name.upper()
    places = [
        ('BELGAUM', 'Belagavi'), ('BELAGAVI', 'Belagavi'), ('MANGALORE', 'Mangaluru'),
        ('MYSORE', 'Mysuru'), ('MYSURU', 'Mysuru'), ('HUBLI', 'Hubballi'),
        ('DHARWAD', 'Dharwad'), ('DAVANGERE', 'Davanagere'), ('SHIMOGA', 'Shivamogga'),
        ('TUMKUR', 'Tumakuru'), ('TUMAKURU', 'Tumakuru'), ('MANIPAL', 'Manipal'),
        ('UDUPI', 'Udupi'), ('HASSAN', 'Hassan'), ('KALABURAGI', 'Kalaburagi'),
        ('GULBARGA', 'Kalaburagi'), ('BALLARI', 'Ballari'), ('BELLARY', 'Ballari'),
        ('BIDAR', 'Bidar'), ('RAICHUR', 'Raichur'), ('MANDYA', 'Mandya'),
        ('KOLAR', 'Kolar'), ('BANGALORE', 'Bengaluru'), ('BENGALURU', 'Bengaluru'),
    ]
    for token, city in places:
        if token in n:
            return city
    # Most records in this KEA dataset are Bengaluru institutions; retain an
    # explicit value so clients can always render a city field.
    return 'Bengaluru'

with zipfile.ZipFile(BOOK) as workbook:
    root = ET.fromstring(workbook.read('xl/worksheets/sheet1.xml'))
    rows = root.findall('.//m:row', NS)
    headers = [cell_value(c) for c in rows[0].findall('m:c', NS)]
    colleges = []
    for row in rows[1:]:
        cells = {c.attrib.get('r', '')[0]: cell_value(c) for c in row.findall('m:c', NS)}
        values = [cells.get(chr(65 + i), '') for i in range(len(headers))]
        values += [''] * (len(headers) - len(values))
        if not values[1] or not values[0].isdigit():
            continue
        cutoffs = {}
        for category, value in zip(headers[3:], values[3:]):
            cutoffs[category] = int(value) if value.isdigit() else None
        colleges.append({
            'code': values[1],
            'name': values[2],
            'city': city_for(values[2]),
            'rank': int(values[0]),
            'cutoffs': cutoffs,
            'source': 'KEA PGCET 2025 First Round Allotment Cut-Off Ranks (RoK)',
            'sourceDate': '2025-10-04',
            'seatType': 'RoK',
        })

payload = {
    'metadata': {
        'dataset': 'mba_colleges_cutoffs',
        'title': 'KEA PGCET 2025 First Round Allotment Cut-Off Ranks (RoK)',
        'meaning': 'Lower rank number = more competitive; null = seat not filled / not available',
        'sourceDate': '2025-10-04',
        'seatType': 'RoK',
        'collegeCount': len(colleges),
        'categories': headers[3:],
    },
    'colleges': colleges,
}
OUT.write_text(json.dumps(payload, indent=2), encoding='utf-8')
print(f'Wrote {len(colleges)} colleges to {OUT}')
