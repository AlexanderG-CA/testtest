'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { GroupDetail } from '@/lib/shop-types';
import { useRouter } from 'next/navigation';

export default function VariantSelector({
  group,
  sku,
}: {
  group: GroupDetail;
  sku?: string;
}) {
  const router = useRouter();

  const [color, setColor] = useState<string | undefined>(undefined);
  const [size, setSize] = useState<string | undefined>(undefined);

  // Preselect from props.sku or fallback
  useEffect(() => {
    if (sku) {
      const v = group.variants.find((x) => x.sku === sku);
      if (v) {
        setColor(v.color || undefined);
        setSize(v.size || undefined);
        return;
      }
    }
    const firstInStock = group.variants.find((x) => x.inStock) ?? group.variants[0];
    if (firstInStock) {
      setColor(firstInStock.color || undefined);
      setSize(firstInStock.size || undefined);
    }
  }, [group, sku]);

  const resolved = useMemo(() => {
    return group.variants.find(
      (v) => (color ? v.color === color : true) && (size ? v.size === size : true)
    );
  }, [group.variants, color, size]);

  const colorsAvailable = useMemo(() => group.facets.colors.map((c) => c.value), [group.facets.colors]);
  const sizesAvailable = useMemo(() => group.facets.sizes.map((s) => s.value), [group.facets.sizes]);

  const sizesEnabled = useMemo(() => {
    if (!color) return new Set(sizesAvailable);
    return new Set(group.variants.filter((v) => v.color === color).map((v) => v.size || '').filter(Boolean));
  }, [group.variants, color, sizesAvailable]);

  const colorsEnabled = useMemo(() => {
    if (!size) return new Set(colorsAvailable);
    return new Set(group.variants.filter((v) => v.size === size).map((v) => v.color || '').filter(Boolean));
  }, [group.variants, size, colorsAvailable]);

  const displayPrice =
    group.minPrice === group.maxPrice
      ? `$${group.minPrice.toFixed(2)}`
      : resolved
      ? `$${resolved.price.toFixed(2)}`
      : `From $${group.minPrice.toFixed(2)}`;

  const mainImage = resolved?.primaryImageUrl || group.heroImageUrl;

  function onAddToCart() {
    if (!resolved || !resolved.inStock) return;
    alert(`Added to cart: ${group.name} (${resolved.color || ''} ${resolved.size || ''}) [${resolved.sku}]`);
  }

  // Sync selected SKU to URL for sharability
  useEffect(() => {
    if (resolved?.sku) {
      const params = new URLSearchParams(window.location.search);
      params.set('sku', resolved.sku);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [resolved?.sku, router]);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="aspect-square bg-gray-50 relative rounded-2xl overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={group.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-400">No Image</div>
          )}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{group.name}</h1>
        <div className="mt-2 text-lg">{displayPrice}</div>

        {/* Color */}
        {colorsAvailable.length > 0 && (
          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Color</div>
            <div className="flex flex-wrap gap-2">
              {colorsAvailable.map((c) => {
                const isEnabled = colorsEnabled.has(c);
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    disabled={!isEnabled}
                    className={`px-3 py-1 rounded-full border ${
                      isSelected ? 'bg-gray-900 text-white' : ''
                    } ${!isEnabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    onClick={() => setColor(c)}
                    aria-pressed={isSelected}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Size */}
        {sizesAvailable.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Size</div>
            <div className="flex flex-wrap gap-2">
              {sizesAvailable.map((s) => {
                const isEnabled = sizesEnabled.has(s);
                const isSelected = size === s;
                return (
                  <button
                    key={s}
                    disabled={!isEnabled}
                    className={`px-3 py-1 rounded-full border ${
                      isSelected ? 'bg-gray-900 text-white' : ''
                    } ${!isEnabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    onClick={() => setSize(s)}
                    aria-pressed={isSelected}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock */}
        <div className="mt-4 text-sm">
          {resolved ? (
            resolved.inStock ? (
              <span className="text-green-700">In stock</span>
            ) : (
              <span className="text-red-700">Out of stock</span>
            )
          ) : (
            <span className="text-gray-600">Select options</span>
          )}
        </div>

        {/* SKU */}
        <div className="mt-1 text-xs text-gray-500">{resolved?.sku && <>SKU: {resolved.sku}</>}</div>

        {/* CTA */}
        <div className="mt-6">
          <button
            disabled={!resolved || !resolved.inStock}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-black text-white disabled:opacity-40"
            onClick={onAddToCart}
          >
            Add to cart
          </button>
        </div>

        {/* Details */}
        <div className="mt-8 text-sm text-gray-700 space-y-2">
          <p>
            {group.inStockAny
              ? 'This product has multiple variants. Choose color and size to see exact availability.'
              : 'Currently unavailable. Check back soon.'}
          </p>
        </div>
      </div>
    </div>
  );
}

