"use client";

import {
  CircleHelp,
  Headset,
  TriangleAlert,
  Info,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { ContentColumn, PageContainer, PageHeader } from "@/components/shared";
import { HelpAccordion } from "@/components/patient/HelpAccordion";

const faqItems = [
  "How do I upload a prescription?",
  "How long does it take to receive offers?",
  "Can I cancel a request?",
  "Is my prescription data secure?",
];

const helpSections = [
  {
    icon: <CircleHelp className="w-[35px] h-[35px]" strokeWidth={1.5} />,
    title: "FAQs",
    content: (
      <ul className="list-disc pl-9 space-y-1">
        {faqItems.map((item) => (
          <li
            key={item}
            className="text-t-21 font-semibold text-neutral-dark-active leading-[1.2]"
          >
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: <Headset className="w-[35px] h-[35px]" strokeWidth={1.5} />,
    title: "Contact Support",
    content: (
      <div className="space-y-3 text-t-17 text-neutral-dark-active">
        <p>
          Email us at{" "}
          <span className="font-semibold text-primary">
            support@cureway.com
          </span>
        </p>
        <p>We typically respond within 24 hours.</p>
      </div>
    ),
  },
  {
    icon: <TriangleAlert className="w-[35px] h-[35px]" strokeWidth={1.5} />,
    title: "Order Issues",
    content: (
      <div className="space-y-3 text-t-17 text-neutral-dark-active">
        <p>
          If you&apos;re experiencing issues with your order, please visit the
          Report an Issue page or contact support.
        </p>
      </div>
    ),
  },
  {
    icon: <Info className="w-[35px] h-[35px]" strokeWidth={1.5} />,
    title: "Legal & Info",
    content: (
      <div className="flex flex-col gap-6">
        <ul className="list-disc pl-9">
          <li className="text-t-21 font-semibold text-neutral-dark-active leading-[1.2]">
            Privacy Policy
          </li>
        </ul>
        <div className="bg-primary-light flex items-center gap-1 p-2 rounded-2xl w-full">
          <ShieldCheck className="w-5 h-5 text-neutral-dark shrink-0" />
          <p className="text-t-21 font-normal text-neutral-dark leading-[1.5]">
            Your data is protected
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: <FileText className="w-[35px] h-[35px]" strokeWidth={1.5} />,
    title: "Report an Issue",
    content: undefined,
  },
];

export default function HelpCenterPage() {
  return (
    <PageContainer className="flex flex-col gap-4">
      <PageHeader
        title="Help Center"
        subtitle="Get help, FAQs, and contact support"
      />

      <ContentColumn width="md" className="flex flex-col gap-4">
        <HelpAccordion items={helpSections} />
      </ContentColumn>
    </PageContainer>
  );
}
