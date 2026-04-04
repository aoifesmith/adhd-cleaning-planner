# 🧠✨ ADHD Cleaning Planner

An interactive, color-coded cleaning planner built for ADHD minds. Bite-sized tasks, progress tracking, and encouraging tips to help you build lasting cleaning habits without the overwhelm.

## Features

- ☀️ **Daily** — Morning, After Breakfast, Midday & Night routines
- 📅 **Weekly** — One room per day, Mon–Sun
- 🏠 **Monthly** — Deep clean zones: Kitchen, Bathroom, Bedroom, Living Room
- ⚡ **Speed Clean** — Room-by-room with time badges (e.g. "2 min")
- 🧺 **Laundry** — Day-by-day schedule with laundry tips
- 🗓️ **Yearly** — All 12 months, current month highlighted automatically
- 💾 Progress saves automatically in your browser (localStorage)
- 🎉 Celebration message when a section is 100% complete
- 🎨 Full colour-coded legend so your brain can navigate at a glance

## Getting Started

### Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

### Build for production

```bash
npm run build
```

## Deploy to Vercel (free)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Click **Deploy** — Vercel auto-detects Vite/React
5. You'll get a live URL like `your-project.vercel.app` ✨

## Deploy to Netlify (free)

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click **Deploy** ✨

## Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- Google Fonts (Playfair Display, Nunito, Dancing Script)
- Pure inline styles (no CSS framework needed)

## Customising

All task data lives at the top of `src/App.jsx` in clearly labelled arrays:

- `DAILY_DATA` — daily routine tasks
- `WEEKLY_DATA` — weekly room tasks
- `MONTHLY_DATA` — monthly deep clean tasks
- `SPEED_DATA` — speed cleaning tasks
- `YEARLY_DATA` — yearly tasks by month
- `LAUNDRY_DAYS` — laundry schedule

Edit any array to add, remove, or change tasks to suit your home!

---

Made with 💙 for ADHD minds everywhere.
