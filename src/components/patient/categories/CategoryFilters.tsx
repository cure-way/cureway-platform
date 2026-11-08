import Link from "next/link";

interface Filter {
  label: string;
  value?: string;
}

interface Props {
  filters: Filter[];
  categoryId: number;
  activeSort?: string;
}

export default function CategoryFilters({
  filters,
  categoryId,
  activeSort,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        const isActive =
          (!filter.value && !activeSort) || filter.value === activeSort;

        const href = filter.value
          ? `/categories/${categoryId}?sort=${filter.value}`
          : `/categories/${categoryId}`;

        return (
          <Link
            key={filter.label}
            href={href}
            className={`
              px-4 py-2 rounded-xl text-t-14 font-medium
              transition-all duration-200
              whitespace-nowrap
              ${
                isActive
                  ? "bg-(--color-primary) text-white shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }
            `}
            aria-current={isActive ? "page" : undefined}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
