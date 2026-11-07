type Props = {
  title: string;
  subtitle: string;
};

export function OrdersHeader({ title, subtitle }: Props) {
  return (
    <div className="w-full font-[var(--font-montserrat)]">
      <div className="flex flex-col gap-2">
        <h1 className="text-t-36 font-bold leading-[100%] tracking-tight text-[#263B81]">
          {title}
        </h1>
        <p className="text-2xl font-normal leading-[150%] text-[#9A9A9A]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
