# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Four audiences, all first-class:

- **Players in Cameroon**: young people, schools and clubs who should try the sport, learn the rules and join or register a team.
- **The global curious and press**: people discovering a new team sport born in Africa, who need to grasp what it is in seconds.
- **Partners and sponsors**: federations, institutions and brands evaluating whether to back or adopt Vizball. They need seriousness: governance, official rules, a real organisation.
- **The existing community**: current players and clubs following news, events, tutorials, the forum and the shop.

## Product Purpose

The official site of Vizball and the Vizball Association: it explains the sport (rules, field, positions, officials), tells its origin story, and is the hub for news, tutorials, the club map, events, governance documents, the forum and the equipment shop. Success means a first-time visitor understands the sport and wants to play, follow or back it.

## Positioning

Vizball is an original team sport invented in Cameroon in 2007 by MIAFFO NKENGNI Yannick Joël. Its mechanism no other sport shares: an asymmetric match of 4 players against 5, on a 48 × 24 m field split into a shooting zone (a Target defended inside a great circle by shooters) and a duel zone (attackers driving toward a backstop plate scored 3/2/1 by zone), with 12 balls, played mostly by hand and sometimes by foot, and the teams swapping roles after each of 4 periods.

## Operating Context

Bilingual French (default) and English, switchable in the navbar and persisted. Content is managed through the admin dashboard (articles, products, clubs, events, tutorials, governance documents, team members, gallery). A third-party chatbot widget (servallsolutions) is embedded on every page. An "under construction" gate currently fronts the site. A separate browser game lives at game.vizball.org.

## Capabilities and Constraints

- React 18 + Vite + Tailwind 3 + shadcn/Radix; framer-motion is already installed. Express/Bun/SQLite backend in `server/`.
- Routes: home, le-sport, tutoriels, actualites (+ detail), forum (login required), boutique (+ product, panier), gouvernance, media, contact, login, register, admin.
- Stripe is installed but deliberately not wired up.
- Database-driven content (articles, products, forum) is single-language as entered.

## Brand Commitments

- **Colors are fixed** (user-pinned): deep pitch green `hsl(153 50% 16%)` (#143D2B), field green `hsl(152 40% 55%)`, gold `hsl(43 75% 49%)`, brand red `hsl(0 100% 40%)`. Cameroon's green-red-yellow is the root of this palette.
- **Fonts are fixed** (user-pinned): Fester (Regular, Bold, Bold Italic, Heavy) for everything; Inter is also in the repo.
- Logo: `src/assets/images/LOGO-VIZBALL-ASSOCIATION-blanc.png`; seal: `Sceau-Vizball-2-web.png`.
- Slogans: "Rise Above The Game" and "Justice - Volonté - Succès".
- The user wants a world-class, Awwwards-level site with exceptional animation and transitions.

## Evidence on Hand

- Founding facts: created 2007 in Cameroon by MIAFFO NKENGNI Yannick Joël; 4 periods of 15 min; 48 × 24 m field; hands and sometimes feet; 12 balls; 4 vs 5 players; role swap each period; zones Z3/Z2/Z1 at 3/2/1 points; the CLAQUE penalty worth 1 point from 8 m.
- Photos in `src/assets/images/` (throne, ball-to-the-leg, community, court, players sitting on pitch, plus three historical images).
- The full rulebook copy lives in `src/pages/LeSport.jsx` and `src/lib/translations.js`.
- **Absent, must not be fabricated**: player/club/country counts, testimonials, press quotes, sponsor logos, results.

## Product Principles

1. Explain the sport before selling anything: a visitor should grasp the 4-vs-5, two-zone mechanism fast.
2. African origin is the story, told with pride and specificity, never as exotic decoration.
3. Seriousness for partners sits alongside energy for players; both are true of the same organisation.
4. Every page works in French and English.
5. Never invent proof; show the real rules, real field, real photos.

## Accessibility & Inclusion

Many visitors are on mobile in Cameroon, often on modest connections and devices: performance and mobile-first layouts matter. Respect `prefers-reduced-motion`.
