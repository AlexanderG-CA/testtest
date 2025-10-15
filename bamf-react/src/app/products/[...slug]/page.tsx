import React from "react";
import { notFound } from "next/navigation";

// /src/app/products/[...slug]/page.tsx

type Props = { params: { slug?: string[] } };

const getData = async (slug: string) => {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { slug };
};


/**
 * Replace this with your real data fetching logic (CMS / DB / API).
 * Expect category in params.slug[0] and product handle in params.slug[1..].
 */
async function fetchProduct(category: string | undefined, handle: string | undefined) {
  // demo/mock: return null when no product found
  if (!category) return null;
  if (!handle) {
    // when there's only a category (e.g. /products/mens) you might return a list instead
    return { type: "category", category, title: category };
  }
  // pretend we found a product
  return {
    type: "product",
    id: `${category}/${handle}`,
    category,
    handle,
    title: handle.replace(/-/g, " "),
    description: `Demo product ${handle} in ${category}`,
  };
}

const ItemPage = async ({ params }: Props) => {
  await getData(params?.slug?.join("/") || "");
  const slug = params?.slug ?? [];
  const category = slug[0];
  // join remaining segments so URLs like /products/a/b/c work too
  const handle = slug.length > 1 ? slug.slice(1).join("/") : undefined;

  const data = await fetchProduct(category, handle);

  if (!data) {
    // no category -> 404
    return notFound();
  }

  if (data.type === "category") {
    // category listing placeholder
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-semibold">Category: {data.category}</h1>
        <p className="text-gray-500 mt-2">Showing products for {data.category}...</p>
      </main>
    );
  }

  // product page
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p className="text-sm text-gray-500 mt-1">Category: {data.category}</p>
      <p className="mt-4">{data.description}</p>
    </main>
  );
};

export default ItemPage;
