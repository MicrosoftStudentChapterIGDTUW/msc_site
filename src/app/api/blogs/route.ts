import { NextResponse } from "next/server";
import { getSheet } from "@/lib/googleSheets";

export async function GET() {
  try {
    const sheets = await getSheet();

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;
    const range = "Sheet1!A2:E";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];

    const blogs = rows.map((row: any[]) => ({
      slug: row[0],
      title: row[1],
      keywords: row[2]
        ? (row[2] as string).split(",").map((k: string) => k.trim())
        : [],
      content: row[3] || "",
      createdAt: row[4] || "",
    }));

    return NextResponse.json({ blogs });
  } catch (err) {
    console.error("Google Sheets error:", err);
    return NextResponse.json(
      { error: "Failed to load blogs" },
      { status: 500 }
    );
  }
}
