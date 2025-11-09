// components/ProductCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GroupedProductCard } from '@/lib/shop-types';

export default function ProductCard({
  product,
  categorySlug,
}: {
  product: GroupedProductCard;
  categorySlug: string;
}) {
  const priceText =
    product.minPrice === product.maxPrice
      ? `$${product.minPrice.toFixed(2)}`
      : `From $${product.minPrice.toFixed(2)}`;

  // Only use groupSlug – fallback to groupId removed to prevent 404
  if (!product.groupSlug) {
    console.warn('Product missing groupSlug:', product);
    return null; // Skip rendering broken products
  }

const href = `/shop/${encodeURIComponent(categorySlug)}/${encodeURIComponent(
  product.groupSlug || product.groupId
)}${product.sampleSku ? `?sku=${encodeURIComponent(product.sampleSku)}` : ''}`;

  return (
    <Link
      href={href}
      className="group block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md transition"
    >
      <div className="aspect-square bg-gray-50 relative">
        {product.primaryImageUrl ? (
          <Image
            src={product.primaryImageUrl}
            alt={product.groupName}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">No Image</div>
        )}
        {!product.anyInStock && (
          <span className="absolute top-2 left-2 bg-white/90 text-xs px-2 py-1 rounded">Sold out</span>
        )}
      </div>

      <div className="p-3">
        <div className="font-medium line-clamp-2">{product.groupName}</div>
        <div className="mt-1 text-sm text-gray-600">{priceText}</div>
        {product.totalVariants > 1 && (
          <div className="mt-1 text-xs text-gray-500">{product.totalVariants} options</div>
        )}
      </div>
    </Link>
  );
}
