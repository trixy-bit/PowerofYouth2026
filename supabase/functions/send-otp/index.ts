import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import nodemailer from "npm:nodemailer@6.9.10";

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

        // Create nodemailer transporter for Zoho
        const transporter = nodemailer.createTransport({
          host: "smtppro.zoho.com",
          port: 587,
          secure: false,
          auth: {
            user: Deno.env.get("ZOHO_EMAIL")!,
            pass: Deno.env.get("ZOHO_PASSWORD")!,
          },
        });

        // Send email
        const mailOptions = {
          from: `"Power Of Youth" <${Deno.env.get("ZOHO_EMAIL")}>`,
          to: email,
          subject: "Your Power Of Youth OTP",
          html: `
            <h2>Your One-Time Password</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP expires in 5 minutes.</p>
          `,
        };

        await transporter.sendMail(mailOptions);

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