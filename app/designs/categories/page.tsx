import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { Product } from 'lib/shopify/types';

// export async function generateMetadata(props: {
//   params: Promise<{ category: string }>;
// }): Promise<Metadata> {
//   const params = await props.params;
//   const collection = await getCollection(params.collection);

//   if (!collection) return notFound();

//   return {
//     title: collection.seo?.title || collection.title,
//     description:
//       collection.seo?.description || collection.description || `${collection.title} products`
//   };
// }

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // const searchParams = await props.searchParams;
  // const params = await props.params;
  // const { sort } = searchParams as { [key: string]: string };
  // const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  let products: Product[] = [];
  // try {
  //   products = await getCollectionProducts({ collection: params.collection, sortKey, reverse });
  // } catch (error) {
  //   console.error(error);
  // }

  return (
    <section>
      {products.length === 0 ? (
        <p className="h-[400px] py-3 pt-[100px] text-center text-lg">{`No categories found.`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
