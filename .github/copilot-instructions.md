---
name: medifind-workspace
description: "AI agent instructions for MediFind, a real-time hospital bed availability tracker for Nanded region. Use for: implementing features, debugging component/state issues, integrating Supabase/Maps/Auth, extending admin portal, or any full-stack modifications."
---

# MediFind Workspace Instructions

## Project Overview

**MediFind** is a real-time hospital bed availability tracker helping patients in the Nanded region (Maharashtra, India) find available ICU, oxygen, ventilator, cardiac, oncology, and general beds across multiple hospitals.

### Key Features
- **Find Tab**: Browse hospitals, filter by bed type, search by name/location, real-time availability
- **Emergency Tab**: Ultra-fast access to nearest hospitals + emergency numbers (108, 102, 100)
- **Hospital Portal Tab**: Admin interface (stub for future expansion)
- **Live Stats Dashboard**: Aggregate ICU beds, ventilators, oxygen beds, hospital status
- **Critical Alerts**: Red banner when hospitals reach critical capacity (ICU ≤2 beds)
- **Real-time Simulation**: Bed availability updates every 30 seconds (mock data currently)

### MVP Status
- **Architecture**: Complete, MVP-ready
- **Data Layer**: Supabase schema + migrations ready; currently using mock data (`src/data/mockHospitals.ts`)
- **Features**: Core find/emergency/booking flows working
- **Stubs**: Maps integration, Hospital Portal, real Supabase queries

---

## Development Environment

### Prerequisites
- Node.js 16+ with npm
- (Optional) Supabase account with project URL + anon key

### Quick Start
```bash
cd c:\Users\navin\OneDrive\Desktop\MEDIFIED
npm install
npm run dev        # Starts Vite dev server on localhost:5173
```

### Build & Validation Commands
```bash
npm run build      # Production build → dist/ folder
npm run preview    # Preview production build locally
npm run lint       # ESLint type + code quality checks
npm run typecheck  # TypeScript strict mode validation (no emit)
```

**Best Practice**: Before committing, always run:
```bash
npm run lint && npm run typecheck && npm run build
```

---

## Tech Stack

| Layer | Tech | Version | Notes |
|-------|------|---------|-------|
| **Build Tool** | Vite | 5.4.2 | ESM-first, Fast Refresh enabled |
| **Framework** | React | 18.3.1 | Functional components + hooks |
| **Language** | TypeScript | 5.5.3 | Strict mode enabled (`noUnusedLocals`, `noUnusedParameters`) |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first, mobile-first breakpoints (md: for tablet+) |
| **UI Icons** | Lucide React | 0.344.0 | Optimized icon library (excluded from bundler optimization) |
| **Database** | Supabase | ^2.57.4 | PostgreSQL backend, ready to integrate (currently unused) |
| **Code Quality** | ESLint | 9 + TypeScript ESLint | .config.js rules in workspace root |

---

## Architecture & State Management

### Data Flow (Current MVP Implementation)
```
App.tsx (single state hub)
  ├── hospitals[] ..................... raw hospital data + bed availability
  ├── filteredHospitals[] ............ after filter/search
  ├── selectedBedType, searchQuery ... filter controls
  ├── selectedHospital .............. triggers booking modal
  ├── criticalAlert .................. ICU ≤2 beds threshold alert
  └── activeTab ...................... find/emergency/portal view
```

### Component Organization

**By Feature** (`src/components/`):
- `Header.tsx` ........... Logo, title, "LIVE - Nanded" badge
- `Navigation.tsx` ....... Tab switcher (Find / Emergency / Portal)
- `StatsDashboard.tsx` ... 4 stat cards (ICU, ventilators, oxygen, online hospitals)
- `SearchFilters.tsx` ... Bed type dropdown + search input
- `HospitalCard.tsx` .... Hospital info, bed badges, distance, book button
- `BookingModal.tsx` .... Patient form (name, age, phone, bed type, symptoms)
- `EmergencyView.tsx` ... Emergency numbers + 3 nearest hospitals
- `HospitalPortal.tsx` .. Admin dashboard (stub)
- `MapSection.tsx` ...... Interactive map placeholder (stub)
- `AlertBanner.tsx` ..... Critical capacity alerts (red banner)

**Current Design Decision**: All state centralized in `App.tsx`, passed down via props. This is acceptable for MVP; future scale may benefit from Context API or state management library.

