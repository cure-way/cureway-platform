type Props = {
  title: string;
  subtitle: string;
};

export function OrdersHeader({ title, subtitle }: Props) {
  return (
    <div className="w-full font-[var(--font-montserrat)]">
      <div className="flex flex-col gap-2">
        <h1 className="text-page-title text-primary-darker">{title}</h1>
        <p className="text-t-21 font-normal leading-[150%] text-[#9A9A9A]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
