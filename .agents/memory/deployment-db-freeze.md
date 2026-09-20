---
name: Production database freeze
description: How to interpret an empty public directory when the local preview has data.
---

The published app can receive a database error when its Replit production database is frozen or disabled, even while the development database works normally. The Database pane can unpause it; after unpausing, republish or restart so startup seeding and database-backed features resume.

**Why:** A failed production data request was previously rendered by the Browse page as a misleading empty state, making the issue look like missing content.

**How to apply:** Check production database status before changing filters or seed data. Keep public read-only directory behavior resilient, but treat the database state as the real fix for persistence, auth, reviews, and saved spots.