### Data Types
Located in `src/lib/supabase.ts`:
```typescript
Hospital {
  id: string
  name: string
  location: string
  address: string
  latitude: number
  longitude: number
  distance_km: number
  phone: string
  is_online: boolean
  created_at: ISO timestamp
  updated_at: ISO timestamp
}

BedAvailability {
  id: string
  hospital_id: string
  bed_type: 'Oxygen' | 'ICU' | 'Ventilator' | 'Cardiac' | 'Oncology' | 'General'
  total_beds: number
  available_beds: number
  status: 'AVAILABLE' | 'MODERATE' | 'CRITICAL'
  last_updated: ISO timestamp
  created_at: ISO timestamp
}

HospitalWithBeds = Hospital & { bed_availability: BedAvailability[] }
```

---

## Key Working Patterns

### 1. Component Pattern (HospitalCard)
- **Props**: Hospital data + event handlers (onBookNow)
- **Utilities**: Color mapping functions for status/bed type
- **Responsive**: `flex-col md:flex-row` for mobile/desktop
- **Events**: Google Maps redirect on distance click, booking modal on button click

```tsx
// Example from HospitalCard.tsx
const getStatusColor = (status: BedAvailability['status']): string => {
  switch(status) {
    case 'AVAILABLE': return 'bg-green-100 text-green-800';
    case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
    case 'CRITICAL': return 'bg-red-100 text-red-800';
  }
};
```

### 2. filtering & State Updates (App.tsx)
- **Filtering**: Cascading effects (hospital changes → re-filter)
- **Real-time simulation**: `setInterval` every 30 seconds, updates all beds randomly
- **Critical alert check**: Finds any ICU bed with ≤2 available, triggers alert

```tsx
// Pattern: useEffect with dependencies
useEffect(() => {
  const filtered = hospitals.filter(h => 
    h.bed_availability.some(b => b.bed_type === selectedBedType)
    && h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setFilteredHospitals(filtered);
}, [hospitals, selectedBedType, searchQuery]);
```

### 3. Mock Data Source
Located in `src/data/mockHospitals.ts`. Exports `NANDED_HOSPITALS[]` array.

**Note**: Currently loads fresh `new Date().toISOString()` on every render—not app startup time. If persisting timestamps is needed, move to state initialization.

### 4. Styling Pattern
- **Tailwind utility-first**: No custom CSS files (all in JSX className)
- **Responsive**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern
- **Colors**: Semantic Tailwind palette (green-100, red-500, etc.)
- **Icons**: Imported from `lucide-react` (e.g., `import { AlertCircle } from 'lucide-react'`)

---

## Current Known Limitations & TODOs

| Item | Status | Impact | Resolution |
|------|--------|--------|-----------|
| **Supabase Integration** | 🔶 Stub | Bed data doesn't persist; all mock | Uncomment DB queries in `fetchHospitals()`, add `.env.local` creds |
| **Maps Integration** | 🔶 Stub | MapSection is empty placeholder | Replace with Google Maps API in MapSection.tsx |
| **Hospital Portal** | 🔶 Stub | Admin Tab shows nothing; no auth | Implement Admin UI + authentication |
| **Real-time Sync** | ⚠️ Local only | 30-sec updates are client-side simulation | Integrate Supabase Real-time subscriptions for actual server sync |
| **Error Recovery** | 🟡 Basic | Limited error UI, no retries | Add retry logic + error boundaries |
| **State Scaling** | ℹ️ Design | All state in App.tsx; works for MVP | Future: migrate to Context API or Redux if needed |

---

## Environment Variables

### For Supabase Integration
Create `.env.local` in workspace root (git-ignored):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note**: Currently unused; enabling requires uncommenting DB queries in `src/App.tsx` fetchHospitals().

---

## TypeScript & Linting

