# MajiMap resident app (PWA prototype)

The resident side of MajiMap Module D, Community Reporting: report a water problem with a photo, follow it until it is fixed, answer reviewers, and find working water nearby. Built from the Figma designs in *MajiMap – 04 Community Reports – Resident app*.

It is a static prototype: there is no server or database. Everything a resident does is kept on their phone (localStorage), and the water points, reports and reviewer messages come from `src/lib/data/static.js` (fictional, around Wote and Kilungu in Makueni).

## What works for real
- Installable PWA with an offline app shell (service worker). Map tiles you have viewed stay available offline.
- Camera viewfinder (or choose a photo), with photos shrunk to about 300 KB.
- Location from the phone (if you are outside Makueni it uses a demo spot near Kilungu so the data stays nearby).
- Voice notes with the microphone.
- Sign in with a phone number and a 6-digit code, a 4-digit PIN, and fingerprint or Face ID unlock through WebAuthn.
- Light, Dark or the phone setting, with the colours from the Figma tokens.
- Offline reporting: a report made without a connection waits on the phone and sends itself when you are back online.

## What is faked
- **SMS codes:** any 6 digits work; `000000` shows the wrong-code state.
- **Sending:** the upload is simulated. Add `?net=slow` to a `/sent/...` address, or use a slow network, to see the slow state. Turn the connection off mid-send to see Failed.
- **AI type suggestion:** always suggests *Leak or damaged pipe*.
- **Reviewer replies:** they are part of the static data (report RPT-MKN-0298).

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm start   # production server on PORT (default 3000)
```
Camera, microphone, location, service worker and fingerprint need HTTPS (or localhost).

## Deploy on Railway from GitHub
1. Push this folder to a GitHub repository.
2. In Railway: **New project → Deploy from GitHub repo**, then pick the repository.
3. Railway reads `railway.json`: Nixpacks installs the packages, `npm run build` builds the app, and it starts with `npm start`. It sets `PORT` for you.
4. Under **Settings → Networking**, choose **Generate domain** to get an HTTPS address, then open it on your phone and use *Add to Home screen*.

## Structure
- `src/app.css`: tokens (Maji Light and Maji Dark) and base component styles.
- `src/lib/components`: Logo, Ripple, BottomNav, CodeInput, ReportCard, Badge, Toggle and others.
- `src/lib/data/static.js`: the static data.
- `src/lib/store.svelte.js`: on-phone state (session, PIN hash, theme, reports, draft).
- `src/routes/(full)`: full-screen flows (sign in, unlock, report a problem).
- `src/routes/(app)`: screens with the bottom nav (Home, Reports, Nearby water, Account).
- `src/service-worker.js`: offline cache.

## Changelog
Newest first. Every change to the app gets a dated line here.

### 25 Nov 2026
- Android system bars (status bar and gesture bar) now follow the screen: they match the bottom nav on screens that have it, the page background on screens without it, and the camera's dark surface on the camera. They update with light and dark mode. Manifest `theme_color` changed from brand blue to the page background.

### 24 Nov 2026
- Railway: `buildCommand` is now `npm run build`. Nixpacks already installs packages, and a second `npm ci` failed on its locked cache.
- Fixed: after creating a PIN the app opened the unlock screen instead of Home.
- Fixed: Send report returned to the camera instead of the sending screen.
- First release of the resident PWA: sign in with phone and SMS code, PIN and fingerprint or Face ID unlock, Forgot PIN, Home, Report a problem (camera, location, check, already reported, voice note, send, sending, slow, failed, saved offline), Reports and report details with reviewer messages and replies, Nearby water map and list, water point details, Account, and Appearance (phone setting, light, dark). Works offline; static data for Makueni.
