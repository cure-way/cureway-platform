"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FiCamera } from "react-icons/fi";

interface Props {
  image: string;
  name: string;
  onSave?: (file: File) => void;
}

export default function ProfileAvatar({ image, name, onSave }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string>(image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);
    setSelectedFile(file);
  };

  const handleSave = () => {
    if (!selectedFile) return;

    // onSave?.(selectedFile);

    // setSelectedFile(null);
  };

  return (
    <div className="flex gap-6 mb-8">
      {/* Avatar */}
      <div className="relative w-28 h-28">
        <Image
          src={preview}
          alt={name}
          width={112}
          height={112}
          className="border border-gray-200 rounded-full w-28 h-28 object-cover"
        />

        {/* Camera button */}
        <button
          onClick={openFilePicker}
          className="right-0 bottom-0 absolute flex justify-center items-center bg-(--color-primary) hover:bg-(--color-primary-dark) shadow-md rounded-full w-10 h-10 text-white"
        >
          <FiCamera size={18} />
        </button>

        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Save Button */}
      {selectedFile && (
        <button
          onClick={handleSave}
          className="hover:bg-(--color-primary) px-4 py-2 border rounded-lg h-fit text-gray-500 hover:text-white text-sm transition-all roundedlg"
        >
          Save Image
        </button>
      )}
    </div>
  );
}
