"use client";

import { X } from "lucide-react";

export interface FilterTag {
  id: string;
  label: string;
}

interface SearchFilterTagsProps {
  tags: FilterTag[];
  onRemove: (id: string) => void;
}

export function SearchFilterTags({ tags, onRemove }: SearchFilterTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 items-center px-0">
      {tags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          className="flex items-center gap-2 border border-primary-light-active rounded-2xl text-primary-darker text-t-14 font-medium px-3 py-1.5 h-12 hover:bg-primary-light/30 transition-colors"
          onClick={() => onRemove(tag.id)}
          aria-label={`Remove ${tag.label} filter`}
        >
          <span>{tag.label}</span>
          <X className="w-4.5 h-4.5 text-primary-darker" />
        </button>
      ))}
    </div>
  );
}
