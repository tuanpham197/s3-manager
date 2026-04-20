import type { Video, VideoStatus } from "./video";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface User {
  id: string;
  email: string;
}

export interface SessionResponse {
  user: User;
}

export interface LoginResponse {
  user: User;
  sessionToken: string;
}

export interface VideoListResponse extends PaginatedResponse<Video> {}

export interface VideoListParams {
  status?: VideoStatus;
  page?: number;
  limit?: number;
  sort?: "date" | "name" | "size";
  order?: "asc" | "desc";
}

export interface UploadPresignRequest {
  filename: string;
  content_type: string;
  size: number;
}

export interface UploadPresignResponse {
  upload_url: string;
  s3_key: string;
  s3_bucket: string;
  expires_at: string;
}

export interface UploadCompleteRequest {
  s3_key: string;
  s3_bucket: string;
  filename: string;
  size: number;
  duration_seconds: number;
}

export interface UploadCompleteResponse {
  video: Pick<Video, "id" | "name" | "s3_link" | "status">;
  sheets_row: number;
}

export interface S3Config {
  bucket: string;
  region: string;
  access_key_id: string;
  prefix: string;
}

export interface S3ConfigRequest extends S3Config {
  secret_access_key: string;
}

export interface SheetsConfig {
  spreadsheet_id: string;
  sheet_name: string;
  connected: boolean;
  service_account_email: string;
}

export interface SheetsConfigRequest {
  spreadsheet_id: string;
  sheet_name: string;
  service_account_key: Record<string, unknown>;
}

export interface SyncEntry {
  id: string;
  started_at: string;
  completed_at: string;
  status: "success" | "running" | "failed";
  videos_added: number;
  videos_failed: number;
}

export interface SyncTriggerResponse {
  sync_id: string;
  started_at: string;
  status: "running";
}

export interface SyncHistoryResponse extends PaginatedResponse<SyncEntry> {}
