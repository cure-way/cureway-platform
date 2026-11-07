interface Props {
  completedPercent: number;
  pendingPercent: number;
}

export function OrdersStatusInfo({ completedPercent, pendingPercent }: Props) {
  return (
    <div className="space-y-2 w-full max-w-[20rem]">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Completed</span>
        <span className="font-medium text-(--color-primary)">
          {completedPercent}%
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Pending</span>
        <span className="font-medium text-(--color-secondary)">
          {pendingPercent}%
        </span>
      </div>
    </div>
  );
}
