# Architecture
- **Frontend:** Next.js (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** Supabase (planned)
- **AI:** Anthropic Claude API for audit summaries.
### Data Flow Diagram
```mermaid
graph TD
    A[Frontend: Next.js Form] -->|Tool Data| B[lib/auditEngine.ts]
    B -->|Calculation| C[State Management]
    C -->|Persist| D[LocalStorage]
    C -->|Display| E[UI Results Card]
    E -->|Trigger| F[Lead Capture Form]
    F -->|Store| G[Database/Supabase]
```