# Analytics — Event Map & Funnel

GA4 property: `G-05TS7KT8TF` (set in `src/_data/site.json` → `analyticsId`; empty value = no tag emitted).
Tag config is privacy-first: `anonymize_ip: true`, Google Signals off, ad personalization off.

**Renaming an event breaks historical continuity — change names deliberately and update this file.**

## The funnel

```
Awareness          Consideration (qualified lead)         Conversion
page_view    →     gallery_photo_open / faq_open /   →    book_cta_click   →   vrbo_outbound_click ★
scroll             area guide & cabin page views          (arrive at /book/)   (handoff to Vrbo)
                                                                            ↘  contact_click / inquiry_form_click (direct lead)
```

A **qualified lead** = a session that reaches `/book/` (via `book_cta_click`) or emits a
direct-lead event. The **key event (conversion)** is `vrbo_outbound_click` — the moment we
hand a visitor to Vrbo. Actual bookings happen on Vrbo and can't be measured here; outbound
click is the last thing we own.

## Custom events (declarative: `data-analytics` + one delegated listener in main.js)

| Event | Trigger | Params | Question it answers |
|---|---|---|---|
| `book_cta_click` ★qualifying | Any internal "Book Your Stay" CTA (links to /book/) | `location`: header, hero, home_cta_band, cabin_page, area_guide, about_page | Which placements move visitors into the booking flow? |
| `vrbo_outbound_click` ★KEY EVENT | Any link out to the Vrbo listing | `location`: book_page, footer | How many visitors do we hand to Vrbo, and from where? |
| `contact_click` | tel: / mailto: links | `method`: phone, email; `location`: footer, contact_page | Do people prefer calling/emailing over Vrbo? |
| `inquiry_form_click` | Link out to the Google inquiry form | `location`: contact_page, book_page | Are pre-booking questions blocking bookings? |
| `gallery_photo_open` | Lightbox opened in the gallery | `section`: room/area name | Which rooms/areas do prospects scrutinize? (engagement depth) |
| `faq_open` | A FAQ `<details>` opened (toggle listener, fires on open only) | `question`: full question text | What do prospects need answered before booking? |
| `social_click` | Footer social icons | `network`: facebook, instagram | Is the site feeding the social channels? |

## GA4 console setup (owner, one-time)

1. **Admin → Data display → Key events**: mark `vrbo_outbound_click` as a key event.
   Optionally also `contact_click` and `inquiry_form_click` (direct leads).
2. **Enhanced measurement** (the toggles you listed) — keep defaults on; here's what each does on this site:
   - *Page views*: primary traffic metric. History-based events fine to leave on (site does no SPA routing, so it never double-fires).
   - *Scrolls*: useful — 90% depth on the home page is an engagement signal.
   - *Outbound clicks*: safety net; catches attraction links etc. Our named `vrbo_outbound_click` is what you report on — the generic `click` event stays as backup detail.
   - *Site search*: no-op — the site has no search box or query params. Harmless either way.
   - *Form interactions*: no-op — there are no on-site forms (inquiry is an external Google Form, tracked via `inquiry_form_click`).
   - *Video engagement*: no-op — no embedded videos. If you ever embed a YouTube cabin tour, this starts working automatically.
   - *File downloads*: no-op — no downloadable files.
3. Suggested reports: Engagement → Events, compare `book_cta_click` by `location`
   (custom dimension needed for params: Admin → Custom definitions → create event-scoped
   dimensions for `location`, `section`, `method`, `question`).

## Rules

- Fire conversion-ish events on real actions only (clicks on real links) — never on page load.
- New trackable element = add `data-analytics="event_name"` (+ `data-analytics-*` params). No per-element JS.
- Keep `/admin/` out of analytics (the admin page has no tag — it doesn't use the base layout).
