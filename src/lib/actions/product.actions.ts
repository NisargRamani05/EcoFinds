'use server';

import dbConnect from '../dbConnect';
import Product from '../models/Product';
import User from '../models/User';

// Your existing getProducts function should be here...
export async function getProducts() { /* ... */ }

// --- ADD THIS NEW FUNCTION ---
// This function will be the "tool" our AI can use.
export async function searchProducts(query: string) {
  console.log(`Searching for products with query: "${query}"`);
  try {
    await dbConnect();

    // Use the $text operator to perform a search on our new text index
    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } } // Also get the relevance score
    )
    .sort({ score: { $meta: "textScore" } }) // Sort by the most relevant first
    .limit(4) // Limit to the top 4 results
    .lean();

    console.log(`Found ${products.length} products.`);
    return JSON.parse(JSON.stringify(products));

  } catch (error) {
    console.error('Database error searching products:', error);
    return [];
  }
}