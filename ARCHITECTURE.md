# Project Architecture - Credex Audit

### Tech Stack
* **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS.
* **Animations**: Framer Motion for interactive tool selection and results.
* **Backend/Database**: Supabase (PostgreSQL) for lead management and data persistence.
* **Deployment**: Vercel.

### Data Flow
1. **Selection Layer**: Users select AI tools from a curated grid.
2. **Configuration Layer**: Tool-specific data (Seats, Cost per Seat) is captured in a centralized state.
3. **Logic Layer**: The Audit Engine calculates annual leakage using the formula: `(Seats * Cost_per_Seat) * 12`.
4. **Persistence Layer**: On audit execution, user email and calculated data are pushed to Supabase.