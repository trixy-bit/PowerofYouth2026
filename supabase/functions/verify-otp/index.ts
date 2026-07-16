import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (req, ctx) => {
      try {
        const body = await req.json();
        const email = typeof body.email === "string"
          ? body.email.trim().toLowerCase()
          : null;
        const otp = typeof body.otp === "string"
          ? body.otp.trim()
          : null;

        if (!email || !otp) {
          return Response.json(
            { error: "Email and OTP are required" },
            { status: 400 }
          );
        }

        const now = new Date().toISOString();

        // Use admin client to bypass RLS
        const { data: otpRow, error: otpError } = await ctx.supabaseAdmin
          .from("otp_codes")
          .select("*")
          .eq("email", email)
          .eq("otp", otp)
          .gte("expires_at", now)
          .order("expires_at", { ascending: false })
          .limit(1)
          .single();

        if (otpError || !otpRow) {
          return Response.json(
            { error: "Invalid or expired OTP" },
            { status: 401 }
          );
        }

        // Delete used OTP
        await ctx.supabaseAdmin
          .from("otp_codes")
          .delete()
          .eq("id", otpRow.id);

        // Fetch registration data
        const { data: registration, error: regError } = await ctx.supabaseAdmin
          .from("registrations")
          .select("*")
          .eq("email", email)
          .single();

        if (regError || !registration) {
          return Response.json(
            { error: "Registration not found" },
            { status: 404 }
          );
        }

        return Response.json({
          success: true,
          registration,
        });
      } catch (err) {
        return Response.json(
          { error: err instanceof Error ? err.message : "Unknown error" },
          { status: 500 }
        );
      }
    }
  ),
};
