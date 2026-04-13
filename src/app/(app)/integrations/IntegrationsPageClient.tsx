"use client";

import { useState } from "react";
import Link from "next/link";
import AwsS3Form from "./_components/AwsS3Form";
import GoogleSheetsForm from "./_components/GoogleSheetsForm";
import SyncHistoryTable from "./_components/SyncHistoryTable";
import SaveBar from "./_components/SaveBar";

export default function IntegrationsPageClient() {
  const [showSaveBar, setShowSaveBar] = useState(true);

  return (
    <main className="ml-0 md:ml-64 flex-1 min-h-screen pt-[57px] pb-20 md:pb-12 px-6 md:px-8">
      <div className="max-w-6xl mx-auto py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 mb-4 text-[10px] font-bold tracking-widest uppercase text-[#64748B]"
        >
          <Link
            href="/dashboard"
            className="hover:text-[#2563EB] transition-colors duration-150 cursor-pointer"
          >
            Configuration
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#2563EB]">Integration &amp; API Settings</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#1E293B] tracking-tight mb-2">
            Integration &amp; API Settings
          </h1>
          <p className="text-[#64748B] max-w-2xl text-sm leading-relaxed">
            Manage your cloud storage infrastructure and third-party synchronization tools.
            Changes to these settings may affect active upload pipelines.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <AwsS3Form />
          <GoogleSheetsForm />
          <SyncHistoryTable />
        </div>

        {/* Save Bar */}
        {showSaveBar && (
          <SaveBar
            onSave={() => setShowSaveBar(false)}
            onDiscard={() => setShowSaveBar(false)}
          />
        )}
      </div>
    </main>
  );
}
