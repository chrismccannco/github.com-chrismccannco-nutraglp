import type { SpacerBlockData } from "@/lib/types/blocks";

const HEIGHT_MAP: Record<string, string> = {
  sm: "py-4",
  md: "py-8",
  lg: "py-12",
  xl: "py-20",
};

export default function SpacerBlockRender({ data }: { data: SpacerBlockData }) {
  return <div className={HEIGHT_MAP[data.height] || "py-8"} aria-hidden />;
}
