"use client";

import type { RichTextBlockData } from "@/lib/types/blocks";
import RichTextEditor from "../../RichTextEditor";

interface Props {
  data: RichTextBlockData;
  onChange: (data: RichTextBlockData) => void;
}

export default function RichTextBlockForm({ data, onChange }: Props) {
  return (
    <RichTextEditor
      content={data.html}
      onChange={(html) => onChange({ ...data, html })}
      placeholder="Start writing…"
    />
  );
}
