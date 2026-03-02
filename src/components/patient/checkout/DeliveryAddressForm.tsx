"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import type { DeliveryAddress } from "@/types/cart";
import Image from "next/image";

type LocationState = "idle" | "searching" | "results" | "confirming" | "confirmed" | "denied";
interface GeoResult { id: string; label: string; lat: number; lng: number; }
interface DeliveryAddressFormProps {
  selectedAddress: DeliveryAddress | null;
  onAddressSelect: (address: DeliveryAddress) => void;
  /**
   * Pre-fetched saved addresses from GET /patient/addresses.
   * When provided, shows a selectable list above the GPS/manual form.
   */
  savedAddresses?: DeliveryAddress[];
  loadingAddresses?: boolean;
}
interface ManualAddress { line1: string; line2: string; streetNumber: string; city: string; postalCode: string; }
const EMPTY: ManualAddress = { line1: "", line2: "", streetNumber: "", city: "", postalCode: "" };

const Spinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const cls = size === "sm" ? "w-4 h-4 border-2" : size === "lg" ? "w-11 h-11 border-[2.5px]" : "w-5 h-5 border-2";
  return <div className={`${cls} border-primary/15 border-t-primary rounded-full animate-spin flex-shrink-0`} />;
};


const TargetIcon = () => (
  <Image src="/icons/locationSeeker.svg" alt="Location" width={22} height={22} />
);


