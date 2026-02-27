import { Control, UseFormRegister, useFieldArray } from "react-hook-form";
import { MedicineFormValues } from "@/types/pharmacyTypes";

interface EditableNotesFieldProps {
  control: Control<MedicineFormValues>;
  register: UseFormRegister<MedicineFormValues>;
}

export default function EditableNotesField({
  control,
  register,
}: EditableNotesFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "notes",
  });

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="font-medium text-gray-700">Inventory Notes</label>

        <button
          type="button"
          onClick={() => append({ value: "" })}
          className="text-blue-600 text-xs"
        >
          + Add Note
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <input
            {...register(`notes.${index}.value` as const)}
            className="px-3 py-2 border rounded-lg w-full"
            placeholder="Enter note..."
          />

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500 text-xs"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
