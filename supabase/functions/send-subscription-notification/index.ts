import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const OWNER_EMAIL = 'cvlink2030@gmail.com';

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const { email, type } = await req.json();

    if (!email || !type) {
      console.error('Missing required fields:', { email, type });
      return new Response(
        JSON.stringify({ error: 'Email and type are required' }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Get current timestamp in Arabic format
    const now = new Date();
    const arabicDate = now.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Riyadh'
    });

    // Prepare email content based on type
    const subject = type === 'partner' 
      ? '🤝 طلب شراكة جديد من الموقع'
      : '📧 اشتراك جديد في النشرة البريدية';

    const htmlContent = type === 'partner'
      ? `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #dc2626; margin: 0; font-size: 24px;">🤝 طلب شراكة تجارية جديد</h2>
            </div>
            
            <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border-right: 4px solid #dc2626;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #666;">
                <strong style="color: #333;">📧 البريد الإلكتروني:</strong>
              </p>
              <p style="margin: 0; font-size: 20px; color: #dc2626; font-weight: bold;">
                ${email}
              </p>
            </div>

            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                <strong style="color: #333;">🕐 وقت الطلب:</strong> ${arabicDate}
              </p>
            </div>

            <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                <strong>⚡ إجراء مطلوب:</strong><br/>
                يرجى التواصل مع الشريك المحتمل في أقرب وقت ممكن لمناقشة فرص الشراكة.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                تم إرسال هذا الإشعار تلقائياً من موقعك
              </p>
            </div>
          </div>
        </div>
      `
      : `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #14b8a6; margin: 0; font-size: 24px;">📧 اشتراك جديد في النشرة البريدية</h2>
            </div>
            
            <div style="background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border-right: 4px solid #14b8a6;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #666;">
                <strong style="color: #333;">📧 البريد الإلكتروني:</strong>
              </p>
              <p style="margin: 0; font-size: 20px; color: #14b8a6; font-weight: bold;">
                ${email}
              </p>
            </div>

            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                <strong style="color: #333;">🕐 وقت الاشتراك:</strong> ${arabicDate}
              </p>
            </div>

            <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #065f46; line-height: 1.6;">
                <strong>✅ تم بنجاح:</strong><br/>
                تم إضافة المشترك إلى قائمة النشرة البريدية. سيتلقى التحديثات والعروض الحصرية.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                تم إرسال هذا الإشعار تلقائياً من موقعك
              </p>
            </div>
          </div>
        </div>
      `;

    // Send email notification using Resend
    if (RESEND_API_KEY) {
      console.log('Attempting to send email via Resend...');
      console.log('Email type:', type);
      console.log('Recipient:', OWNER_EMAIL);
      
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: OWNER_EMAIL,
          subject: subject,
          html: htmlContent,
        }),
      });

      const resendData = await resendResponse.json();
      
      if (!resendResponse.ok) {
        console.error('Resend API error:', {
          status: resendResponse.status,
          statusText: resendResponse.statusText,
          data: resendData
        });
        
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to send email notification',
            details: resendData
          }),
          { 
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }

      console.log('Email sent successfully via Resend:', resendData);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Notification sent successfully',
          emailId: resendData.id
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    } else {
      console.warn('RESEND_API_KEY not configured - email notification skipped');
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Data saved but email notification skipped (API key not configured)',
          warning: 'Please configure RESEND_API_KEY in Supabase Edge Function secrets'
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
});