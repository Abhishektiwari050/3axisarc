# 3axis Arc | Architectural Real Estate

A high-end, industrial-chic real estate platform featuring structural grids, editorial typography, and immersive interactive experiences.

## ✨ Features

- **Immersive Hero Section** — Interactive 3D parallax with mouse-tracking perspective shifts
- **Project Showcase** — Full-reveal hover animations with clip-path transitions
- **Infinite Marquee** — Smooth horizontal scrolling text banner
- **Parallax Scrolling** — Depth-layered background images
- **Glassmorphism UI** — Frosted-glass status cards and overlays
- **3D Tilt Cards** — Spring-physics powered card interactions
- **Multi-Page SPA** — Smooth page transitions with AnimatePresence
- **Contact Form** — Animated input fields with accent underline effects
- **Noise Overlay** — Subtle texture for that premium editorial feel
- **Structural Grid** — Architectural grid lines for design consistency

## 🛠 Tech Stack

- **React 19** + TypeScript
- **Vite** — Lightning-fast build tool
- **Tailwind CSS v4** — Utility-first styling
- **Motion** (Framer Motion) — Animations & gestures
- **React Router DOM** — Client-side routing
- **Lucide React** — Icon library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
├── index.html          # Entry HTML with custom SVG favicon
├── src/
│   ├── App.tsx         # Main application with all components & pages
│   ├── main.tsx        # React entry point
│   └── index.css       # Global styles & Tailwind theme
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies & scripts
```

## 📄 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, projects, expertise, metrics, journal |
| `/projects` | Projects | Full project gallery with hover reveals |
| `/philosophy` | Philosophy | Brand ethos and design philosophy |
| `/journal` | Journal | Technical articles and insights |
| `/inquire` | Inquire | Contact form for project inquiries |

## 📝 License

Apache-2.0
