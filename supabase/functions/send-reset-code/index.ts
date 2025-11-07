import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendResetCodeRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SendResetCodeRequest = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Неверный email адрес" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error("Error fetching users:", userError);
      throw userError;
    }

    const userExists = userData.users.some(u => u.email === email);

    if (!userExists) {
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Если email существует, код был отправлен" 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code in database (expires in 15 minutes)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    
    const { error: insertError } = await supabase
      .from("password_reset_codes")
      .insert({
        user_email: email,
        code: code,
        expires_at: expiresAt,
        used: false,
      });

    if (insertError) {
      console.error("Error inserting reset code:", insertError);
      throw insertError;
    }

    // Send email with code
    const emailResponse = await resend.emails.send({
      from: "Savannah Cats <lukmilashka10@gmail.com>",
      to: [email],
      subject: "Код для сброса пароля",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Сброс пароля</h1>
          <p style="font-size: 16px; color: #555;">Вы запросили сброс пароля для вашего аккаунта.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #777; font-size: 14px;">Ваш код для сброса пароля:</p>
            <h2 style="margin: 0; color: #333; font-size: 32px; letter-spacing: 4px;">${code}</h2>
          </div>
          <p style="font-size: 14px; color: #777;">Код действителен в течение 15 минут.</p>
          <p style="font-size: 14px; color: #777;">Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Код отправлен на вашу почту" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-reset-code function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Произошла ошибка при отправке кода" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
