import { cn } from "@/lib/utils";

/**
 * The one page container.
 *
 * Every route puts its header and its body inside the same instance, so the
 * two always share a left and right edge. Before this, the content blocks of a
 * single page could start at different x positions — on Upload Prescription
 * the header sat at x=80 and the cards at x=208.
 *
 * Do NOT reach for `max-w-3xl` / `4xl` / `5xl` / `6xl` / `7xl` / `xs` instead:
 * those classes compile to `max-width: var(--container-5xl)` and friends, and
 * those variables are not defined in the theme, so the declaration is invalid
 * and no width is applied at all. See docs/design-spec.md §1.
 */
export type PageContainerWidth = "default" | "wide";

const WIDTH: Record<PageContainerWidth, string> = {
  // Comfortable measure for cards, forms and reading.
  default: "max-w-[1120px]",
  // Dashboards and full-bleed data tables only. Matches --container-2xl.
  wide: "max-w-[1440px]",
};

export function PageContainer({
  children,
  width = "default",
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  width?: PageContainerWidth;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full",
        WIDTH[width],
        // 16 / 24 / 32 horizontal padding per breakpoint, per the spec.
        "px-4 md:px-6 lg:px-8",
        "py-6 md:py-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default PageContainer;
