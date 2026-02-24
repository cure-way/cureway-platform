type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="bg-red-50 p-6 rounded-xl text-center">
      <p className="mb-3 font-medium text-red-600 text-sm">{message}</p>

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
