// app/shop/page.tsx
import { fetchCategories } from '@/lib/api-client';
import type { Category } from '@/lib/shop-types';
import Link from 'next/link';

export const metadata = {
  title: 'Shop',
};

export default async function ShopLanding() {
  let categories: Category[] = [];
  try {
    categories = await fetchCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    // Return empty state or mock data
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Shop</h1>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Backend API is not available. Please start the backend server.</p>
          <p className="text-sm text-gray-400">Expected API at: https://localhost:7039</p>
        </div>
      ) : (
        <section>
          <h2 className="text-lg font-medium mb-3">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop/${encodeURIComponent(c.slug)}`}
                className="block rounded-2xl border border-gray-200 p-5 hover:shadow-md transition"
              >
                <div className="text-lg font-medium">{c.name}</div>
                <div className="text-sm text-gray-500 mt-1">Explore {c.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
