export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The shell owns the frame, the gutter and the scroll container.
  return <>{children}</>;
}
