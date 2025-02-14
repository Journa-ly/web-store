import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { Product } from 'lib/shopify/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ready to Ship Designs',
  description: 'Browse our collection of ready to ship designs'
};

export default async function ReadyToShipPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  let products: Product[] = [];

  // TODO: Implement ready-to-ship products fetching here
  // This should be implemented based on your data fetching requirements

  return (
    <section>
      {products.length === 0 ? (
        <p className="h-[400px] py-3 pt-[100px] text-center text-lg">
          No ready-to-ship designs available at the moment
        </p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
