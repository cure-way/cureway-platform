// ===================================================================
// EMPTY STATE COMPONENT
// ===================================================================

import  {  type ReactNode } from "react";
import { motion } from "framer-motion";
import { ANIMATION } from "../../constants/cart.constants";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ANIMATION.DURATION.NORMAL / 1000,
        ease: ANIMATION.EASE.DEFAULT,
      }}
      className="text-center py-16 px-6"
    >
      {/* Icon */}
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-light flex items-center justify-center text-muted-foreground"
        >
          {icon}
        </motion.div>
      )}

      {/* Content */}
      <h3 className="text-t-21 font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-t-14 text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <button onClick={action.onClick} className="btn btn-lg btn-primary">
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
