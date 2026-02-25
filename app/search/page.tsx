import { getDb, initDb } from '@/lib/db';
import ArticleCard from '@/components/news/ArticleCard';
import type { Article } from '@/lib/db';

export const revalidate = 0;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim() || '';
  let articles: Article[] = [];

  if (query.length > 1) {
    try {
      await initDb();
      const db = getDb();
      const results = await db.execute({
        sql: `SELECT * FROM articles WHERE status='published' AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ? OR source LIKE ?) ORDER BY created_at DESC LIMIT 30`,
        args: [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`],
      });
      articles = results.rows as unknown as Article[];
    } catch (e) { console.error(e); }
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px 80px' }}>
      <form method="GET" action="/search" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '560px' }}>
          <input
            type="text" name="q" defaultValue={query}
            placeholder="Search Ghana news…"
            autoFocus
            style={{
              flex: 1, padding: '11px 16px',
              border: '1.5px solid #E5E5E5', borderRadius: '8px',
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#0A0A0A',
              outline: 'none', background: '#fff',
            }}
          />
          <button type="submit" style={{
            padding: '11px 24px', background: '#E8001D', color: '#fff',
            border: 'none', borderRadius: '8px',
            fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700,
            cursor: 'pointer',
          }}>Search</button>
        </div>
      </form>

      {query && (
        <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '2px solid #E8001D' }}>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', fontWeight: 400, color: '#0A0A0A' }}>
            {articles.length > 0 ? `${articles.length} results for "${query}"` : `No results for "${query}"`}
          </h1>
        </div>
      )}

      {articles.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '14px' }}>
          {articles.map(a => <ArticleCard key={a.id} article={a} />)}
        </div>
      )}

      {query && articles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'DM Sans, sans-serif', color: '#9CA3AF' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
          <p style={{ fontSize: '14px' }}>No articles found. Try different keywords.</p>
        </div>
      )}
    </div>
  );
}
