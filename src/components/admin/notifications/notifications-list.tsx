"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Notification } from "./notifications-data";
import NotificationRow from "./notification-row";
import { transition } from "@/components/admin/shared/motion";

/* ------------------------------------------------------------------
   NOTIFICATIONS LIST
   ------------------------------------------------------------------ */
interface NotificationsListProps {
  notifications: Notification[];
  onToggleFavorite: (id: string) => void;
  onToggleArchived: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationsList({
  notifications,
  onToggleFavorite,
  onToggleArchived,
  onDelete,
}: NotificationsListProps) {
  const shouldReduce = useReducedMotion();

  if (notifications.length === 0) {
    return (
      <div className="flex-1 grid place-items-center text-t-17 text-neutral">
        No notifications found
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-auto">
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout={!shouldReduce}
            initial={shouldReduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={shouldReduce ? undefined : { opacity: 0, height: 0 }}
            transition={transition.enter}
          >
            <NotificationRow
              notification={notification}
              onToggleFavorite={onToggleFavorite}
              onToggleArchived={onToggleArchived}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
