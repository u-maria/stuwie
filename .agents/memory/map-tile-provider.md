---
name: Map tile provider
description: Public tile source used by the Vienna map and why it should remain keyless.
---

The map should use OpenStreetMap tiles with the required attribution. The previously used CARTO Voyager endpoint can start returning an “API KEY REQUIRED” watermark without any application code change.

**Why:** The public map displayed provider watermarks even though markers and spot data were working.

**How to apply:** Prefer the keyless OpenStreetMap tile URL for this app unless a managed tile provider and its secret/configuration are intentionally added.