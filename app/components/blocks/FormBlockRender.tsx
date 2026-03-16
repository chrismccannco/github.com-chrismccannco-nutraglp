"use client";

import { useState } from "react";
import type { FormBlockData } from "@/lib/types/blocks";

const bgClasses: Record<string, string> = {
  forest: "bg-[#2D5F2B] text-white",
  cream: "bg-[#F5F0E8] text-[#1A1A1A]",
  white: "bg-white text-[#1A1A1A]",
  sage: "bg-[#A8C5A0] text-[#1A1A1A]",
  ink: "bg-[#1A1A1A] text-white",
};

export default function FormBlockRender({ data }: { data: FormBlockData }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const bg = bgClasses[data.bgColor] || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: data.formName || "waitlist",
          email: email.trim(),
          name: name.trim(),
        }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setStatus("success");
      setEmail("");
      setName("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className={`py-16 px-6 ${bg}`}>
        <div className="max-w-xl mx-auto text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-medium">{data.successMessage || "Thank you!"}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 px-6 ${bg}`}>
      <div className="max-w-xl mx-auto text-center">
        {data.heading && (
          <h2 className="font-fraunces text-3xl font-semibold mb-3">{data.heading}</h2>
        )}
        {data.description && (
          <p className="opacity-80 mb-6">{data.description}</p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="flex-1 px-4 py-3 rounded-full border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="flex-1 px-4 py-3 rounded-full border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="px-6 py-3 bg-[#2D5F2B] text-white rounded-full font-semibold text-sm hover:bg-[#244D23] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === "sending" ? "Sending..." : data.buttonText || "Submit"}
          </button>
        </form>
        {status === "error" && (
          <p className="text-red-500 text-sm mt-3">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
}
