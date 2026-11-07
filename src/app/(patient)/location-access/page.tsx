"use client";

import { PageContainer, PageHeader } from "@/components/shared";
import { Button } from "@/components/shared/Button";

export default function LocationAccessPage() {
  const handleAllowLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // TODO: Store location and redirect
        },
        () => {
          // TODO: Show error toast to user
        },
      );
    }
  };

  const handleNotNow = () => {
    // TODO: Navigate to next step or home
    window.history.back();
  };

  return (
    <PageContainer variant="form" className="flex flex-col gap-4">
      <PageHeader
        title="Enable Location Access"
        subtitle="Please provide clear details so we can help you faster."
      />

      <div className="w-full bg-white rounded-2xl shadow-card p-6 flex flex-col items-center justify-center gap-20 min-h-96">
        {/* Message Box */}
        <div className="w-full bg-white border border-black/50 rounded-2xl p-6">
          <p className="text-t-21 font-bold text-[#494949] text-center leading-[1.2]">
            We use your location to show nearby pharmacies and calculate
            delivery accurately.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleAllowLocation}
            className="bg-primary-light text-primary hover:bg-primary-light/80 rounded-xl"
          >
            Allow Location
          </Button>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleNotNow}
            className="border-0 text-black hover:bg-gray-50 rounded-xl"
          >
            Not Now
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
