
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  to: string;
  type: "booking" | "approved" | "declined";
  appointmentData: {
    id: string;
    serviceName: string;
    date: string;
    time: string;
    location?: string;
    price?: number;
    notes?: string;
  };
}

const getEmailContentForType = (type: string, data: EmailData["appointmentData"], customerName: string) => {
  const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  switch (type) {
    case "booking":
      return {
        subject: "Your Appointment Booking Confirmation",
        html: `
          <h1>Thank you for booking with us, ${customerName}!</h1>
          <p>We have received your booking request for the following service:</p>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Service:</strong> ${data.serviceName}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Booking ID:</strong> ${data.id}</p>
            ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
            ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
          </div>
          <p>Your booking is currently <strong>pending approval</strong>. We'll notify you once it's approved or if any changes are needed.</p>
          <p>Thank you for choosing our services!</p>
        `
      };
    case "approved":
      return {
        subject: "Your Appointment Has Been Approved",
        html: `
          <h1>Great news, ${customerName}!</h1>
          <p>Your appointment has been <strong style="color: #22c55e;">approved</strong>. Please find the details below:</p>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Service:</strong> ${data.serviceName}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Booking ID:</strong> ${data.id}</p>
            ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
            ${data.price ? `<p><strong>Price:</strong> $${data.price.toFixed(2)}</p>` : ''}
          </div>
          <p>Please make the payment using the link below to confirm your appointment:</p>
          <p><a href="#" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Make Payment</a></p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
        `
      };
    case "declined":
      return {
        subject: "Update on Your Appointment Request",
        html: `
          <h1>Important Update, ${customerName}</h1>
          <p>We regret to inform you that your appointment request has been <strong style="color: #ef4444;">declined</strong>.</p>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Service:</strong> ${data.serviceName}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Booking ID:</strong> ${data.id}</p>
          </div>
          <p>This might be due to unavailability during your requested time or other scheduling conflicts.</p>
          <p>Please feel free to book again with a different time or date, or contact us for assistance.</p>
        `
      };
    default:
      return {
        subject: "Update on Your Appointment",
        html: `<p>There has been an update to your appointment. Please log in to check the details.</p>`
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, appointmentData, customerName } = await req.json() as EmailData & { customerName: string };

    if (!to || !type || !appointmentData) {
      throw new Error("Missing required fields");
    }

    const { subject, html } = getEmailContentForType(type, appointmentData, customerName);

    const emailResponse = await resend.emails.send({
      from: "SpotBook Appointments <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
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
