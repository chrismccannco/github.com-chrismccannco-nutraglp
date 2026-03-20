import type { TestimonialsBlockData } from "@/lib/types/blocks";
import TestimonialCarousel from "../TestimonialCarousel";

export default function TestimonialsBlockRender({ data }: { data: TestimonialsBlockData }) {
  // Reuse existing TestimonialCarousel which fetches from /api/testimonials
  // The style/columns config can be extended later
  return (
    <section className="py-12 px-6">
      <TestimonialCarousel />
    </section>
  );
}
