"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileWarning,
  Lock,
  ArrowRight,
} from "lucide-react";

import { SHOWCASE_MODE } from "@/lib/showcase/config";
import { getDb } from "@/lib/showcase/db";
import { formatDate } from "@/lib/format";
import type { PrescriptionResponseDto } from "@/types/api.types";

/**
 * The context column beside the upload flow.
 *
 * The page used to be a single 768px column with most of the screen empty.
 * This panel fills the other half with the things a visitor actually needs
 * while uploading: what happens next, what the file has to be, who sees it,
 * and where their earlier prescriptions stand.
 *
 * It reads the showcase fixtures directly rather than through the HTTP layer,
 * so it adds no request and no new endpoint.
 */

const STEPS = [
  {
    title: "Upload a photo",
    body: "A clear picture of the whole prescription, including the dosage line.",
  },
  {
    title: "A pharmacist reviews it",
    body: "A licensed pharmacist checks it and may ask for a clearer photo.",
  },
  {
    title: "Your order is prepared",
    body: "Once approved, the selected pharmacy prepares it for delivery.",
  },
];

const STATUS: Record<
  string,
  { label: string; icon: typeof CheckCircle2; cls: string }
> = {
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    cls: "bg-success-light text-success-dark",
  },
  UNDER_REVIEW: {
    label: "Under review",
    icon: Clock,
    cls: "bg-warning-light text-warning-dark",
  },
  REUPLOAD_REQUESTED: {
    label: "Re-upload needed",
    icon: FileWarning,
    cls: "bg-error-light text-error-dark",
  },
};

function recentPrescriptions(): PrescriptionResponseDto[] {
  if (!SHOWCASE_MODE) return [];
  try {
    return [...getDb().prescriptions]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 3);
  } catch {
    return [];
  }
}

export default function UploadSidePanel() {
  const recent = recentPrescriptions();

  return (
    <aside data-section="side panel" className="flex flex-col gap-4">
      {/* How it works */}
      <section className="rounded-xl border border-border bg-white p-4 md:p-6">
        <h2 className="text-t-17-semibold text-primary-darker">How it works</h2>
        <ol className="mt-4 flex flex-col gap-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-light text-t-12-semibold text-primary"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-t-14-semibold text-primary-darker">
                  {s.title}
                </p>
                <p className="measure mt-0.5 text-t-12 text-neutral-dark">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Requirements */}
      <section className="rounded-xl border border-border bg-white p-4 md:p-6">
        <h2 className="text-t-17-semibold text-primary-darker">
          Accepted files
        </h2>
        <dl className="mt-3 flex flex-col gap-2 text-t-14">
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-dark">Formats</dt>
            <dd className="text-t-14-semibold text-primary-darker">
              JPG, PNG, PDF
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-dark">Maximum size</dt>
            <dd className="text-t-14-semibold text-primary-darker">10 MB</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-dark">Minimum resolution</dt>
            <dd className="text-t-14-semibold text-primary-darker">
              600 × 600 px
            </dd>
          </div>
        </dl>
      </section>

      {/* Privacy */}
      <section className="flex gap-3 rounded-xl border border-[#73694E]/30 bg-[#FFF8E6] p-4 md:p-6">
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#73694E]"
        >
          <Lock className="h-4 w-4 text-white" />
        </span>
        <div className="min-w-0">
          <p className="text-t-14-semibold text-[#73694E]">
            A licensed pharmacist will review it
          </p>
          <p className="measure mt-0.5 text-t-12 text-[#73694E]">
            Your prescription is secure and only shared with the selected
            pharmacy.
          </p>
        </div>
      </section>

      {/* Recent prescriptions */}
      {recent.length > 0 && (
        <section className="rounded-xl border border-border bg-white p-4 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-t-17-semibold text-primary-darker">
              Your recent prescriptions
            </h2>
          </div>
          <ul className="mt-3 flex flex-col divide-y divide-border">
            {recent.map((rx) => {
              const s = STATUS[rx.status] ?? STATUS.UNDER_REVIEW;
              const Icon = s.icon;
              return (
                <li key={rx.id} className="flex items-center gap-3 py-3">
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm px-2 py-1 text-t-12-semibold ${s.cls}`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {s.label}
                  </span>
                  <span className="ml-auto shrink-0 text-t-12 text-neutral-dark">
                    {formatDate(rx.createdAt)}
                  </span>
                </li>
              );
            })}
          </ul>
          <Link
            href="/orders"
            className="mt-2 inline-flex h-11 items-center gap-1.5 text-t-14-semibold text-primary transition-colors hover:text-primary-hover"
          >
            View all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      )}
    </aside>
  );
}
