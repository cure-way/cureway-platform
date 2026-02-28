"use client";
import Image from "next/image";
import { Mail, Phone, User } from "lucide-react";
import type { ContactInfo } from "@/types/cart";

interface Props { contact: ContactInfo; }
export default function ContactInformation({ contact }: Props) {
  return (
    <div className="font-[var(--font-montserrat)]">
      <div className="w-full pb-3 border-b border-border mb-4">
        <h2 className="text-t-30-semibold text-foreground leading-tight m-0">Contact Information</h2>
      </div>
      <div className="w-full rounded-xl py-3 flex flex-col gap-2 border border-black/10">
        {[
          { icon: contact.avatar
              ? <Image src={contact.avatar} alt={contact.name} width={48} height={48} className="rounded-[30px] object-cover" />
              : <User size={22} className="text-primary" strokeWidth={1.8} />,
            text: contact.name },
          { icon: <Mail size={22} className="text-primary " strokeWidth={1.8} />, text: contact.email },
          { icon: <Phone size={22} className="text-primary" strokeWidth={1.8} />, text: contact.phone },
        ].map(({ icon, text }, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2">
            <div className="w-12 h-12 rounded-[30px] bg-primary-light flex items-center justify-center flex-shrink-0">{icon}</div>
            <span className="text-t-21 text-primary-dark font-medium leading-tight">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
