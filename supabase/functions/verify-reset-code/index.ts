import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyResetCodeRequest {
  email: string;
  code: string;
  newPassword: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, newPassword }: VerifyResetCodeRequest = await req.json();

    if (!email || !code || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Все поля обязательны" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (newPassword.length < 8) {
      return new Response(
        JSON.stringify({ error: "Пароль должен быть не менее 8 символов" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find the reset code
    const { data: resetCodes, error: fetchError } = await supabase
      .from("password_reset_codes")
      .select("*")
      .eq("user_email", email)
      .eq("code", code)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching reset code:", fetchError);
      throw fetchError;
    }

    if (!resetCodes || resetCodes.length === 0) {
      return new Response(
        JSON.stringify({ error: "Неверный код или код уже использован" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const resetCode = resetCodes[0];

    // Check if code is locked due to too many attempts
    if (resetCode.locked) {
      console.log(`Code locked for email: ${email}`);
      return new Response(
        JSON.stringify({ error: "Код заблокирован из-за множественных неудачных попыток. Пожалуйста, запросите новый код" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Increment attempt counter
    const newAttempts = (resetCode.attempts || 0) + 1;
    const shouldLock = newAttempts >= 5;

    const { error: updateAttemptError } = await supabase
      .from("password_reset_codes")
      .update({ 
        attempts: newAttempts,
        locked: shouldLock 
      })
      .eq("id", resetCode.id);

    if (updateAttemptError) {
      console.error("Error updating attempt counter:", updateAttemptError);
    }

    if (shouldLock) {
      console.log(`Code locked after ${newAttempts} attempts for email: ${email}`);
      return new Response(
        JSON.stringify({ error: "Слишком много неудачных попыток. Код заблокирован. Пожалуйста, запросите новый код" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if code expired
    if (new Date(resetCode.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Код истек. Пожалуйста, запросите новый код" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error("Error fetching users:", userError);
      throw userError;
    }

    const user = userData.users.find(u => u.email === email);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Пользователь не найден" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update password using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      throw updateError;
    }

    // Mark code as used
    const { error: markUsedError } = await supabase
      .from("password_reset_codes")
      .update({ used: true })
      .eq("id", resetCode.id);

    if (markUsedError) {
      console.error("Error marking code as used:", markUsedError);
    }

    console.log(`Password successfully reset for user: ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Пароль успешно изменен" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-reset-code function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Произошла ошибка при обновлении пароля" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
