import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/admin-auth";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// MIME type → internal format
const ALLOWED_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "doc",
  "text/plain": "txt",
  "text/markdown": "md",
  "text/csv": "csv",
  // macOS sometimes reports these
  "application/octet-stream": "unknown",
  "application/x-pdf": "pdf",
};

// Extension fallback (macOS/Windows report inconsistent MIME types)
const ALLOWED_EXT: Record<string, string> = {
  pdf: "pdf",
  docx: "docx",
  doc: "doc",
  txt: "txt",
  md: "md",
  csv: "csv",
};

function resolveFileType(file: File): string | null {
  // Try MIME first
  const byMime = ALLOWED_MIME[file.type];
  if (byMime && byMime !== "unknown") return byMime;

  // Fall back to extension
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return ALLOWED_EXT[ext] ?? null;
}

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  const suffix = Date.now().toString(36);
  return `${base}-${suffix}`;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function inferDocType(filename: string, text: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes("competitor") || lower.includes("competitive")) return "competitor";
  if (lower.includes("brief") || lower.includes("product")) return "product";
  if (lower.includes("style") || lower.includes("brand")) return "style_guide";
  if (lower.includes("faq") || lower.includes("q&a")) return "faq";
  if (lower.includes("research") || lower.includes("study")) return "research";
  if (lower.includes("policy") || lower.includes("legal")) return "policy";
  return "general";
}

function extractTitleFromText(text: string, filename: string): string {
  // Try to get a title from the first non-empty line
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const firstLine = lines[0] || "";
  // If first line looks like a title (not too long, not all caps sentence)
  if (firstLine.length > 3 && firstLine.length < 120) {
    return firstLine.replace(/[#*_]+/g, "").trim();
  }
  // Fall back to filename without extension
  return filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid issues with serverless cold starts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = await import("pdf-parse") as any;
  const pdfParse = mod.default ?? mod;
  const data = await pdfParse(buffer);
  return data.text || "";
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

function extractTextFromPlain(buffer: Buffer): string {
  return buffer.toString("utf-8");
}

/**
 * POST /api/knowledge/upload
 * Accepts a file upload, extracts text, creates a knowledge doc.
 * Supports PDF, DOCX, TXT, MD, CSV.
 */
export async function POST(request: NextRequest) {
  const { error: authError } = await requireRole(request, "editor");
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const docTypeOverride = formData.get("doc_type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate type — check MIME then extension fallback
    const fileType = resolveFileType(file);
    if (!fileType) {
      return NextResponse.json(
        { error: `File type not supported (got "${file.type || "unknown"}"). Use PDF, DOCX, TXT, MD, or CSV.` },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum 10MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text based on type
    let extractedText = "";
    let parseError: string | null = null;

    try {
      if (fileType === "pdf") {
        extractedText = await extractTextFromPdf(buffer);
      } else if (fileType === "docx" || fileType === "doc") {
        extractedText = await extractTextFromDocx(buffer);
      } else {
        extractedText = extractTextFromPlain(buffer);
      }
    } catch (e) {
      parseError = String(e);
      // Fall through with empty text — still create the doc so user can see it
      extractedText = "";
    }

    // Trim and clean
    extractedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n{4,}/g, "\n\n\n")
      .trim();

    // Derive metadata
    const filename = file.name;
    const title = extractTitleFromText(extractedText, filename);
    const docType = docTypeOverride || inferDocType(filename, extractedText);
    const slug = generateSlug(title);
    const wordCount = countWords(extractedText);

    // Auto-generate summary: first 2 sentences or 200 chars
    let autoSummary = "";
    if (extractedText.length > 0) {
      const sentences = extractedText.split(/[.!?]\s+/);
      autoSummary = sentences.slice(0, 2).join(". ").slice(0, 200).trim();
      if (autoSummary && !autoSummary.endsWith(".")) autoSummary += ".";
    }

    const db = getDb();

    const insertResult = await db.execute({
      sql: `INSERT INTO knowledge_docs (title, slug, doc_type, content, summary, tags, word_count, enabled)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        title,
        slug,
        docType,
        extractedText,
        autoSummary || null,
        JSON.stringify([]),
        wordCount,
        1, // active by default
      ],
    });

    const id = Number(insertResult.lastInsertRowid);

    const result = await db.execute({
      sql: "SELECT id, title, slug, doc_type, summary, tags, word_count, enabled, created_at FROM knowledge_docs WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({
      ...result.rows[0],
      parse_error: parseError,
      chars_extracted: extractedText.length,
    }, { status: 201 });

  } catch (e: unknown) {
    console.error("Knowledge upload error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
