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
      <FiAlertCircle className="mb-3 text-red-600 text-t-30" />

      <p className="mb-4 font-medium text-red-600 text-t-14">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-medium text-white text-t-14 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
