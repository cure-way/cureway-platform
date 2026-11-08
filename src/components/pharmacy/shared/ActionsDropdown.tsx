"use client";

import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { useActionsDropdown } from "@/hooks/useActionsDropdown";
import { ActionItem } from "@/types/pharmacyTypes";

interface ActionsDropdownProps<TActionId extends string> {
  actions: ActionItem<TActionId>[];
  onAction: (actionId: TActionId) => void;
}

export default function ActionsDropdown<TActionId extends string>({
  actions,
  onAction,
}: ActionsDropdownProps<TActionId>) {
  const { open, position, buttonRef, menuRef, toggle, close } =
    useActionsDropdown();

  return (
    <>
      {/* Trigger */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        className="inline-flex justify-center items-center hover:bg-gray-100 border border-gray-300 rounded-lg w-8 h-8"
      >
        <MoreHorizontal className="w-4 h-4 text-blue-600" />
      </button>

      {/* Menu */}
      {open &&
        position &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            className="z-50 fixed bg-white shadow-lg border border-gray-200 rounded-lg w-48"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            <div className="px-3 py-2 font-medium text-gray-700 text-t-14">
              Actions
            </div>

            <div className="bg-gray-200 h-px" />

            {actions.map((action) => (
              <button
                key={action.id}
                disabled={action.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                  onAction(action.id);
                }}
                className={`block w-full px-4 py-2 text-left text-t-14 transition
                  ${
                    action.disabled
                      ? "cursor-not-allowed text-gray-400"
                      : action.danger
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                {action.label}
              </button>
            ))}
          </div>,
          document.getElementById("dropdown-portal")!,
        )}
    </>
  );
}
