import { NextResponse } from "next/server";
import { htmlLine, htmlTextBlock, sendMail } from "@/lib/mail";
import { formatPrice } from "@/lib/data";

export const runtime = "nodejs";

type OrderItem = {
  title?: unknown;
  slug?: unknown;
  category?: unknown;
  price?: unknown;
  quantity?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function cleanNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = cleanText(body.name, 120);
    const phone = cleanText(body.phone, 80);
    const email = cleanText(body.email, 180);
    const city = cleanText(body.city, 120);
    const address = cleanText(body.address, 240);
    const comment = cleanText(body.comment, 2000);
    const contactMethod = cleanText(body.contactMethod, 80);
    const items = Array.isArray(body.items) ? (body.items as OrderItem[]) : [];

    const normalizedItems = items
      .map((item) => {
        const price = cleanNumber(item.price);
        const quantity = Math.max(1, cleanNumber(item.quantity));

        return {
          title: cleanText(item.title, 180),
          slug: cleanText(item.slug, 180),
          category: cleanText(item.category, 120),
          price,
          quantity,
          sum: price * quantity,
        };
      })
      .filter((item) => item.title && item.price > 0);

    if (!name || !phone || !email || normalizedItems.length === 0) {
      return NextResponse.json(
        { message: "Заполните контакты и добавьте товары в корзину." },
        { status: 400 },
      );
    }

    const total = normalizedItems.reduce((sum, item) => sum + item.sum, 0);
    const itemsText = normalizedItems
      .map((item, index) =>
        [
          `${index + 1}. ${item.title}`,
          `Категория: ${item.category || "не указана"}`,
          `Количество: ${item.quantity}`,
          `Цена: ${formatPrice(item.price)}`,
          `Сумма: ${formatPrice(item.sum)}`,
          item.slug ? `Ссылка: /product/${item.slug}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      )
      .join("\n\n");

    const rows = normalizedItems
      .map(
        (item) => `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;">${htmlTextBlock(item.title)}</td>
            <td style="padding:8px;border:1px solid #ddd;">${htmlTextBlock(item.category || "-")}</td>
            <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
            <td style="padding:8px;border:1px solid #ddd;">${formatPrice(item.price)}</td>
            <td style="padding:8px;border:1px solid #ddd;">${formatPrice(item.sum)}</td>
          </tr>
        `,
      )
      .join("");

    await sendMail({
      subject: `Новый заказ с сайта от ${name}`,
      replyTo: email,
      text: [
        "Новый заказ с сайта",
        "",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Email: ${email}`,
        `Город: ${city}`,
        `Адрес: ${address}`,
        `Способ связи: ${contactMethod}`,
        "",
        "Состав заказа:",
        itemsText,
        "",
        `Итого: ${formatPrice(total)}`,
        comment ? `\nКомментарий:\n${comment}` : "",
      ].join("\n"),
      html: [
        "<h2>Новый заказ с сайта</h2>",
        htmlLine("Имя", name),
        htmlLine("Телефон", phone),
        htmlLine("Email", email),
        htmlLine("Город", city),
        htmlLine("Адрес", address),
        htmlLine("Способ связи", contactMethod),
        comment ? `<p><strong>Комментарий:</strong><br />${htmlTextBlock(comment)}</p>` : "",
        "<h3>Состав заказа</h3>",
        `<table style="border-collapse:collapse;width:100%;">
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Товар</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Категория</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Кол-во</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Цена</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Сумма</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`,
        `<p><strong>Итого:</strong> ${formatPrice(total)}</p>`,
      ].join(""),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Order mail error:", error);
    return NextResponse.json(
      { message: "Не получилось отправить заказ. Попробуйте позже." },
      { status: 500 },
    );
  }
}
