"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MotionTap } from "@/components/shared/MotionTap";
import { IconBack } from "@/components/patient/settings/Icons";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/features/auth";

const COUNTRIES = [
  { code: "PS", name: "Palestine", dial: "+970", flag: "🇵🇸" },
  { code: "IL", name: "Israel", dial: "+972", flag: "🇮🇱" },
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "AE", name: "UAE", dial: "+971", flag: "🇦🇪" },
  { code: "JO", name: "Jordan", dial: "+962", flag: "🇯🇴" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[16px] font-semibold text-[#17234D]">{children}</div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  rightIcon,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="flex h-[56px] w-full items-center gap-3 rounded-[16px] border border-[#EFEDED] bg-white px-4">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        className="h-full w-full bg-transparent text-[16px] font-medium text-[#494949] outline-none"
      />
      {rightIcon && <div>{rightIcon}</div>}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="#9CA3AF"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth="2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="6"
        width="16"
        height="14"
        rx="3"
        stroke="#9CA3AF"
        strokeWidth="2"
      />
      <path d="M8 3v3M16 3v3M4 9h16" stroke="#9CA3AF" strokeWidth="2" />
    </svg>
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, loading, updating, update } = useProfile();
  const { logout } = useAuth();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [country, setCountry] = React.useState(COUNTRIES[0]);
  const [phone, setPhone] = React.useState("");

  // Hydrate form fields when profile data arrives
  const hydrated = React.useRef(false);
  React.useEffect(() => {
    if (!profile || hydrated.current) return;
    hydrated.current = true;

    setName(profile.name ?? "");
    setEmail(profile.email ?? "");
    setDob(profile.dateOfBirth ?? "");

    if (profile.defaultAddress) {
      const addr = profile.defaultAddress;
      setLocation([addr.area, addr.region].filter(Boolean).join(", "));
    }

    if (profile.phoneNumber) {
      const matched = COUNTRIES.find((c) =>
        profile.phoneNumber.startsWith(c.dial),
      );
      if (matched) {
        setCountry(matched);
        setPhone(profile.phoneNumber.slice(matched.dial.length));
      } else {
        setPhone(profile.phoneNumber);
      }
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await update({
        name: name.trim() || undefined,
        phoneNumber: `${country.dial}${phone}`.trim() || undefined,
        dateOfBirth: dob || undefined,
      });
      toast.success("Profile updated");
      router.push("/profile");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/sign-in");
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="mx-auto w-full max-w-[1100px]">
        {/* ✅ Header row (مثل Settings) */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[26px] font-bold text-black">Edit Profile</div>

          <MotionTap
            as="button"
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2"
          >
            <IconBack />
            <span className="text-[18px] font-bold">Back</span>
          </MotionTap>
        </div>

        {/* ✅ Cards start at the same top line */}
        <div className="grid items-start gap-6 lg:grid-cols-12">
          {/* LEFT CARD */}
          <div className="lg:col-span-5">
            <div className="rounded-[24px] border-t-[5px] border-t-[#5678C5] bg-white p-6 shadow-card">
              <div className="flex flex-col items-center gap-4">
                <div className="h-[140px] w-[140px] overflow-hidden rounded-full bg-[#EBEDF7]">
                  <Image
                    src={
                      profile?.profileImageUrl || "/patient/profile/Avatar.png"
                    }
                    alt="avatar"
                    width={140}
                    height={140}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>

                <MotionTap
                  as="button"
                  onClick={() => console.log("change photo")}
                  className="flex h-[50px] w-full max-w-[220px] items-center justify-center rounded-[24px] bg-[#EBEDF7]"
                >
                  <span className="text-[18px] font-semibold text-[#334EAC]">
                    Change photo
                  </span>
                </MotionTap>
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="lg:col-span-7">
            <div className="rounded-[24px] border-t-[5px] border-t-[#4C6AAF] bg-white p-6 shadow-card">
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Name</FieldLabel>
                  <TextInput value={name} onChange={setName} />
                </div>

                <div>
                  <FieldLabel>Email</FieldLabel>
                  <TextInput value={email} onChange={setEmail} />
                </div>

                <div>
                  <FieldLabel>Change password</FieldLabel>
                  <TextInput
                    value={password}
                    onChange={setPassword}
                    type="password"
                    rightIcon={<EyeIcon />}
                  />
                </div>

                <div>
                  <FieldLabel>Location</FieldLabel>
                  <TextInput value={location} onChange={setLocation} />
                </div>

                <div>
                  <FieldLabel>Date Of Birth</FieldLabel>
                  <TextInput
                    value={dob}
                    onChange={setDob}
                    rightIcon={<CalendarIcon />}
                  />
                </div>

                <div>
                  <FieldLabel>Phone Number</FieldLabel>
                  <div className="flex h-[56px] w-full items-center gap-3 rounded-[16px] border border-[#EFEDED] bg-white px-4">
                    <select
                      value={country.code}
                      onChange={(e) => {
                        const selected = COUNTRIES.find(
                          (c) => c.code === e.target.value,
                        );
                        if (selected) setCountry(selected);
                      }}
                      className="bg-transparent text-[16px] font-medium outline-none"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.dial}
                        </option>
                      ))}
                    </select>

                    <div className="h-6 w-px bg-[#E5E7EB]" />

                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent text-[16px] outline-none"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col items-center gap-4">
                  <MotionTap
                    as="button"
                    onClick={handleSave}
                    disabled={updating || loading}
                    className="flex h-[50px] w-full max-w-[360px] items-center justify-center rounded-[24px] bg-[#334EAC] disabled:opacity-50"
                  >
                    <span className="text-[20px] font-semibold text-white">
                      {updating ? "Saving..." : "Save changes"}
                    </span>
                  </MotionTap>

                  <MotionTap
                    as="button"
                    onClick={handleLogout}
                    className="flex h-[50px] w-full max-w-[360px] items-center justify-center rounded-[24px] border border-[#263B81]"
                  >
                    <span className="text-[20px] font-semibold text-[#334EAC]">
                      Logout
                    </span>
                  </MotionTap>
                </div>
              </div>
            </div>
          </div>
          {/* end */}
        </div>
      </div>
    </div>
  );
}
