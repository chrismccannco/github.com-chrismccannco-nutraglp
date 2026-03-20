"use client";

import { useEffect, useState } from "react";
import type { CTAButtonBlockData } from "@/lib/types/blocks";

interface ABRow {
  variant: string;
  event_type: string;
  count: number;
}

interface Props {
  data: CTAButtonBlockData;
  onChange: (data: CTAButtonBlockData) => void;
  blockId?: string;
}

export default function CTAButtonBlockForm({ data, onChange, blockId }: Props) {
  const [abResults, setAbResults] = useState<ABRow[] | null>(null);

  const set = <K extends keyof CTAButtonBlockData>(key: K, value: CTAButtonBlockData[K]) =>
    onChange({ ...data, [key]: value });

  const setVariantB = (field: string, value: string) => {
    onChange({
      ...data,
      variantB: {
        text: data.variantB?.text || "",
        url: data.variantB?.url || "",
        style: data.variantB?.style || "primary",
        [field]: value,
      },
    });
  };

  useEffect(() => {
    if (!data.abEnabled || !blockId) return;
    fetch(`/api/ab?block_id=${blockId}`)
      .then((r) => r.json())
      .then((d) => setAbResults(d.results || []))
      .catch(() => {});
  }, [data.abEnabled, blockId]);

  const getCount = (variant: string, eventType: string): number => {
    if (!abResults) return 0;
    const row = abResults.find((r) => r.variant === variant && r.event_type === eventType);
    return row ? Number(row.count) : 0;
  };

  const ctr = (variant: string): string => {
    const imp = getCount(variant, "impression");
    const clk = getCount(variant, "click");
    if (imp === 0) return "—";
    return `${((clk / imp) * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Button Text</label>
          <input
            type="text"
            value={data.text}
            onChange={(e) => set("text", e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            placeholder="Shop Now"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">URL</label>
          <input
            type="text"
            value={data.url}
            onChange={(e) => set("url", e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            placeholder="/products"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Style</label>
          <select
            value={data.style}
            onChange={(e) => set("style", e.target.value as CTAButtonBlockData["style"])}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={data.centered}
              onChange={(e) => set("centered", e.target.checked)}
              className="rounded border-neutral-300"
            />
            Centered
          </label>
        </div>
      </div>

      {/* A/B Testing */}
      <div className="border-t border-neutral-100 pt-4 mt-4">
        <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
          <input
            type="checkbox"
            checked={!!data.abEnabled}
            onChange={(e) => set("abEnabled", e.target.checked)}
            className="rounded border-neutral-300"
          />
          Enable A/B test
        </label>
        <p className="text-xs text-neutral-400 mt-1">
          Show a random variant to each visitor and track which converts better.
        </p>
      </div>

      {data.abEnabled && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Variant B
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={data.variantB?.text || ""}
                onChange={(e) => setVariantB("text", e.target.value)}
                className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white"
                placeholder={data.text || "Alternate text"}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">URL</label>
              <input
                type="text"
                value={data.variantB?.url || ""}
                onChange={(e) => setVariantB("url", e.target.value)}
                className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white"
                placeholder={data.url || "/products"}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Style</label>
            <select
              value={data.variantB?.style || "primary"}
              onChange={(e) => setVariantB("style", e.target.value)}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
            </select>
          </div>
          <p className="text-xs text-neutral-400">
            Leave fields blank to inherit from variant A.
          </p>

          {/* Inline results */}
          {blockId && abResults !== null && (
            <div className="border-t border-neutral-200 pt-3 mt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Results
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {(["A", "B"] as const).map((v) => {
                  const imp = getCount(v, "impression");
                  const clk = getCount(v, "click");
                  return (
                    <div
                      key={v}
                      className="bg-white border border-neutral-200 rounded-lg p-3"
                    >
                      <p className="text-xs font-semibold text-neutral-700 mb-1">
                        Variant {v}
                      </p>
                      <div className="text-xs text-neutral-500 space-y-0.5">
                        <p>Impressions: {imp.toLocaleString()}</p>
                        <p>Clicks: {clk.toLocaleString()}</p>
                        <p className="font-medium text-neutral-700">CTR: {ctr(v)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {abResults.length === 0 && (
                <p className="text-xs text-neutral-400 mt-2">
                  No data yet. Results appear after visitors see the button.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
