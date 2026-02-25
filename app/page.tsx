import { getDb, initDb } from '@/lib/db';
import ArticleCard from '@/components/news/ArticleCard';
import type { Article } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 300;

async function getArticles() {
  try {
    await initDb();
    const db = getDb();
    const [hero, grid, politics, sports, business, entertainment, more] = await Promise.all([
      db.execute("SELECT * FROM articles WHERE status='published' ORDER BY created_at DESC LIMIT 1"),
      db.execute("SELECT * FROM articles WHERE status='published' ORDER BY created_at DESC LIMIT 5 OFFSET 1"),
      db.execute("SELECT * FROM articles WHERE status='published' AND category='politics' ORDER BY created_at DESC LIMIT 4"),
      db.execute("SELECT * FROM articles WHERE status='published' AND category='sports' ORDER BY created_at DESC LIMIT 4"),
      db.execute("SELECT * FROM articles WHERE status='published' AND category='business' ORDER BY created_at DESC LIMIT 5"),
      db.execute("SELECT * FROM articles WHERE status='published' AND category='entertainment' ORDER BY created_at DESC LIMIT 5"),
      db.execute("SELECT * FROM articles WHERE status='published' ORDER BY created_at DESC LIMIT 12 OFFSET 6"),
    ]);
    return {
      hero: hero.rows as unknown as Article[],
      grid: grid.rows as unknown as Article[],
      politics: politics.rows as unknown as Article[],
      sports: sports.rows as unknown as Article[],
      business: business.rows as unknown as Article[],
      entertainment: entertainment.rows as unknown as Article[],
      more: more.rows as unknown as Article[],
      hasArticles: (hero.rows.length + grid.rows.length) > 0,
    };
  } catch (e) {
    if (process.env.NODE_ENV === 'production' && process.env.TURSO_DATABASE_URL) console.error(e);
    return { hero: [], grid: [], politics: [], sports: [], business: [], entertainment: [], more: [], hasArticles: false };
  }
}

export default async function HomePage() {
  const { hero, grid, politics, sports, business, entertainment, more, hasArticles } = await getArticles();

  if (!hasArticles) return <EmptyState />;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 16px 80px', background: 'transparent' }}>

      {/* ── Hero + Grid ── */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }} className="hero-grid">
          {hero[0] && (
            <div className="hero-main">
              <ArticleCard article={hero[0]} variant="hero" />
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="hero-side">
            {grid.slice(0, 4).map(a => <ArticleCard key={a.id} article={a} variant="featured" />)}
          </div>
        </div>
        <style>{`
          @media(min-width:768px){
            .hero-grid{grid-template-columns:3fr 2fr!important;}
            .hero-side{grid-template-columns:1fr 1fr!important;}
          }
          @media(min-width:1024px){
            .hero-grid{grid-template-columns:5fr 3fr!important;}
          }
        `}</style>
      </section>

      {/* ── Main + Sidebar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} className="main-layout">
        <div className="main-col">

          {/* Latest */}
          {grid.length > 4 && (
            <section style={{ marginBottom: '40px' }}>
              <SectionHeader title="Latest News" href="/" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '14px' }}>
                {grid.slice(4).map(a => <ArticleCard key={a.id} article={a} />)}
              </div>
            </section>
          )}

          {/* Politics */}
          {politics.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <SectionHeader title="Politics" href="/category/politics" accent="#E8001D" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '14px' }}>
                {politics.map(a => <ArticleCard key={a.id} article={a} />)}
              </div>
            </section>
          )}

          {/* Sports */}
          {sports.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <SectionHeader title="Sports" href="/category/sports" accent="#1D4ED8" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '14px' }}>
                {sports.map(a => <ArticleCard key={a.id} article={a} />)}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="sidebar-col">
          {business.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <SectionHeader title="Business" href="/category/business" accent="#059669" />
              {business.map(a => <ArticleCard key={a.id} article={a} variant="compact" />)}
            </div>
          )}
          {entertainment.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <SectionHeader title="Entertainment" href="/category/entertainment" accent="#7C3AED" />
              {entertainment.map(a => <ArticleCard key={a.id} article={a} variant="compact" />)}
            </div>
          )}
          <AdSlot size="300×250" />
        </aside>
      </div>

      <style>{`
        @media(min-width:1024px){
          .main-layout{grid-template-columns:1fr 300px!important;}
        }
      `}</style>

      {/* More stories */}
      {more.length > 0 && (
        <section style={{ marginTop: '0' }}>
          <SectionHeader title="More Stories" href="/" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '12px' }}>
            {more.map(a => <ArticleCard key={a.id} article={a} variant="horizontal" />)}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ title, href, accent = '#E8001D' }: { title: string; href: string; accent?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: '14px', paddingBottom: '10px',
      borderBottom: `2px solid ${accent}`,
    }}>
      <h2 style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: accent,
      }}>{title}</h2>
      <Link href={href} style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '11px', fontWeight: 600,
        color: accent, textDecoration: 'none',
        letterSpacing: '0.04em',
      }}>See all →</Link>
    </div>
  );
}

function AdSlot({ size }: { size: string }) {
  return (
    <div style={{
      background: '#F7F7F8',
      border: '1.5px dashed #E5E5E5',
      borderRadius: '8px',
      padding: '24px',
      textAlign: 'center',
      color: '#9CA3AF',
    }}>
      <p style={{ fontFamily: 'DM Sans', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Advertisement</p>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>{size}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ maxWidth: '480px', margin: '80px auto', textAlign: 'center', padding: '0 16px' }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '12px',
        background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', margin: '0 auto 20px',
      }}>📰</div>
      <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', color: '#0A0A0A', marginBottom: '8px' }}>No articles yet</h2>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#6B7280', lineHeight: 1.6, marginBottom: '24px' }}>
        Articles will appear once the scraper runs. Visit the admin panel to initialize the database and fetch your first articles.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <a href="/api/init" style={btnStyle('#0A0A0A')}>① Initialize Database</a>
        <a href="/api/cron/rss" style={btnStyle('#E8001D')}>② Fetch RSS Articles</a>
        <Link href="/admin" style={btnStyle('#374151')}>Go to Admin Panel</Link>
      </div>
    </div>
  );
}
const btnStyle = (bg: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  padding: '10px 24px', background: bg, color: '#fff',
  borderRadius: '8px', textDecoration: 'none',
  fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600,
  width: '100%', maxWidth: '280px',
});
