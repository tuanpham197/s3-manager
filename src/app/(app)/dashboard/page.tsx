import MetricCard from "@/components/dashboard/MetricCard";
import VideoTable from "@/components/dashboard/VideoTable";

export default function DashboardPage() {
  return (
    <main className="ml-64 flex-1 p-8 min-h-screen">
      {/* Summary */}
      <section className="mb-12">
        <h1 className="text-3xl font-extrabold text-[#1E293B] mb-8 tracking-tight">
          Architecture Overview
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Videos"
            value="1,284"
            badge="12%"
            badgePositive
            footer="Managed across 4 regions"
          />
          <MetricCard
            title="Storage Used"
            value="4.2"
            unit="TB"
            progress={65}
            progressLabel="65% of S3 Standard quota"
          />
          <MetricCard
            title="Last Sync"
            value="4 mins ago"
            syncImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDiDyGxAoKiQ0GRDVlLfpZWZn-GVr-ZhJ90dO4zLRVWxLJ7LxlFK06IXsxQoW9p_r0BFR1drTIZcsO3jSmr44D2PkkUozdbV6M6yxz8hnGX-NygOSNAe0wn2qnTmGFDFyMJNMICmIYBx0YNJ5-GFi8dj3QkW_S3DEL4Agtistlih2f6m_m8s-1Ni9w6TtzAX0iCOJ8q3VRdqrpLMO72vxQEBAc-pPw9TsakyPt00lVOQAXPuIdrBQkz8BaGEFsjoOiN9IJwib1_4Lg"
            syncStatus="Google Sheets Connected"
            footer="Asset index fully synced"
          />
        </div>
      </section>

      {/* Video Library */}
      <VideoTable />
    </main>
  );
}
