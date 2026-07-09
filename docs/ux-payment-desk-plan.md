# Payment Desk – UX Plan (same components)

Improvements using **existing components only**: `FormFieldsFromConfig`, `TotalSummaryCard`, `Card`, `Button`, section blocks.

---

## 1. **Information order (mental model)**

**Current:** Concession → Fee breakup (TotalSummaryCard) → Fee collection.

**Proposed:** Show “what to collect” first, then “adjust” (concession), then “collect”.

| Order | Section | Rationale |
|-------|---------|-----------|
| 1 | **Fee breakup + Grand Total** (TotalSummaryCard) | Staff see target amount and breakdown before any input. |
| 2 | **Concession / Discount** | Adjust total if needed. |
| 3 | **Fee Collection** | Enter payment against the (possibly discounted) total. |

**Components:** Same; only **section order** in the form changes.

---

## 2. **Sticky context (who & how much)**

**Idea:** Keep applicant and “Total payable” visible while scrolling.

- Make the **header Card** (applicant name, application ID, total payable) **sticky** (e.g. `sticky top-0 z-10`) with a light background so it stays visible during Fee Collection.
- Optional: subtle shadow when scrolled to separate it from content.

**Components:** Same `Card` + `CardContent`; add Tailwind `sticky top-0 z-10 bg-background/95 backdrop-blur`.

---

## 3. **Fee Collection: clear grouping**

**Idea:** Two clear blocks: “Payment amounts” and “Payment details”.

- **Payment amounts:** Cash, Online, Cheque, Bank (the four amount fields).
- **Payment details:** UTR ID, Cheque/Ref No, Bank name, Bank reference, Internal notes.

**Implementation:** Use existing **section** + **renderSectionHeader** in `FormFieldsFromConfig`:

- Add `section: "amounts"` to the four amount fields and `section: "details"` to the rest in `PAY_DESK_PAYMENT_FIELDS`.
- In `pay.tsx`, pass `renderSectionHeader` to show small headings: “Payment amounts” and “Payment details” between the two groups.

**Components:** Same `FormFieldsFromConfig`; config + one prop.

---

## 4. **Target visible while entering**

**Idea:** Repeat “Amount to collect” inside or right above Fee Collection so the target is visible while filling amounts.

- Add one line above the Fee Collection grid: **“Amount to collect: ₹{totalPayable}”** (same as header card, compact).
- Or a short line under the section title: “Collect ₹X (after concession).”

**Components:** Plain text / existing typography; no new UI components.

---

## 5. **Status strip placement**

**Current:** Status strip (Fully covered / remaining / over-collected) is between Fee Collection and the submit button.

**Proposed:** Keep it there; optionally make it more prominent when **remaining > 0** (e.g. slightly larger text or icon). Same `div` and styles; only emphasis when action is needed.

---

## 6. **Submit button state**

**Current:** Disabled when `totalCollected <= 0`; label “Confirm & Record Payment” / “Recording…”.

**Keep:** Same. Optional: when `totalCollected > 0` and `remaining === 0`, show a short line above the button: “Total collected matches amount due.” for reassurance.

**Components:** Same `Button`; optional one-line text above it.

---

## 7. **Summary of changes (implementation order)**

| # | Change | Components | Effort |
|---|--------|------------|--------|
| 1 | Reorder: TotalSummaryCard → Concession → Fee Collection | Layout only | Low |
| 2 | Sticky header card | Card + Tailwind | Low |
| 3 | “Amount to collect” line above Fee Collection | Text | Low |
| 4 | Section headers in Fee Collection (amounts vs details) | Config + renderSectionHeader | Medium |
| 5 | Optional: reassurance line above button when fully covered | Text | Low |

All of the above use **the same components**; only order, styling, config, and copy change.
