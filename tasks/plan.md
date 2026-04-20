# API Integration Plan

> Source of truth: `API_DESIGN.md`
> Codebase snapshot: 2026-04-20

---

## Current State

| Screen | Route | Mock data? | API-connected? |
|--------|-------|-----------|---------------|
| Dashboard | `/dashboard` | Yes | No |
| Upload | `/upload` | Yes | No |
| Integrations | `/integrations` | Yes | No |
| Login | `/login` | No | No |

**Missing screens** (noted in `tasks/missing-screens.md`):
- `All Videos` — sidebar link exists but no route/page
- `Sync Status` — no dedicated real-time sync page

---

## Dependency Graph

```
Auth context / session (Phase 0)
  └── All protected routes depend on this

API client (Phase 0)
  └── All fetch calls depend on this

Phase 1 — Auth
  └── LoginForm → POST /api/auth/login
  └── App layout → GET /api/auth/session (guard)
  └── Navbar → POST /api/auth/logout

Phase 2 — Videos (Dashboard)
  └── VideoTable → GET /api/videos
  └── VideoRow delete → DELETE /api/videos/{id}
  └── VideoRow edit → PATCH /api/videos/{id}
  └── MetricCard totals derived from pagination.total

Phase 3 — Upload flow
  └── DropZone → POST /api/upload/presign
  └── Browser PUT → S3 presigned URL (XMLHttpRequest for progress)
  └── On PUT success → POST /api/upload/complete

Phase 4 — Integrations
  └── AwsS3Form → GET /api/integrations/s3 (load) + PUT (save)
  └── GoogleSheetsForm → GET /api/integrations/sheets (load) + PUT (save)
  └── SyncHistoryTable → GET /api/sync/history
  └── "Sync Now" trigger → POST /api/sync
```

---

## Phase 0 — Foundation
**Goal:** shared API client, types, auth context. No screen-visible changes.

### Task 0-A: API client + proxy
- Create `src/lib/api.ts` — thin `fetch` wrapper:
  - Reads `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8080`)
  - Attaches `Authorization: Bearer <token>` from session storage/cookie
  - Returns typed responses; throws on non-2xx
- Add `/api` → `http://localhost:8080` rewrite in `next.config.ts`
- **Acceptance:** `api.get('/api/auth/session')` callable from any component

### Task 0-B: Extend types
- Update `src/types/video.ts` — rename fields to match API snake_case (`s3_link`, not `s3Link`)
- Add `src/types/api.ts` — `PaginatedResponse<T>`, `SyncEntry`, `S3Config`, `SheetsConfig`, `UploadPresignResponse`
- **Acceptance:** All existing components import from types without errors (`tsc --noEmit`)

### Task 0-C: Auth context
- Create `src/context/AuthContext.tsx`:
  - Stores `{ user, sessionToken }` in React context + localStorage
  - Exposes `login()`, `logout()`, `user`
- Wrap `(app)/layout.tsx` and `(auth)/layout.tsx` with `<AuthProvider>`
- **Acceptance:** `useAuth()` hook returns user from any child component

---

## Phase 1 — Auth
**Goal:** real login/logout/session guard.

### Task 1-A: Login
- Wire `LoginForm.tsx` to call `POST /api/auth/login`
- On 200: store `sessionToken` via `AuthContext.login()`, redirect to `/dashboard`
- On 401: show inline error "Invalid credentials"
- **Acceptance:** valid credentials → dashboard; invalid → error message visible

### Task 1-B: Session guard
- In `(app)/layout.tsx`: call `GET /api/auth/session` on mount
- If 401 → redirect to `/login`
- Show loading spinner while checking
- **Acceptance:** direct navigation to `/dashboard` without token → redirects to `/login`

### Task 1-C: Logout
- Add logout handler in `Navbar.tsx` (user avatar dropdown or settings icon)
- Calls `POST /api/auth/logout`, then `AuthContext.logout()`, then pushes `/login`
- **Acceptance:** clicking logout clears session and lands on login page

