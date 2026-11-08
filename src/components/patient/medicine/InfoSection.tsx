import SectionHeader from "./SectionHeader";

interface InfoSectionProps {
  title: string;
  content: string;
  isLast?: boolean;
}

export default function InfoSection({
  title,
  content,
  isLast = false,
}: InfoSectionProps) {
  return (
    <div className={!isLast ? "mb-8 pb-8 border-b border-gray-200" : ""}>
      <SectionHeader title={title} />
      <p className="pl-4 text-gray-700 text-t-14 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}
