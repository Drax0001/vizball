---
name: Vizball
description: The official site of Vizball, where the page is the pitch.
colors:
  pitch: "hsl(153 50% 16%)"
  night: "hsl(153 52% 9%)"
  night-2: "hsl(153 48% 12%)"
  chalk: "hsl(48 80% 95%)"
  gold: "hsl(43 75% 49%)"
  brand-red: "hsl(0 100% 40%)"
  field-green: "hsl(152 40% 55%)"
  paper: "hsl(48 50% 97%)"
  ink: "hsl(153 40% 10%)"
  muted-paper: "hsl(48 35% 92%)"
  muted-ink: "hsl(153 14% 34%)"
  hairline: "hsl(150 18% 84%)"
typography:
  display:
    fontFamily: "Fester, sans-serif"
    fontSize: "clamp(3rem, 9.5vw, 9rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fester, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Fester, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  voice:
    fontFamily: "Fester, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Fester, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Fester, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.14em"
  button:
    fontFamily: "Fester, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  sm: "6px"
  md: "10px"
  media: "14px"
  pill: "9999px"
spacing:
  gutter: "clamp(1.25rem, 3.4vw, 3rem)"
  shell: "1440px"
  row: "2rem"
  section: "7rem"
  section-lg: "10rem"
components:
  cta-red:
    backgroundColor: "{colors.brand-red}"
    textColor: "#ffffff"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 8px 0 24px"
    height: "48px"
  cta-red-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.night}"
  cta-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.night}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 8px 0 24px"
    height: "48px"
  cta-gold-hover:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.night}"
  cta-night:
    backgroundColor: "{colors.night}"
    textColor: "{colors.chalk}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 8px 0 28px"
    height: "56px"
  cta-night-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.night}"
  cta-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 8px 0 24px"
    height: "48px"
  cta-ghost-hover:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.night}"
  menu-button:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.night}"
    rounded: "{rounded.pill}"
    padding: "0 12px 0 16px"
    height: "40px"
  menu-button-open:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.night}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "44px"
  info-panel:
    backgroundColor: "{colors.night}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.media}"
    padding: "20px"
    width: "256px"
---

# Design System: Vizball

## Overview

**Creative North Star: "The Page Is the Pitch"**

The official 48 × 24 m Vizball field (outer line, midline, the Z3/Z2/Z1 zone lines, the great circle with its central and three peripheral circles, the gold backstop plate and the red claque point) is the site's architecture and its only motif. It is drawn as chalk hairlines on deep pitch green, it draws itself in on mount or on scroll, and the real play loop runs on it with dots for players and balls. Every page stands on this same field: the home hero fills the viewport with it, inner-page heroes carry it as a top-left band that fades out before the title, auth pages carry it upright beside the form, the menu overlay and the footer carry it as a faint watermark, and the loader draws it in chalk on brand red.

The world alternates two grounds. Dark sections (night and pitch green, chalk type) carry the field, the story and the action; light sections (warm paper, night-green ink) carry reading and lists, set as ruled rows like a referee's match sheet. Gold marks scoring, emphasis and the team of four; brand red is the team of five, the primary action, the slogan band and the loader. The logo's green, red and gold strokes recur as a tricolour stripe on the solid navbar, the footer and the page-transition sheets. Type is a single family, Fester, in three voices: Heavy uppercase display, Bold Italic spoken lines, Regular body.

Motion is part of the identity, not decoration: chalk-line draw-on, display words rising out of masks, manifesto words lighting from dim to full, a red-flood loader once per session, a night-green sheet that wipes between routes, inertial scroll, and magnetic pill actions. All of it switches off under `prefers-reduced-motion`. The system refuses the federation default: photo carousels, stat bars and grids of equal icon cards.

**Key Characteristics:**
- The official field, drawn to scale from shared geometry, is the recurring structure on every page.
- Two grounds only: dark pitch for field and action, warm paper for reading; no grey middle.
- One family (Fester) in three voices; display is always Heavy and uppercase.
- Pill controls, 14px media corners, circles and straight lines; nothing else.
- Flat surfaces: depth comes from ground changes, hairlines and motion, never shadows.
- Motion grammar is shared (two curves, four durations) and fully disabled under reduced motion.

