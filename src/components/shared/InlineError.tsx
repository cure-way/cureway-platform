
// ===================================================================
// INLINE ERROR COMPONENT
// ===================================================================

import { motion } from "framer-motion";
import {  AlertTriangle, RefreshCw } from "lucide-react";


interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
}

export function InlineError({ message, onRetry }: InlineErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-error-light border border-error rounded-lg"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="text-error flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-t-14 text-error-dark font-medium mb-2">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-t-12 text-error hover:text-error-dark font-medium flex items-center gap-1"
            >
              <RefreshCw size={12} />
              Try Again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}