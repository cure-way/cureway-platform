"use client";
import React, { useEffect } from "react";
import type { Order } from "@/types/order";


function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-4 border-b border-border last:border-0">
      <p className="text-t-12 font-semibold text-muted-foreground tracking-widest uppercase mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

export function ViewDetailsDrawer({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const statusCfgMap: Record<string, { label: string; textCls: string; bgCls: string }> = {
    processing: {
      label: "Processing",
      textCls: "text-warning",
      bgCls: "bg-warning-light",
    },
    on_the_way: {
      label: "On the way",
      textCls: "text-primary",
      bgCls: "bg-accent",
    },
    delivered: {
      label: "Delivered",
      textCls: "text-success",
      bgCls: "bg-success-light",
    },
    cancelled: {
      label: "Cancelled",
      textCls: "text-error",
      bgCls: "bg-error-light",
    },
  };

  const statusCfg = statusCfgMap[order.status] || statusCfgMap.processing;

  const hasGroups = Array.isArray(order.pharmacyGroups) && order.pharmacyGroups.length > 0;
  const flatItems = order.items ?? [];

  const subtotal = hasGroups
    ? (order.pharmacyGroups ?? []).reduce((s, g) => s + g.subtotal, 0)
    : flatItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <>
      <style>{`
        @keyframes drawer-in {
          from { transform: translateX(100%); opacity: .5; }
          to   { transform: translateX(0);    opacity: 1;  }
        }
        .details-drawer { animation: drawer-in 0.3s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[1000] backdrop-blur-sm"
      />

      <div className="details-drawer fixed top-0 right-0 h-full z-[1001] bg-card shadow-2xl flex flex-col font-[var(--font-montserrat)] w-[min(480px,100vw)]">
        {/* Header */}
        <div className="sticky top-0 bg-card px-5 pt-5 pb-4 border-b border-border z-10 flex items-start justify-between gap-3 flex-shrink-0">
          <div className="min-w-0">
            <p className="text-t-12 font-medium text-muted-foreground mb-1">
              Order #{order.id}
            </p>
            <h2 className="text-t-21-bold text-foreground m-0">
              Order Details
            </h2>
            <span
              className={`inline-block mt-1.5 px-3 py-1 rounded-lg text-t-12 font-semibold ${statusCfg.bgCls} ${statusCfg.textCls}`}
            >
              {statusCfg.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-light flex items-center justify-center border-none cursor-pointer hover:bg-neutral-light-hover transition-colors flex-shrink-0 mt-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5">
          {hasGroups ? (
            <Section title={`Pharmacies (${order.pharmacyGroups!.length})`}>
              <div className="flex flex-col gap-3">
                {order.pharmacyGroups!.map((group) => (
                  <div key={group.pharmacyId} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-primary">🏠</span>
                    </div>
                    <div>
                      <p className="text-t-14-bold text-foreground m-0">{group.pharmacyName}</p>
                      <p className="text-t-12 text-muted-foreground m-0">Subtotal: ${group.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          ) : (
            <Section title="Pharmacy">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                   <span className="text-primary">🏠</span>
                </div>
                <div>
                  <p className="text-t-14-bold text-foreground m-0">{order.pharmacyName}</p>
                  <p className="text-t-12 text-muted-foreground m-0">{order.address}</p>
                </div>
              </div>
            </Section>
          )}

          <Section title={`Items (${hasGroups ? "Grouped" : flatItems.length})`}>
             <div className="flex flex-col gap-3">
                {flatItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-neutral-light rounded-xl p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-t-14-semibold text-foreground m-0 truncate">{item.name}</p>
                      <p className="text-t-12 text-muted-foreground m-0">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-t-14-bold text-primary">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
             </div>
          </Section>

          <Section title="Price Breakdown">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-t-14 text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border mt-1 font-bold">
                <span className="text-t-17">Total</span>
                <span className="text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </Section>
          <div className="h-5" />
        </div>
      </div>
    </>
  );
}