## Colors

A fixed, user-pinned palette rooted in Cameroon's green, red and yellow: deep greens as ground, chalk cream as line and type, gold and red as the only accents.

### Primary
- **Deep Pitch Green** (pitch): the secondary dark ground (PlayLoop section, `pitch-2`), outline strokes around player dots, and the colour of match-sheet values on paper. The brand's anchor green.
- **Night Pitch** (night): the main dark ground for heroes, manifesto, menu overlay, footer, the solid navbar and the page-transition sheet. Also the ink on gold surfaces.
- **Night Pitch Lift** (night-2): a one-step-lighter night for adjacent dark bands.

### Secondary
- **Scoring Gold** (gold): scoring and emphasis. Accent words in display headings (BALL in the wordmark), active nav links, the team of four on the field, the backstop plate and catch-ball supports, zone tints, score pops, the progress bar, focus outlines, text selection, caret, the scrollbar thumb, the loader ground and the closing CTA section ground.

### Tertiary
- **Brand Red** (brand-red): the team of five on every field drawing, the primary action pill, the slogan band, the loader ground, the gallery "see all" disc, hover fills on list arrows, the claque point, the live dot, and the middle stroke of the tricolour stripe. Never as text on the dark greens (too little contrast); on dark grounds red is a fill with chalk type.
- **Field Green** (field-green): a supporting light green held in the token set (`secondary`) and chart scale; rarely used on public surfaces.

### Neutral
- **Chalk** (chalk): every line and every word on the dark grounds, at stepped opacities (full for titles, 85% for nav, 70 to 75% for body, 50 to 60% for labels, 45 to 60% for field lines, 10 to 20% for hairlines and rings).
- **Warm Paper** (paper): the light reading ground (match sheet, explore list, forms, page body).
- **Night Ink** (ink): text on paper; dims to 70% for body notes and 55% for labels.
- **Muted Paper** (muted-paper) and **Muted Ink** (muted-ink): quiet fills and secondary text from the shadcn token layer.
- **Hairline** (hairline): borders and input strokes on paper. Ruled rows on paper use night ink at 15% instead.

### Named Rules
**The Red Team Rule.** Red is a full brand colour with structural jobs: it is the team of five wherever the field plays, the ground of the slogan band and loader, and the primary action. It is never body or heading text on the dark greens; there it is a filled surface or dot carrying chalk.

**The Tricolour Rule.** The logo's three strokes (field green, brand red, gold) appear together only as the stripe: under the solid navbar, atop the footer, and on the edge of the page-transition sheets. The full-colour logo mark is used in the navbar and the construction gate.

**The Chalk Opacity Rule.** On dark grounds there is one ink, chalk, and hierarchy comes from its opacity steps, not from new greys.

**The Gold Means Score Rule.** Gold is for scoring, emphasis and the active state. A gold word in a heading is the word that scores.

## Typography

**Display Font:** Fester Heavy (with sans-serif)
**Voice Font:** Fester Bold Italic
**Body Font:** Fester Regular
**Label Font:** Fester Bold

**Character:** One condensed-feeling grotesque in three registers: a shouted, tightly leaded uppercase display, a spoken italic for slogans and pull lines, and a plain regular for reading. Kerning and ligatures are on; headings balance, paragraphs wrap pretty.

