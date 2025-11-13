import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  messageId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, messageId }: ContactNotificationRequest = await req.json();

    console.log("Sending contact notification for message:", messageId);

    // Получаем email администраторов из базы данных
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: adminRoles, error: adminError } = await supabaseClient
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (adminError) {
      console.error("Error fetching admin roles:", adminError);
      throw adminError;
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admins found in the system");
      return new Response(
        JSON.stringify({ message: "No admins to notify" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Получаем email администраторов
    const { data: adminProfiles, error: profileError } = await supabaseClient
      .from("profiles")
      .select("email")
      .in("id", adminRoles.map(r => r.user_id));

    if (profileError) {
      console.error("Error fetching admin profiles:", profileError);
      throw profileError;
    }

    const adminEmails = adminProfiles
      ?.map(p => p.email)
      .filter((e): e is string => !!e) || [];

    if (adminEmails.length === 0) {
      console.log("No admin emails found");
      // Используем дефолтный email для уведомлений
      adminEmails.push("savannahdynasty@gmail.com");
    }

    console.log("Sending notification to admins:", adminEmails);

    // Формируем красивый HTML для письма
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Новое сообщение</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #1A1F2C;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1A1F2C; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1A1F2C 0%, #2A2F3C 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(217, 179, 112, 0.2);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #D9B370 0%, #C9A35F 100%); padding: 30px; text-align: center;">
                      <div style="display: inline-block; width: 60px; height: 60px; background: #1A1F2C; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                        <span style="font-size: 30px;">👑</span>
                      </div>
                      <h1 style="margin: 0; color: #1A1F2C; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        SavannahDynasty
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #1A1F2C; font-size: 14px; opacity: 0.9;">
                        Новое сообщение от клиента
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <div style="background: rgba(217, 179, 112, 0.1); border-left: 4px solid #D9B370; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                        <p style="margin: 0; color: #D9B370; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                          ✨ Важное уведомление
                        </p>
                      </div>
                      
                      <div style="color: #E5E7EB; margin-bottom: 30px;">
                        <h2 style="color: #D9B370; font-size: 20px; margin: 0 0 20px 0; font-weight: 600;">
                          Информация о клиенте
                        </h2>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid rgba(217, 179, 112, 0.2);">
                              <span style="color: #9CA3AF; font-size: 14px;">Имя:</span>
                              <br>
                              <span style="color: #E5E7EB; font-size: 16px; font-weight: 500;">${name}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid rgba(217, 179, 112, 0.2);">
                              <span style="color: #9CA3AF; font-size: 14px;">Email:</span>
                              <br>
                              <a href="mailto:${email}" style="color: #D9B370; font-size: 16px; text-decoration: none; font-weight: 500;">${email}</a>
                            </td>
                          </tr>
                          ${phone ? `
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid rgba(217, 179, 112, 0.2);">
                              <span style="color: #9CA3AF; font-size: 14px;">Телефон:</span>
                              <br>
                              <a href="tel:${phone}" style="color: #D9B370; font-size: 16px; text-decoration: none; font-weight: 500;">${phone}</a>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                        
                        <h3 style="color: #D9B370; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">
                          Сообщение
                        </h3>
                        <div style="background: rgba(217, 179, 112, 0.05); border-radius: 12px; padding: 20px; color: #E5E7EB; line-height: 1.6; font-size: 15px;">
                          ${message.replace(/\n/g, '<br>')}
                        </div>
                      </div>
                      
                      <div style="text-align: center; margin-top: 30px;">
                        <a href="${Deno.env.get("SUPABASE_URL")?.replace('https://', 'https://').replace('.supabase.co', '.lovableproject.com')}/admin/messages" 
                           style="display: inline-block; background: linear-gradient(135deg, #D9B370 0%, #C9A35F 100%); color: #1A1F2C; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(217, 179, 112, 0.3); transition: all 0.3s;">
                          Перейти в админ-панель
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: rgba(217, 179, 112, 0.05); padding: 25px 30px; text-align: center; border-top: 1px solid rgba(217, 179, 112, 0.2);">
                      <p style="margin: 0 0 10px 0; color: #9CA3AF; font-size: 13px;">
                        Это автоматическое уведомление от SavannahDynasty
                      </p>
                      <p style="margin: 0; color: #6B7280; font-size: 12px;">
                        © ${new Date().getFullYear()} SavannahDynasty. Элитные кошки Саванна.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Отправляем email всем администраторам
    const emailPromises = adminEmails.map(adminEmail =>
      resend.emails.send({
        from: "SavannahDynasty <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🔔 Новое сообщение от ${name}`,
        html: htmlContent,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failCount = results.filter(r => r.status === 'rejected').length;

    console.log(`Email notification sent: ${successCount} succeeded, ${failCount} failed`);

    if (failCount > 0) {
      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map(r => r.reason);
      console.error("Some emails failed to send:", errors);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successCount,
        failed: failCount 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-notification function:", error);
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
