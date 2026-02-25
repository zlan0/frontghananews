import { getDb, initDb } from '@/lib/db';
import { formatDate, contentToHtml, CATEGORIES } from '@/lib/utils';
import type { Article } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/news/ArticleCard';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    await initDb();
    const db = getDb();
    const result = await db.execute({ sql: 'SELECT title, excerpt, image_url FROM articles WHERE slug = ? AND status = ?', args: [slug, 'published'] });
    const a = result.rows[0] as any;
    if (!a) return {};
    return { title: a.title, description: a.excerpt || '', openGraph: { title: a.title, description: a.excerpt || '', images: a.image_url ? [a.image_url] : [] } };
  } catch { return {}; }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    await initDb();
    const db = getDb();
    const result = await db.execute({ sql: 'SELECT * FROM articles WHERE slug = ? AND status = ?', args: [slug, 'published'] });
    const article = result.rows[0] as unknown as Article;
    if (!article) notFound();

    db.execute({ sql: 'UPDATE articles SET views = views + 1 WHERE slug = ?', args: [slug] }).catch(() => {});
    const related = await db.execute({ sql: "SELECT * FROM articles WHERE status='published' AND category=? AND slug != ? ORDER BY created_at DESC LIMIT 4", args: [article.category, slug] });
    const catLabel = CATEGORIES.find(c => c.slug === article.category)?.label || 'General';
    const htmlContent = contentToHtml(article.content);

    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} className="article-layout">

          {/* Main article */}
          <article style={{ minWidth: 0 }}>
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#9CA3AF' }}>
              <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Home</Link>
              <span>›</span>
              <Link href={`/category/${article.category}`} style={{ color: '#9CA3AF', textDecoration: 'none' }}>{catLabel}</Link>
              <span>›</span>
              <span style={{ color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</span>
            </nav>

            {/* Category + title */}
            <Link href={`/category/${article.category}`} style={{ textDecoration: 'none' }}>
              <span style={{
                display: 'inline-block', background: '#E8001D', color: '#fff',
                fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: '3px', marginBottom: '14px',
              }}>{catLabel}</span>
            </Link>

            <h1 style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontSize: 'clamp(22px, 4vw, 36px)',
              fontWeight: 400, lineHeight: 1.15,
              color: '#0A0A0A', letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}>{article.title}</h1>

            {/* Byline */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px',
              padding: '12px 0', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5',
              marginBottom: '24px',
              fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#6B7280',
            }}>
              <span style={{ fontWeight: 600, color: '#3D3D3D' }}>{article.author}</span>
              {article.source && <><span style={{ color: '#D1D5DB' }}>·</span><span>{article.source}</span></>}
              <span style={{ color: '#D1D5DB' }}>·</span>
              <time dateTime={article.created_at}>{formatDate(article.created_at)}</time>
              {article.is_ai_rewritten === 1 && (
                <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>AI Enhanced</span>
              )}
            </div>

            {/* Hero image */}
            {article.image_url && (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px', background: '#F3F4F6' }}>
                <Image src={article.image_url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:1024px) 100vw, 66vw" priority />
              </div>
            )}

            {/* Excerpt */}
            {article.excerpt && (
              <p style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                fontSize: '18px', fontWeight: 400,
                color: '#3D3D3D', lineHeight: 1.6,
                fontStyle: 'italic',
                borderLeft: '3px solid #E8001D', paddingLeft: '16px',
                marginBottom: '24px',
              }}>{article.excerpt}</p>
            )}

            {/* Body */}
            <div className="prose-article" dangerouslySetInnerHTML={{ __html: htmlContent }} style={{ maxWidth: '100%' }} />

            {/* Source */}
            {article.source_url && (
              <div style={{ marginTop: '24px', padding: '14px 16px', background: '#F7F7F8', borderRadius: '8px', border: '1px solid #E5E5E5' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#6B7280' }}>
                  Source:{' '}
                  <a href={article.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#E8001D', fontWeight: 600, textDecoration: 'none' }}>
                    {article.source || article.source_url}
                  </a>
                </p>
              </div>
            )}

            {/* Share */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E5E5E5' }}>
              <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Share</span>
              {[
                { href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`, label: '𝕏', bg: '#000' },
                { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || '')}/article/${slug}`, label: 'Facebook', bg: '#1877F2' },
                { href: `https://wa.me/?text=${encodeURIComponent(article.title)}`, label: 'WhatsApp', bg: '#25D366' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  padding: '7px 14px', background: s.bg, color: '#fff',
                  borderRadius: '6px', textDecoration: 'none',
                  fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600,
                }}>{s.label}</a>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="article-sidebar">
            {related.rows.length > 0 && (
              <div>
                <div style={{ borderBottom: '2px solid #E8001D', paddingBottom: '8px', marginBottom: '0' }}>
                  <h2 style={{ fontFamily: 'DM Sans', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8001D' }}>Related Stories</h2>
                </div>
                {(related.rows as unknown as Article[]).map(a => <ArticleCard key={a.id} article={a} variant="compact" />)}
              </div>
            )}
            <div style={{ marginTop: '24px', background: '#F7F7F8', border: '1.5px dashed #E5E5E5', borderRadius: '8px', padding: '24px', textAlign: 'center', color: '#9CA3AF' }}>
              <p style={{ fontFamily: 'DM Sans', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Advertisement</p>
              <p style={{ fontFamily: 'monospace', fontSize: '12px' }}>300×600</p>
            </div>
          </aside>
        </div>

        <style>{`
          @media(min-width:1024px){
            .article-layout{grid-template-columns:1fr 300px!important;}
            .article-sidebar{display:block!important;}
          }
          .article-sidebar{display:none;}
          @media(min-width:1024px){.article-sidebar{display:block;}}
        `}</style>
      </div>
    );
  } catch (e) {
    notFound();
  }
}
