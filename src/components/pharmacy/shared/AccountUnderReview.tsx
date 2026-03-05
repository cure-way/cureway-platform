"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth";

export default function AccountUnderReview() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitchAccount = async () => {
    setIsLoading(true);
    await logout();
  };

  return (
    <div className="flex justify-center items-center px-4 h-screen">
      <div className="bg-white shadow p-6 border rounded-xl w-full max-w-md text-center">
        <h2 className="mb-2 font-semibold text-lg">Account Under Review</h2>

        <p className="mb-6 text-gray-600">
          Your pharmacy account is currently under review. You will gain access
          once it is approved.
        </p>

        <div className="flex flex-col justify-center items-center gap-3">
          <Link
            href="/"
            className={`px-5 py-2.5 rounded-lg text-white transition-colors
            ${
              isLoading
                ? "bg-gray-400 pointer-events-none"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            Go Home
          </Link>

          <button
            onClick={handleSwitchAccount}
            disabled={isLoading}
            className="flex items-center gap-2 hover:bg-gray-100 disabled:opacity-60 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 transition-colors disabled:cursor-not-allowed"
          >
            {isLoading && (
              <span className="border-2 border-gray-300 border-t-gray-700 rounded-full w-4 h-4 animate-spin" />
            )}
            {isLoading ? "Signing out..." : "Sign in with another account"}
          </button>
        </div>
      </div>
    </div>
  );
}
