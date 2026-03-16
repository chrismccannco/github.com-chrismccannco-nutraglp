"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Block } from "@/lib/types/blocks";
import BlockItem from "./BlockItem";
import BlockFormRenderer from "./BlockFormRenderer";

interface Props {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function BlockCanvas({ blocks, onChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const reorder = (list: Block[]) => list.map((b, i) => ({ ...b, order: i }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const updated = [...blocks];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);
    onChange(reorder(updated));
  };

  const updateBlock = (id: string, block: Block) => {
    onChange(blocks.map((b) => (b.id === id ? block : b)));
  };

  const removeBlock = (id: string) => {
    onChange(reorder(blocks.filter((b) => b.id !== id)));
  };

  const toggleHidden = (id: string) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b)));
  };

  const duplicateBlock = (id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const original = blocks[idx];
    const clone: Block = {
      ...JSON.parse(JSON.stringify(original)),
      id: crypto.randomUUID(),
      order: idx + 1,
    };
    const updated = [...blocks];
    updated.splice(idx + 1, 0, clone);
    onChange(reorder(updated));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === blocks.length - 1) return;

    const updated = [...blocks];
    const target = direction === "up" ? idx - 1 : idx + 1;
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    onChange(reorder(updated));
  };

  if (blocks.length === 0) {
    return (
      <div className="border-2 border-dashed border-neutral-200 rounded-lg p-12 text-center">
        <p className="text-neutral-400 text-sm">No blocks yet. Add one from the palette.</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <BlockItem
              key={block.id}
              block={block}
              index={index}
              total={blocks.length}
              onRemove={() => removeBlock(block.id)}
              onToggleHidden={() => toggleHidden(block.id)}
              onDuplicate={() => duplicateBlock(block.id)}
              onMoveUp={() => moveBlock(block.id, "up")}
              onMoveDown={() => moveBlock(block.id, "down")}
            >
              <BlockFormRenderer
                block={block}
                onChange={(updated) => updateBlock(block.id, updated)}
              />
            </BlockItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
