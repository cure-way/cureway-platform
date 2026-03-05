interface Props {
  message?: string;
}

export function SectionError({ message = "Something went wrong." }: Props) {
  return <div className="py-10 text-red-600 text-center">{message}</div>;
}
