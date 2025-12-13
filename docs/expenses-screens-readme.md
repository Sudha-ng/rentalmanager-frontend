# Expenses & Expense Types Screens

## Overview
These notes capture the current implementation of the Expenses and Expense Types areas in the RentalManager Angular 19 frontend. Both flows use standalone Angular components, Angular Material, and the shared backend API (proxied through `/api`).

## Top-Level Navigation
- `app.component.html` hosts the sticky Material toolbar and a custom pill-style tab strip linking to `/expenses` and `/expense-types`.
- Tabs expose `role="tab"` and `aria-selected` for accessibility and mirror the current route via `routerLinkActive`.
- `app.component.css` defines the radial background, toolbar spacing, and tab styling (gradients, hover animation, responsive stacking under 600px).

## Expenses Screen (`ExpenseListComponent`)
### Location
`src/app/components/expense/expense-list/`

### Data Flow
- `expense-list.component.ts` injects `ExpenseService` and `ExpenseTypeService`.
- Search (`searchControl`) and type filter (`typeFilterControl`) use `FormControl`s with `debounceTime(300)` before reloading expenses.
- Expense types are fetched once to populate the dropdown and a `Map` cache for resolving display names.
- Both API calls pipe through `takeUntilDestroyed()` for automatic teardown.
- Error handling leverages `MatSnackBar`; user-facing errors also show inline near the table.

### UI / UX
- Template (`expense-list.component.html`) renders:
  - Eyebrow + hero copy, CTA button to `/expenses/create`.
  - Material card shell with (currently removed) filters block, data table, loading overlay, and empty state.
  - Table columns: description + notes, type, property, amount (INR currency pipe), expense date, and action column for edit navigation.
- Styles (`expense-list.component.css`) manage centered column layout, responsive grid for filters, typographic hierarchy, floating loading layer, and empty state visuals.

### Interaction Details
- `clearFilters()` resets both controls without firing value-change events, then manually reloads expenses.
- `trackByExpenseId` optimizes table rendering.
- `resolveTypeName` returns cached type names or falls back to an em dash.

## Expense Types Screen (`ExpensesTypeListComponent`)
### Location
`src/app/components/expenses-type/expenses-type-list/`

### Data Flow
- Component injects `ExpenseTypeService`, fetches all records on init, and tracks `loading` state.
- Errors surface via `MatSnackBar`.

### UI / UX
- Template mirrors the Expenses layout: header with CTA to `/expense-types/create`, Material card, table, loading indicator, and empty state (with friendly prompt).
- Table columns: name, description, updated timestamp (Angular date pipe), and edit action button linking to `/expense-types/{id}/edit`.
- Styles keep a consistent 720px column, deep card shadow, uppercase headers, and centered empty state.

## Shared Considerations
- Both components rely on the `/api` proxy already defined in the project so they can work against the backend without additional CORS handling.
- Visual system favors high-contrast typography, pill buttons, and radial gradients to match the broader RentalManager branding.
- Each list component exposes obvious CTAs for creation and uses Material Icons for quick edit affordances.

## Potential Next Steps
1. Reintroduce the filter block markup in `expense-list.component.html` if search/type filtering should be visible again (logic already exists).
2. Add unit tests to cover service error cases and helper functions (`resolveTypeName`, etc.).
3. Extend both lists with pagination or infinite scroll if dataset volumes grow.
