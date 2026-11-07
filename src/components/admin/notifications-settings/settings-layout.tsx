"use client";

import { RotateCcw } from "lucide-react";
import SettingsRow from "./settings-row";
import type { SettingsRowData } from "./settings-row";

/* ------------------------------------------------------------------
   DEFAULT SETTINGS DATA (matches Figma defaults)
   ------------------------------------------------------------------ */
export const defaultSettings: SettingsRowData[] = [
  {
    id: "popup-desktop",
    title: "Pop up notification on desktop",
    description:
      "Receive instant alerts on your desktop for important system updates and user actions.",
    defaultValue: true,
  },
  {
    id: "mobile-push",
    title: "Mobile push notifications",
    description:
      "Stay updated with real-time alerts sent directly to your mobile device for key app activities.",
    defaultValue: true,
  },
  {
    id: "email-subscription",
    title: "Email subscription alerts",
    description:
      "Get notified via email about the latest features, updates, and promotions tailored to your interests.",
    defaultValue: false,
  },
  {
    id: "sms",
    title: "SMS notifications",
    description:
      "Receive instant text message alerts on your phone for critical updates and offers that matter to you.",
    defaultValue: true,
  },
  {
    id: "push",
    title: "Push notifications",
    description:
      "Stay informed in real-time with push notifications directly on your device whenever there\u2019s news or promotions available.",
    defaultValue: true,
  },
  {
    id: "weekly-newsletter",
    title: "Weekly newsletter",
    description:
      "Subscribe to our weekly newsletter for curated content, tips, and insights delivered straight to your inbox.",
    defaultValue: true,
  },
];

/* ------------------------------------------------------------------
   SETTINGS RIGHT PANEL
   ------------------------------------------------------------------ */
interface SettingsLayoutProps {
  settings: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
  onResetToDefault: () => void;
}

export default function SettingsLayout({
  settings,
  onToggle,
  onResetToDefault,
}: SettingsLayoutProps) {
  return (
    <div className="flex-1 min-w-0 bg-white border border-border rounded-2xl p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-t-17 font-medium text-neutral-darker">
          Notification Settings
        </h2>
        <button
          type="button"
          onClick={onResetToDefault}
          className="flex items-center gap-3 px-3 py-2 border border-primary rounded text-t-14 font-semibold text-primary hover:bg-primary-light transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
          Reset to default
        </button>
      </div>

      {/* Settings rows */}
      <div className="space-y-4">
        {defaultSettings.map((row) => (
          <SettingsRow
            key={row.id}
            title={row.title}
            description={row.description}
            checked={settings[row.id] ?? row.defaultValue}
            onChange={(value) => onToggle(row.id, value)}
          />
        ))}
      </div>
    </div>
  );
}
