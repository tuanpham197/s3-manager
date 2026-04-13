import IntegrationsPageClient from "./IntegrationsPageClient";

export const metadata = {
  title: "Integration & API Settings | S3 Video Manager",
  description: "Configure AWS S3 and Google Sheets integrations",
};

export default function IntegrationsPage() {
  return <IntegrationsPageClient />;
}
