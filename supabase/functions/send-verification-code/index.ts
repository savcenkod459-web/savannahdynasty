import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  code: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: VerificationRequest = await req.json();

    console.log(`Sending verification code to ${email}: ${code}`);

    // В реальном приложении здесь бы отправляли email через Resend
    // Но для простоты мы просто логируем код
    // Пользователь увидит код в консоли браузера
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code sent",
        // Только для разработки - в продакшене удалить!
        debug_code: code 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-verification-code:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
