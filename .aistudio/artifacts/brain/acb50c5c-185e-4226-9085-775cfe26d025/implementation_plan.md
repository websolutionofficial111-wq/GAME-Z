# GAME/Z — Streamlined Esports Command Center & Tournament Platform

A clean, minimalist modern dark interface for the GAME/Z esports platform, focused on high-usability tournament exploration, interactive bracket viewing, and seamless match registration.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your preferences from Turn 1, the interface has been tailored to focus on **Command Center** and **Tournaments**, adopting a **clean minimalist modern dark mode with softer accents**, and concentrating interactive features around a **Tournament Bracket Viewer** and **Match Registration System**.

- **Confirmed Decision 1 (Core Scope)**: Focused primarily on **Tournaments** and **Command Center**, with a simple sidebar navigation allowing instant transitions.
- **Confirmed Decision 2 (Visual Aesthetic)**: Clean minimalist modern dark mode (`#090D16` canvas, `#111827` surface panels, hairline borders `#1F2937`) with restrained, soft neon accents (soft cyan `#06B6D4` and muted rose `#F43F5E`) instead of aggressive high-contrast glows.
- **Confirmed Decision 3 (Interactive Core)**: Live interactive Tournament Bracket Viewer (interactive rounds, winner advancement, match details inspector) and a streamlined 2-step Tournament Registration modal with instant roster confirmation and slot counter updates.

---

## 1. Overview & Core Concept

- **What It Does**: GAME/Z delivers a focused esports competitive hub where players can browse live and upcoming tournaments (Valorant, BGMI/PUBG, Free Fire, EA FC), enroll their squad or solo entry in one click, inspect dynamic interactive tournament brackets (Quarterfinals, Semifinals, Grand Finals), and track their competitive rank progression (Diamond III tier, RP rating, recent match history).
- **Target Audience**: Competitive and casual grassroots esports players looking for organized tournaments without unnecessary UI clutter.
- **Key Value**: Replaces overly dense multi-screen layouts with a clean, responsive 2-view architecture (Command Center & Tournaments) that makes finding a tournament and understanding match brackets instantaneous.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Command Center (Home Overview)**:
   - Header with player tier status (`DIAMOND III`, `8,240 RP`), verified status, and quick notification preview.
   - Hero spotlight featuring active competitions and instant CTA to explore matches.
   - Quick stats row: Tabular figures for Rank Points (`8,240`), Matches Played (`86`), Winnings (`₹18,500`), and Win Rate (`36.0%`).
   - "Recent & Live Tournaments" grid cards with live status, starting times, prize pool, remaining slots, and direct "Enroll" or "View Bracket" triggers.
   - Daily Challenge & Rank Progress cards providing one-click XP reward claim with smooth feedback.

2. **Tournaments Arena (Primary View)**:
   - Filter bar with quick game selectors (*All Games*, *Valorant*, *BGMI / PUBG*, *Free Fire*, *EA FC*), search input, and status filters (*All*, *Live*, *Upcoming*, *Completed*).
   - Dynamic tournament cards with real-time remaining slot bars (`12/32 slots`, `24/64 slots`), entry fee indicators (Free entry / Sponsored), and prize pools.
   - **Interactive Bracket Viewer**: Clicking "View Bracket" opens an intuitive visual tournament tree (Quarterfinals → Semifinals → Grand Finals) displaying teams, live/final scores, winner highlights, and match detail tooltips.
   - **Streamlined Registration Modal**: Clicking "Enroll" opens a clean, user-friendly registration sheet where players select entry type (Solo vs Squad), enter team name or in-game ID, verify eligibility, and confirm entry with immediate visual confirmation and slot counter decrement.

3. **Visual Identity & Theme**:
   - **Canvas & Surfaces**: Deep refined slate background (`#080C14`), elevated card surfaces (`#0E1422` and `#141C2E`), subtle hairline borders (`rgba(255, 255, 255, 0.08)`).
   - **Accents**: Soft cyan (`#06B6D4`) for primary actions and active tabs; muted rose-pink (`#F43F5E`) for live highlights and rank badges; emerald (`#10B981`) for confirmed registrations.
   - **Typography**: Bold geometric sans for headers (`Outfit` / `Plus Jakarta Sans`), clean unboxed body prose, and strict tabular numerals (`font-mono tabular-nums`) for prize pools, points, and timers.
   - **Anti-Slop Discipline**: No decorative pulsing dots, no code-comment titles (`//`), zero pill badge sandwiches on cards, and clean single-line controls.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct 2-Tab Navigation (Command Center + Tournaments Arena)**
  - *Chosen Approach*: Streamline the navigation to the two high-impact views requested by the user, while keeping player profile stats neatly accessible in an unobtrusive top-right profile drawer.
  - *Why*: Eliminates overwhelming screen complexity and cognitive fatigue, aligning with the "simple and user-friendly" directive.
