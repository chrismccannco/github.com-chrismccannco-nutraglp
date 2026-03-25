import { NextRequest, NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getPropertyId(): Promise<string | null> {
  // Check env first, then site_settings
  if (process.env.GA4_PROPERTY_ID) return process.env.GA4_PROPERTY_ID;
  try {
    const db = getDb();
    const r = await db.execute({
      sql: "SELECT value FROM site_settings WHERE key = 'ga4_property_id'",
      args: [],
    });
    return (r.rows[0]?.value as string) || null;
  } catch {
    return null;
  }
}

function buildClient() {
  // Prefer explicit env vars; fall back to GOOGLE_APPLICATION_CREDENTIALS file
  const clientEmail = process.env.GA4_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GA4_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, "\n");

  if (clientEmail && privateKey) {
    return new BetaAnalyticsDataClient({
      credentials: { client_email: clientEmail, private_key: privateKey },
    });
  }
  // Will use GOOGLE_APPLICATION_CREDENTIALS env if set
  return new BetaAnalyticsDataClient();
}

export async function GET(req: NextRequest) {
  try {
    const propertyId = await getPropertyId();
    if (!propertyId) {
      return NextResponse.json(
        { configured: false, error: "GA4 property ID not configured. Add GA4_PROPERTY_ID to your environment or site settings." },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(req.url);
    const days = Math.min(parseInt(searchParams.get("days") || "28"), 365);

    const client = buildClient();
    const property = `properties/${propertyId}`;

    const [overviewRes, topPagesRes, channelsRes] = await Promise.all([
      // Sessions, users, page views summary
      client.runReport({
        property,
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
        ],
      }),
      // Top pages
      client.runReport({
        property,
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
        dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
        metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),
      // Traffic channels
      client.runReport({
        property,
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }, { name: "totalUsers" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      }),
    ]);

    const overview = overviewRes[0]?.rows?.[0]?.metricValues || [];
    const topPages = (topPagesRes[0]?.rows || []).map((r) => ({
      path: r.dimensionValues?.[0]?.value || "",
      title: r.dimensionValues?.[1]?.value || "",
      views: parseInt(r.metricValues?.[0]?.value || "0"),
      users: parseInt(r.metricValues?.[1]?.value || "0"),
    }));
    const channels = (channelsRes[0]?.rows || []).map((r) => ({
      channel: r.dimensionValues?.[0]?.value || "Unknown",
      sessions: parseInt(r.metricValues?.[0]?.value || "0"),
      users: parseInt(r.metricValues?.[1]?.value || "0"),
    }));

    return NextResponse.json({
      configured: true,
      days,
      overview: {
        sessions: parseInt(overview[0]?.value || "0"),
        users: parseInt(overview[1]?.value || "0"),
        pageViews: parseInt(overview[2]?.value || "0"),
        bounceRate: parseFloat(overview[3]?.value || "0"),
        avgSessionDuration: parseFloat(overview[4]?.value || "0"),
      },
      topPages,
      channels,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // Return a non-500 so the UI can render a helpful message
    return NextResponse.json({ configured: true, error: msg }, { status: 200 });
  }
}
