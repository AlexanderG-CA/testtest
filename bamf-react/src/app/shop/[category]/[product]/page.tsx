// app/shop/[category]/[product]/page.tsx
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import VariantSelector from '@/components/VariantSelector';
import { fetchCategories, fetchGroupDetail } from '@/lib/api-client';

type Props = {
  params: { category: string; product: string };
  searchParams?: { sku?: string };
};

export async function generateMetadata({ params }: Props) {
  const title = `${decodeURIComponent(params.product)} • ${decodeURIComponent(params.category)} • Shop`;
  return { title };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const categorySlug = decodeURIComponent(params.category);
  const groupSlug = decodeURIComponent(params.product);
  const sku = searchParams?.sku;

  const [categories, group] = await Promise.all([
    fetchCategories(),
    fetchGroupDetail(groupSlug, sku),
  ]);

  const category = categories.find((c) => c.slug === categorySlug);
  if (!group) notFound();

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: category?.name || categorySlug, href: `/shop/${encodeURIComponent(categorySlug)}` },
          { label: group.name },
        ]}
      />

      <VariantSelector group={group} sku={sku} />

      {/* Related products / more from category */}
    </main>
  );
}

