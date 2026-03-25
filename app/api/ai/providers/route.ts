import { NextResponse } from "next/server";
import { getAvailableProviders } from "@/lib/ai-provider";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAvailableProviders();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ providers: [], defaultProvider: "anthropic" });
  }
}
