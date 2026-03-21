# Duplex PDF Merger

[繁體中文](README_zh.md)

A fast, client-side utility designed to seamlessly merge and properly reorder single-sided scanned odd and even PDF pages into a complete document. Fully supports reverse-ordered even pages commonly produced by ADF (Automatic Document Feeder) scanners.

---

## The Problem

When using a printer or ADF scanner that only supports single-sided scanning, duplex documents require a two-step process:

1. **First pass**: Scan all odd-numbered pages (1, 3, 5...) with the paper loaded in normal orientation.

2. **Second pass**: Flip the paper stack, scan the remaining even pages in reverse order (6, 4, 2...) from the back.

The result is two separate PDF files with pages in the wrong order — this tool solves that.

---

## Features

- **Client-side only** — No uploads, no server, your documents never leave your device
- **Automatic page reordering** — Seamlessly interleave odd and even pages
- **Reverse even page support** — Built-in option for ADF-style reverse scanning
- **Works offline** — After opening the HTML file, no internet connection required
- **No installation** — Just open the HTML file in any modern browser

---

## Usage

1. Open `printer adf duplex scan merger.html` in your browser.

2. Select the PDF containing **odd-numbered pages** (1, 3, 5...).

3. Select the PDF containing **even-numbered pages** (6, 4, 2... if reversed).

4. Keep **"Reverse even pages"** checked if your even pages were scanned in reverse order (standard ADF workflow).

5. Enter an output filename (optional).

6. Click **Merge & Download** to get your complete document.

---

## Technical Details

- Built with [pdf-lib](https://pdf-lib.js.org/) for PDF manipulation
- Single HTML file with no dependencies (pdf-lib is loaded from CDN; works offline after initial load)
- All processing happens in the browser

---

## License

MIT License
