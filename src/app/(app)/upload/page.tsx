import UploadPageClient from "./UploadPageClient";

export const metadata = {
  title: "Upload Video | S3 Video Manager",
  description: "Upload video files to Amazon S3",
};

export default function UploadPage() {
  return <UploadPageClient />;
}
