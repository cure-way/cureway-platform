type EmptyStateProps = {
  message?: string;
};

export default function EmptyState({
  message = "No data found.",
}: EmptyStateProps) {
  return (
    <div className="bg-white p-10 border rounded-xl text-center">
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
