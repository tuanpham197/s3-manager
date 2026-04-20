# S3 Video Manager — API Design

> **Stack:** Go (backend) · Next.js 16.2.3 / React 19 (frontend)
> The Go server is a separate process. The Next.js frontend calls it via `fetch`.

---

## Overview

The backend is a standalone Go HTTP server. All endpoints are prefixed `/api`.

Base URL (development): `http://localhost:8080`
Frontend proxy (optional): Next.js can proxy `/api/*` → `http://localhost:8080` via `next.config.ts` rewrites.

---

## Route Map

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/logout` | Invalidate session |
| GET | `/api/auth/session` | Return current session |
| GET | `/api/videos` | List videos (paginated, filterable) |
| POST | `/api/videos` | Create video record |
| GET | `/api/videos/{id}` | Get single video |
| PATCH | `/api/videos/{id}` | Update video metadata |
| DELETE | `/api/videos/{id}` | Delete video record |
| POST | `/api/upload/presign` | Get S3 presigned PUT URL |
| POST | `/api/upload/complete` | Mark upload complete, write to Sheets |
| GET | `/api/integrations/s3` | Get saved S3 config |
| PUT | `/api/integrations/s3` | Save S3 config |
| GET | `/api/integrations/sheets` | Get saved Sheets config |
| PUT | `/api/integrations/sheets` | Save Sheets config |
| POST | `/api/sync` | Trigger manual S3→Sheets sync |
| GET | `/api/sync/history` | List sync history entries |

---

## Auth

### `POST /api/auth/login`

**Request**
```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

**Response 200**
```json
{
  "user": { "id": "u_01", "email": "user@example.com" },
  "sessionToken": "<jwt>"
}
```

**Response 401**
```json
{ "error": "Invalid credentials" }
```

---

### `POST /api/auth/logout`

Requires `Authorization: Bearer <token>` header.

**Response 204** — no body

---

### `GET /api/auth/session`

Requires `Authorization: Bearer <token>` header.

**Response 200**
```json
{
  "user": { "id": "u_01", "email": "user@example.com" }
}
```

**Response 401**
```json
{ "error": "Unauthenticated" }
```

---

## Videos

### `GET /api/videos`

Query params:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | `published \| uploading \| failed` | — | Filter by status |
| `page` | int | `1` | Page number |
| `limit` | int | `20` | Items per page |
| `sort` | `date \| name \| size` | `date` | Sort field |
| `order` | `asc \| desc` | `desc` | Sort direction |

**Response 200**
```json
{
  "data": [
    {
      "id": "v_01",
      "name": "marketing_hero_v1.mp4",
      "size": "1.2 GB",
      "duration": "3:42",
      "s3_link": "s3://prod-cdn/uploads/marketing_hero_v1.mp4",
      "status": "published",
      "date": "2026-04-10",
      "time": "14:22",
      "thumbnail": "https://cdn.example.com/thumbs/v_01.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1284
  }
}
```

---

### `POST /api/videos`

Creates a video record (typically called internally by `/api/upload/complete`).

**Request**
```json
{
  "name": "intro_v2.mov",
  "size": "540 MB",
  "duration": "1:15",
  "s3_key": "uploads/intro_v2.mov",
  "s3_bucket": "prod-cdn",
  "thumbnail": "https://cdn.example.com/thumbs/v_02.jpg"
}
```

**Response 201**
```json
{
  "id": "v_02",
  "name": "intro_v2.mov",
  "size": "540 MB",
  "duration": "1:15",
  "s3_link": "s3://prod-cdn/uploads/intro_v2.mov",
  "status": "published",
  "date": "2026-04-13",
  "time": "09:01",
  "thumbnail": "https://cdn.example.com/thumbs/v_02.jpg"
}
```

---

### `GET /api/videos/{id}`

**Response 200** — same shape as single item in list above

**Response 404**
```json
{ "error": "Video not found" }
```

---

### `PATCH /api/videos/{id}`

All fields optional (partial update).

**Request**
```json
{
  "name": "intro_final.mov",
  "status": "published"
}
```

**Response 200** — updated video object

---

### `DELETE /api/videos/{id}`

Removes the DB record. Does **not** delete from S3 (caller responsibility).

**Response 204** — no body

**Response 404**
```json
{ "error": "Video not found" }
```

---

## Upload

### `POST /api/upload/presign`

Returns a short-lived S3 presigned PUT URL so the browser uploads directly
to S3 without routing bytes through the Go server.

**Request**
```json
{
  "filename": "hero_final.mp4",
  "content_type": "video/mp4",
  "size": 1258291200
}
```

**Response 200**
```json
{
  "upload_url": "https://prod-cdn.s3.amazonaws.com/uploads/hero_final.mp4?...",
  "s3_key": "uploads/hero_final.mp4",
  "s3_bucket": "prod-cdn",
  "expires_at": "2026-04-13T09:15:00Z"
}
```

