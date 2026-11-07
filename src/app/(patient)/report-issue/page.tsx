"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/shared";
import { Button } from "@/components/shared/Button";

export default function ReportIssuePage() {
  const [selectedOrder, setSelectedOrder] = useState("");
  const [description, setDescription] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const mockOrders = [
    "Order #1234 - Pain Relief Pack",
    "Order #1235 - Vitamin D Supplements",
    "Order #1236 - Antibiotics",
  ];

  const handleSubmit = () => {
    // TODO: Implement submit logic
  };

  return (
    <PageContainer variant="account" className="flex flex-col gap-4">
      <PageHeader
        title="Report an Issue"
        subtitle="Please provide clear details so we can help you faster."
      />

      <div className="w-full bg-white border-[5px] border-primary/10 rounded-3xl shadow-card p-6">
        <div className="border-2 border-neutral-normal/40 rounded-3xl p-6 flex flex-col gap-6">
          <p className="text-t-21 font-bold text-black leading-[1.2]">
            Select Order
          </p>

          {/* Order Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border border-neutral-normal/40 rounded-3xl p-6 flex items-center gap-2"
              type="button"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              aria-label="Select order"
            >
              <span
                className={`flex-1 text-t-17 text-left leading-[1.2] ${
                  selectedOrder ? "text-black" : "text-neutral"
                }`}
              >
                {selectedOrder || "Select Order"}
              </span>
              <ChevronDown
                className={`w-6 h-6 text-neutral transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 top-full mt-2 w-full bg-white border border-neutral-normal/40 rounded-2xl shadow-card overflow-hidden">
                {mockOrders.map((order) => (
                  <button
                    key={order}
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-6 py-4 text-left text-t-17 text-black hover:bg-primary-light transition-colors"
                  >
                    {order}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Textarea */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the Issue"
            className="w-full border border-neutral-normal/40 rounded-3xl p-6 text-t-17 text-black placeholder:text-neutral leading-[1.2] resize-none min-h-37.5 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
            className="bg-primary-light text-primary hover:bg-primary-light/80 rounded-xl"
          >
            Save changes
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
