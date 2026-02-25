import { NextResponse } from 'next/server';
import { initDb, getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Quick connectivity test first
    const url = process.env.TURSO_DATABASE_URL;
    const token = process.env.TURSO_AUTH_TOKEN;
    
    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'TURSO_DATABASE_URL is not set in environment variables',
        hint: 'Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to your Vercel project settings under Settings → Environment Variables, then redeploy.',
      }, { status: 500 });
    }

    await initDb();
    
    const db = getDb();
    const [articles, rssSources, scrapeSources] = await Promise.all([
      db.execute("SELECT COUNT(*) as c FROM articles"),
      db.execute("SELECT COUNT(*) as c FROM rss_sources"),
      db.execute("SELECT COUNT(*) as c FROM scrape_sources"),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      stats: {
        articles: (articles.rows[0] as any).c,
        rss_sources: (rssSources.rows[0] as any).c,
        scrape_sources: (scrapeSources.rows[0] as any).c,
      },
      next_step: 'Visit /api/cron/rss to fetch your first articles',
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      error: String(e),
      hint: 'Check your TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are correctly set in Vercel environment variables.',
    }, { status: 500 });
  }
}
