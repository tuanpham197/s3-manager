"use client";

import {
  CircleStackIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { S3Config, S3ConfigRequest } from "@/types/api";

const REGIONS = [
  { value: "us-east-1", label: "us-east-1 (N. Virginia)" },
  { value: "us-west-2", label: "us-west-2 (Oregon)" },
  { value: "eu-central-1", label: "eu-central-1 (Frankfurt)" },
  { value: "ap-southeast-1", label: "ap-southeast-1 (Singapore)" },
];

interface Props {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: React.MutableRefObject<(() => Promise<void>) | null>;
  discardRef: React.MutableRefObject<(() => void) | null>;
}

interface FormState {
  bucket: string;
  region: string;
  access_key_id: string;
  secret_access_key: string;
  prefix: string;
}

const EMPTY: FormState = {
  bucket: "",
  region: "us-east-1",
  access_key_id: "",
  secret_access_key: "",
  prefix: "",
};

export default function AwsS3Form({ onDirtyChange, saveRef, discardRef }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loaded, setLoaded] = useState<FormState>(EMPTY);
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testOk, setTestOk] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isDirty = useRef(false);

  useEffect(() => {
    api
      .get<S3Config>("/api/integrations/s3")
      .then((data) => {
        const state: FormState = {
          bucket: data.bucket ?? "",
          region: data.region ?? "us-east-1",
          access_key_id: data.access_key_id ?? "",
          secret_access_key: "",
          prefix: data.prefix ?? "",
        };
        setForm(state);
        setLoaded(state);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const checkDirty = (next: FormState, base: FormState) => {
    const dirty =
      next.bucket !== base.bucket ||
      next.region !== base.region ||
      next.access_key_id !== base.access_key_id ||
      next.secret_access_key !== "" ||
      next.prefix !== base.prefix;
    if (dirty !== isDirty.current) {
      isDirty.current = dirty;
      onDirtyChange(dirty);
    }
  };

  const patch = (key: keyof FormState, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      checkDirty(next, loaded);
      return next;
    });
    setError(null);
    setTestOk(null);
  };

  const handleSave = async () => {
    setError(null);
    try {
      const body: S3ConfigRequest = {
        bucket: form.bucket,
        region: form.region,
        access_key_id: form.access_key_id,
        secret_access_key: form.secret_access_key,
        prefix: form.prefix,
      };
      await api.put("/api/integrations/s3", body);
      const next = { ...form, secret_access_key: "" };
      setLoaded(next);
      setForm(next);
      isDirty.current = false;
      onDirtyChange(false);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to save S3 configuration.",
      );
      throw err;
    }
  };

  const handleDiscard = () => {
    setForm(loaded);
    setError(null);
    setTestOk(null);
    isDirty.current = false;
    onDirtyChange(false);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestOk(null);
    setError(null);
    try {
      await api.put("/api/integrations/s3", {
        bucket: form.bucket,
        region: form.region,
        access_key_id: form.access_key_id,
        secret_access_key: form.secret_access_key,
        prefix: form.prefix,
      } satisfies S3ConfigRequest);
      setTestOk(true);
    } catch (err) {
      setTestOk(false);
      setError(err instanceof ApiError ? err.message : "Connection test failed.");
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    saveRef.current = handleSave;
    discardRef.current = handleDiscard;
  });

  return (
    <section className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-8 hover:border-[#BFDBFE] transition-colors duration-200">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center text-[#2563EB] flex-shrink-0">
          <CircleStackIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#1E293B]">AWS S3 Configuration</h3>
          <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mt-0.5">
            Primary Storage Engine
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <fieldset disabled={isLoading} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bucket Name */}
          <div className="space-y-2">
            <label htmlFor="bucket-name" className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">
              Bucket Name
            </label>
            <input
              id="bucket-name"
              type="text"
              value={form.bucket}
              onChange={(e) => patch("bucket", e.target.value)}
              placeholder="e.g. my-s3-bucket"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-150"
            />
          </div>

          {/* Region */}
          <div className="space-y-2">
            <label htmlFor="aws-region" className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">
              Region
            </label>
            <select
              id="aws-region"
              value={form.region}
              onChange={(e) => patch("region", e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-150 cursor-pointer"
            >
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Access Key ID */}
        <div className="space-y-2">
          <label htmlFor="access-key-id" className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">
            Access Key ID
          </label>
          <input
            id="access-key-id"
            type="text"
            value={form.access_key_id}
            onChange={(e) => patch("access_key_id", e.target.value)}
            placeholder="AKIAIOSFODNN7EXAMPLE"
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm font-mono text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-150"
            autoComplete="off"
          />
        </div>

        {/* Secret Access Key */}
        <div className="space-y-2">
          <label htmlFor="iam-key" className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">
            Secret Access Key
          </label>
          <div className="relative">
            <input
              id="iam-key"
              type={showKey ? "text" : "password"}
              value={form.secret_access_key}
              onChange={(e) => patch("secret_access_key", e.target.value)}
              placeholder="Leave blank to keep existing secret"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 pr-12 text-sm font-mono text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-150"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2563EB] transition-colors duration-150 cursor-pointer p-1"
              aria-label={showKey ? "Hide secret key" : "Show secret key"}
            >
              {showKey ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          {testOk === true && (
            <div className="flex items-center gap-1.5 px-1 mt-1">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
              <p className="text-[11px] text-[#475569]">
                Key validated with <span className="font-bold">Full S3 Access</span> permissions.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end items-center gap-4">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#2563EB] font-bold px-5 py-2.5 rounded-xl text-sm transition-colors duration-150 cursor-pointer border border-[#E2E8F0] hover:border-[#BFDBFE] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <SignalIcon className="w-4 h-4" />
            {isTesting ? "Testing…" : "Test Connection"}
          </button>
        </div>
      </fieldset>
    </section>
  );
}
