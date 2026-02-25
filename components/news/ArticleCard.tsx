import Link from 'next/link';
import Image from 'next/image';
import { formatDate, CATEGORIES } from '@/lib/utils';
import type { Article } from '@/lib/db';

interface Props {
  article: Article;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal' | 'hero';
}

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  politics:      { bg: '#FEE2E2', text: '#B91C1C' },
  business:      { bg: '#D1FAE5', text: '#065F46' },
  sports:        { bg: '#DBEAFE', text: '#1E40AF' },
  entertainment: { bg: '#EDE9FE', text: '#6D28D9' },
  health:        { bg: '#D1FAE5', text: '#065F46' },
  technology:    { bg: '#CFFAFE', text: '#155E75' },
  general:       { bg: '#F3F4F6', text: '#374151' },
};

function Chip({ category }: { category: string }) {
  const c = CAT_COLORS[category] || CAT_COLORS.general;
  const label = CATEGORIES.find(x => x.slug === category)?.label || 'General';
  return (
    <span className="chip" style={{ background: c.bg, color: c.text }}>{label}</span>
  );
}

export default function ArticleCard({ article, variant = 'default' }: Props) {

  /* ── HERO (large feature) ── */
  if (variant === 'hero') {
    return (
      <Link href={`/article/${article.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <article style={{
          position: 'relative', borderRadius: '10px', overflow: 'hidden',
          height: '420px', background: '#111',
        }}>
          {article.image_url
            ? <Image src={article.image_url} alt={article.title} fill style={{ objectFit: 'cover', opacity: 0.55 }} sizes="(max-width:768px) 100vw, 60vw" priority />
            : <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a0a00,#4a0010)' }} />
          }
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
            <Chip category={article.category} />
            <h2 style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontSize: 'clamp(18px, 3vw, 26px)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.2,
              marginTop: '8px',
              marginBottom: '10px',
              letterSpacing: '-0.01em',
            }}>{article.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
              <span>{article.source || 'GhanaFront'}</span>
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  /* ── FEATURED (medium overlay) ── */
  if (variant === 'featured') {
    return (
      <Link href={`/article/${article.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <article style={{
          position: 'relative', borderRadius: '10px', overflow: 'hidden',
          height: '220px', background: '#111',
        }}>
          {article.image_url
            ? <Image src={article.image_url} alt={article.title} fill style={{ objectFit: 'cover', opacity: 0.5 }} sizes="33vw" />
            : <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0a1628,#1e3a5f)' }} />
          }
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px' }}>
            <Chip category={article.category} />
            <h3 style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontSize: '15px', fontWeight: 400,
              color: '#fff', lineHeight: 1.25,
              marginTop: '6px',
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{article.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontFamily: 'DM Sans', fontWeight: 500, marginTop: '6px' }}>
              {formatDate(article.created_at)}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  /* ── COMPACT (sidebar list) ── */
  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <article style={{
          display: 'flex', gap: '12px', padding: '12px 0',
          borderBottom: '1px solid #F0F0F0',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Chip category={article.category} />
            <h4 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px', fontWeight: 600,
              color: '#0A0A0A', lineHeight: 1.35,
              marginTop: '5px',
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{article.title}</h4>
            <p style={{ color: '#9CA3AF', fontSize: '11px', fontFamily: 'DM Sans', fontWeight: 500, marginTop: '4px' }}>
              {formatDate(article.created_at)}
            </p>
          </div>
          {article.image_url && (
            <div style={{ position: 'relative', width: '64px', height: '56px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', background: '#F3F4F6' }}>
              <Image src={article.image_url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="64px" />
            </div>
          )}
        </article>
      </Link>
    );
  }

  /* ── HORIZONTAL ── */
  if (variant === 'horizontal') {
    return (
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <article className="card" style={{ display: 'flex', gap: '0', overflow: 'hidden' }}>
          <div style={{ position: 'relative', width: '120px', minWidth: '120px', background: '#F3F4F6' }}>
            {article.image_url
              ? <Image src={article.image_url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="120px" />
              : <div className="img-fallback" style={{ position: 'absolute', inset: 0 }}>📰</div>
            }
          </div>
          <div style={{ flex: 1, padding: '12px 14px' }}>
            <Chip category={article.category} />
            <h4 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px', fontWeight: 600,
              color: '#0A0A0A', lineHeight: 1.35,
              marginTop: '6px',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{article.title}</h4>
            <p style={{ color: '#9CA3AF', fontSize: '11px', fontFamily: 'DM Sans', fontWeight: 500, marginTop: '5px' }}>
              {article.source || 'GhanaFront'} · {formatDate(article.created_at)}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  /* ── DEFAULT card ── */
  return (
    <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', height: '176px', background: '#F3F4F6', flexShrink: 0 }}>
          {article.image_url
            ? <Image src={article.image_url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
            : <div className="img-fallback" style={{ position: 'absolute', inset: 0 }}>📰</div>
          }
          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <Chip category={article.category} />
          </div>
        </div>
        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontSize: '15px', fontWeight: 400,
            color: '#0A0A0A', lineHeight: 1.3,
            flex: 1,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{article.title}</h3>
          {article.excerpt && (
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '12px', color: '#6B7280', lineHeight: 1.5,
              marginTop: '6px',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{article.excerpt}</p>
          )}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            marginTop: '10px', paddingTop: '10px',
            borderTop: '1px solid #F0F0F0',
            color: '#9CA3AF', fontSize: '11px',
            fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
          }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.source || 'GhanaFront'}</span>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#D1D5DB', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap' }}>{formatDate(article.created_at)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
