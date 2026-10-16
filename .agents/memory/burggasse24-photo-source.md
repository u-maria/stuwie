---
name: Burggasse24 photo source
description: Avoid the legacy image host that browsers reject for the Burggasse24 spot.
---

The legacy Burggasse24 image URL points to a host whose TLS certificate does not match the requested hostname, so browsers reject the photo.

**Why:** The user reported the photo was blank across the site, and the host failed browser and command-line TLS validation.

**How to apply:** Keep the image-load fallback and use a valid HTTPS source for future Burggasse24 photo updates. Do not restore the legacy host.
