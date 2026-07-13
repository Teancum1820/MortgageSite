import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lead details.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const lead = {
    ...parsed.data,
    createdAt: new Date().toISOString(),
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
    userAgent: request.headers.get("user-agent"),
  };

  await persistLead(lead);
  await postToWebhook(lead);

  return NextResponse.json({ ok: true });
}

async function persistLead(lead: Record<string, unknown>) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const dataDir = path.join(process.cwd(), "data");
  await mkdir(dataDir, { recursive: true });
  await appendFile(path.join(dataDir, "leads.jsonl"), `${JSON.stringify(lead)}\n`, "utf8");
}

async function postToWebhook(lead: Record<string, unknown>) {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    throw new Error(`Lead webhook failed with status ${response.status}`);
  }
}
