'use server';

import { getTrendingDesigns } from '@/requests/server-designs';
import TrendingDesignsCarousel from './TrendingDesignsCarousel';

export default async function TrendingDesignsServer() {
  const designs = await getTrendingDesigns(8);

  return (
    <div className="pb-12 pt-6">
      <div className="mb-8 px-4 sm:px-6 lg:px-8">
        <p className="mt-4 text-center text-xl text-gray-500">
          Check out what's popular in the community right now
        </p>
      </div>

      <TrendingDesignsCarousel designs={designs} />
    </div>
  );
}
