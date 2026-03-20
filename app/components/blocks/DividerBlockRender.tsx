import type { DividerBlockData } from "@/lib/types/blocks";

const STYLE: Record<string, string> = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
};

const SPACING: Record<string, string> = {
  sm: "my-4",
  md: "my-8",
  lg: "my-12",
};

export default function DividerBlockRender({ data }: { data: DividerBlockData }) {
  return (
    <div className={`max-w-5xl mx-auto px-6 ${SPACING[data.spacing] || SPACING.md}`}>
      <hr className={`border-t border-neutral-200 ${STYLE[data.style] || STYLE.solid}`} />
    </div>
  );
}
