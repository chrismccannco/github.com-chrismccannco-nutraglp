"use client";

import { useEffect } from "react";

export default function InvestorInteractions() {
  useEffect(() => {
    // Scroll reveal
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".inv-reveal").forEach((el) => obs.observe(el));

    // Sticky CTA
    const sticky = document.getElementById("invStickyBtn");
    const hero = document.querySelector(".inv-hero");
    const handleScroll = () => {
      if (!sticky || !hero) return;
      const heroEnd = hero.getBoundingClientRect().height + (hero as HTMLElement).offsetTop;
      sticky.classList.toggle("show", window.scrollY > heroEnd - 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Animate bars on reveal
    const barObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // Gap chart bars
            e.target.querySelectorAll(".inv-gap-fill").forEach((bar) => {
              const w = (bar as HTMLElement).getAttribute("data-width");
              if (w) setTimeout(() => { (bar as HTMLElement).style.width = w + "%"; }, 200);
            });
            // Fund bars
            e.target.querySelectorAll(".inv-fund-fill").forEach((bar) => {
              const w = (bar as HTMLElement).getAttribute("data-width");
              if (w) setTimeout(() => { (bar as HTMLElement).style.width = w + "%"; }, 200);
            });
            barObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll("[data-animate-bars]").forEach((el) => barObs.observe(el));

    // Initialize bar widths to 0 for animation
    document.querySelectorAll(".inv-gap-fill, .inv-fund-fill").forEach((el) => {
      (el as HTMLElement).style.width = "0%";
    });

    return () => {
      obs.disconnect();
      barObs.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="inv-sticky-btn" id="invStickyBtn">
      <a href="#deck" className="inv-btn-gold">Request the Deck →</a>
    </div>
  );
}
