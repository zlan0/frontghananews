'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/category/politics', label: 'Politics' },
  { href: '/category/business', label: 'Business' },
  { href: '/category/sports', label: 'Sports' },
  { href: '/category/entertainment', label: 'Entertainment' },
  { href: '/category/technology', label: 'Tech' },
  { href: '/category/health', label: 'Health' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const pathname = usePathname();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
  };

  return (
    <>
      {/* ── Top micro-bar ── */}
      <div style={{ background: '#0A0A0A', color: '#9CA3AF', fontSize: '11px', padding: '5px 0' }} className="hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-GH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <Link href="/admin" style={{ color: '#9CA3AF', fontWeight: 500 }} className="hover:text-white transition-colors">
            Admin ↗
          </Link>
        </div>
      </div>

      {/* ── Main header ── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="flag-stripe" />

        <div className="max-w-7xl mx-auto px-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>

            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 'clamp(20px, 4vw, 26px)',
                  fontWeight: 400,
                  color: '#0A0A0A',
                  letterSpacing: '-0.02em',
                }}>
                  Ghana<span style={{ color: '#E8001D' }}>Front</span>
                </span>
                <span style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#9CA3AF',
                  marginTop: '1px',
                }}>Ghana's News Leader</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex" style={{ gap: '2px' }}>
              {NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link${pathname === item.href ? ' active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }} style={{
                background: searchOpen ? '#F7F7F8' : 'transparent',
                border: '1px solid transparent',
                borderRadius: '6px',
                padding: '7px',
                cursor: 'pointer',
                color: '#3D3D3D',
                display: 'flex', alignItems: 'center',
                transition: 'all 0.15s',
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>

              <button className="lg:hidden" onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }} style={{
                background: menuOpen ? '#F7F7F8' : 'transparent',
                border: '1px solid transparent',
                borderRadius: '6px',
                padding: '7px',
                cursor: 'pointer',
                color: '#3D3D3D',
                display: 'flex', alignItems: 'center',
              }}>
                {menuOpen
                  ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div style={{ paddingBottom: '10px' }}>
              <form onSubmit={onSearch} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text" value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Search Ghana news…"
                  autoFocus
                  style={{
                    flex: 1, padding: '9px 14px',
                    border: '1.5px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#0A0A0A',
                    outline: 'none',
                    background: '#F7F7F8',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#E8001D'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E5E5'; e.target.style.background = '#F7F7F8'; }}
                />
                <button type="submit" style={{
                  padding: '9px 18px',
                  background: '#E8001D', color: '#fff',
                  border: 'none', borderRadius: '8px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                }}>Search</button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ borderTop: '1px solid #E5E5E5', background: '#fff' }}>
            <div className="max-w-7xl mx-auto px-4 py-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
              {NAV.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '12px', fontWeight: 600,
                  textAlign: 'center',
                  padding: '8px 4px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: pathname === item.href ? '#E8001D' : '#3D3D3D',
                  background: pathname === item.href ? '#FFF1F2' : '#F7F7F8',
                }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Breaking news bar ── */}
      <div style={{ background: '#E8001D', overflow: 'hidden' }}>
        <div className="max-w-7xl mx-auto" style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            background: '#B8001A',
            color: '#fff',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '6px 12px', flexShrink: 0,
          }}>Live</span>
          <div className="ticker-wrap" style={{ flex: 1 }}>
            <div className="ticker-inner" style={{
              color: '#fff',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '12px', fontWeight: 500,
              padding: '6px 16px',
            }}>
              Ghana's latest news — Politics · Business · Sports · Entertainment · Technology · Health
              &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
              Stay informed with GhanaFront — Updated every 2 hours
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="bottom-nav no-print">
        {[
          { href: '/', label: 'Home', icon: <HomeIcon /> },
          { href: '/category/politics', label: 'Politics', icon: <PoliticsIcon /> },
          { href: '/category/sports', label: 'Sports', icon: <SportsIcon /> },
          { href: '/category/business', label: 'Business', icon: <BizIcon /> },
          { href: '/search', label: 'Search', icon: <SearchIcon /> },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            padding: '4px 8px', textDecoration: 'none',
            color: pathname === item.href ? '#E8001D' : '#6B7280',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '10px', fontWeight: 600,
            transition: 'color 0.15s',
          }}>
            <span style={{ display: 'flex' }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

const HomeIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const PoliticsIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const SportsIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const BizIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const SearchIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
