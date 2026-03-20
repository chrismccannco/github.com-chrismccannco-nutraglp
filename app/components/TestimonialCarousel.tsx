"use client";

import { useEffect, useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  quote: string;
  rating: number;
  avatar_url: string | null;
  featured: number;
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? "text-gold" : "text-rule"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch("/api/testimonials?published=1")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data);
      })
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
      <div className="flex gap-5" style={{ minWidth: "max-content" }}>
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="w-[320px] shrink-0 bg-white border border-rule rounded-xl p-6"
          >
            <Stars count={t.rating} />
            {t.title && (
              <p className="text-[15px] font-medium text-ink mt-3 mb-2 font-display">
                {t.title}
              </p>
            )}
            <p className="text-sm text-mist leading-relaxed mb-4">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              {t.avatar_url ? (
                <img
                  src={t.avatar_url}
                  alt={t.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-forest-mid/10 flex items-center justify-center text-xs font-bold text-forest-mid">
                  {t.name.charAt(0)}
                </div>
              )}
              <span className="text-xs text-mist font-medium">{t.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