async function reverseGeocode(lat: number, lng: number): Promise<GeoResult[]> {
  try {
    const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`, { headers: { "Accept-Language": "en" } });
    if (!resp.ok) throw new Error();
    const data = await resp.json();
    const label = data.display_name as string;
    const broader = label.split(", ").slice(2).join(", ");
    return [{ id: "r1", label, lat, lng }, { id: "r2", label: broader || label, lat, lng }];
  } catch { return [{ id: "r1", label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng }]; }
}

function AddressInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [focused, setFocused] = useState(false);
  const hasVal = value.trim().length > 0;
  return (
    <input
      className={[
        "input input-md w-full rounded-2xl font-[var(--font-montserrat)] text-t-14 font-medium text-neutral-dark",
        focused ? "border-primary" : "border-border",
        !focused && hasVal ? "bg-accent" : "bg-card",
      ].join(" ")}
      placeholder={placeholder} value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    />
  );
}

export default function DeliveryAddressForm({ selectedAddress, onAddressSelect, savedAddresses = [], loadingAddresses = false }: DeliveryAddressFormProps) {
  const [locState, setLocState] = useState<LocationState>(selectedAddress?.coordinates ? "confirmed" : "idle");
  const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<GeoResult | null>(null);
  const [confirmedAddr, setConfirmedAddr] = useState<DeliveryAddress | null>(selectedAddress?.coordinates ? selectedAddress : null);
  const [manual, setManual] = useState<ManualAddress>(EMPTY);
  const [deniedMsg, setDeniedMsg] = useState("");

  // Use a ref to always call the latest onAddressSelect — avoids stale closure
  const onAddressSelectRef = useRef(onAddressSelect);
  useEffect(() => { onAddressSelectRef.current = onAddressSelect; }, [onAddressSelect]);

  useEffect(() => {
    if (Object.values(manual).some(v => v.trim() !== "")) {
      const street = `${manual.streetNumber} ${manual.line1}`.trim();
      const city = manual.city.trim();
      // Only call if there is meaningful content (not just whitespace)
      if (street || city) {
        onAddressSelectRef.current({ street, city, area: manual.line2, notes: manual.postalCode });
      }
    }
  }, [manual]);

  const handleClickLocation = useCallback(() => {
    if (locState === "confirmed") return;
    if (!navigator.geolocation) { setDeniedMsg("Geolocation is not supported by your browser."); setLocState("denied"); return; }
    setLocState("searching"); setGeoResults([]); setSelectedResult(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => { const results = await reverseGeocode(pos.coords.latitude, pos.coords.longitude); setGeoResults(results); setLocState("results"); },
      (err) => { setDeniedMsg(err.code === err.PERMISSION_DENIED ? "Location permission denied. Please enable it in browser settings, or enter your address manually." : "Unable to detect your location. Please enter your address manually."); setLocState("denied"); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, [locState]);

  const handleConfirm = () => {
    if (!selectedResult) return;
    setLocState("confirming");
    setTimeout(() => {
      const addr: DeliveryAddress = { id: selectedResult.id, street: selectedResult.label.split(",")[0] ?? selectedResult.label, city: selectedResult.label.split(",").slice(1).join(",").trim(), coordinates: { lat: selectedResult.lat, lng: selectedResult.lng } };
      setConfirmedAddr(addr); setLocState("confirmed"); onAddressSelect(addr);
    }, 800);
  };

  const set = (key: keyof ManualAddress) => (e: React.ChangeEvent<HTMLInputElement>) => setManual(prev => ({ ...prev, [key]: e.target.value }));
  const isActive = locState !== "idle" && locState !== "denied";

  return (
    <div className="font-[var(--font-montserrat)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-t-30-semibold text-foreground leading-tight m-0">Delivery Address</h2>
        <button className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
          <MoreHorizontal size={18} className="text-neutral-dark" />
        </button>
      </div>

      {/* Saved addresses from API (/patient/addresses) */}
      {loadingAddresses && (
        <div className="flex items-center gap-2 mb-4 text-t-14 text-muted-foreground">
          <Spinner size="sm" />
          <span>Loading saved addresses…</span>
        </div>
      )}
      {!loadingAddresses && savedAddresses.length > 0 && (
        <div className="mb-4">
          <p className="text-t-14 font-semibold text-muted-foreground mb-2">Saved Addresses</p>
          <div className="flex flex-col gap-2">
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddress?.apiId != null && selectedAddress.apiId === addr.apiId;
              return (
                <button
                  key={addr.id ?? addr.apiId}
                  onClick={() => onAddressSelect(addr)}
                  className={[
                    "w-full text-left rounded-2xl border px-4 py-3 text-t-14 transition-all cursor-pointer",
                    isSelected ? "border-primary bg-accent font-semibold text-primary" : "border-border bg-card text-foreground hover:border-primary/50",
                  ].join(" ")}
                >
                  <span className="font-semibold">{addr.label ?? "Address"}</span>
                  {addr.isDefault && <span className="ml-2 text-t-12 text-success-darker">(Default)</span>}
                  <span className="block text-t-12 text-muted-foreground mt-0.5">{addr.street}{addr.city ? `, ${addr.city}` : ""}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-t-14 font-medium text-neutral-dark">Or enter a new address</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </div>
      )}

      <div className={`w-full rounded-2xl border p-4 transition-colors ${isActive ? "border-primary" : "border-neutral-light-active"}`}>
        <button onClick={locState === "idle" || locState === "denied" ? handleClickLocation : undefined}
          className={`flex items-center gap-3 bg-transparent border-none p-0 w-full justify-between ${locState === "idle" || locState === "denied" ? "cursor-pointer" : "cursor-default"}`}>
          <div className="flex items-center gap-3">
            <TargetIcon />
            <span className="text-t-17-semibold text-primary">Use Your Current Location</span>
          </div>
          {(locState === "idle" || locState === "denied") && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          )}
        </button>

        {locState === "searching" && (
          <div className="flex flex-col items-center gap-5 pt-6 pb-2">
            <Spinner size="lg" />
            <span className="text-t-17-semibold text-muted-foreground text-center">Searching your location</span>
          </div>
        )}

        {locState === "denied" && (
          <div className="mt-3 p-3 bg-error-light rounded-xl">
            <p className="text-t-12 text-error m-0 leading-relaxed">{deniedMsg}</p>
          </div>
        )}

        {(locState === "results" || locState === "confirming") && (
          <div className="mt-4">
            <p className="text-t-17-bold text-primary mb-2.5">Results:</p>
            <div className="flex flex-col gap-1">
              {geoResults.map(r => {
                const isSel = selectedResult?.id === r.id;
                return (
                  <button key={r.id} onClick={() => setSelectedResult(r)}
                    className={`w-full min-h-[65px] rounded-xl px-4 py-2.5 text-center flex items-center justify-center transition-all border cursor-pointer ${isSel ? "border-primary-dark bg-primary/5" : "border-neutral-light-active bg-transparent"}`}>
                    <span className="text-t-12 text-neutral-dark leading-relaxed">{r.label}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={handleConfirm} disabled={!selectedResult || locState === "confirming"}
              className={`w-full h-12 rounded-xl bg-primary text-card text-t-17-semibold border-none mt-3 flex items-center justify-center gap-2.5 transition-opacity ${!selectedResult ? "opacity-60 cursor-default" : "cursor-pointer hover:bg-primary-hover"}`}>
              {locState === "confirming" ? (<>Confirming <Spinner size="sm" /></>) : "Confirm"}
            </button>
          </div>
        )}

        {locState === "confirmed" && confirmedAddr && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="w-full h-12 rounded-xl px-4 bg-success-light flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--success-darker))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2v6h6"/><path d="M3 8C5.5 4.5 9.5 2 14 2c5.5 0 10 4.5 10 10s-4.5 10-10 10c-4.5 0-8.5-2.5-10-6"/>
                </svg>
                <span className="text-t-14-semibold text-foreground">Status</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-t-12-semibold text-success-darker">Location Confirmed</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--success-darker))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
            </div>
            <div className="w-full rounded-xl px-4 py-3 bg-accent text-center">
              <span className="text-t-12 text-neutral-dark leading-relaxed">{confirmedAddr.street}{confirmedAddr.city ? `, ${confirmedAddr.city}` : ""}</span>
            </div>
          </div>
        )}
      </div>

      {(locState === "idle" || locState === "denied") && (
        <>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-t-14 font-medium text-neutral-dark">Or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="flex flex-col gap-2">
            {([{ key: "line1" as const, placeholder: "Address line 1" }, { key: "line2" as const, placeholder: "Address line 2" }, { key: "streetNumber" as const, placeholder: "Street number" }]).map(({ key, placeholder }) => (
              <AddressInput key={key} placeholder={placeholder} value={manual[key]} onChange={set(key)} />
            ))}
            <div className="flex gap-2">
              <AddressInput placeholder="City, State" value={manual.city} onChange={set("city")} />
              <AddressInput placeholder="Postal Code" value={manual.postalCode} onChange={set("postalCode")} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
