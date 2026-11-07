import { cn } from "@/lib/utils";

/**
 * The one page container.
 *
 * Pages of the same kind share a variant, so they land on exactly the same
 * left and right edges and the same top spacing at every breakpoint. A page
 * never sets its own max-width — before this, patient routes alone started at
 * seven different left edges at 1440.
 *
 * Horizontal padding is 16 / 24 / 32 across every variant, so the gutters match
 * even where the measure differs.
 *
 * Do NOT reach for `max-w-3xl` / `4xl` / `5xl` / `6xl` / `7xl` / `xs`: those
 * classes resolve to `var(--container-Nxl)`, which the theme does not define,
 * so the declaration is invalid and no width is applied at all. See
 * docs/design-spec.md §1.
 */
export type PageContainerVariant =
  /** Listings and grids: medicines, categories, pharmacies, saved medicine, search. */
  | "list"
  /** Detail pages: a medicine, a pharmacy, an order. */
  | "detail"
  /** Forms and flows: cart, checkout, upload prescription, edit profile. 880px
   * rather than a narrow 720px column because cart and checkout are two-column. */
  | "form"
  /** Account pages: profile, orders, notifications, history, legal text. */
  | "account"
  /** Auth screens, which own the whole viewport. */
  | "auth"
  /** Pharmacy and admin dashboards: charts and wide data tables. */
  | "dashboard";

const VARIANT: Record<PageContainerVariant, string> = {
  list: "max-w-[1120px] py-6 md:py-8",
  detail: "max-w-[960px] py-6 md:py-8",
  form: "max-w-[880px] py-6 md:py-8",
  account: "max-w-[960px] py-6 md:py-8",
  auth: "max-w-[1280px] py-6 md:py-10",
  dashboard: "max-w-[1440px] py-4 md:py-6",
};

/**
 * The shell rail: the topbar, the announcements bar and the quick-action chips
 * are part of the patient shell rather than any one page, but they must line up
 * with page content rather than running to the viewport edge. They share the
 * "list" measure, which is the widest content variant, and the same gutters.
 */
export const SHELL_RAIL = "mx-auto w-full max-w-[1120px] px-4 md:px-6 lg:px-8";

export function PageContainer({
  children,
  variant = "list",
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  variant?: PageContainerVariant;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      data-page-container={variant}
      className={cn(
        "mx-auto w-full px-4 md:px-6 lg:px-8",
        VARIANT[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default PageContainer;
