import { cn } from "@/lib/utils";

/**
 * The frame.
 *
 * One container system for all three areas, after besterra.io: a 1680px outer
 * frame with a single `clamp(1.25rem, 5vw, 3rem)` gutter. Page chrome — the
 * showcase strip, the patient header and chip row, the dashboard top bar — and
 * page content all sit on it, so their left and right edges line up exactly at
 * every breakpoint.
 *
 * Widths and the gutter come from tokens in `global.css` (`--container-max`,
 * `--container-px`, `--content-*`). Nothing else in the app sets a page
 * max-width or horizontal page padding.
 */

/** The frame: used by PageContainer and by the shell chrome. */
export const FRAME =
  "mx-auto w-full max-w-[var(--container-max)] px-[var(--container-px)]";

/**
 * Shell chrome — the showcase strip, the patient topbar, the announcements bar
 * and the quick-action chips — keeps a full-bleed background and puts only its
 * *content* on the frame, so the chrome lines up with the page beneath it.
 */
export const SHELL_RAIL = FRAME;

/**
 * Every page's outer container. It always fills the frame; a page that needs a
 * narrower column puts a <ContentColumn> inside it, which keeps the page header
 * at full width.
 */
export function PageContainer({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag data-page-container="frame" className={cn(FRAME, "py-6 md:py-8", className)}>
      {children}
    </Tag>
  );
}

/**
 * A narrower column inside the frame, for forms and long text.
 *
 * It is **left-aligned**, not centred: the page header above it stays at the
 * full frame width, and the column starts on the same left edge, so a form's
 * first field sits directly under the title.
 */
export type ContentWidth =
  /** 1280px: wide multi-column. */
  | "xl"
  /** 1200px: standard. */
  | "lg"
  /** 768px: forms and narrow content. */
  | "md"
  /** 640px: long text, legal. */
  | "sm";

const WIDTH: Record<ContentWidth, string> = {
  xl: "max-w-[var(--content-xl)]",
  lg: "max-w-[var(--content-lg)]",
  md: "max-w-[var(--content-md)]",
  sm: "max-w-[var(--content-sm)]",
};

export function ContentColumn({
  children,
  width = "md",
  className,
}: {
  children: React.ReactNode;
  width?: ContentWidth;
  className?: string;
}) {
  return (
    <div
      data-content-column={width}
      className={cn("w-full mr-auto", WIDTH[width], className)}
    >
      {children}
    </div>
  );
}

export default PageContainer;
