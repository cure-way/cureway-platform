import { FiEdit } from "react-icons/fi";

interface Props {
  name: string;
  onEdit: () => void;
}

export default function ProfileHeader({ name, onEdit }: Props) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="font-semibold text-[#0F172A] text-[26px]">{name}</h1>

      <button
        onClick={onEdit}
        className="flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-primary-dark) px-4 py-2.5 rounded-lg font-medium text-white text-sm"
      >
        <FiEdit size={16} />
        Edit Profile
      </button>
    </div>
  );
}
