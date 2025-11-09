// components/ListingFilters.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

export default function ListingFilters({
  availableColors,
  availableSizes,
}: {
  availableColors: string[];
  availableSizes: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [localMin, setLocalMin] = useState(sp.get('min') || '');
  const [localMax, setLocalMax] = useState(sp.get('max') || '');

  const updateParam = useCallback(
    (key: string, value?: string | null) => {
      const next = new URLSearchParams(sp.toString());
      if (!value) next.delete(key);
      else next.set(key, value);
      router.replace(`${pathname}?${next.toString()}`);
    },
    [router, pathname, sp]
  );

  const current = useMemo(
    () => ({
      color: sp.get('color') || '',
      size: sp.get('size') || '',
      sort: sp.get('sort') || 'price-asc',
      min: sp.get('min') || '',
      max: sp.get('max') || '',
      pageSize: sp.get('pageSize') || '24',
    }),
    [sp]
  );

  return (
    <aside className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full border ${!current.color ? 'bg-gray-900 text-white' : ''}`}
            onClick={() => updateParam('color', null)}
          >
            All
          </button>
          {availableColors.map((c) => (
            <button
              key={c}
              className={`px-3 py-1 rounded-full border ${
                current.color === c ? 'bg-gray-900 text-white' : ''
              }`}
              onClick={() => updateParam('color', c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Size</label>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full border ${!current.size ? 'bg-gray-900 text-white' : ''}`}
            onClick={() => updateParam('size', null)}
          >
            All
          </button>
          {availableSizes.map((s) => (
            <button
              key={s}
              className={`px-3 py-1 rounded-full border ${current.size === s ? 'bg-gray-900 text-white' : ''}`}
              onClick={() => updateParam('size', s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Min price</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={() => updateParam('min', localMin || null)}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max price</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={() => updateParam('max', localMax || null)}
            placeholder="1000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sort</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={current.sort}
          onChange={(e) => updateParam('sort', e.target.value)}
        >
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
        </select>
      </div>
    </aside>
  );
}
