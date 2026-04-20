# Task List — API Integration

> See `tasks/plan.md` for full context and acceptance criteria.

## Phase 0 — Foundation

- [x] **0-A** Create `src/lib/api.ts` fetch wrapper + `next.config.ts` proxy rewrite
- [x] **0-B** Extend types: update `src/types/video.ts`, add `src/types/api.ts`
- [x] **0-C** Create `src/context/AuthContext.tsx` + wrap layouts

## Phase 1 — Auth

- [x] **1-A** Wire `LoginForm.tsx` → `POST /api/auth/login`
- [x] **1-B** Session guard in `(app)/layout.tsx` → `GET /api/auth/session`
- [x] **1-C** Logout in `Navbar.tsx` → `POST /api/auth/logout`

## Phase 2 — Videos

- [x] **2-A** `VideoTable.tsx` + dashboard page → `GET /api/videos` (paginated)
- [x] **2-B** Status filter → `?status=` query param
- [x] **2-C** Delete button → `DELETE /api/videos/{id}`
- [x] **2-D** Edit button → `PATCH /api/videos/{id}`
- [ ] **[CHECKPOINT 2]** All video CRUD verified against real API

## Phase 3 — Upload

- [x] **3-A** Presign + XHR upload → `POST /api/upload/presign` → PUT to S3
- [x] **3-B** Upload complete → `POST /api/upload/complete`
- [ ] **[CHECKPOINT 3]** End-to-end upload verified

## Phase 4 — Integrations

- [x] **4-A** `AwsS3Form.tsx` → `GET /api/integrations/s3` + `PUT /api/integrations/s3`
- [x] **4-B** `GoogleSheetsForm.tsx` → `GET /api/integrations/sheets` + `PUT /api/integrations/sheets`
- [x] **4-C** `SyncHistoryTable.tsx` → `GET /api/sync/history` + `POST /api/sync`
