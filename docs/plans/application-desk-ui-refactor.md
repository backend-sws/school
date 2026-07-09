# Application Desk UI Refactor Plan

**Goal:** Divide each step into small UI chunks, extract reusable elements (props-driven), and keep the codebase small and effective.

---

## 1. Reusable primitives (shared across steps)

| Component | Purpose | Props | Used in |
|-----------|---------|--------|---------|
| **StepCard** | Card wrapper with consistent header (title, subtitle, "Step X of N") and optional footer slot | `title`, `subtitle`, `stepIndex`, `totalSteps`, `children`, `footer?: ReactNode` | Every step |
| **SectionPanel** | Bordered panel with optional section title (e.g. "Address", "Medical information") | `title?: string`, `children` | Address/Guardian, Medical, Services |
| **StepNavFooter** | Back + primary action (Continue / Submit), optional Cancel link | `onBack?`, `onPrimary`, `primaryLabel`, `primaryLoading?`, `cancelHref?` | Every step |
| **FormFieldsFromConfig** | Renders an array of field configs via `ControlledFormComponent` in a grid | `control`, `fields` (config array), `columns?: "1" \| "2"`, `getClassName?(field)` | Identity, Address, Guardian, Medical, Academic |

---

## 2. Reusable domain blocks (admission-specific, still props-driven)

| Component | Purpose | Props | Used in |
|-----------|---------|--------|---------|
| **DocumentUploadRow** | Single doc: label + tooltip, file input, "Choose file" / filename + Remove | `label`, `tooltip?`, `path`, `fileName?`, `onUpload`, `onRemove`, `accept`, `uploading` | Medical step |
| **DocumentUploadSection** | List of `DocumentUploadRow` from `APPLICATION_DESK_DOCUMENT_TYPES` | `docTypes`, `value: Record<key, path>`, `fileNames`, `onChange`, `onFileName`, refs for inputs | Medical step |
| **FeeParticularsTable** | Table: rows (particular name, amount, remove) + "Add particular" dropdown + button | `control`, `name` (fees array), `rows` (with `_title`), `onAdd`, `onRemove`, `allOptions`, `addPlaceholder` | Services step |
| **InventoryTable** | Table: item name, price, qty, total, remove + Add item dropdown | `control`, `name` (inventory_items), `rows`, `onAdd`, `onRemove`, `itemOptions` | Services step |
| **TransportFields** | Route, Stop, Amount dropdowns/inputs | `control`, `routeOptions`, `stopOptions` | Services step |
| **TotalSummaryCard** | Read-only: Tuition total, Inventory total, Transport, Grand total | `feeTotal`, `inventoryTotal`, `transportTotal` | Services step |
| **FeeCollectionSection** | Cash amount, Online amount, Transaction ID (if online > 0), remaining/over message | `control`, `grandTotal` | Review step |
| **ReviewSummaryGrid** | Read-only key–value grid (session, stream, applicant, address, guardian, medical, docs, services) | `sections: { title?, rows: { label, value }[] }[]` | Review step |

---

## 3. Step components (small, compose primitives + blocks)

Each step is a thin component that composes the above. It receives form control + handlers + options from the page.

| Step | Composition |
|------|-------------|
| **IdentityStep** | `StepCard` → `FormFieldsFromConfig` (applicant fields, no session/stream) → `StepNavFooter` (Cancel, Continue) |
| **AddressGuardianStep** | `StepCard` → `SectionPanel` "Address" + `FormFieldsFromConfig` (address fields) → `SectionPanel` "Guardian" + `FormFieldsFromConfig` (guardian fields) → `StepNavFooter` |
| **MedicalDocumentsStep** | `StepCard` → `SectionPanel` "Medical" + `FormFieldsFromConfig` (medical fields) → `SectionPanel` "Document upload" + `DocumentUploadSection` → `StepNavFooter` |
| **AcademicStep** | `StepCard` → `FormFieldsFromConfig` (session, stream, class, section) → `StepNavFooter` |
| **ServicesStep** | `StepCard` → Fee section title + `FeeParticularsTable` → `Separator` → Inventory + `InventoryTable` → `Separator` → Transport + `TransportFields` → `TotalSummaryCard` → `StepNavFooter` |
| **ReviewStep** | `StepCard` → `ReviewSummaryGrid` (summary data) → `FeeCollectionSection` → `StepNavFooter` (Back, Complete Onboarding) |

