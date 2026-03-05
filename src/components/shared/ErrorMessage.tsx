"use client";

type Props = { message: string };

export default function ErrorMessage({ message }: Props) {
  return (
    <div className="my-6 rounded-lg border border-error bg-error-light px-6 py-4 text-center text-error text-body font-medium">
      {message}
    </div>
  );
}
