import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const to = String(body.to ?? "").trim();
    const spaceName = String(body.spaceName ?? "").trim();

    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT ?? 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromAddress = process.env.SMTP_FROM || "noreply@danzalab.com";

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: "Faltan variables de entorno SMTP: SMTP_HOST, SMTP_USER, SMTP_PASS." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `Tu espacio ${spaceName || "publicado"} ya fue aprobado`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin-bottom: 12px;">¡Tu espacio ya fue aprobado!</h2>
          <p>Hola,</p>
          <p>Tu solicitud para <strong>${spaceName || "tu espacio"}</strong> fue aprobada y ya quedó disponible en la sección de salas.</p>
          <p>Podés entrar a la plataforma para revisar cómo queda publicado.</p>
          <p>Saludos,<br />Danza Lab</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approval notification error:", error);
    return NextResponse.json({ error: "No se pudo enviar la notificación." }, { status: 500 });
  }
}
