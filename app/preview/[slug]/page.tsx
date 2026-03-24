import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getPagePreview } from "@/lib/cms";
import { validatePreviewAccess } from "@/lib/preview";
import BlockRenderer from "../../components/blocks/BlockRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `Preview: ${slug}`, robots: "noindex, nofollow" };
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;

  const cookieStore = await cookies();
  const access = await validatePreviewAccess(token ?? null, "page", slug, cookieStore);

  if (!access.allowed) {
    const returnPath = `/preview/${slug}${token ? `?token=${token}` : ""}`;
    redirect(`/admin/login?next=${encodeURIComponent(returnPath)}`);
  }

  const page = await getPagePreview(slug);
  if (!page) notFound();

  return (
    <>
      <div className="bg-amber-500 text-white text-center text-xs py-2 font-medium sticky top-0 z-50 flex items-center justify-center gap-3">
        <span>
          {access.label ? `PREVIEW — ${access.label}` : "PREVIEW MODE"}
          {!page.published && " — not published"}
        </span>
        {access.isAdmin && (
          <a href={`/admin/pages/${slug}`} className="underline opacity-80 hover:opacity-100">
            Back to editor
          </a>
        )}
        {page.published && access.isAdmin && (
          <a href={`/${slug}`} className="underline opacity-80 hover:opacity-100">
            View live
          </a>
        )}
      </div>
      <main>
        <BlockRenderer blocks={page.blocks} />
      </main>
    </>
  );
}
