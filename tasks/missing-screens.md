# Missing Screens — Build Later

Screens referenced in navigation or API design that do not yet have a corresponding page.

---

## 1. All Videos — `/videos`

**Why needed:** Sidebar has a nav item "All Videos" with no route. Dashboard only shows a table widget; a dedicated page should support full-screen pagination, bulk actions, and search.

**API endpoints:**
- `GET /api/videos` (with all query params: status, page, limit, sort, order)
- `DELETE /api/videos/{id}`
- `PATCH /api/videos/{id}`

**Suggested components to reuse:** `VideoTable`, `VideoRow`

**Extras to build:**
- Search bar (needs a `search` query param added to API design)
- Bulk select + bulk delete
- Sort column headers

---

## 2. Single Video Detail — `/videos/{id}`

**Why needed:** `VideoRow` has a "View" action button with no target route.

**API endpoints:**
- `GET /api/videos/{id}`
- `PATCH /api/videos/{id}`
- `DELETE /api/videos/{id}`

**Suggested layout:** video metadata card + S3 link + status timeline

---

## 3. Sync Status / Real-time Progress — `/integrations/sync`

**Why needed:** `POST /api/sync` returns a `sync_id` and runs in background. There is no screen to watch a running sync.

**API endpoints:**
- `POST /api/sync`
- `GET /api/sync/history`

**Extras to build:**
- Polling loop on `sync_id` status (or SSE if backend adds it)
- Progress indicator per video scanned

---

## 4. Settings / Profile

**Why needed:** Navbar has a settings icon; no `/settings` route exists.

**API endpoints:** None defined yet — needs API design update.

**Suggested content:** user profile, password change, notification preferences.
