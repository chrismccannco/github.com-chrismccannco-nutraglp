import { notFound } from "next/navigation";
import { getPagePreview } from "@/lib/cms";
import BlockRenderer from "../../components/blocks/BlockRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `Preview: ${slug}`, robots: "noindex, nofollow" };
}

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPagePreview(slug);
  if (!page) notFound();

  return (
    <>
      <div className="bg-amber-500 text-white text-center text-xs py-2 font-medium sticky top-0 z-50">
        PREVIEW MODE — This page is not published. <a href={`/admin/pages/${slug}`} className="underline ml-1">Back to editor</a>
      </div>
      <main>
        <BlockRenderer blocks={page.blocks} />
      </main>
    </>
  );
}
