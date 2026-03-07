export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-4 pb-4 h-full overflow-y-auto">{children}</div>;
}
