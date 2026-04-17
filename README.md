# HajjFlow — হজ্ব আমল পরিকল্পনা

A mobile-first Hajj companion app with full Bengali UI. Helps pilgrims track daily amal, Tawaf rituals, duas, and location-specific routines across Makkah, Madinah, Mina, and Arafat.

## Features

- **সারসংক্ষেপ (Overview)** — Daily amal checklist + Hajj step tracker with live progress stats
- **আমল চার্ট (Amal Chart)** — Track all categories of ibadah across the journey
- **তাওয়াফ (Tawaf)** — 7-round Tawaf guide with per-round focus, Arabic zikir, and Bangla translation
- **মক্কা / মদিনা / মিনা / আরাফা** — Time-blocked daily routines for each location
- **১০০ দোয়া (100 Duas)** — Checkable list of 100 duas to complete during Hajj
- **সূরা (Surahs)** — Time-based Surah reading schedule with spiritual context
- **সম্পর্কে (About)** — Project info in Bangla

## Tech Stack

- Vanilla HTML/CSS/JS — zero dependencies
- localStorage-ready state (checklist toggle via class manipulation)
- Mobile-first, max-width 430px, thumb-friendly UI
- Bengali (bn-BD) primary language

## Usage

Open `hajj_amal_app.html` directly in any browser. No build step, no server needed.

```bash
open hajj_amal_app.html
```

## Project Structure

```
hajjflow/
├── hajj_amal_app.html   # Main app (single file)
├── prompt.md            # Feature spec & Claude prompts
├── CLAUDE.md            # Claude Code project instructions
└── README.md            # This file
```

## Planned Features

- Tawaf counter with 7-round state machine + 2-rakat Salah confirmation flow
- Interactive accordion for Hajj step overview
- LocalStorage persistence for checklist state
- PWA support for offline use during Hajj

## Contributing

Suggestions, bug reports, and PRs welcome → [github.com/jakaria-istauk/hajjflow](https://github.com/jakaria-istauk/hajjflow)

## License

Personal/religious use. Open for community contribution.
