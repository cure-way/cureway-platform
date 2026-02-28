"use client";
import React, { useEffect } from "react";
import type { Order } from "@/types/order";

const STEPS: Array<{ key: string; label: string; icon: React.ReactNode }> = [
  { key: "confirmed", label: "Order Confirmed",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> },
  { key: "processing", label: "Being Prepared",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> },
  { key: "packed", label: "Packed & Ready",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
  { key: "on_the_way", label: "On the Way",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { key: "delivered", label: "Delivered",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
];

function getCompleted(status: Order["status"]): Set<string> {
  const done = new Set(["confirmed"]);
  if (status === "processing" || status === "on_the_way" || status === "delivered") done.add("processing");
  if (status === "on_the_way" || status === "delivered") { done.add("packed"); done.add("on_the_way"); }
  if (status === "delivered") done.add("delivered");
  return done;
}
function getCurrent(status: Order["status"]): string {
  if (status === "processing") return "processing";
  if (status === "on_the_way") return "on_the_way";
  if (status === "delivered") return "delivered";
  return "confirmed";
}

export function TrackOrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const completed = getCompleted(order.status);
  const current   = getCurrent(order.status);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      <style>{`@keyframes modal-in{from{opacity:0;transform:translateY(24px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}.track-modal{animation:modal-in 0.28s cubic-bezier(0.34,1.12,0.64,1) both}`}</style>
      <div onClick={onClose} className="fixed inset-0 bg-black/45 z-[1000] flex items-center justify-center p-4 sm:p-5 backdrop-blur-sm">
        <div className="track-modal w-full max-w-[520px] bg-card rounded-3xl p-6 sm:p-8 shadow-2xl relative font-[var(--font-montserrat)]" onClick={e => e.stopPropagation()}>
          {/* Close */}
          <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-light flex items-center justify-center border-none cursor-pointer hover:bg-neutral-light-hover transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--neutral-dark))" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>

          {/* Header */}
          <p className="text-t-12 font-medium text-muted-foreground mb-1.5">Order #{order.id}</p>
          <h2 className="text-t-25-bold text-foreground mb-4">Track Your Order</h2>

          {/* Delivery estimate */}
          {order.estimatedDelivery && order.status !== "delivered" && (
            <div className="bg-success-light rounded-xl px-4 py-3 flex items-center gap-2.5 mb-7">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--success-darker))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <div>
                <span className="text-t-12 font-medium text-success-darker">Estimated delivery · </span>
                <span className="text-t-14-bold text-success-darker">{order.estimatedDelivery}</span>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="flex flex-col mt-6">
            {STEPS.map((step, idx) => {
              const isDone = completed.has(step.key);
              const isCurrent = step.key === current;
              const isLast = idx === STEPS.length - 1;
              return (
                <div key={step.key} className="flex gap-4 items-stretch">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isDone ? "bg-primary text-card border-0" : isCurrent ? "bg-accent text-primary border-2 border-primary" : "bg-neutral-light text-neutral border-2 border-border"}`}>
                      {isDone && step.key !== current
                        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
                        : step.icon}
                    </div>
                    {!isLast && <div className={`w-0.5 flex-1 min-h-6 transition-colors ${isDone ? "bg-primary" : "bg-border"}`} />}
                  </div>
                  <div className={`${isLast ? "pt-2.5" : "pb-6 pt-2.5"} flex-1`}>
                    <p className={`text-t-17 m-0 ${isCurrent ? "font-bold text-primary" : isDone ? "font-semibold text-foreground" : "font-medium text-neutral"}`}>
                      {step.label}
                      {isCurrent && !isDone && <span className="ml-2 text-t-12 font-semibold text-primary bg-accent px-2 py-0.5 rounded-full">In progress</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pharmacy */}
          <div className="mt-6 px-4 py-3.5 bg-neutral-light rounded-xl flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <div>
              <p className="text-t-14-bold text-foreground m-0">{order.pharmacyName}</p>
              <p className="text-t-12 text-muted-foreground m-0">{order.address}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
