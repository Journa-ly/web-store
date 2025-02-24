import { serverSideServerClient } from 'clients/server';

/**
 * getCategories - fetches all available categories
 */
export async function getCategories() {
  try {
    const response = await serverSideServerClient.get('/designs/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * getCategory - fetches a single category by ID
 */
export async function getCategory(categoryId: string) {
  try {
    const response = await serverClient.get(`/designs/categories/${categoryId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}
