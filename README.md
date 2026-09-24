# Case #404: The Developer

> An unsolved mystery portfolio.  
> **Solo Codes** — Brook Solomon

A themed portfolio built as a crime-scene investigation: red strings, polaroids, evidence boards, and a suspect profile. Fully responsive with a custom cursor (desktop), hamburger nav (mobile), and the same artifact components in a list-on-mobile layout.

**Live:** [solocodes.dev](https://solocodes.dev)

---

## Features

- **Crime Scene** — Hub with CASE #404 title and artifact links (Polaroid, Sticky Note, MO card, Evidence folder)
- **Suspect** — Profile page (mugshot, bio, psychological analysis, digital footprint)
- **Evidence** — Project gallery with search, tech filters, and detail modals
- **Modus Operandi** — Skills as “weapons” and “tactical assets” with linked evidence
- **Timeline** — Career chronology + GitHub contribution heatmap

**UI:** Custom cursor (magnifying glass), red strings (Framer Motion), crime tape, cork/paper textures, responsive nav (tabs on desktop, hamburger + dropdown on mobile).

---

## Tech Stack

| Category   | Stack |
|-----------|--------|
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| UI        | [React](https://react.dev) 19, [Tailwind CSS](https://tailwindcss.com) 4 |
| Motion    | [Framer Motion](https://www.framer.com/motion/) |
| Icons     | [Lucide React](https://lucide.dev) |
| Other     | [react-github-calendar](https://github.com/grubersjoe/react-github-calendar), TypeScript |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Clone and install
git clone https://github.com/brooksolomon/portfolio.git
cd portfolio
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Scripts:**

| Command        | Description        |
|----------------|--------------------|
| `npm run dev`  | Start dev server   |
| `npm run build`| Production build   |
| `npm run start`| Run production app |
| `npm run lint` | Run ESLint         |

---

## Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx          # Root layout, fonts, bg decor
│   ├── page.tsx            # Crime scene (home)
│   ├── suspect/page.tsx     # Profile
│   ├── evidence/page.tsx   # Projects
│   ├── modus-operandi/     # Skills
│   └── timeline/page.tsx   # Experience + GitHub heatmap
├── components/
│   ├── Navigation.tsx      # Tabs (desktop) / hamburger (mobile)
│   ├── CustomCursor.tsx    # Magnifying-glass cursor (pointer devices only)
│   └── ui/
│       ├── Polaroid.tsx
│       ├── StickyNote.tsx
│       ├── RedString.tsx   # Animated red thread
│       ├── CrimeTape.tsx
│       └── GithubHeatmap.tsx
├── lib/utils.ts
└── public/images/          # Profile + project assets
```

---

## License

Private / personal portfolio. All rights reserved.

---

*“Every build is a calculated strike. Every line is a trace left behind.”*  
— Modus Operandi