---

## Phase 2 — Videos (Dashboard)
**Goal:** real paginated video list with delete/edit.

### Task 2-A: VideoTable data fetch
- Convert `VideoTable.tsx` to accept `videos`, `pagination`, `isLoading` props
- In `dashboard/page.tsx` (make it a client component or add a server fetch): call `GET /api/videos?page=1&limit=20`
- Pass data down; replace `MOCK_VIDEOS`
- **Acceptance:** table shows real rows; pagination controls change `page` param and re-fetch

### Task 2-B: Status filter
- Wiring existing status dropdown → appends `?status=` query param to fetch
- **Acceptance:** selecting "Published" shows only published videos

### Task 2-C: Delete video
- `VideoRow.tsx` delete button → calls `DELETE /api/videos/{id}`
- On 204: remove row from list optimistically
- On 404: show toast "Video not found"
- **Acceptance:** delete removes row without full page reload

### Task 2-D: Edit video (inline or modal)
- Edit button → `PATCH /api/videos/{id}` with updated `name`/`status`
- **Acceptance:** saving edit updates the row in-place

### Checkpoint 2: All video CRUD working against real API before moving to upload.

---

## Phase 3 — Upload
**Goal:** real S3 presigned upload with progress.

### Task 3-A: Presign + direct-to-S3 upload
- In `UploadPageClient.tsx`, replace mock flow:
  1. On file drop → `POST /api/upload/presign` with `{filename, content_type, size}`
  2. Use `XMLHttpRequest` (not fetch) to PUT file to `upload_url`, track `progress` events
  3. Update `UploadProgressItem` with real % progress
- **Acceptance:** real file uploads to S3; progress bar reflects actual transfer

### Task 3-B: Upload complete
- After XHR success → `POST /api/upload/complete` with `{s3_key, s3_bucket, filename, size, duration_seconds}`
- On 201: set item state to `success`, show S3 link
- On error: set item state to `error`
- **Acceptance:** upload complete creates video record; S3 link shown in progress item

### Checkpoint 3: End-to-end upload working before integrations.

---

## Phase 4 — Integrations
**Goal:** real config load/save + sync.

### Task 4-A: AWS S3 form
- In `AwsS3Form.tsx` on mount: `GET /api/integrations/s3` → pre-fill `bucket`, `region`, `access_key_id`, `prefix`
- `secret_access_key` field remains blank (never returned by API)
- "Save Changes" button → `PUT /api/integrations/s3`; on 422 show validation error
- **Acceptance:** form loads saved config; saving calls PUT; 422 shows error inline

### Task 4-B: Google Sheets form
- In `GoogleSheetsForm.tsx` on mount: `GET /api/integrations/sheets` → pre-fill `spreadsheet_id`, `sheet_name`, `connected`, `service_account_email`
- "Save Changes" → `PUT /api/integrations/sheets` with service account JSON
- **Acceptance:** form loads config; save succeeds or shows error

### Task 4-C: Sync history
- `SyncHistoryTable.tsx` on mount: `GET /api/sync/history?limit=20`
- Replace `INITIAL_LOGS` mock
- "Sync Now" button (add to integrations page header) → `POST /api/sync` → poll or show "Sync started" toast
- **Acceptance:** table shows real sync history; "Sync Now" triggers a sync and new entry appears on next fetch

---

## Phase ordering

```
0-A → 0-B → 0-C   (parallel after 0-A)
  → 1-A, 1-B, 1-C  (parallel)
    → 2-A → 2-B, 2-C, 2-D  (parallel after 2-A)
      [Checkpoint 2]
      → 3-A → 3-B
        [Checkpoint 3]
        → 4-A, 4-B, 4-C  (parallel)
```

---

## Out of scope (this plan)

- Building missing screens (tracked in `tasks/missing-screens.md`)
- Go backend implementation
- Google OAuth flow for Sheets
- Real-time sync progress via WebSocket/SSE
