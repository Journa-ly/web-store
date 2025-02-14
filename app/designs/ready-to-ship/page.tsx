import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { Product } from 'lib/shopify/types';
import { getCollection, getCollectionProducts } from 'lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';


export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection("ready-to-ship");

  return {
    title: collection.seo?.title || collection.title || "Ready to Ship",
    description:
      collection.seo?.description || collection.description || `${collection.title}` || "Ready to Ship products"
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  let products: Product[] = [];
  try {
    products = await getCollectionProducts({ collection: "ready-to-ship", sortKey, reverse });
  } catch (error) {
    console.error(error);
  }

  return (
    <section>
      {products.length === 0 ? (
        <p className="h-[400px] py-3 pt-[100px] text-center text-lg">{`No designs found in this category`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
