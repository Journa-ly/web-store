import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/requests/categories';

export const metadata: Metadata = {
  title: 'Design Categories',
  description: 'Browse our collection of design categories'
};

interface Category {
  uuid: string;
  name: string;
  description: string | null;
  priority: number;
  image_url: string | null;
  design_count: number;
}

export default async function CategoryPage() {
  let categories: Category[] = [];

  try {
    // Fetch categories from the API
    categories = await getCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Design Categories</h1>

      {categories.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-lg text-gray-600">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.uuid}
              href={`/designs/categories/${category.uuid}`}
              className="group"
            >
              <div className="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
                <figure className="relative h-48 w-full">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-base-200">
                      <span className="text-xl text-base-content/50">No Image</span>
                    </div>
                  )}
                </figure>

                <div className="card-body">
                  <h2 className="card-title">{category.name}</h2>
                  {category.description && (
                    <p className="text-sm text-base-content/70">{category.description}</p>
                  )}
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">{category.design_count} designs</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
