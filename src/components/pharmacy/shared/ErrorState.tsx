import { FiAlertCircle } from "react-icons/fi";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <FiAlertCircle className="mb-3 text-red-600 text-4xl" />

      <p className="mb-4 font-medium text-red-600 text-sm">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-medium text-white text-sm transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
