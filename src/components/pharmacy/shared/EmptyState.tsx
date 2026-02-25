import { FiInbox } from "react-icons/fi";

type EmptyStateProps = {
  message?: string;
};

export default function EmptyState({
  message = "No data found.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <FiInbox className="mb-3 text-gray-400 text-4xl" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
