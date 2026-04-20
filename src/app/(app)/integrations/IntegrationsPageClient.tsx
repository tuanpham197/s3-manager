"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import AwsS3Form from "./_components/AwsS3Form";
import GoogleSheetsForm from "./_components/GoogleSheetsForm";
import SyncHistoryTable from "./_components/SyncHistoryTable";
import SaveBar from "./_components/SaveBar";

export default function IntegrationsPageClient() {
  const [s3Dirty, setS3Dirty] = useState(false);
  const [sheetsDirty, setSheetsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const s3SaveRef = useRef<(() => Promise<void>) | null>(null);
  const s3DiscardRef = useRef<(() => void) | null>(null);
  const sheetsSaveRef = useRef<(() => Promise<void>) | null>(null);
  const sheetsDiscardRef = useRef<(() => void) | null>(null);

  const showSaveBar = s3Dirty || sheetsDirty;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        s3Dirty && s3SaveRef.current ? s3SaveRef.current() : Promise.resolve(),
        sheetsDirty && sheetsSaveRef.current ? sheetsSaveRef.current() : Promise.resolve(),
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (s3Dirty) s3DiscardRef.current?.();
    if (sheetsDirty) sheetsDiscardRef.current?.();
  };

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
          <AwsS3Form
            onDirtyChange={setS3Dirty}
            saveRef={s3SaveRef}
            discardRef={s3DiscardRef}
          />
          <GoogleSheetsForm
            onDirtyChange={setSheetsDirty}
            saveRef={sheetsSaveRef}
            discardRef={sheetsDiscardRef}
          />
          <SyncHistoryTable />
        </div>

        {/* Save Bar */}
        {showSaveBar && (
          <SaveBar
            onSave={handleSave}
            onDiscard={handleDiscard}
            isSaving={isSaving}
          />
        )}
      </div>
    </main>
  );
}
