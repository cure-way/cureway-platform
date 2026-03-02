
interface Props {
  totalItems: number;
}

export default function CartHeader({ totalItems }: Props) {
  return (
    <div className="w-full bg-accent px-4 sm:px-8 lg:px-10 xl:px-20 pt-4 pb-8">
      <div className="max-w-[1392px] mx-auto flex items-center justify-between gap-4">
        <h1 className="text-t-36-bold text-primary font-[var(--font-montserrat)]">
          My Cart
        </h1>
        <span className="text-t-21 text-foreground font-[var(--font-montserrat)]">
          [ {totalItems} items in total ]
        </span>
      </div>
    </div>
  );
}
