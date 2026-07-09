import { NextResponse } from "next/server";
import { htmlLine, htmlTextBlock, sendMail } from "@/lib/mail";

export const runtime = "nodejs";

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = cleanText(body.name, 120);
    const contact = cleanText(body.contact, 180);
    const message = cleanText(body.message, 4000);

    if (!name || !contact || !message) {
      return NextResponse.json(
        { message: "Заполните имя, контакт и сообщение." },
        { status: 400 },
      );
    }

    const replyTo = contact.includes("@") ? contact : undefined;

    await sendMail({
      subject: `Сообщение с сайта от ${name}`,
      replyTo,
      text: [
        "Новое сообщение с сайта",
        "",
        `Имя: ${name}`,
        `Контакт: ${contact}`,
        "",
        message,
      ].join("\n"),
      html: [
        "<h2>Новое сообщение с сайта</h2>",
        htmlLine("Имя", name),
        htmlLine("Контакт", contact),
        `<p><strong>Сообщение:</strong><br />${htmlTextBlock(message)}</p>`,
      ].join(""),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact mail error:", error);
    return NextResponse.json(
      { message: "Не получилось отправить сообщение. Попробуйте позже." },
      { status: 500 },
    );
  }
}