### Hierarchy
- **Display** (900, uppercase, line-height 0.86, -0.02em): page titles at `clamp(3rem, 9.5vw, 9rem)`; the home wordmark goes to 15vw (21vw on phones) at line-height 0.8; the closing CTA to `clamp(3.5rem, 11vw, 11rem)` with a 12ch measure. The menu overlay links use display at `clamp(2.2rem, min(7.2vw, 9.2vh), 5.75rem)`.
- **Headline** (900, uppercase, 0.86): section headings at `clamp(2.4rem, 5.5vw, 5rem)` to `clamp(2.6rem, 6vw, 6rem)`; match-sheet values at `clamp(3rem, 8.5vw, 7.5rem)` with tabular figures.
- **Title** (700, 1.25rem to 1.5rem, tight): widget titles, footer and menu-side links, card titles.
- **Voice** (700 italic, 1.125rem to 1.25rem): slogans only ("Rise Above The Game", "Justice · Volonté · Succès"), set in gold.
- **Body** (400, 1rem to 1.25rem, 1.4 to 1.625): leads at 1.125 to 1.25rem with a measure around 42rem; notes at 0.9375rem (the overridden `sm`).
- **Label** (700, 0.75rem, 0.14em, uppercase): keys inside components (match-sheet keys, form field labels, footer column heads, widget heads).

### Named Rules
**The No Eyebrow Rule.** The label style lives inside components (a key, a column head, a field label). It is never set as a kicker above a heading.

**The Display Is Heavy Rule.** Any heading at display or headline scale is Fester 900 uppercase at 0.86 leading; accent comes from colour (gold words), never from a second family or weight.

## Layout

One shell for the whole site: content max width 1440px, side gutter `clamp(1.25rem, 3.4vw, 3rem)`, applied by a single shell class. Sections breathe vertically at 7rem on phones and 10 to 11rem from md up. Lists are ruled, full-width rows (2rem vertical padding from md, 1.5rem on phones) in a three-column grid (key, large value or title, note) that collapses to one column below md.

The field is responsive by orientation, not by scaling alone: below 768px it rotates to portrait (24 × 48, shooting zone on top, backstop at the bottom); from 768px it is landscape. The home hero is a full-viewport dark pitch (100svh, min 640px): the field fills the space between the top bar and the wordmark, the great circle holds a photo that opens like an iris, the giant VIZBALL wordmark sits bottom-left, the red pill sits bottom-right on the touchline, and a next-match panel sits top-right (falling back to "Depuis 2007"). On phones the subtitle, status line and a full-width red pill stack under the field.

Inner-page heroes are night pitch at 64 to 70svh with the title bottom-aligned; the field occupies a band 26svh tall at the top-left at 40% opacity, masked to fade out before the title, and steps aside for an optional 22rem portrait photo at lg. The signature play-loop section pins a 100svh stage inside a 520vh scroll: narration (step bars, step count, title, text) left, field right on desktop; field above narration on phones.

Breakpoints are Tailwind's defaults (640, 768, 1024, 1280px); 768px is the decisive one.

## Elevation & Depth

The system is flat. Depth comes from alternating grounds (night, pitch, paper, gold), from chalk hairlines and inset rings at 10 to 35% opacity, from masks that fade the field out, and from motion (parallax photos, the scaling hero field, the route sheet). There are no shadows on public surfaces; the solid navbar is a night ground with a chalk 10% bottom hairline, and floating panels are night at 80% with an inset chalk 15% ring.

### Named Rules
**The Flat Pitch Rule.** Nothing casts a shadow. If an element needs to separate from its ground, give it an inset hairline ring or change the ground.

## Shapes

Circles and straight lines only, as on the field. Every control is a full pill (buttons, CTAs, menu button, language switch, chips, icon discs). Photographs and floating panels take a 14px corner; inputs take 10px. Media is clipped, never bordered: photos unmask with an inset clip-path rising from below, and the hero photo is clipped by the great circle itself. Ruled lines are 1px at 15 to 18% of the current ink; the progress and step bars are 3px rounded strips. Arrow glyphs live inside a circular disc that rotates -45 degrees on hover.

## Components

### Buttons (the pill action)
Tactile, confident and magnetic.
- **Shape:** full pill (9999px); text left, a circular arrow disc right (32px at md size, 40 to 48px at lg) tinted 16% of the current colour.
- **Sizes:** md 48px tall, 0.95rem; lg 56 to 64px tall, 1 to 1.125rem. Fester Bold uppercase at 0.06em.
- **Tones:** red (the primary action), gold, chalk, night, ghost (chalk inset ring 35% on dark) and ghost-dark (night inset ring 25% on gold or paper).
- **Hover / Focus:** a second colour fills the pill rising from below over 500ms on the out-expo curve; the arrow disc turns -45 degrees; on fine pointers the whole pill drifts toward the cursor (spring, strength 0.28). Focus shows the same fill plus the global 2px gold outline at 3px offset.
- **Utility button:** the shadcn button is also a pill (Fester Bold, 0.04em) for forms and admin-adjacent controls.

