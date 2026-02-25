import Link from 'next/link';
import { CATEGORIES } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="site-footer no-print">
      <div className="flag-stripe" />
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              Ghana<span>Front</span>
            </div>
            <p className="footer-tagline">
              Ghana's premier digital news platform. Accurate, timely journalism.
            </p>
          </div>

          <div>
            <h3 className="footer-heading">Sections</h3>
            <ul className="footer-links">
              {CATEGORIES.slice(1).map(c => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="footer-link">{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-heading">Site</h3>
            <ul className="footer-links">
              <li><Link href="/" className="footer-link">Home</Link></li>
              <li><Link href="/search" className="footer-link">Search</Link></li>
              <li><Link href="/admin" className="footer-link">Admin Panel</Link></li>
              <li><Link href="/api/init" className="footer-link">Init DB</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-heading">About</h3>
            <p className="footer-tagline">Accra, Ghana<br />Updated every 2 hours</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GhanaFront. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
