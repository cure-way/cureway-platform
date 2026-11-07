import { PageHeader } from "@/components/shared";

interface Props {
  totalItems: number;
}

/**
 * The cart's page header. It used to be a 36px bold title in its own
 * full-bleed accent band at 1392px, which matched no other page; it now uses
 * the shared header inside the page's container like every other route.
 */
export default function CartHeader({ totalItems }: Props) {
  return (
    <PageHeader
      title="My Cart"
      subtitle={`${totalItems} items in total`}
      showBack
      backHref="/medicines"
    />
  );
}