### Strict Mode Enabled
```jsonc
// tsconfig.app.json
{
  "target": "ES2020",
  "lib": ["ES2020", "DOM", "DOM.Iterable"],
  "jsx": "react-jsx",
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

### ESLint Rules
- React hooks exhaustive deps
- React Refresh boundaries
- No unused imports allowed
- Prefer const over let

**Before committing**: Run `npm run typecheck` to catch type errors.

---

## Common Development Tasks

### Add a New Hospital
1. Edit `src/data/mockHospitals.ts` → add to `NANDED_HOSPITALS` array
2. Follow Hospital + BedAvailability structure from `src/lib/supabase.ts`
3. Ensure all fields populated (id, coordinates, phone, beds)

### Add a New Bed Type Filter
1. Update `BedType` union in `src/lib/supabase.ts`
2. Add color mapping in relevant component (e.g., SearchFilters.tsx)
3. Ensure mock data includes bed entries for new type
4. Test filtering in Find tab

### Enable Real Supabase
1. Create `.env.local` with Supabase creds
2. In `src/App.tsx` `fetchHospitals()`: 
   - Uncomment DB query
   - Comment out mock data fallback
3. Run `npm run typecheck` to validate
4. Test in `npm run dev`

### Integrate Google Maps
1. Add Google Maps API key to `.env.local`
2. Replace MapSection.tsx stub with gmaps library
3. Add location markers for hospitals
4. Bind to hospital coordinates (latitude, longitude fields)

### Deploy Changes
1. Validate: `npm run lint && npm run typecheck && npm run build`
2. Check `/dist` folder generated successfully
3. Deploy dist/ folder to hosting (Vercel, Netlify, etc.)

---

## Testing & Debugging

### Component Debugging
- Use React DevTools browser extension to inspect component props/state
- Check Network tab for any API/Supabase calls (currently none)
- Console.log during effects is safe but remove before commit

### Real-time Updates
- Currently simulated every 30 seconds in App.tsx effect
- Bed counts change randomly; ICU has special alert logic
- Watch Network tab for future Supabase Real-time subscriptions

### Performance Notes
- Hospital list re-renders on every filter change (acceptable for <500 hospitals)
- No virtual scrolling yet (add if hospital list grows >1000)
- Lucide icons are tree-shakeable; no bundle bloat from unused icons

---

## Code Review Checklist

Before submitting changes:
- [ ] All components are functional + use hooks (no class components)
- [ ] Props destructured with TypeScript types
- [ ] No unused imports or variables (ESLint catches these)
- [ ] Tailwind classes follow mobile-first pattern (`base → md: → lg:`)
- [ ] TypeScript strict mode passes (`npm run typecheck`)
- [ ] No console.log/debugger left in code
- [ ] New components exported from `src/components/` and used in App

---

## Quick Reference: File Locations

```
src/
  App.tsx ....................... Main state hub + filter logic
  main.tsx ....................... React DOM render entry
  index.css ....................... Global styles + Tailwind imports
  components/
    HospitalCard.tsx ............ Hospital display + booking trigger
    BookingModal.tsx ............ Patient form modal
    EmergencyView.tsx ........... Emergency Tab content
    SearchFilters.tsx ........... Filter controls
    StatsDashboard.tsx .......... Stats display
    MapSection.tsx .............. Map placeholder (stub)
    HospitalPortal.tsx .......... Admin Tab (stub)
    Header.tsx .................. Logo + title
    Navigation.tsx .............. Tab switcher
    AlertBanner.tsx ............. Critical alert display
  lib/
    supabase.ts .................. TypeScript types + Supabase client init
  data/
    mockHospitals.ts ............ Mock hospital data

Project root:
  vite.config.ts ................. Vite build config (React plugin enabled)
  tsconfig.app.json .............. TypeScript strict config
  tailwind.config.js ............. Tailwind CSS theme
  postcss.config.js .............. AutoPrefixer + CSS processing
  eslint.config.js ............... ESLint rules
  package.json ................... Dependencies + scripts
```

---

## Performance & Best Practices

### Rendering Optimization
- Filtering recalculates on search/bedType change—acceptable for MVP
- Consider `useMemo` for expensive computations if hospital list grows >500
- No Context API overhead currently; single App.tsx re-render is fine

### Tailwind CSS
- All styles are utility-first; no custom CSS files
- Responsive classes: `base → md:tablet → lg:desktop`
- Reuse badge/status color patterns across components

### Type Safety
- Always define component prop types first (enhances IDE autocomplete)
- Avoid `any` type; use discriminated unions (e.g., status union types)
- Run `npm run typecheck` before commits

---

## Resources & Links

- [Vite Docs](https://vitejs.dev/) — Build tool reference
- [React 18 Docs](https://react.dev/) — Component patterns
- [TypeScript Docs](https://www.typescriptlang.org/) — Type definitions
- [Tailwind CSS Docs](https://tailwindcss.com/) — Styling utilities
- [Lucide Icons](https://lucide.dev/) — Icon library reference
- [Supabase Docs](https://supabase.com/docs) — Database integration (when ready)

---

## Getting Help

For issues with:
- **Component rendering** → Check HospitalCard.tsx pattern for structure
- **State updates** → Review App.tsx useEffect dependencies
- **TypeScript errors** → Run `npm run typecheck` for detailed errors
- **Styling** → Check Tailwind docs or similar component for pattern
- **Build failures** → Ensure `.env.local` is correct and dependencies installed

