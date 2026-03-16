/**
 * Email notification helper using Resend API.
 * Requires env vars: RESEND_API_KEY, NOTIFICATION_EMAIL
 * Falls back silently if not configured.
 */

interface EmailOptions {
  subject: string;
  html: string;
  to?: string;
}

export async function sendNotification(opts: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = opts.to || process.env.NOTIFICATION_EMAIL;

  if (!apiKey || !to) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NutraGLP <notifications@nutraglp.com>",
        to: [to],
        subject: opts.subject,
        html: opts.html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function formSubmissionEmail(submission: {
  form_name: string;
  email: string;
  name?: string | null;
  data?: Record<string, unknown>;
}): EmailOptions {
  const dataRows = submission.data
    ? Object.entries(submission.data)
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;font-size:13px">${k}</td><td style="padding:4px 0;font-size:13px">${String(v)}</td></tr>`)
        .join("")
    : "";

  return {
    subject: `New ${submission.form_name} submission from ${submission.name || submission.email}`,
    html: `
      <div style="font-family:-apple-system,system-ui,sans-serif;max-width:480px">
        <h2 style="color:#2D5F2B;font-size:18px;margin-bottom:16px">New Form Submission</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0;color:#666;font-size:13px">Form</td><td style="padding:4px 0;font-size:13px;font-weight:600">${submission.form_name}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#666;font-size:13px">Email</td><td style="padding:4px 0;font-size:13px">${submission.email}</td></tr>
          ${submission.name ? `<tr><td style="padding:4px 12px 4px 0;color:#666;font-size:13px">Name</td><td style="padding:4px 0;font-size:13px">${submission.name}</td></tr>` : ""}
          ${dataRows}
        </table>
        <hr style="margin:20px 0;border:none;border-top:1px solid #eee" />
        <p style="font-size:12px;color:#999">View all submissions at <a href="https://nutraglp-headless-cms.vercel.app/admin/submissions">Admin → Submissions</a></p>
      </div>
    `,
  };
}
