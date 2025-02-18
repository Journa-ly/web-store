import { serverClient } from 'clients/server';

export async function getCategories() {
  try {
    const response = await serverClient.get('/designs/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