---

## 4. File structure

```
resources/js/
├── components/
│   └── admission/
│       ├── StepCard.tsx              # Step wrapper (header + body + footer)
│       ├── SectionPanel.tsx          # Bordered panel with optional title
│       ├── StepNavFooter.tsx         # Back + primary action, optional Cancel
│       ├── FormFieldsFromConfig.tsx  # Grid of ControlledFormComponent from config
│       ├── DocumentUploadRow.tsx     # Single document row (label, upload/remove)
│       ├── DocumentUploadSection.tsx # List of DocumentUploadRow from config
│       ├── FeeParticularsTable.tsx   # Fees table + add row
│       ├── InventoryTable.tsx        # Inventory table + add row
│       ├── TransportFields.tsx       # Route, stop, amount
│       ├── TotalSummaryCard.tsx      # Totals display
│       ├── FeeCollectionSection.tsx # Cash / online / txn ID + message
│       ├── ReviewSummaryGrid.tsx     # Read-only summary sections
│       └── steps/
│           ├── IdentityStep.tsx
│           ├── AddressGuardianStep.tsx
│           ├── MedicalDocumentsStep.tsx
│           ├── AcademicStep.tsx
│           ├── ServicesStep.tsx
│           └── ReviewStep.tsx
├── pages/
│   └── admission/
│       └── applications/
│           └── new.tsx               # Flow state, form, API; renders step by flowStep
└── constants/
    └── page/
        └── admin/
            └── applicationDeskForm.ts  # Existing; add STEP_LABELS, STEP_SUBTITLES, FLOW_STEPS if desired
```

---

## 5. Page responsibilities (new.tsx)

- **State:** `flowStep`, `selectedNewFeeId`, `selectedNewInventoryItemId`, `uploadingDocType`, `docFileNames`, `fileInputRefs`
- **Form:** `useForm`, `useFieldArray` for fees and inventory
- **Queries:** sessions, streams, admission heads, classes, fee particulars, inventory, transport routes/stops
- **Handlers:** `onContinueFromIdentity`, `onBack`, `onContinueFromAddressGuardian`, etc.; `onSubmit`; fee/inventory add/remove; document upload/remove
- **Render:** Single step via map or switch: `getStepContent(flowStep)` returning `<IdentityStep ... />`, `<AddressGuardianStep ... />`, etc., with props (control, watch, setValue, options, handlers)

Step components stay presentational: they receive `control`, `watch`, `setValue`, `getValues`, and step-specific props (options, callbacks). No API or route logic inside step components.

---

## 6. Implementation order

1. **Phase 1 – Primitives**  
   Add `StepCard`, `SectionPanel`, `StepNavFooter`, `FormFieldsFromConfig` under `components/admission/`. Use them in one step (e.g. Identity) to validate the API.

2. **Phase 2 – Domain blocks**  
   Add `DocumentUploadRow`, `DocumentUploadSection`; then `FeeParticularsTable`, `InventoryTable`, `TransportFields`, `TotalSummaryCard`, `FeeCollectionSection`, `ReviewSummaryGrid`.

3. **Phase 3 – Step components**  
   Add `IdentityStep`, `AddressGuardianStep`, `MedicalDocumentsStep`, `AcademicStep`, `ServicesStep`, `ReviewStep` under `components/admission/steps/`, each composing primitives + blocks.

4. **Phase 4 – Wire page**  
   In `new.tsx`, replace inline step JSX with `getStepContent(flowStep)` that returns the corresponding step component with props. Keep all hooks and handlers in the page.

---

## 7. Benefits

- **Smaller files:** Each step is a short component; shared UI lives in one place.
- **Reuse:** `StepCard`, `SectionPanel`, `StepNavFooter`, `FormFieldsFromConfig` usable in other multi-step flows.
- **Testability:** Primitives and domain blocks can be tested in isolation; steps get minimal props.
- **Maintainability:** Change step order or add a step by updating the flow map and adding one step component.
