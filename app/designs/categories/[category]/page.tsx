import { Metadata } from 'next';
import { getCategory } from '@/requests/categories';
import { CategoryDesignList } from '@/components/designs/CategoryDesignList';
import { Category } from '@/types/category';
import Image from 'next/image';
import { redirect } from 'next/navigation';

function CategoryHeader({ category }: { category: Category }) {
  return (
    <div className="mb-8">
      <div className="relative mb-6 h-48 w-full overflow-hidden rounded-lg md:h-72">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 640px, 1280px"
            priority
            quality={85}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-base-200"></div>
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-[4.5rem]">
            {category.name.toUpperCase()}
          </h1>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const pageParams = await params;
  const { data: category } = await getCategory(pageParams.category);

  if (!category) {
    return redirect(`/designs/categories?message=${pageParams.category} not found`);
  }

  return {
    title: `${category.name} Designs | Journa`,
    description: category.description || `Browse ${category.name} designs on Journa`
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const pageParams = await params;
  const { data: category } = await getCategory(pageParams.category);

  if (!category) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-lg text-red-500">Category not found</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 pb-8">
      <CategoryHeader category={category} />
      <CategoryDesignList categoryId={pageParams.category} />
    </section>
  );
}
