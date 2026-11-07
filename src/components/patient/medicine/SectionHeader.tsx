export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-start gap-2 mb-6">
      <div className="bg-(--color-primary) mt-2 rounded-full w-2 h-2"></div>
      <h2 className="font-bold text-gray-900 text-t-17">{title}</h2>
    </div>
  );
}
