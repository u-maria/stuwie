---
name: Public prototype authentication scope
description: Product scope for authentication and user-specific features in the deployed study-spots prototype.
---

The deployed study-spots app is a public prototype. Registration and login are mockup-only functionality and are not needed in production. Keep saved spots, write reviews, check-ins, and other user-specific actions disabled when they require accounts.

**Why:** The user specified that registration and login are only for prototype/mockup functionality, not the deployed version.

**How to apply:** Keep public spot browsing, map, and read-only content available without an authentication provider. Continue using `SUPABASE_DATABASE_URL` for PostgreSQL; do not add an auth system to restore user-specific actions.
