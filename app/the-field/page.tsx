import type { Metadata } from "next";
import { getSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

const DEFAULT_HTML = `
<h1>The Field</h1>
<p class="fn-lead">A room for the work that doesn't have a name yet.</p>

<p>If you've been reading Field Notes, you already know the territory. The place where what you do for a living starts to bump up against something larger. Where the old frameworks stop fitting and you're not sure what's next.</p>

<p>I've spent fifteen years in enterprise tech. I've also spent a long time studying consciousness, identity, and what actually changes people. Those two tracks are not separate things. They converge in rooms like this one.</p>

<h3>Who this is for</h3>

<p>Leaders who sense something is off but can't quite name it. People who are good at what they do and starting to wonder if that's enough. Not beginners. Not people looking for a productivity system. People who are willing to sit with hard questions in front of other people who are doing the same.</p>

<h3>What we work on</h3>

<p>Whatever's actually present. Identity under pressure. The gap between the version of yourself you perform and the one you know is there. How experience accumulates and what to do with it. What your work is really asking of you.</p>

<p>No pre-built curriculum. The room shapes itself around the people in it.</p>

<h3>Before we begin</h3>

<p>Before the cohort starts, each person gets sixty minutes with me alone. I work intuitively in these sessions — drawing on psychic and mediumship capacities I've developed alongside the more conventional coaching and facilitation training. Some people know exactly what that means. Others don't, and that's fine. You'll know if it's for you.</p>

<p>This isn't a reading in the traditional sense. It's a clearing. An attunement. A way of beginning the work before the group work begins.</p>

<h3>Format</h3>

<p>Six people. Six weeks. Ninety minutes weekly. Live — not recorded. Starting September 2026. \$1,500.</p>

<p>Small on purpose. The number matters because the room matters.</p>

<p>If any of this landed, <a href="mailto:chris@chrismccann.co">write me</a>. I'll send details and we'll talk briefly first. Not every reply becomes a yes.</p>
`;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  return {
    alternates: { canonical: "/the-field" },
    title: "The Field",
    description:
      s.page_the_field_description ||
      "A six-person, six-week live cohort for leaders doing the work that doesn't have a name yet. Starting September 2026.",
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