### Inputs / Fields
- **Style:** 44px tall, 10px corners, 1px hairline stroke, paper fill, 16px side padding, gold caret.
- **Focus:** stroke turns gold with a 2px gold ring at 30%.
- **Label:** the label style in night ink at 65% above the field; hints at 55%.
- **Disabled:** 50% opacity, not-allowed cursor.

### Navigation
- **Top bar:** 72px (80px at lg), transparent over the dark hero, turning solid night with a chalk 10% hairline after 40px of scroll; hides on scroll down past 320px and returns on scroll up. Light-topped pages (login, register) start solid.
- **Links:** four primary links (Le Sport, Tutoriels, Actualités, Boutique) in Fester Bold uppercase 0.95rem at 0.08em, chalk 85%; hover draws a 1px underline in from the left; active is gold.
- **Menu button:** chalk pill with a two-line burger that crosses; turns gold when open; the label rolls between Menu and Fermer.
- **Menu overlay:** a night pitch that opens as a circle growing from the menu button, every destination at display scale rising out of masks, the upright field as a 12% watermark, and an aside with language, login, email, social discs and the slogan in voice.

### Ruled Lists (match sheet and explore)
The signature reading pattern on paper. Full-width rows separated by night-ink 15% hairlines; a key in label style, a display-scale value or title, a short note. On hover a 2px gold rule draws across the top of the row and the pitch-green value turns gold (match sheet), or the title slides right while the arrow disc fills brand red with a chalk arrow (explore). On fine pointers the explore list floats a 14px-cornered photo that follows the cursor.

### Field Lines (signature)
The official field rendered from shared geometry in metres, landscape or portrait. Chalk strokes at currentColor with round caps; zone lines at 55% opacity; gold backstop plate and supports; red claque point; optional gold zone tints that brighten the active zone to 22%. Lines draw in sequence (70ms stagger) over 1.6s on the in-out-quart curve. Overlays project field metres into the drawing, so players (brand red for the team of five, gold for the team of four) and balls (chalk shot ball with a red ring, chalk catch ball with a gold ring) sit on regulation positions.

### Info Panel
The next-match widget: 256px, night at 80% with an inset chalk 15% ring, 14px corners, 20px padding; a label head with a red live dot, a title, and the date in gold. Its fallback is a gold display line ("Depuis 2007") with a label under it.

## Do's and Don'ts

### Do:
- **Do** put the official field, drawn from the shared geometry, on every new page hero, and keep its lines clear of type with a mask or a band.
- **Do** set display headings in Fester 900 uppercase at 0.86 leading and mark the scoring word in gold.
- **Do** use the brand-red pill for the primary action of a view, and give red its structural jobs (team of five, slogan band, loader).
- **Do** build lists as ruled rows on paper (hairlines at 15%, label key, display value, note) instead of card grids.
- **Do** use the shared motion vocabulary: out-expo `cubic-bezier(0.16, 1, 0.3, 1)` and in-out-quart `cubic-bezier(0.76, 0, 0.24, 1)`, durations 0.35, 0.7, 1.1 and 1.6s.
- **Do** honour `prefers-reduced-motion`: no draw-on, reveals, parallax, magnetism, loader or smooth scroll.
- **Do** use only real facts, rules, the real field and real photos as proof.

### Don't:
- **Don't** set a label above a heading as an eyebrow or kicker.
- **Don't** add box shadows; separate with grounds, hairlines or inset rings.
- **Don't** introduce a second typeface or a non-pill button shape.
- **Don't** set brand red as text on the dark greens; use it as a fill carrying chalk type.
- **Don't** build grids of equal icon-heading-text cards, photo carousels or stat bars.
- **Don't** invent player counts, testimonials, sponsor logos or results.
