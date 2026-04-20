export type VideoStatus = "published" | "uploading" | "failed";

export interface Video {
  id: string;
  name: string;
  size: string;
  duration: string;
  s3_link: string;
  status: VideoStatus;
  uploadProgress?: number;
  date: string;
  time: string;
  thumbnail: string;
}

export const STATUS_LABELS: Record<VideoStatus, string> = {
  published: "Published",
  uploading: "Uploading",
  failed: "Failed",
};
