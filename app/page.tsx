import Hero from "./components/Hero";
import ProofBar from "./components/ProofBar";
import Problem from "./components/Problem";
import Mechanism from "./components/Mechanism";
import Personas from "./components/Personas";
import Contrast from "./components/Contrast";
import Science from "./components/Science";
import ProductLineup from "./components/ProductLineup";
import LatestResearch from "./components/LatestResearch";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import SubscribePopup from "./components/SubscribePopup";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProofBar />
      <Problem />
      <hr className="max-w-[720px] mx-auto border-t border-rule" />
      <Mechanism />
      <Personas />
      <Contrast />
      <Science />
      <ProductLineup />
      <LatestResearch />
      <CTA />
      <Footer />
      <SubscribePopup />

      {/* Hidden form for Netlify Forms detection */}
      <form name="subscribe" data-netlify="true" netlify-honeypot="bot-field" hidden>
        <input name="form-name" value="subscribe" type="hidden" />
        <input name="bot-field" />
        <input name="email" type="email" />
        <input name="phone" type="tel" />
        <input name="sms_opt_in" type="checkbox" />
      </form>
    </main>
  );
}
