import { NextResponse } from "next/server";
import { Resend } from "resend";

import { createSupabaseAdminClient } from "@/lib/supabase";

const emailPattern =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const resendApiKey = process.env.RESEND_API_KEY;
const waitlistFromEmail =
  process.env.WAITLIST_FROM_EMAIL || "CroVew <waitlist@croovi.com>";
const waitlistNotifyEmail =
  process.env.WAITLIST_NOTIFY_EMAIL || "ashishkhanagwal2001@gmail.com";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        email?: string;
      }
    | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || email.length > 254 || !emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      {
        error: "Waitlist is not configured yet. Add the required server env vars.",
      },
      { status: 500 },
    );
  }

  const { data: existingEntry, error: lookupError } = await supabase
    .from("waitlist")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json(
      { error: "Unable to verify your waitlist request right now." },
      { status: 500 },
    );
  }

  if (existingEntry) {
    return NextResponse.json(
      { error: "You're already on the waitlist." },
      { status: 409 },
    );
  }

  const { error } = await supabase.from("waitlist").insert({
    email,
    product: "CroVew",
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You're already on the waitlist." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Unable to save your waitlist request right now." },
      { status: 500 },
    );
  }

  if (resend) {
    await Promise.allSettled([
      resend.emails.send({
        from: waitlistFromEmail,
        to: email,
        subject: "You're on the CroVew waitlist",
        html: `
          <div style="font-family: Inter, Arial, sans-serif; background: #071010; color: #e8fffb; padding: 40px; max-width: 620px; margin: 0 auto;">
            <h2 style="color: #2fe282; margin-bottom: 16px;">You're on the CroVew waitlist.</h2>
            <p style="color: #b8d0cd; line-height: 1.8;">
              Thanks for signing up. We'll let you know as soon as early access opens.
            </p>
            <p style="color: #b8d0cd; line-height: 1.8;">
              CroVew is built for founders who want real-time behavioral analytics without heavyweight setup.
              Drop in a tiny script, watch live sessions, track events, spot drop-off patterns, and understand what users are doing while your product is still in motion.
            </p>
            <p style="color: #b8d0cd; line-height: 1.8;">
              We're actively shaping the MVP now, and you'll be among the first to get access when invites go out.
            </p>
            <div style="border-top: 1px solid #153332; margin-top: 28px; padding-top: 22px;">
              <p style="color: #86a4a1; font-size: 13px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.08em;">Also building under Croovi</p>
              <p style="color: #b8d0cd; line-height: 1.8; margin: 0 0 8px;">
                <strong style="color: #ffffff;">CroFlux</strong> — Turns strategy into structured execution through projects, tasks, ownership, and momentum.
              </p>
              <p style="color: #b8d0cd; line-height: 1.8; margin: 0;">
                <strong style="color: #ffffff;">CrooFx</strong> — AI automation for repetitive development workflows so teams can move faster with less manual overhead.
              </p>
            </div>
            <p style="color: #72908d; margin-top: 28px; font-size: 13px; border-top: 1px solid #153332; padding-top: 16px;">
              Ashish Khanagwal, Founder at Croovi
            </p>
          </div>
        `,
      }),
      resend.emails.send({
        from: waitlistFromEmail,
        to: waitlistNotifyEmail,
        subject: "New CroVew waitlist signup",
        html: `<p>New signup: <strong>${email}</strong></p>`,
      }),
    ]);
  }

  return NextResponse.json({
    message: "Congratulations! You'll be notified when CroVew goes live.",
  });
}
