'use server';

import { Design } from '@/types/design';
import { serverClient } from '../../clients/server';
import TrendingDesignsCarousel from './TrendingDesignsCarousel';

async function getTrendingDesigns() {
  try {
    const response = await serverClient.get('/designs/trending/?page_size=8');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending designs:', error);
    return [];
  }
}

export default async function TrendingDesignsServer() {
  const designs = await getTrendingDesigns();

  return (
    <div className="pt-6 pb-12">
      <div className="mb-8 px-4 sm:px-6 lg:px-8">
        <p className="mt-4 text-xl text-center text-gray-500">
          Check out what's popular in the community right now
        </p>
      </div>
      
      <TrendingDesignsCarousel designs={designs} />
    </div>
  );
} 