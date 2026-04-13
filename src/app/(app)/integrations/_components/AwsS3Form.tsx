"use client";

import {
  CircleStackIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const REGIONS = [
  "us-east-1 (N. Virginia)",
  "us-west-2 (Oregon)",
  "eu-central-1 (Frankfurt)",
  "ap-southeast-1 (Singapore)",
];

export default function AwsS3Form() {
  const [showKey, setShowKey] = useState(false);

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

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bucket Name */}
          <div className="space-y-2">
            <label
              htmlFor="bucket-name"
              className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block"
            >
              Bucket Name
            </label>
            <input
              id="bucket-name"
              type="text"
              defaultValue="production-video-assets-v2"
              placeholder="e.g. my-s3-bucket"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-150"
            />
          </div>

          {/* Region */}
          <div className="space-y-2">
            <label
              htmlFor="aws-region"
              className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block"
            >
              Region
            </label>
            <select
              id="aws-region"
              defaultValue={REGIONS[0]}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-150 cursor-pointer"
            >
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* IAM Access Key */}
        <div className="space-y-2">
          <label
            htmlFor="iam-key"
            className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block"
          >
            IAM Access Key
          </label>
          <div className="relative">
            <input
              id="iam-key"
              type={showKey ? "text" : "password"}
              defaultValue="AKIA27C4RF8YJ9EXAMPLE"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 pr-12 text-sm font-mono text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-150"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2563EB] transition-colors duration-150 cursor-pointer p-1"
              aria-label={showKey ? "Hide access key" : "Show access key"}
            >
              {showKey ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-1 mt-1">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
            <p className="text-[11px] text-[#475569]">
              Key validated with <span className="font-bold">Full S3 Access</span> permissions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end items-center gap-4">
          <span className="text-[11px] text-[#94A3B8] font-medium">Last tested: 2 mins ago</span>
          <button
            type="button"
            className="flex items-center gap-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#2563EB] font-bold px-5 py-2.5 rounded-xl text-sm transition-colors duration-150 cursor-pointer border border-[#E2E8F0] hover:border-[#BFDBFE]"
          >
            <SignalIcon className="w-4 h-4" />
            Test Connection
          </button>
        </div>
      </div>
    </section>
  );
}
