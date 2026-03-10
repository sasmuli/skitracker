import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message, type } = await req.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Ski Tracker <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL!,
      subject: `[SkiTracker] ${type || "Message"} from ${name || "User"}`,
      replyTo: email,
      text: `
From: ${name || "Anonymous"}
Email: ${email}
Type: ${type || "General"}

${message}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}