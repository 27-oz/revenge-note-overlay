# 📝 Note Overlay — Revenge Plugin

A floating sticky note that sits on top of Discord at all times.

## What it does
- Adds a 📝 button in the bottom-right corner of the app
- Tap it to open/close a note card
- Type anything — it saves automatically
- Tap **Clear** to wipe the note
- Your note persists across restarts (saved via plugin storage)

## File structure
```
note-overlay/
├── index.js       ← plugin code
└── manifest.json  ← plugin metadata
```

## How to host & install
1. Put both files in a public GitHub repo
2. Enable **GitHub Pages** on the repo (Settings → Pages → Deploy from main branch)
3. Your plugin URL will be:
   `https://yourusername.github.io/your-repo-name/`
4. In Revenge: Settings → Plugins → + → paste the URL above

## Troubleshooting
- If the overlay doesn't appear, open Revenge Developer settings and check the JS console for `[NoteOverlay]` warnings
- The plugin targets `AppContainer` — if Discord updates and renames it, the `findByName` call will need updating
