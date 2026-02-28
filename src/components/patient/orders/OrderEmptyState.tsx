"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function OrderEmptyState() {
  const router = useRouter();

  return (
    <div className="w-full py-10 font-[var(--font-montserrat)]">
      <div className="flex flex-col items-center gap-6">
        
        <Image
          src="/icons/empty-order.png"
          alt="no orders"
          width={150}
          height={150}
          className="block"
          priority
        />

        <p className="text-center text-2xl font-bold leading-[120%] text-black/80">
          No Order Found , Start Your First Order Now!
        </p>

        <button
          type="button"
          onClick={() => router.push("/cart")}
          className={[
            "h-12 w-[212px] rounded-xl border border-[#334EAC] bg-white px-[22px] py-[10px]",
            "transition-all duration-300 ease-in-out",
            "hover:bg-[#334EAC]/10",
            "active:bg-[#334EAC] active:scale-[0.99]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#334EAC]/35",
          ].join(" ")}
        >
          <span className="text-xl font-bold leading-[120%] text-[#334EAC] active:text-white">
            Order Now
          </span>
        </button>
      </div>
    </div>
  );
}
