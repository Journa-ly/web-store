import { serverSideServerClient } from 'clients/server';
import * as Sentry from '@sentry/nextjs';
import { Category } from '@/types/category';
/**
 * getCategories - fetches all available categories
 */
export async function getCategories() {
  let returnValue: { data: Category[]; error: unknown } = {
    data: [],
    error: null
  };
  try {
    const response = await serverSideServerClient.get('/designs/categories/');
    returnValue.data = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    Sentry.captureException(error);
    returnValue.error = error;
  }

  return returnValue;
}

/**
 * getCategory - fetches a single category by ID
 */
export async function getCategory(categoryPath: string) {
  let returnValue: { data: Category | null; error: unknown } = {
    data: null,
    error: null
  };
  try {
    const response = await serverSideServerClient.get(`/designs/categories/${categoryPath}/`);
    returnValue.data = response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    Sentry.captureException(error);
    returnValue.error = error;
  }
  return returnValue;
}
