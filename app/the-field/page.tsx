import type { Metadata } from "next";
import { getSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

const DEFAULT_HTML = `
<h1>The Field</h1>
<p class="fn-lead">The room that comes next.</p>
<p>If you've been reading Field Notes, you already know the territory.</p>
<p>The questions that come back no matter how much you achieve. The gap between who you are at work and who you are when nobody's watching. The sense that something is off in a way that doesn't show up on any dashboard.</p>
<p>This is where we work on that. Six people. Six weeks. Weekly 90-minute calls, live. Starting in September.</p>
<p>The conversations start in the calls. Most of what matters happens in between them.</p>
<h3>Who this is for</h3>
<p>People who've been reading Field Notes and recognize something in it they haven't been able to name. Leaders who are performing and quietly hollowing out. People who are done explaining it to others and ready to sit with it directly.</p>
<h3>What we work on</h3>
<p>Who you are when the performance stops. Why you're here. What you're running from.</p>
<p>No curriculum distributed in advance. The direction follows what's in the room.</p>
<h3>Before we begin</h3>
<p>Each person gets 60 minutes with me before the cohort starts. No agenda. I work intuitively — reading what's present, what's in the room, who or what shows up. Some people call it psychic. Some call it mediumship. Some just call it a sense of knowing. Whatever it is, we use it to set the table for the six weeks ahead.</p>
<h3>Format</h3>
<p>Six people. Six weeks. 90 minutes weekly. Live — not recorded. Starting September 2026. $1,500.</p>
<p>If any of this landed, <a href="mailto:chris@chrismccann.co">write me</a>. I'll send details and we'll talk briefly first.</p>
`;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  return {
    alternates: { canonical: "/the-field" },
    title: "The Field",
    description: s.page_the_field_description ||
      "Six people. Six weeks. The questions that don't leave you alone. A live cohort with Chris McCann, starting September 2026.",
  };
}

export default async function TheField() {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const html = s.page_the_field || DEFAULT_HTML;
  return (
    <main className="fn-wrap fn-article">
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