- **Decision 2: Comprehensive In-App Bracket Viewer Component**
  - *Chosen Approach*: Custom responsive bracket renderer supporting round stages, match pairings, team avatars, score cards, and winner indicators.
  - *Why*: Brackets are the heart of competitive gaming. Providing an interactive, pan-and-inspect bracket directly in the app delivers immediate esports authenticity without leaving the page.
- **Decision 3: Reactive State with Local Storage Fallback**
  - *Chosen Approach*: Fully reactive client-side tournament state (registered status, custom teams, updated slots, claimed daily challenge).
  - *Why*: Instantaneous zero-latency feedback during user testing with no server dependencies or network dropouts.

---

## 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                         App State                             │
│   - activeTab ('command_center' | 'tournaments')             │
│   - tournamentsList (tournaments, slots, status, game)       │
│   - userRegistrations (set of registered tournament IDs)     │
│   - activeBracketModal (tournament or null)                  │
│   - activeRegisterModal (tournament or null)                 │
│   - playerProfile (Rohan Mehta, Diamond III, 8,240 RP)       │
└──────────────────────────────┬───────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│     Sidebar & Top Navigation  │   │       Main Viewport          │
│ - Brand Logo (GAME/Z)        │   │ ┌──────────────────────────┐ │
│ - Nav Links (Command/Arena)  │   │ │ Command Center           │ │
│ - Quick Player Pill & Drawer │   │ │  - Hero Banner & XP      │ │
└──────────────────────────────┘   │ │  - Key Stats Strip (RP)  │ │
                                   │ │  - Featured Tournaments  │ │
                                   │ └──────────────────────────┘ │
                                   │ ┌──────────────────────────┐ │
                                   │ │ Tournaments Arena        │ │
                                   │ │  - Game Filters & Search │ │
                                   │ │  - Tournament Grid Cards │ │
                                   │ └──────────────────────────┘ │
                                   └──────────────┬───────────────┘
                                                  │
                                   ┌──────────────┴───────────────┐
                                   ▼                              ▼
                    ┌──────────────────────────┐   ┌──────────────────────────┐
                    │ Interactive Bracket View │   │ Smooth Match Register    │
                    │ - QF / SF / Finals Tree  │   │ - Squad & Solo Picker    │
                    │ - Match Scores & Winner  │   │ - Instant confirmation   │
                    └──────────────────────────┘   └──────────────────────────┘
```

### Component Structure

- `src/App.tsx`: Main layout controller, navigation tabs, active view switching, modal orchestrator.
- `src/components/Sidebar.tsx`: Minimalist sidebar with active tab states and quick rank level badge.
- `src/components/TopNav.tsx`: Clean 3-zone header matching design constitution (wordmark/view title, search bar, player profile trigger).
- `src/components/CommandCenterView.tsx`: Hero banner, responsive stats strip with tabular figures, recent tournaments preview, daily XP claim card.
- `src/components/TournamentsView.tsx`: Game category filter buttons, search input, status filters, and tournament cards with direct Enroll / Bracket action triggers.
- `src/components/BracketModal.tsx`: Visual multi-round tournament bracket with interactive match cards, winner branch connections, and match details popover.
- `src/components/RegisterModal.tsx`: Friendly 2-step registration dialog with input validation, squad/solo selector, and success state.
- `src/components/ProfileDrawer.tsx`: Slide-over drawer showing player's Diamond III rank breakdown, verified badge, and recent proof-of-play match records.
- `src/data/tournamentsData.ts`: Realistic esports tournament presets (Valorant Campus Clash, BGMI Monsoon Drop, Free Fire Weekend Rush, FC Kickoff Cup) complete with full bracket seedings and rosters.
