## Day 1 — 2026-05-08
**Hours worked:** 0.5
**What I did:** Initialized Next.js project with TypeScript and Tailwind. Created the mandatory repository structure and engineering documentation files.
**What I learned:** Reviewing Credex's specific requirements for AI-assisted evaluations.
## Day 2 — 2026-05-09
**Hours worked:** 2
**What I did:** Implemented the math logic for audit savings and built the frontend list to display tool breakdowns.
**What I learned:** How to manage dynamic form state in React for multiple inputs.
## Day 3 — 2026-05-10
**Hours worked:** 3
**What I did:** Refined the UI to match high-fidelity wireframes, implemented the "AI Stack Builder" logic to handle multiple tools, and fixed responsive layout bugs.
**What I learned:** Handling React hydration issues with LocalStorage in Next.js.
## Day 4 — 2026-05-11
**Hours worked:** 3
**What I did:** * Successfully integrated Supabase for lead capture and database management.

Fixed critical Environment Variable pathing issues and resolved "Invalid API Key" errors.

Implemented the lead generation UI to capture user emails and store audit results.

Added mandatory documentation files: ECONOMICS.md and GTM.md for project evaluation.
**What I learned:** How to configure Row Level Security (RLS) policies in Supabase for public inserts.

Managing deployment-specific environment variables in Netlify.

## Day 5 — 2026-05-12
**Hours worked:** 4
**What I did:**
Finalized the Production Build and resolved Netlify deployment environment variable synchronization.

Implemented LinkedIn Social Sharing logic to enable users to share their audit results directly.

Fixed the Multiple Tool Stack logic to allow users to add and manage multiple AI subscriptions in a single session.

Completed all mandatory assessment documentation: README.md, PRICING_DATA.md, and PROMPTS.md.

Conducted a final End-to-End test of the lead capture flow from the live URL to the Supabase backend.

What I learned:

The importance of Production vs Local context when handling environment variables in Next.js.

How to use URL Encoding for creating seamless social media sharing intents.

Refined my understanding of React State Batching when updating arrays and resetting form inputs simultaneously.
## Day 6 — 2026-05-13
Hours worked: 5
What I did:

Major UI Overhaul: Switched to a high-fidelity "Selection-first" flow inspired by modern SaaS onboarding.

Dynamic Tool Configuration: Implemented a state-driven logic where users first select AI tools from a grid, and then configure seats/plans for only the selected tools.

Custom Plan Logic: Added dropdowns for users to select their specific subscription tier (Pro, Team, Enterprise) instead of using hardcoded defaults.

Branding: Integrated Credex branding throughout the application for a professional internship-ready look.

Distribution Features: Finalized the LinkedIn social sharing intent and implemented a system-print based Download PDF feature.

Lead Capture Sync: Ensured the "Calculate Savings" trigger successfully validates the work email and pushes the full tool-stack data to Supabase.

What I learned:

How to manage complex nested states in React when handling multiple dynamic form inputs.

Improving User Experience (UX) by reducing cognitive load—showing users only what they need to see at each step.

Leveraging window.print() with CSS media queries (print:) to create high-quality PDF exports without external library overhead.