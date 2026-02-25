import { getDb, initDb } from '@/lib/db';
import ArticleCard from '@/components/news/ArticleCard';
import type { Article } from '@/lib/db';
import { CATEGORIES } from '@/lib/utils';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const cat = CATEGORIES.find(c => c.slug === categorySlug);
  if (!cat) return {};
  return { title: `${cat.label} News`, description: `Latest ${cat.label} news from Ghana` };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ category: string }>; searchParams: Promise<{ page?: string }> }) {
  const { category: categorySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const cat = CATEGORIES.find(c => c.slug === categorySlug);
  if (!cat) notFound();

  const page = parseInt(resolvedSearchParams.page || '1');
  const perPage = 18;
  const offset = (page - 1) * perPage;

  try {
    await initDb();
    const db = getDb();
    const whereClause = categorySlug === 'general' ? `WHERE status='published'` : `WHERE status='published' AND category='${categorySlug}'`;
    const [articles, countResult] = await Promise.all([
      db.execute(`SELECT * FROM articles ${whereClause} ORDER BY created_at DESC LIMIT ${perPage} OFFSET ${offset}`),
      db.execute(`SELECT COUNT(*) as total FROM articles ${whereClause}`),
    ]);
    const total = (countResult.rows[0] as any).total;
    const totalPages = Math.ceil(total / perPage);
    const items = articles.rows as unknown as Article[];

    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px 80px' }}>
        <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #E8001D' }}>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(24px,4vw,32px)', fontWeight: 400, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            {cat.label}
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
            {total} articles · Page {page} of {totalPages}
          </p>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF', fontFamily: 'DM Sans, sans-serif' }}>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>No articles in this category yet.</p>
            <Link href="/" style={{ color: '#E8001D', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>← Back to Home</Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '14px' }}>
              {items.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '32px' }}>
                {page > 1 && <Link href={`/category/${categorySlug}?page=${page - 1}`} className="page-btn">‹</Link>}
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1;
                  return <Link key={p} href={`/category/${categorySlug}?page=${p}`} className={`page-btn ${p === page ? 'active' : ''}`}>{p}</Link>;
                })}
                {page < totalPages && <Link href={`/category/${categorySlug}?page=${page + 1}`} className="page-btn">›</Link>}
              </div>
            )}
          </>
        )}
      </div>
    );
  } catch (e) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#E8001D', fontFamily: 'DM Sans' }}>Error loading articles. Please try again.</div>;
  }
}
