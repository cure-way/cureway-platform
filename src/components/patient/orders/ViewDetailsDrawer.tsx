"use client";
import React, { useEffect } from "react";
import type { Order } from "@/types/order";

export function ViewDetailsDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const statusCfg = {
    processing: { label: "Processing",  textCls: "text-warning",  bgCls: "bg-warning-light"  },
    on_the_way: { label: "On the way",  textCls: "text-primary",  bgCls: "bg-accent"          },
    delivered:  { label: "Delivered",   textCls: "text-success",  bgCls: "bg-success-light"   },
    cancelled:  { label: "Cancelled",   textCls: "text-error",    bgCls: "bg-error-light"     },
  }[order.status];

  const subtotal = (order.items ?? []).reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="py-4 border-b border-border last:border-0">
        <p className="text-t-12 font-semibold text-muted-foreground tracking-widest uppercase mb-3">{title}</p>
        {children}
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes drawer-in{from{transform:translateX(100%);opacity:.5}to{transform:translateX(0);opacity:1}}.details-drawer{animation:drawer-in 0.3s cubic-bezier(0.22,1,0.36,1) both}`}</style>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-[1000] backdrop-blur-sm" />
      {/* Drawer */}
      <div className="details-drawer fixed top-0 right-0 h-full z-[1001] bg-card shadow-2xl flex flex-col font-[var(--font-montserrat)] w-[min(480px,100vw)]">
        {/* Sticky header */}
        <div className="sticky top-0 bg-card px-5 pt-5 pb-4 border-b border-border z-10 flex items-start justify-between gap-3 flex-shrink-0">
          <div className="min-w-0">
            <p className="text-t-12 font-medium text-muted-foreground mb-1">Order #{order.id}</p>
            <h2 className="text-t-21-bold text-foreground m-0">Order Details</h2>
            <span className={`inline-block mt-1.5 px-3 py-1 rounded-lg text-t-12 font-semibold ${statusCfg.bgCls} ${statusCfg.textCls}`}>{statusCfg.label}</span>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-neutral-light flex items-center justify-center border-none cursor-pointer hover:bg-neutral-light-hover transition-colors flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--neutral-dark))" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5">
          <Section title="Pharmacy">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div><p className="text-t-14-bold text-foreground m-0">{order.pharmacyName}</p><p className="text-t-12 text-muted-foreground m-0">{order.address}</p></div>
            </div>
          </Section>

          <Section title={`Items (${(order.items ?? []).length})`}>
            <div className="flex flex-col gap-3">
              {(order.items ?? []).map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-neutral-light rounded-xl p-3">
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-t-14-semibold text-foreground m-0 truncate">{item.name}</p>
                    {item.genericName && <p className="text-t-12 text-muted-foreground m-0">{item.genericName}</p>}
                    <p className="text-t-12 text-muted-foreground m-0">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-t-14-bold text-primary flex-shrink-0">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Price Breakdown">
            <div className="flex flex-col gap-2">
              {[{ label: "Subtotal", val: subtotal }, { label: "Delivery Fee", val: order.deliveryFee ?? 0 }].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-t-14 text-muted-foreground">{label}</span>
                  <span className="text-t-14 text-foreground">${val.toFixed(2)}</span>
                </div>
              ))}
              {(order.discount ?? 0) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-t-14 text-success">Discount</span>
                  <span className="text-t-14 text-success">-${(order.discount ?? 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-border mt-1">
                <span className="text-t-17-bold text-foreground">Total</span>
                <span className="text-t-21-bold text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </Section>

          {order.deliveryAddress && (
            <Section title="Delivery Address">
              <div className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" className="mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="text-t-14 text-foreground">{order.deliveryAddress}</span>
              </div>
            </Section>
          )}

          {order.paymentMethod && (
            <Section title="Payment Method">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <span className="text-t-14-semibold text-foreground">{order.paymentMethod}</span>
              </div>
            </Section>
          )}
          <div className="h-5" />
        </div>
      </div>
    </>
  );
}
