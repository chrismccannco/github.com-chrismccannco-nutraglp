import type { Metadata } from "next";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the team behind NutraGLP.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-gold text-sm font-bold uppercase tracking-widest mb-4">About</p>
        <h1 className="text-3xl text-white font-display">The team behind NutraGLP</h1>
        <p className="text-lg text-white/50 mt-4">Minimal test page.</p>
      </section>

      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-2xl text-ink font-display mb-4">Leadership</h2>
          <p className="text-mist">This is the minimal about page test.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
