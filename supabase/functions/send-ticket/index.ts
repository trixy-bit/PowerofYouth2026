import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import nodemailer from "npm:nodemailer@6.9.10";

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (req, ctx) => {
      try {
        const body = await req.json();
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
        const name = typeof body.name === "string" ? body.name.trim() : "";
        const registrationId = typeof body.registrationId === "string" ? body.registrationId.trim() : "";
        const image = typeof body.image === "string" ? body.image.trim() : null;

        if (!email || !image) {
          return Response.json(
            { error: "Email and ticket image are required" },
            { status: 400 }
          );
        }

        // Clean base64 string if data URL header is present
        const cleanImage = image.replace(/^data:image\/\w+;base64,/, "");

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

        // Send email with attached and inline pass
        const mailOptions = {
          from: `"Power Of Youth" <${Deno.env.get("ZOHO_EMAIL")}>`,
          to: email,
          subject: "Your Power Of Youth 2026 Ticket Pass!",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111111; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #c9a84c;">Dear ${name},</h2>
              <p>Thank you for registering for <strong>Power Of Youth 2026</strong>!</p>
              <p>Your registration was successful. Your Registration ID is: <strong>${registrationId}</strong>.</p>
              <p>Here is your official entry pass. Please save it and present the QR code at the entry gates:</p>
              <div style="text-align: center; margin: 24px 0;">
                <img src="cid:passImage" alt="Entry Pass" style="max-width: 320px; width: 100%; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" />
              </div>
              <p style="font-size: 13px; color: #666666;">Your entry pass is also attached to this email as <strong>POY2026-Pass-${registrationId}.png</strong> for easy saving.</p>
              <br/>
              <p>Warm blessings,</p>
              <p><strong>Power Of Youth Team</strong></p>
            </div>
          `,
          attachments: [
            {
              filename: `POY2026-Pass-${registrationId}.png`,
              content: cleanImage,
              encoding: 'base64',
              cid: 'passImage',
            }
          ]
        };

        await transporter.sendMail(mailOptions);

        return Response.json({
          success: true,
          message: "Ticket sent successfully",
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
