# -*- coding: utf-8 -*-
"""Update turkmen translations in base.ts.
Usage:
    Pass JSON dict {phrase_id: turkmen_text} as argv[1] or via stdin.
Example:
    python update_tk.py '{"phrase_0002": "Ertiriňiz haýyrly bolsun!"}'
"""
import json
import re
import sys
from pathlib import Path

BASE = Path(r"C:/Users/seydi/Shapak-Apps/turkmen-phrasebook/src/data/languages/base.ts")


def escape_ts(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main():
    if len(sys.argv) > 1:
        data = json.loads(sys.argv[1])
    else:
        data = json.loads(sys.stdin.read())

    text = BASE.read_text(encoding="utf-8")
    updated = 0
    for pid, tk in data.items():
        # Match the full block for this id
        pattern = re.compile(
            r'(\{\s*\n\s*id:\s*"' + re.escape(pid) + r'",[\s\S]*?turkmen:\s*)"[^"]*"',
            re.MULTILINE,
        )
        new_text, n = pattern.subn(r'\1"' + escape_ts(tk) + '"', text, count=1)
        if n == 0:
            print(f"NOT FOUND: {pid}", file=sys.stderr)
            continue
        text = new_text
        updated += 1

    BASE.write_text(text, encoding="utf-8")
    print(f"Updated {updated} phrases")


if __name__ == "__main__":
    main()