**Response 400**
```json
{ "error": "content_type must be a video/* MIME type" }
```

---

### `POST /api/upload/complete`

Called by the client after the browser PUT to S3 succeeds. Creates the video
record and appends a row to Google Sheets.

**Request**
```json
{
  "s3_key": "uploads/hero_final.mp4",
  "s3_bucket": "prod-cdn",
  "filename": "hero_final.mp4",
  "size": 1258291200,
  "duration_seconds": 222
}
```

**Response 201**
```json
{
  "video": {
    "id": "v_03",
    "name": "hero_final.mp4",
    "s3_link": "s3://prod-cdn/uploads/hero_final.mp4",
    "status": "published"
  },
  "sheets_row": 42
}
```

---

## Integrations

### `GET /api/integrations/s3`

**Response 200**
```json
{
  "bucket": "prod-cdn",
  "region": "us-east-1",
  "access_key_id": "AKIA••••••••REDACTED",
  "prefix": "uploads/"
}
```

> `secret_access_key` is never returned. The masked `access_key_id` is for display only.

---

### `PUT /api/integrations/s3`

**Request**
```json
{
  "bucket": "prod-cdn",
  "region": "us-east-1",
  "access_key_id": "AKIAIOSFODNN7EXAMPLE",
  "secret_access_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "prefix": "uploads/"
}
```

**Response 200**
```json
{ "ok": true }
```

**Response 422**
```json
{ "error": "Invalid AWS credentials or bucket unreachable" }
```

---

### `GET /api/integrations/sheets`

**Response 200**
```json
{
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  "sheet_name": "Videos",
  "connected": true,
  "service_account_email": "s3-sync@project.iam.gserviceaccount.com"
}
```

---

### `PUT /api/integrations/sheets`

**Request**
```json
{
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  "sheet_name": "Videos",
  "service_account_key": { "...": "google service account JSON key object" }
}
```

**Response 200**
```json
{ "ok": true, "service_account_email": "s3-sync@project.iam.gserviceaccount.com" }
```

---

## Sync

### `POST /api/sync`

Triggers a full S3 bucket scan and reconciles with Google Sheets.
Responds immediately; sync runs in a background goroutine.

**Response 202**
```json
{
  "sync_id": "sync_07",
  "started_at": "2026-04-13T09:00:00Z",
  "status": "running"
}
```

---

### `GET /api/sync/history`

Query params: `limit` (default `20`), `page` (default `1`)

**Response 200**
```json
{
  "data": [
    {
      "id": "sync_07",
      "started_at": "2026-04-13T09:00:00Z",
      "completed_at": "2026-04-13T09:00:42Z",
      "status": "success",
      "videos_added": 3,
      "videos_failed": 0
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 14 }
}
```

---

## Common Error Shape

```json
{ "error": "<human-readable message>" }
```

Standard HTTP status codes:
- `400` Bad Request — validation failure
- `401` Unauthenticated
- `403` Forbidden
- `404` Not Found
- `422` Unprocessable Entity — business logic failure
- `500` Internal Server Error

---

## Suggested Go Project Structure

```
backend/
├── main.go
├── go.mod
├── go.sum
├── internal/
│   ├── handler/
│   │   ├── auth.go          # login, logout, session
│   │   ├── videos.go        # CRUD
│   │   ├── upload.go        # presign, complete
│   │   ├── integrations.go  # s3 config, sheets config
│   │   └── sync.go          # trigger, history
│   ├── middleware/
│   │   └── auth.go          # JWT validation, request logging, CORS
│   ├── service/
│   │   ├── s3.go            # presign URL, AWS SDK calls
│   │   ├── sheets.go        # Google Sheets append
│   │   └── sync.go          # background sync logic
│   ├── store/
│   │   └── store.go         # DB interface (videos, sync history, config)
│   └── model/
│       └── model.go         # Video, SyncEntry, S3Config, SheetsConfig structs
└── config/
    └── config.go            # env-based config (port, DB DSN, JWT secret)
```

---

## Implementation Notes

1. **Router** — use `net/http` with `http.ServeMux` (Go 1.22+ supports `{id}` path params natively) or a lightweight library like `chi`.

2. **JSON field names** — all JSON keys use `snake_case` to match Go struct tag convention (`json:"s3_link"`).

3. **S3 uploads** — frontend calls `/api/upload/presign` → PUT directly to S3 → calls `/api/upload/complete`. Video bytes never pass through the Go server.

4. **Background sync** — `POST /api/sync` launches a goroutine; progress/result is persisted to the store and readable via `GET /api/sync/history`.

5. **Secrets** — `secret_access_key` and Google service account keys are stored server-side only (env vars or encrypted DB column) and never serialised in responses.

6. **Auth middleware** — wrap all routes except `POST /api/auth/login` with a middleware that validates the JWT from the `Authorization: Bearer <token>` header.

7. **CORS** — add a CORS middleware that allows the Next.js origin (`http://localhost:3000` in dev) so the browser can call the Go server directly.
