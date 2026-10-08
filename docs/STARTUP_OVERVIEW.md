# Startup Overview — Hayalin Canlansın

*A short, honest overview of an early-stage product idea, its current
state, and what still needs to be proven.*

**Status:** Pre-seed / pre-revenue. Working interactive prototype
published; no paying customers, no revenue, no partnerships.

---

## 1. The problem

Children's books are usually written *about* a child, never *for* one.
The personalised segment exists, but it is mostly a print-on-demand
novelty: the child's name is dropped into a fixed story, and nothing
else changes.

Parents, grandparents and gift-givers who want something more
meaningful face three friction points:

1. **Generic content.** Substituting a name into a stock story reads
   as generic after the first page.
2. **Poor fit for age.** A single text is sold to a 4-year-old and a
   10-year-old alike, even though sentence length, vocabulary and
   narrative complexity differ enormously between them.
3. **No easy way to try before committing.** Most services ask for an
   order form before the customer sees a single page of output.

The result is a category with demand but low trust: buyers cannot tell
in advance whether the output will be worth the money.

---

## 2. The solution

Hayalin Canlansın turns a child's name, age group and chosen character
trait into a coherent short story — one where those inputs shape the
*plot*, not just the noun.

The differentiator is the **age-adapted narrative**: the same beat is
written three ways (3–5, 6–8, 9–12) so that vocabulary, sentence
length and emotional intensity match the reader.

The product is deliberately verifiable up front: the visitor generates
a story in the browser in seconds, reads it, prints it, and only then
decides whether the concept is worth anything.

---

## 3. The product

### Live today (free, no sign-up, no data leaves the device)

- **Interactive story demo** — 3 themes × 3 age groups × 4 optional
  character traits, two narrative variants per theme, template-based
  generation running entirely client-side.
- **Print-to-PDF** output with a book-style layout.
- Honest labelling throughout: it is presented as an *interactive
  concept demo*, not as an AI product.

### Planned

| Item | Stage |
| --- | --- |
| Personalised storybook (child's name as hero) | Prototype |
| Illustrated, paginated storybook | Concept |
| Memory-based stories (family events, milestones) | Concept |
| Special-occasion digital surprises | Future expansion |
| Interactive digital story experiences | Future expansion |

**Nothing is for sale.** No order flow, no pricing, no checkout.

---

## 4. Target audience

Primary (initial validation target, 10–20 people):

- Parents of children aged 3–12 buying a first "real" book or a gift.
- Grandparents and relatives buying a personalised gift from abroad or
  out of town.

Secondary (later):

- Educators and speech/language therapists looking for age-appropriate
  short texts.
- Niche gift marketplaces seeking a low-cost personalised SKU.

---

## 5. Why now

- **Generation cost collapsed.** Producing a coherent, age-tuned short
  narrative is now technically cheap; the remaining cost is editorial
  judgement, not writing hours.
- **Personalised print is proven demand but weak retention.** Existing
  players compete on novelty, not on narrative quality or age fit.
- **Zero-friction trial became normal.** Customers expect to see output
  before they hand over an e-mail address; a browser-side demo makes
  that expectation satisfiable at no infrastructure cost.

*These are hypotheses to be tested, not established market facts.*

---

## 6. Business model (hypothesis)

No revenue exists yet. The working hypotheses, in the order they will
be tested:

1. **Unit sale:** a single personalised digital storybook, priced as an
   impulse gift.
2. **Printed add-on:** physical book fulfilment as a higher-margin
   upsell, once quality and unit economics are proven.
3. **Bundle/subscription:** a small subscription for ongoing stories
   (birthdays, school milestones) — only if repeat usage is observed.

Pricing is intentionally not stated: no willingness-to-pay data
exists yet.

---

## 7. Go-to-market

Phase 1 — *learning, not scale* (see `VALIDATION_PLAN.md`):

- 10–20 direct conversations with parents and grandparents, anchored
  on the live demo rather than a pitch deck.
- Shared demo links inside family/parenting groups, with a single
  clear ask: "read the story and tell me what felt wrong."

Phase 2 — *only if the signal is there*:

- Content-led distribution: sample stories as shareable artefacts.
- Partnerships with independent bookshops and illustrators for the
  printed version.

No paid acquisition is planned before willingness-to-pay is observed.

---

## 8. Traction and current status

Stated plainly, because nothing else is honest at this stage:

| Dimension | Reality |
| --- | --- |
| Product | Working interactive prototype in production |
| Users | None yet — validation has not started |
| Revenue | None |
| Team | One person (founder/developer) |
| Funding | None raised |
| Partnership | None |

What *has* been proven is technical, not commercial: the demo runs
offline-capable, needs no server, does not leak user input, and is
covered by an automated test suite. Commercial desirability is entirely
unproven.

---

## 9. Competition and differentiation

| Approach | Typical weakness |
| --- | --- |
| Name-in-a-template print services | Story does not react to the child; same text for all ages |
| DIY AI chat prompts | Inconsistent quality, no age tuning, no repeatable product |
| Traditional publishers | Not personalisable, long lead time |

Our intended wedge: **age-adapted narrative quality plus a free,
instant, no-sign-up trial.** Whether that wedge matters to buyers is
exactly what Phase 1 is designed to find out.

---

## 10. Roadmap

No dates or completion percentages are published, because there is no
user data to base them on. The sequence is:

1. ✅ Brand, site and honest status labelling
2. ✅ Interactive story prototype (3 themes × 3 age groups)
3. ⏭ Server-side story generation with a strict fallback to the local
   engine
4. ▫ Paginated book layout and PDF/print quality work
5. ▫ Illustration production and print fulfilment research
6. ▫ Closed beta with 10–20 families

---

## 11. Team

- **Founder / developer** — product, brand, engineering and design.

The team is one person, working part-time. No advisers, employees or
contractors are claimed. Human editorial review is *planned* as part
of the production pipeline; it has not been staffed or performed.

---

## 12. The ask

**Current stage-appropriate ask: introductions and feedback, not
capital.**

Specifically:

1. Introductions to parents/grandparents of 3–12 year-olds who would
   agree to a 20-minute conversation.
2. Introductions to independent children's-book illustrators and to a
   print fulfilment provider, for the cost research in roadmap step 5.
3. Honest critique of the demo: what would make you not trust it?

Investment will be discussed only after the validation plan produces
evidence of demand. Any figure at this point would be invented.

---

## Appendix — Key risks

| Risk | Mitigation |
| --- | --- |
| "Cute but not worth paying for" | Validation plan tests willingness-to-pay before any build-out |
| Age-fit turns out not to matter | That is a cheap, fast finding — pivot to personalisation depth |
| Illustration costs dominate unit economics | Roadmap step 5 is a cost research gate, not a commitment |
| LLM output quality/safety issues | Strict server-side validation, content filter and automatic fallback to the deterministic engine |
| Privacy expectations from parents | No storage of child data; demo never transmits input |
