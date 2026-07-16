import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (req, ctx) => {
      try {
        const rawEmail = (await req.json()).email;
        const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : null;

        if (!email) {
          return Response.json(
            { error: "Email is required" },
            { status: 400 }
          );
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP in database
        const { error } = await ctx.supabaseAdmin
          .from("otp_codes")
          .insert({
            email,
            otp,
            expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          });

        if (error) {
          return Response.json(
            { error: error.message },
            { status: 500 }
          );
        }

        // Send email
        const { error: emailError } = await resend.emails.send({
          from: "Power Of Youth <onboarding@resend.dev>",
          to: email,
          subject: "Your Power Of Youth OTP",
          html: `
            <h2>Your One-Time Password</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP expires in 5 minutes.</p>
          `,
        });

        if (emailError) {
          return Response.json(
            { error: emailError.message },
            { status: 500 }
          );
        }

        return Response.json({
          success: true,
          message: "OTP sent successfully",
        });
      } catch (err) {
        return Response.json(
          {
            error: err instanceof Error ? err.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    }
  ),
};