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

    // Rate limiting: Check for recent reset codes (max 3 per hour)
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { data: recentCodes, error: rateLimitError } = await supabase
      .from("password_reset_codes")
      .select("created_at")
      .eq("user_email", email)
      .gte("created_at", oneHourAgo);

    if (rateLimitError) {
      console.error("Error checking rate limit:", rateLimitError);
      throw rateLimitError;
    }

    if (recentCodes && recentCodes.length >= 3) {
      console.log(`Rate limit exceeded for email: ${email}`);
      return new Response(
        JSON.stringify({ error: "Слишком много попыток. Пожалуйста, попробуйте через час" }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

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

    // Send email with the reset code
    const emailResponse = await resend.emails.send({
      from: "SavannahDynasty <onboarding@resend.dev>",
      to: [email],
      subject: "Код сброса пароля - SavannahDynasty",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #D9B370; text-align: center; margin-bottom: 20px;">🐾 SavannahDynasty</h1>
            <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Код сброса пароля</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Здравствуйте!
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
              Вы запросили сброс пароля для вашей учетной записи. Используйте код ниже для подтверждения:
            </p>
            
            <div style="background: linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%); border: 3px solid #D9B370; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0; box-shadow: 0 4px 15px rgba(217, 179, 112, 0.2);">
              <div style="color: #8B7355; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">Ваш код подтверждения</div>
              <div style="font-size: 36px; font-weight: bold; color: #D9B370; letter-spacing: 10px; font-family: 'Courier New', monospace; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">
                ${code}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-top: 30px;">
              ⏱️ Этот код действителен в течение <strong>15 минут</strong>.
            </p>
            
            <p style="color: #999; font-size: 12px; line-height: 1.5; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо. Ваш аккаунт в безопасности.
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #D9B370; font-size: 12px; margin: 0;">SavannahDynasty - Элитные кошки</p>
            </div>
          </div>
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
